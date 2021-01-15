const User = require('../models/auth.model');
const Payment = require('../models/payment.model');
const Bene = require('../models/beneficiary.model')
const shortid = require('shortid');
const request = require('request');
const crypto = require('crypto');
const cfSdk = require('cashfree-sdk')
const { Payouts } = cfSdk;
const { Beneficiary, Transfers } = Payouts;

require('dotenv').config({
    path: './config/config.env'
})

const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandling');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
sgMail.setApiKey(process.env.MAIL_KEY);

exports.isAuth = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.replace('Bxyz ', '')
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err.message)
                return res.status(401).json({
                    status: 'Signup again'
                });
            } else {
                if (req.body.id) {
                    if (parseInt(req.body.id) === parseInt(decoded._id)) {
                        next()
                    } else {
                        return res.status(401).json({
                            status: 'Not Allowed'
                        });
                    }
                } else if (req.params.id) {

                    if (parseInt(req.params.id) === parseInt(decoded._id)) {
                        next()
                    } else {
                        return res.status(401).json({
                            status: 'Not Allowed'
                        });
                    }
                } else {
                    return res.status(401).json({
                        status: 'No Id'
                    });
                }
            }
        });
    } else {
        return res.status(401).json({
            status: 'Need Sign'
        });
    }
}
exports.readController = (req, res) => {
    const userId = req.params.id;
    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    });
};

exports.updateController = (req, res) => {
    const { name, password } = req.body;

    User.findOne({ _id: req.user._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};



exports.orderController = (req, res) => {
    console.log('Order created');
    const postData = {
        appId: process.env.CASHAPPID,
        orderId: shortid.generate(),
        orderAmount: req.body.count * parseInt(process.env.YOLK_PRICE),
        orderCurrency: 'INR',
        orderNote: req.body.email,
        customerName: req.body.name,
        customerEmail: req.body.email,
        customerPhone: req.body.contact,
        returnUrl: `${req.body.url}/user/verify`,
        notifyUrl: `https://www.nestofin.com/api/user/success`
    }
    mode = process.env.CASHMODE,
        secretKey = process.env.CASHSECRETKEY,
        sortedkeys = Object.keys(postData),
        url = "",
        signatureData = "";
    sortedkeys.sort();
    for (let i = 0; i < sortedkeys.length; i++) {
        k = sortedkeys[i];
        signatureData += k + postData[k];
    }
    let signature = crypto.createHmac('sha256', secretKey).update(signatureData).digest('base64');
    postData['signature'] = signature;
    if (mode == "PROD") {
        url = "https://www.cashfree.com/checkout/post/submit";
    } else {
        url = "https://test.cashfree.com/billpay/checkout/post/submit";
    }
    const payment = new Payment({
        email: postData.customerEmail,
        contact: postData.customerPhone,
        orderId: postData.orderId,
        amount: postData.orderAmount,
        txStatus: 'Ordered Pending...'
    });
    payment.save((err, paymentDetail) => {
        if (err || !paymentDetail) {
            console.log(`Payment Save error ${err}`);
            res.status(400).json({
                errors: `Can't proceed`
            });
            res.end()
        } else {
            res.json({
                postData: JSON.stringify(postData),
                url
            });
            res.end()
        }
    });
};



exports.verifyController = (req, res) => {
    console.log('Verify payment')
    if (req.body.txStatus === 'CANCELLED' || req.body.txStatus === 'FAILED') {
        Payment.deleteOne({ orderId: req.body.orderId }, err => {
            if (err) console.log('Deleting Order Error');
        });
        res.render('afterpayment', { success: false })
    } else {
        res.render('afterpayment', { success: true })
    }

};
exports.successController = (req, res) => {
    console.log('Successfull Payment')
    const postData = {
        orderId: req.body.orderId,
        orderAmount: req.body.orderAmount,
        referenceId: req.body.referenceId,
        txStatus: req.body.txStatus,
        paymentMode: req.body.paymentMode,
        txMsg: req.body.txMsg,
        txTime: req.body.txTime
    }
    const secretKey = process.env.CASHSECRETKEY;

    let signatureData = "";
    for (let key in postData) {
        signatureData += postData[key];
    }
    const computedsignature = crypto.createHmac('sha256', secretKey).update(signatureData).digest('base64');
    postData['signature'] = req.body.signature;
    postData['computedsignature'] = computedsignature;
    if (postData.signature === postData.computedsignature) {
        if (postData.txStatus == 'SUCCESS') {
            Payment.findOne({ orderId: postData.orderId })
                .exec((err, payment) => {
                    if (!err && payment) {
                        if (payment.txStatus === 'Ordered Pending...') {
                            payment.paymentMode = postData.paymentMode;
                            payment.referenceId = postData.referenceId;
                            payment.txStatus = 'Paid';
                            const email = payment.email;
                            User.findOne({ email }, (err, user) => {
                                if (user) {
                                    user.yolk_count += (postData.orderAmount / parseInt(process.env.YOLK_PRICE));
                                    user.save((err, updatedUser) => {
                                        if (err) {
                                            console.log('USER UPDATE ERROR', err);
                                        }
                                    });
                                }
                            });
                            payment.save();
                            const emailData = {
                                from: process.env.EMAIL_FROM,
                                pass: process.env.EMAIL_PASS,
                                to: email,
                                subject: 'YOLK ORDER PAID',
                                html: `   
                            <h1>THANK YOU FOR TRUSTING US</h1>
                            <br />
                            <p>You have paid throw ${postData.paymentMode}</p>
                            <br />
                            <h3>This is your Order ID ${postData.orderId}</h3>
                            <br />
                            <h3>This is your Payment ID ${postData.referenceId}</h3>
                            <hr />
                            <p>Please make sure that you have these IDs as if unfortunately something went wrong or you want refund you have to send these IDs only then you can get you issue solved</p>
                            <p>This email may containe sensitive information</p>
                            <p>${process.env.CLIENT_URL}</p>
                        `
                            };
                            sgMail
                                .send(emailData)
                                .then()
                                .catch(err => {
                                    console.log(`Email Not send : ${err}`);
                                });
                        }
                    } else {
                        console.log(`Payment Update Error ${err}`)
                    }
                })
        }
    }
    return res.status(200).send({
        status: "success",
    })
};

Payouts.Init({
    "ENV": process.env.PAYOUTENV,
    "ClientID": process.env.PAYOUTCLIENTID,
    "ClientSecret": process.env.PAYOUTCLIENTSECRET,
    "PathToPublicKey": "./accountId_4512_public_key.pem"
});

exports.withdrawController = (req, res) => {
    const count = req.body.count;
    const email = req.body.email;
    const Amount = count * parseInt(process.env.YOLK_PRICE);


    User.findOne({ email }, (err, user) => {
        if (!err && user) {
            if (user.yolk_count - count >= 0) {
                Bene.findOne({ beneId: user._id })
                    .then(beneficiary => {
                        if (beneficiary) {
                            Transfers.RequestTransfer({
                                "beneId": user._id,
                                "transferId": shortid.generate(),
                                "amount": Amount
                            })
                                .then(response => {
                                    if (response.status === 'SUCCESS') {
                                        user.yolk_count -= count
                                        user.save()
                                        return res.status(parseInt(response.subCode)).json({
                                            status: response.message,
                                            referenceId: response.data.referenceId
                                        })
                                    } else {
                                        console.log(response.status, response.message)
                                        return res.status(409).json({
                                            status: "Can't withdraw"
                                        })
                                    }
                                })
                                .catch(err => {
                                    return res.status(500).json({
                                        status: 'Internal Server Error'
                                    })
                                })
                        } else {
                            return res.status(404).json({
                                status: 'First Add Bank Details'
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(500).json({
                            status: 'Network Down'
                        })
                    })
            } else {
                errors.error = `Can't Refund More than you Have`;
                return res.status(400).json(errors);
            }
        } else {
            errors.error = `User Data Not Found`;
            return res.status(400).json(errors);
        }
    })
};
exports.addbeneficiaryController = (req, res) => {
    const email = req.body.email;

    User.findOne({ email })
        .then(user => {
            if (user) {
                const id = user._id
                Bene.findOne({ beneId: id })
                    .then(beneficiary => {
                        if (beneficiary) {
                            return res.status(202).json({
                                status: 'Already Exist'
                            })

                        } else {
                            Beneficiary.Add({
                                "beneId": user._id,
                                "name": user.name,
                                "email": user.email,
                                "phone": user.phonenumber.slice(3),
                                "bankAccount": req.body.bankAccount,
                                "ifsc": req.body.ifsc,
                                "address1": req.body.address1,
                                "city": req.body.city,
                                "state": req.body.state,
                                "pincode": req.body.pincode
                            })
                                .then(response => {
                                    if (response.subCode === '200') {
                                        const bene = new Bene({
                                            beneId: user._id,
                                            name: user.name,
                                            email: user.email,
                                            phone: user.phonenumber.slice(3),
                                            bankAccount: req.body.bankAccount,
                                            ifsc: req.body.ifsc,
                                            address1: req.body.address1,
                                            city: req.body.city,
                                            state: req.body.state,
                                            pincode: req.body.pincode
                                        })

                                        bene.save()
                                            .then(success => {
                                                return res.status(201).json({
                                                    status: 'Saved'
                                                })
                                            })
                                            .catch(err => {
                                                console.log(err)
                                                Beneficiary.Remove({
                                                    beneId: user._id,
                                                })
                                                return res.status(501).json({
                                                    status: 'Internal Server Error'
                                                })
                                            })
                                    } else {
                                        return res.status(parseInt(response.subCode)).json({
                                            status: response.message
                                        })
                                    }
                                })
                                .catch(err => {
                                    console.log(`Error: ${err}`)
                                    return res.status(500).json({
                                        status: 'Internal Server Error'
                                    })
                                })
                        }
                    })
            } else {
                return res.status(500).json({
                    status: 'DataBase Error'
                })
            }

        })
        .catch(err => {

            console.log(err)
            return res.status(500).json({
                status: 'DataBase Error'
            })
        })
};

exports.getbeneficiary = (req, res) => {
    const id = req.params.id

    User.findById(id, '_id')
        .then(user => {
            if (user) {
                Bene.findOne({ beneId: user._id }, 'bankAccount ifsc pincode state city address1')
                    .then(beneficiary => {
                        if (beneficiary) {
                            return res.status(200).json({
                                beneficiary
                            })
                        } else {
                            return res.status(404).json({
                                status: 'User had not shared bank Details'
                            })
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: 'Some Internal Databse Error'
                        })
                    })
            } else {
                return res.status(404).json({
                    status: 'User Not Found'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: 'Internal Server Error'
            })
        })
}
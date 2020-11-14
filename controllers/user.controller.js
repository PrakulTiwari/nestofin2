const User = require('../models/auth.model');
const Payment = require('../models/payment.model');
const shortid = require('shortid');
const request = require('request');
const crypto = require('crypto');
require('dotenv').config({
    path: './config/config.env'
})

const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandling');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_KEY);


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

    // console.log(`URL: ${url} MODE: ${mode} SIGNATURE: ${signature}`)
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
    // console.log(req.body)
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
                    } else if (err) {
                        console.log(`Payment Update Error ${err}`)
                    }
                })
        }
    }
};

exports.refundController = (req, res) => {
    let orderId = '';
    const referenceId = req.body.id;
    const count = req.body.count;
    const email = req.body.email;
    const errors = {};
    const refundAmount = count * parseInt(process.env.YOLK_PRICE);
    User.findOne({ email }, (err, user) => {
        if (!err && user) {
            if (user.yolk_count - count >= 0) {

                Payment.findOne({ referenceId }, (err, payment) => {
                    if (!err && payment) {
                        console.log('Refund Started')
                        console.log(payment)
                        if (payment.amount < refundAmount) {
                            errors.error = `Can't refund more than you paid`;
                            return res.status(400).json(errors);
                        }
                        if (payment.txStatus !== 'Paid' && payment.txStatus !== 'Partially Refunded') {
                            errors.error = `Amount Not Available for Refund`;
                            return res.status(400).json(errors);
                        }
                        orderId = payment.orderId;
                        payment.amount -= refundAmount;
                        user.yolk_count -= count;
                        user.save();
                        payment.txStatus = 'Refund Processing...';
                        payment.save();
                        dataString = `appId=${process.env.CASHAPPID}&
                                    secretKey=${process.env.CASHSECRETKEY}&
                                    orderId=${orderId}&
                                    referenceId=${referenceId}&
                                    refundAmount=${refundAmount}&
                                    refundNote=${refundAmount}%20refunded%20out%20of${payment.amount}`;
                        const headers = {
                            'cache-control': 'no-cache',
                            'content-type': 'application/x-www-form-urlencoded'
                        };
                        const options = {
                            url: '',
                            method: 'POST',
                            headers: headers,
                            body: dataString
                        };
                        if (process.env.CASHMODE == "PROD") {
                            options.url = "https://api.cashfree.com/api/v1/order/refund";
                        } else {
                            options.url = "https://test.cashfree.com/api/v1/order/refund";
                        }
                        const emailData = {
                            from: process.env.EMAIL_FROM,
                            pass: process.env.EMAIL_PASS,
                            to: payment.email,
                            subject: 'Refund Initiated',
                            html: `   
                                <h1>We will try to Serve you BETTER</h1>
                                <br />
                                <h3>Refund process for your Refrence ID ${referenceId} will be initiated shortly</h3>
                                <hr />
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
                        request(options, (err, response, body) => {
                            // console.log(body.status == 'ERROR')
                            // console.log(body.status === 'ERROR')
                            console.log(body.status == 'OK')
                            if (body.status == 'ERROR') {
                                errors.error = body.message;
                                errors.message = body.reason;
                                payment.amount += refundAmount;
                                payment.txStatus = 'Paid'
                                payment.save();
                                user.yolk_count += count;
                                user.save();
                                return res.status(400).json(errors);
                            } else {
                                console.log('Refund Initiated')
                                const emailData = {
                                    from: process.env.EMAIL_FROM,
                                    pass: process.env.EMAIL_PASS,
                                    to: payment.email,
                                    subject: 'Refund Processed',
                                    html: `   
                                        <h1>We will try to Serve you BETTER</h1>
                                        <br />
                                        <h3>Refund processed for your Payment ID ${referenceId}</h3>
                                        <hr />
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
                                if (payment.amount === 0) {
                                    Payment.deleteOne({ referenceId: payment.referenceId }, err => {
                                        if (err) console.log('Deleting Payment Error');
                                    })
                                } else {
                                    payment.txStatus = 'Partially Refunded'
                                    payment.save();
                                }
                                return res.status(200).json({
                                    message: 'Refunded'
                                })
                            }
                        });
                    } else {
                        errors.error = `Payment Not Found`;
                        return res.status(400).json(errors);
                    }
                });
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
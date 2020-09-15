const User = require('../models/auth.model');
const Payment = require('../models/payment.model');
const Razorpay = require('razorpay')
const shortid = require('shortid');
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

    // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
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
    const options = {
        amount: req.body.count * 10000, //==Rs 100 amount in the smallest currency unit
        currency: "INR",
        receipt: shortid.generate(),
        payment_capture: 1
    };
    instance.orders.create(options, function(err, order) {
        if (err) {
            console.log(`Order create error: ${err}`);
            return res.status(400).json({ error: err });
        }
        res.json(order);
    });
};

const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});

exports.verifyController = (req, res) => {
    const shasum = crypto.createHmac('sha256', process.env.KEY_SECRET)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    // console.log(digest, req.headers['x-razorpay-signature'])

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit')
    } else {
        console.log('Not Ligit');
    }
    res.json({ status: 'ok' })
};
exports.successController = (req, res) => {
    if (req.body.event == 'order.paid') {
        const email = req.body.payload.payment.entity.email;
        const contact = req.body.payload.payment.entity.contact;
        const payment_id = req.body.payload.payment.entity.id;
        const amount = req.body.payload.payment.entity.amount;
        const order_id = req.body.payload.payment.entity.order_id;
        const method = req.body.payload.payment.entity.method;
        const status = 'Paid';
        console.log(email + " " + contact + " " + payment_id + " " + order_id + " " + method + " " + amount);
        const payment = new Payment({
            email,
            contact,
            payment_id,
            order_id,
            method,
            status
        });

        User.findOne({ email }, (err, user) => {
            if (user) {
                user.yolk_count += (amount / 10000);
                user.save((err, updatedUser) => {
                    if (err) {
                        console.log('USER UPDATE ERROR', err);
                    }
                });
            }
        });

        payment.save((err, payment) => {
            if (err) {
                console.log('Payment Save error', errorHandler(err));
            }
        });


        const emailData = {
            from: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
            to: email,
            subject: 'YOLK ORDER PAID',
            html: `   
                <h1>THANK YOU FOR TRUSTING US</h1>
                <br />
                <p>You have paid throw ${method}</p>
                <br />
                <h3>This is your Order ID ${order_id}</h3>
                <br />
                <h3>This is your Payment ID ${payment_id}</h3>
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
        console.log('Done');
    }
    res.json({ status: 'ok' })
};

exports.refundController = (req, res) => {
    const payment_id = req.body.id;
    const count = req.body.count;
    const email = req.body.email;
    const speed = 'optimum'
    const errors = {};
    const amount = count * 10000;

    User.findOne({ email }, (err, user) => {
        if (user) {
            if (user.yolk_count - count >= 0) {
                instance.payments.refund(payment_id, { amount, speed }, (err, payment) => {
                    if (err) {
                        errors.error = err;
                        errors.message = 'Check Your Payment Id';
                        return res.json(errors);
                    } else {
                        console.log(payment);

                        Payment.findOne({ payment_id }, (err, payment) => {
                            if (payment) {
                                payment.status = 'Refund Processing...';
                                payment.save((err, updatedpayment) => {
                                    if (err) {
                                        console.log('Payment UPDATE ERROR', err);
                                    }
                                });
                                const emailData = {
                                    from: process.env.EMAIL_FROM,
                                    pass: process.env.EMAIL_PASS,
                                    to: payment.email,
                                    subject: 'Refund Initiated',
                                    html: `   
                                        <h1>We will try to Serve you BETTER</h1>
                                        <br />
                                        <h3>Refund process for your Payment ID ${payment_id} will be initiated shortly</h3>
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
                            }
                        });
                        if (payment.speed_processed === 'instant') {
                            return res.status(200).json({
                                message: "Refunded process is being initiated"
                            })
                        } else {
                            return res.status(200).json({
                                message: "Refunded will be initiated in 5-6 working days"
                            })
                        }
                    }
                });
            } else {
                return res.status(200).json({
                    message: "Can't refund more than you have"
                })
            }
        }
    })

    instance.payments.refund(payment_id, { amount, speed }, (err, payment) => {
        if (err) {
            errors.error = err;
            errors.message = 'Please Check Payment Id';
            return res.json(errors);
        } else {
            console.log(payment);

            Payment.findOne({ payment_id }, (err, payment) => {
                if (payment) {
                    payment.status = 'Refund Processing...';
                    payment.save((err, updatedpayment) => {
                        if (err) {
                            console.log('Payment UPDATE ERROR', err);
                        }
                    });
                    const emailData = {
                        from: process.env.EMAIL_FROM,
                        pass: process.env.EMAIL_PASS,
                        to: payment.email,
                        subject: 'Refund Initiated',
                        html: `   
                            <h1>We will try to Serve you BETTER</h1>
                            <br />
                            <h3>Refund process for your Payment ID ${payment_id} will be initiated shortly</h3>
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
                }
            });
            if (payment.speed_processed === 'instant') {
                return res.status(200).json({
                    message: "Refunded process is being initiated"
                })
            } else {
                return res.status(200).json({
                    message: "Refunded will be initiated in 5-6 working days"
                })
            }
        }
    });
};

exports.refundSuccessController = (req, res) => {
    if (req.body.event === "refund.processed") {
        const payment_id = req.body.payload.refund.entity.payment_id;
        Payment.findOne({ payment_id }, (err, payment) => {
            if (payment) {
                payment.status = 'Refund Processed';
                payment.save((err, updatedpayment) => {
                    if (err) {
                        console.log('Payment UPDATE ERROR', err);
                    }
                });

                const email = payment.email;

                User.findOne({ email }, (err, user) => {
                    if (user) {
                        user.yolk_count -= 1;
                        user.save((err, updatedUser) => {
                            if (err) {
                                console.log('USER UPDATE ERROR', err);
                            }
                        });
                    }
                });

                const emailData = {
                    from: process.env.EMAIL_FROM,
                    pass: process.env.EMAIL_PASS,
                    to: payment.email,
                    subject: 'Refund Processed',
                    html: `   
                        <h1>We will try to Serve you BETTER</h1>
                        <br />
                        <h3>Refund processed for your Payment ID ${payment_id}</h3>
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
            }
        });
    }

    res.json({ status: 'ok' })
};
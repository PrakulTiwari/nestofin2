const User = require('../models/auth.model');
const Tokenotp = require('../models/otptoken.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandling');
const sgMail = require('@sendgrid/mail');
const { getEnv } = require('google-auth-library/build/src/auth/envDetect');
sgMail.setApiKey(process.env.MAIL_KEY);



exports.registerController = (req, res) => {
    console.log('Register is connected');
    const { name, email, password, phonenumber } = req.body;
    console.log(email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
            if (user) {
                return res.status(400).json({
                    errors: 'Email is taken'
                });
            }

        })

        const token = jwt.sign({
            name,
            email,
            password,
            phonenumber
        },
            process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '5m'
        }
        );

        function generateOTP() {
            var digits = '0123456789';
            var otpLength = 6;
            var otp = '';
            for (let i = 1; i <= otpLength; i++) {
                var index = Math.floor(Math.random() * (digits.length));
                otp = otp + digits[index];
            }
            return otp;
        }
        const otp = generateOTP();

        const tokenotp = new Tokenotp({
            token,
            otp
        });

        tokenotp.save((err, tokenotp) => {
            if (err) {
                console.log('Save error', errorHandler(err));
                return res.status(401).json({
                    errors: errorHandler(err)
                });
            }
        });



        const emailData = {
            from: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
            to: email,
            subject: 'Account activation OTP',
            html: `   
                <h1>You are just one click away!</h1>
                <h3>YOUR OTP IS ${otp} valid for 5 minutes</h3>
               
                <hr />
                <p>This email may containe sensitive information</p>
                
            `
        };
        // console.log(`Email Data: ${Object.keys(emailData).length}`);
        sgMail
            .send(emailData)
            .then(sent => {
                console.log('Email Send');
                return res.json({
                    message: `Email has been sent to ${email}`
                });
            })
            .catch(err => {
                console.log(`Email Not send : ${err}`);
                return res.status(400).json({
                    success: false,
                    errors: errorHandler(err)
                });
            });

    }
};

exports.activationController = (req, res) => {
    const { otp } = req.body;
    let token = '';
    if (otp) {

        Tokenotp.findOne({
            otp
        }).exec((err, tokendetail) => {
            if (tokendetail) {
                token = tokendetail.token;
                jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
                    if (err) {
                        console.log('Activation error');

                        Tokenotp.remove({ otp })
                            .then(count => {
                                if (count) {
                                    console.log('duplicate toke deleted')
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            });

                        return res.status(401).json({
                            errors: 'Expired OTP. Signup again'
                        });
                    } else {
                        const { name, email, password, phonenumber } = jwt.decode(token);
                        const user = new User({
                            name,
                            email,
                            password,
                            phonenumber
                        });

                        user.save((err, user) => {
                            if (err) {
                                console.log('Save error', errorHandler(err));
                                return res.status(401).json({
                                    errors: errorHandler(err)
                                });
                            } else {
                                Tokenotp.remove({ token })
                                    .then(count => {
                                        if (count) {
                                            return res.json({
                                                success: true,
                                                message: 'Signup success'
                                            });
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        return res.json({
                                            message: 'error happening please try again'
                                        });
                                    });
                            }
                        });
                    }
                });


            } else {
                return res.status(401).json({
                    errors: 'Not a valid otp or User has been registered'
                });
            }
        })

    } else {
        return res.json({
            message: 'error happening please try again'
        });
    }
};

exports.signinController = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        // check if user exist
        User.findOne({
            email
        }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    errors: 'User with that email does not exist. Please signup'
                });
            }
            // authenticate
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    errors: 'Email and password do not match'
                });
            }
            // generate a token and send to client
            const token = jwt.sign({
                _id: user._id
            },
                process.env.JWT_SECRET, {
                expiresIn: '7d'
            }
            );
            const { _id, name, email, role, yolk_count, phonenumber } = user; //C 

            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email,
                    role,
                    yolk_count, // C
                    phonenumber
                }
            });
        });
    }
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET // req.user._id
});

exports.adminMiddleware = (req, res, next) => {
    User.findById({
        _id: req.user._id
    }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied.'
            });
        }

        req.profile = user;
        next();
    });
};

exports.forgotPasswordController = (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        User.findOne({
            email
        },
            (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'User with that email does not exist'
                    });
                }

                const token = jwt.sign({
                    _id: user._id
                },
                    process.env.JWT_RESET_PASSWORD, {
                    expiresIn: '10m'
                }
                );

                function generateOTP() {
                    var digits = '0123456789';
                    var otpLength = 6;
                    var otp = '';
                    for (let i = 1; i <= otpLength; i++) {
                        var index = Math.floor(Math.random() * (digits.length));
                        otp = otp + digits[index];
                    }
                    return otp;
                }
                const otp = generateOTP();

                const tokenotp = new Tokenotp({
                    token,
                    otp
                });

                tokenotp.save((err, tokenotp) => {
                    if (err) {
                        console.log('Save error', errorHandler(err));
                        return res.status(401).json({
                            errors: errorHandler(err)
                        });
                    }
                });



                const emailData = {
                    from: process.env.EMAIL_FROM,
                    pass: process.env.EMAIL_PASS,
                    to: email,
                    subject: 'Reset Password Otp',
                    html: `   
                        <h1>Please use the following OTP to reset your password</h1>
                        <h3>YOUR OTP IS ${otp} valid for 5 minutes</h3>
                        <h4>go to ${process.env.CLIENT_URL}/users/password/reset to input otp</h4>
                        <hr />
                        <p>This email may containe sensitive information</p>
                        <p>${process.env.CLIENT_URL}</p>
                    `
                };

                // console.log(`Email Data: ${Object.keys(emailData).length}`);
                sgMail
                    .send(emailData)
                    .then(sent => {
                        console.log('Email Send');
                        return res.json({
                            message: `Email has been sent to ${email}`
                        });
                    })
                    .catch(err => {
                        console.log(`Email Not send : ${err}`);
                        return res.status(400).json({
                            success: false,
                            errors: errorHandler(err)
                        });
                    });

                return user.updateOne({
                    resetPasswordLink: token
                },
                    (err, success) => {
                        if (err) {
                            console.log('RESET PASSWORD LINK ERROR', err);
                            return res.status(400).json({
                                error: 'Database connection error on user password forgot request'
                            });
                        } else {
                            sgMail
                                .send(emailData)
                                .then(sent => {
                                    // console.log('SIGNUP EMAIL SENT', sent)
                                    return res.json({
                                        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                                    });
                                })
                                .catch(err => {
                                    // console.log('SIGNUP EMAIL SENT ERROR', err)
                                    return res.json({
                                        message: err.message
                                    });
                                });
                        }
                    }
                );
            }
        );
    }
};

exports.resetPasswordController = (req, res) => {
    const { otp, newPassword } = req.body;
    let resetPasswordLink = '';
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        if (otp) {
            Tokenotp.findOne({ otp })
                .exec((err, tokendetail) => {
                    if (tokendetail) {
                        resetPasswordLink = tokendetail.token;
                        if (resetPasswordLink) {
                            jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
                                err,
                                decoded
                            ) {
                                if (err) {
                                    return res.status(400).json({
                                        error: 'Expired link. Try again'
                                    });
                                }

                                User.findOne({
                                    resetPasswordLink
                                },
                                    (err, user) => {
                                        if (err || !user) {
                                            return res.status(400).json({
                                                error: 'Something went wrong. Try later'
                                            });
                                        }

                                        const updatedFields = {
                                            password: newPassword,
                                            resetPasswordLink: ''
                                        };

                                        user = _.extend(user, updatedFields);

                                        user.save((err, result) => {
                                            if (err) {
                                                return res.status(400).json({
                                                    error: 'Error resetting user password'
                                                });
                                            }
                                            res.json({
                                                message: `Great! Now you can login with your new password`
                                            });
                                        });
                                    }
                                );
                            });
                        }
                    } else {
                        return res.status(401).json({
                            errors: 'Not a valid otp or User has been registered'
                        });
                    }
                })
        } else {
            return res.json({
                message: 'error happening please try again'
            });
        }
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleController = (req, res) => {
    const { idToken } = req.body;

    client
        .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
        .then(response => {
            // console.log('GOOGLE LOGIN RESPONSE',response)
            const { email_verified, name, email } = response.payload;
            if (email_verified) {
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                            expiresIn: '7d'
                        });
                        const { _id, email, name, role, yolk_count, phonenumber } = user; //C
                        return res.json({
                            token,
                            user: { _id, email, name, role, yolk_count, phonenumber } //C
                        });
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password, yolk_count, phonenumber }); //C
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with google'
                                });
                            }
                            const token = jwt.sign({ _id: data._id },
                                process.env.JWT_SECRET, { expiresIn: '7d' }
                            );
                            const { _id, email, name, role, yolk_count, phonenumber } = data; //C
                            return res.json({
                                token,
                                user: { _id, email, name, role, yolk_count, phonenumber } //C
                            });
                        });
                    }
                });
            } else {
                return res.status(400).json({
                    error: 'Google login failed. Try again'
                });
            }
        });
};

exports.facebookController = (req, res) => {
    console.log('FACEBOOK LOGIN REQ BODY', req.body);
    const { userID, accessToken } = req.body;

    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(response => {
                const { email, name } = response;
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                            expiresIn: '7d'
                        });
                        const { _id, email, name, role, yolk_count, phonenumber } = user; //C
                        return res.json({
                            token,
                            user: { _id, email, name, role, yolk_count, phonenumber } //C
                        });
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with facebook'
                                });
                            }
                            const token = jwt.sign({ _id: data._id },
                                process.env.JWT_SECRET, { expiresIn: '7d' }
                            );
                            const { _id, email, name, role, yolk_count, phonenumber } = data; //C
                            return res.json({
                                token,
                                user: { _id, email, name, role, yolk_count, phonenumber } //C
                            });
                        });
                    }
                });
            })
            .catch(error => {
                res.json({
                    error: 'Facebook login failed. Try later'
                });
            })
    );
};
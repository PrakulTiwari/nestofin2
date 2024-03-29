import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import img from './images/undraw_Security_on_ff2u.png'

export default function Homepage() {
    return (
        <div className="home-page" id="top">
            <div className="window1">
                <div className="border1"></div>
                <div className="border2"></div>
                <div className="border3"></div>
                <div className="oplofin">
                    NESTOFIN.
                </div>
                <div className="a">
                    <h1>Devised to earn you better</h1>
                </div>
                <div className="line"></div>
                <div className="para1">
                    Unlike banks that let your cash sit in your accounts, we use AI technology to make more out of less, with no effort from you.
                </div>
                <div className="para2">
                    Let us optimize your finances and take the work out of investing, borrowing, and planning.
                </div>
                <div className="getstart">
                    <Link to='/register'>Get Started</Link>
                </div>
            </div>
            <div className="window2">
                <div className="sub-window">
                    <div className="question">WHY CHOOSE Nestofin?</div>
                    <div className="head1">
                        <h2>Meet Nest Egg™,</h2>
                    </div>
                    <div className="head2">
                        <h2>innovation for the future</h2>
                    </div>
                    <div className="win2para1">We focus on primary allocation to cryptocurrency, land trusts, micro business lending, stock exchange and negative beta products like gold</div>
                    <div className="win2para2">Deposit a portion of your pay with Nestofin and, with the click of a button, you can have us automate the rest. Automated investing function make sure that our client money is being invested within the right places and benefit with good rate of return along with utter stability and minimum risk.  </div>
                </div>
            </div>
            <div className="window3">
                <div className="sub-win-of-win3">
                    <div className="text-of-subwin-of-win3">
                        <div className="heading1">
                            Upgrade your investing
                        </div>
                        <div className="heading2">
                            <h1>Earn 3x the interest</h1>
                            <div className="subhead">
                                <h1>with the Nest Account</h1>
                            </div>
                        </div>
                        <div className="win3para1">
                            Earn 16% APY on all your investments, 3x the national average and enjoy features like:
                        </div>
                        <div className="win3para2">
                            ~Direct investment and get instant withdrawals.<br />~Risk reduction by diversification.<br /> ~Use Credit card/Debit card Google Pay, Paytm, Phonepe, UPI, Net Banking.
                        </div>
                        <div className="win3btn">
                            <Link to='/register'>Get Started</Link>
                        </div>
                    </div>
                    <div className="img1">

                    </div>
                </div>
                <div className="second-window">
                    <div className="second-head1">
                        PROFOUND SAVINGS AT WORK
                    </div>
                    <div className="second-head2">
                        <h1>Automate your</h1>
                        <div className="second-sub-head">
                            <h1>investments.</h1>
                        </div>
                    </div>
                    <div className="second-para1">
                        We believe in passive investing, which is the time-tested approach to grow your long-term savings. Let our software automatically execute investment best practices, and take the work out of managing your own investments.
                    </div>
                    <div className="second-btn">
                        <Link to='/register'>Get Started</Link>
                    </div>
                    <ul>
                        <li className="win3-sec-paras li-para1">
                            <div className="para-para">
                                <div className="lines"></div>
                                <h1>Start with a solid foundation</h1>
                            </div>
                            We’ll build you a diversified portfolio of cryptocurrency, land trusts, micro business lending, stock exchange. And our software maintains the appropriate investment mix over time.
                        </li>
                        <li className="win3-sec-paras li-para2">
                            <div className="para-para">
                                <div className="lines"></div>
                                <h1>Safety & Transparency</h1>
                            </div>
                            Our aim and objective is to realize - healthy beta value in portfolio, therefore giving our clients - return with utter most stability and adaptability.
                        </li>
                        <li className="win3-sec-paras li-para3">
                            <div className="para-para">
                                <div className="lines"></div>
                                <h1>Flexibility</h1>
                            </div>
                            We start investments with the very bit of Rs 100 and provide same day withdrawls with no penalty or extra charges thus making your money extra flexible!
                        </li>
                    </ul>
                    <div className="img2">

                    </div>
                </div>
            </div>
            <div className="window4">
                <div className="win4-sub-win">
                    <div className="win4-head1">
                        <h1>We care about your security</h1>
                    </div>
                    <div className="win4-para1">
                        We want you to have a transparent and delightful experience without any hassles.
                    </div>
                    <img src={img} alt="" className="win4-img1" />
                    <div className="win4-head2">
                        <h1>Security & Privacy</h1>
                    </div>
                    <div className="win4-para2">
                        Nestofin uses bank level security to protect your sensitive information and prevent unauthorized use.
                    </div>
                </div>
            </div>
        </div>
    );
}

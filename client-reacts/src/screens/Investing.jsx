import React from 'react';
import {Link } from 'react-router-dom';
import Footer from '../assests/Footer';
import '../assests/styles.css';
import '../assests/getstarted.css';
import { ToastContainer} from 'react-toastify';
import img from '../assests/images/borrowing.png';
import Othernavbar from '../assests/Othernavbar'
import Buybutton from '../helpers/Buybutton';

function Investing({ history }) {

  return (
            <div className="getstarted-page" id='top'>
                <Othernavbar />
                <ToastContainer />
                <div className="main-win">
                    <div className="sub-win">
                        <div className="text-part">
                            <h1>COMING SOON...</h1>
                            <h1>Investing made delightfully easy</h1>
                            <p className="main-win-sub-win-para1">Share personal info so we can verify your identity and tailor your advice.</p>
                            <p className="main-win-sub-win-para2">Choose your first account to grow your cash or automate your investments.</p>
                            <p className="main-win-sub-win-para3">Fund with ease. Get started with $1 for cash and $500 for investment accounts.</p>
                            <form><script src="https://cdn.razorpay.com/static/widget/payment-button.js" data-payment_button_id="pl_FVeWx1Ay2BVrRa"></script> </form>
                            <Link to="/planning" className="planning-btn">Explore our free planning website</Link>
                            <Buybutton />
                        </div>
                        <div className="img">
                          <img src={img} alt="invest" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
  );
}

export default Investing;
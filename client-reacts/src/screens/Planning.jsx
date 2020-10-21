import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { signout } from '../helpers/auth';
import { isAuth } from '../helpers/auth';
import { useState } from 'react';
import Footer from '../assests/Footer';
import '../assests/styles.css';
import '../assests/getstarted.css';
import { ToastContainer, toast } from 'react-toastify';
import img from '../assests/images/planning.png';
import Othernavbar from '../assests/Othernavbar';
import '../assests/temp.css';

function sumit() {
    const name = document.querySelector('.planning .i');
    const place = document.querySelector('.planning .name');
    place.innerHTML = '<h2>Hello there ' + name.value + '!<h2>';
    place.innerHTML = '<h4>Best Mutual funds for you are Axis Long Term Equity Fund and Axis Bluechip fund.</h4>'
}

function Planning({ history }) {

    return (
        // <div className="getstarted-page" id='top'>
        //     <Othernavbar />
        //     <ToastContainer />
        //     <div className="main-win">
        //         <div className="sub-win">
        //             <div className="text-part">
        //                 <h1>COMING SOON...</h1>
        //                 <h3>Planning is simple with us.</h3>
        //                 <p className="main-win-sub-win-para1">With the help of SEBI registered advisors and machine learning algorithm we tend to provide you complete solution in diversified portfolio creation with focus given on every nook and cranny.Our planning and advisory plans starts with a small ₹99 for a month’s unlimited financial and creative money management advice.We focus on individual client based needs and help you achieve your financial goals in a safe environment.Be it a salaried individual or a student, proper money management is a key to successful life and we deliver the planning, fabrication and countless hours of our research to your hands.</p>
        //             </div>
        //             <div className="img">
        //                 <img src={img} alt="image" />
        //                 <div className='planbuybutton'>
        //                     <button>Buy Now</button>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <Footer />
        // </div>
        <div className="page" id="top">
            <Othernavbar />
            <ToastContainer />
            <div className="planning">
                <input type="text" placeholder="Enter your name" className="n i" />
                <input type="text" placeholder="Enter your age" className="n j" />
                <input type="text" placeholder="Enter your salary" className="n k" />
                <input type="submit" value="Submit" className="submit" onClick="sumit" />
                <div className="name">

                </div>
            </div>
        </div>
    );
}

export default Planning;
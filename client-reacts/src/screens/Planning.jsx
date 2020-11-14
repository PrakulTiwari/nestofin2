import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../assests/Footer';
import '../assests/styles.css';
import '../assests/getstarted.css';
import { ToastContainer } from 'react-toastify';
import img from '../assests/images/planning.png';
import Othernavbar from '../assests/Othernavbar';

function Planning({ history }) {

    useEffect(() => {
        window.scrollTo(0, 0)
    });

    return (
        <div classNameName="getstarted-page" id='top'>
            <Othernavbar />
            <ToastContainer />
            <div classNameName="main-win">
                <div classNameName="sub-win">
                    <div classNameName="text-part">
                        <h1>COMING SOON...</h1>
                        <h3>Planning is simple with us.</h3>
                        <p classNameName="main-win-sub-win-para1">With the help of SEBI registered advisors and machine learning algorithm we tend to provide you complete solution in diversified portfolio creation with focus given on every nook and cranny.Our planning and advisory plans starts with a small ₹99 for a month’s unlimited financial and creative money management advice.We focus on individual client based needs and help you achieve your financial goals in a safe environment.Be it a salaried individual or a student, proper money management is a key to successful life and we deliver the planning, fabrication and countless hours of our research to your hands.</p>
                    </div>
                    <div classNameName="img">
                        <img src={img} alt="image" />
                        {/* <div classNameName='planbuybutton'>
                            <button>Buy Now</button>
                        </div> */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        // <div className="page" id="top">
        //     <Othernavbar />
        //     <ToastContainer />
        //     <h1>Fill in the details so that our algorithm can decide which mutual funds are best for you!</h1>
        //     <div className="planning">
        //         <input type="text" placeholder="Enter your name" className="n i" />
        //         <input type="number" placeholder="Enter your age" className="n age" />
        //         <label htmlFor="monthly-savings">Monthly Savings</label>
        //         <div className="range-monthly-savings" />
        //         <div className="monthly-savings">
        //             Below ₹1000<input type="radio" name='savings' value='bel1000' />
        //             ₹1000-₹5000<input type="radio" name='savings' value='1000to5000' />
        //             ₹5000-₹10000<input type="radio" name='savings' value='5000to10000' />
        //             ₹10000-₹20000<input type="radio" name='savings' value='10000to20000' />
        //             Above ₹20000<input type="radio" name='savings' value='above20000' />
        //         </div>
        //         <input type="email" className="n email" placeholder="Enter your email" />
        //         <textarea name="goals" id="goals" cols="30" rows="10" placeholder="Describe your short and long term goals" className="n"></textarea>
        //         <input type="submit" value="Submit" className="submit" onClick={sumit} />
        //         <div className="name">

        //         </div>
        //     </div>
        // <Footer />
        // </div>
    );
}

export default Planning;
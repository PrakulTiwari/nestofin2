import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { signout } from '../helpers/auth';
import { isAuth } from '../helpers/auth';
import { useState } from 'react';
import Footer from '../assests/Footer';
import '../assests/styles.css';
import '../assests/getstarted.css';
import { ToastContainer, toast } from 'react-toastify';
import img from '../assests/images/learnmore.png';
import Othernavbar from '../assests/Othernavbar';

function Learnmore({ history }) {

  return (
            <div className="getstarted-page" id='top'>
                <Othernavbar />
                <ToastContainer />
                <div className="main-win">
                    <div className="sub-win">
                        <div className="img">
                          <img src={img} alt="image" />
                        </div>
                        <div className="text-part">
                            <h1>COMING SOON...</h1>
                            <p className="main-win-sub-win-para1">Share personal info so we can verify your identity and tailor your advice.</p>
                            <p className="main-win-sub-win-para2">Choose your first account to grow your cash or automate your investments.</p>
                            <p className="main-win-sub-win-para3">Fund with ease. Get started with $1 for cash and $500 for investment accounts.</p>
                            <Link to="/register" className="nest-btn">Open a Nest Account</Link>
                            <Link to="/planning" className="planning-btn">Explore our free planning website</Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
  );
}

export default Learnmore;
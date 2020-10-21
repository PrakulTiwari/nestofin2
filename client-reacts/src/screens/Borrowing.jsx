import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { signout } from '../helpers/auth';
import { isAuth } from '../helpers/auth';
import { useState } from 'react';
import Footer from '../assests/Footer';
import '../assests/styles.css';
import '../assests/getstarted.css';
import { ToastContainer, toast } from 'react-toastify';
import img from '../assests/images/borrowing.png';
import Othernavbar from '../assests/Othernavbar'

function Borrowing({ history }) {
  return (
    <div className="getstarted-page" id='top'>
      <Othernavbar />
      <ToastContainer />
      <div className="main-win">
        <div className="sub-win">
          <div className="text-part">
            <h1>COMING SOON...</h1>
            <h3>Borrowing made delightfully easy</h3>
          </div>
          <div className="img">
            <img src={img} alt="image" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Borrowing;
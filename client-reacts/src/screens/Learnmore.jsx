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
            <h1>About Us</h1>
            <p className="main-win-sub-win-para1">NESTOFIN PVT. LTD. was commenced in July 2020. It is a platform that uses AI algorithm with the help of investment advisors, and seasoned investors to supply the simplest and the best guidance possible on the investment made by the clients. Company focuses on  primary allocation to mutual funds and shares. We propose better written algorithm investment strategies and help within the allocation in low risk instruments. We tend to supply our clients with complete solution in their diversified portfolio creation. Our aim and objective is to realize - healthy beta value in portfolio, therefore giving our clients - return with utter most stability and adaptability. Our target clients are business owners, middle income households, students, youngsters.For college students and youngsters, we start investment guidance with the very bit of Rs 99. We want to serve the unpriviledged and underpowered working class of our country by making them believe in the power of investing and teaching the healthy financial life mantra to all.</p>
            <p className="main-win-sub-win-para1">Email - nestofin@gmail.com</p>
            <p className="main-win-sub-win-para1">Phone Number - 8076131157</p>
            <p className="main-win-sub-win-para1">Address - 175/16A ,Faridabad,Haryana 121002</p>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Learnmore;
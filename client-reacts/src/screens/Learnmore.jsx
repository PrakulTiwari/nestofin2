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
            <h1>Nest Egg</h1>
            <p className="main-win-sub-win-para1">NESTOFIN PVT. LTD. was commenced in July 2020. It is a platform registered with investment advisors, and seasoned investors to supply the simplest and the best returns possible on the investment made by the clients. Company focuses on  primary allocation to cryptocurrency, land trusts, micro business lending, stock exchange and negative beta products like gold, and we also sell our own own token of investment as a cryptocurrency. We propose better written algorithm investment strategies and help within the allocation in risk. We tend to supply our clients with complete solution in their diversified portfolio creation. Our aim and objective is to realize - healthy beta value in portfolio, therefore giving our clients - return with utter most stability and adaptability. Our target clients are business owners, middle income households, students, youngsters. Automated investing functions make sure that our client money is being invested within the right places and, give them maximum profit and benefit with good rate of return. For college students and youngsters, we start investments with the very bit of Rs 100. We want to serve the unprivledged and underpowered working class of our country by making them believe in the power of investing and teaching the healthy financial life mantra to all.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Learnmore;
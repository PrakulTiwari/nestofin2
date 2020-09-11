import React from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { signout } from '../helpers/auth';
import { isAuth } from '../helpers/auth';
import { useState } from 'react';
import '../assests/styles.css';
import '../assests/getstarted.css';
import '../assests/investing.css';
import {toast } from 'react-toastify';
// import { useHistory } from 'react-router-dom';

export default function Othernavbar() {
  let history = useHistory()
    const [navStyle, setNav] = useState({
    });
    //when burger is clciked
    const burger = () => {
      setNav({
        display:'flex',
        position:'fixed',
        transform:'translateX(-100vw)'
      });
    };
    //when cross is clicked
    const cross = () => {
      setNav({
        display:'none',
        position:'unset',
        transform:'translateX(0vw)'
      });
    };
    const resizedHandler = ()=>{
      if(window.innerWidth>780){
        setNav({
          display:'block',
          position:'initial',
          transform:'translateX(0vw)'
        }); 
      }else{
        setNav({
            display:'none',
            position:'unset',
            transform:'translateX(0vw)'
          });
      }
    }
    window.addEventListener('resize', resizedHandler);


    return (
            <div className="gnav">
                <Link to='/'><h1>NESTO/Fin.</h1></Link>
                <div className="wrapper">
                    <ul style={navStyle}>
                        <li className="others"><Link to="#">Help Center</Link></li>
                        {!isAuth() && <li className="others"><Link to="/login">Login</Link></li>}
                        {!isAuth() && <li className="others"><Link to="/register">Sign Up</Link></li>}
                        {isAuth() && <li onClick={() => {
                    signout(() => {
                      toast.error('Signout Successfully');
                      history.push('/login');
                    });
                    }} className="others"><Link to="#">Sign Out</Link></li>}
                        <div className="cross" onClick={cross}>X</div>
                    </ul>
                    {isAuth() && <span className="others" id="name">Welcome Back <Link to="/dashboard" title='YOUR Dashboard'>{isAuth().name}</Link></span>}
                    {/*replace upper line to {!isAuth() && <span className="others" id="name">Welcome Back <Link to="/dashboard" title='YOUR Dashboard'>Name</Link></span>}*/}
                </div>
                <div className="hamburger" onClick={burger}>
                    <div className="bun"></div>
                    <div className="bun"></div>
                    <div className="bun"></div>
                </div>
            </div>
    )
}

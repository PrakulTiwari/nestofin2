import React from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { signout } from '../helpers/auth';
import { isAuth } from '../helpers/auth';
import { toast } from 'react-toastify';
import { useState } from 'react';
import './script';
import './styles.css';

function Navbar({ history }) {
  
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
      if(window.innerWidth>1023){
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
            <div className="nav">
                <Link to='/'><h1>NESTO/Fin.</h1></Link>
                <div className="outer">
                <div className="wrapper">
                <ul  style={navStyle}>
                    <li className="others"><Link to="/investing">Investing</Link></li>
                    <li className="others"><Link to="/borrowing">Borrowing</Link></li>
                    <li className="others"><Link to="/planning">Planning</Link></li>
                    <li className="others"><Link to="/learnmore">Learn More</Link></li>
                    {!isAuth() && <Link to='/login'><li className="log">Login</li></Link>}
                    {!isAuth() && <Link to='/register'><li className="log">Sign Up</li></Link>}
                    {isAuth() && <li onClick={() => {
                    signout(() => {
                      toast.error('Signout Successfully');
                      history.push('/login');
                    });
                  }} className="log">Sign Out</li>}
                    <li className="gets"><Link to='/getstarted'>Get Started</Link></li>
                    <div className="cross" onClick={cross}>X</div>
                </ul>
                {isAuth() && <div className='borderbox'><span id="name">Welcome <Link to="/dashboard" title='YOUR Dashboard'>{isAuth().name}</Link></span></div>}
                {/*replace upper line to {!isAuth() && <span className="others" id="name">Welcome Back <Link to="/dashboard" title='YOUR Dashboard'>Name</Link></span>}*/}
                </div>
                <div className="hamburger" onClick={burger}>
                    <div className="bun"></div>
                    <div className="bun"></div>
                    <div className="bun"></div>
                </div>
                </div>
            </div>

  );
}

export default Navbar;
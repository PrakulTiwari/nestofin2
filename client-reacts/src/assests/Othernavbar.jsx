import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signout } from '../helpers/auth';
import { isAuth } from '../helpers/auth';
import { useState } from 'react';
import '../assests/styles.css';
import '../assests/getstarted.css';
import '../assests/investing.css';
import { toast } from 'react-toastify';
import Helpcenter from '../helpers/Helpcenter';

export default function Othernavbar() {
  let history = useHistory()
  const [showhelp, setshowhelp] = useState(false);
  const [navStyle, setNav] = useState({
  });
  //when burger is clciked
  const burger = () => {
    setNav({
      display: 'flex',
      position: 'fixed',
      transform: 'translateX(-100vw)'
    });
  };
  //when cross is clicked
  const cross = () => {
    setNav({
      display: 'none',
      position: 'unset',
      transform: 'translateX(0vw)'
    });
  };
  const resizedHandler = () => {
    if (window.innerWidth > 780) {
      setNav({
        display: 'block',
        position: 'initial',
        transform: 'translateX(0vw)'
      });
    } else {
      setNav({
        display: 'none',
        position: 'unset',
        transform: 'translateX(0vw)'
      });
    }
  }
  window.addEventListener('resize', resizedHandler);

  const helphandler = () => {
    if (window.innerWidth < 780)
      cross();
    const show = showhelp;
    setshowhelp(!show);
  }

  return (
    <div className="gnav">
      <Link to='/'><h1>NESTO/Fin.</h1></Link>
      <div className="wrapper">
        <ul style={navStyle}>
          <li className="others"><a onClick={helphandler}>Help Center</a></li>
          <li><Link to="/investing">Investing</Link></li>
          <li><Link to="/borrowing">Borrowing</Link></li>
          <li><Link to="/planning">Planning</Link></li>
          <li><Link to="/learnmore">Learn More</Link></li>
          {!isAuth() && <li className="others"><Link to='/login'>Login</Link></li>}
          {!isAuth() && <li className="others"><Link to='/register'>Sign Up</Link></li>}
          {isAuth() && <li onClick={() => {
            signout(() => {
              toast.error('Signout Successfully');
              history.push('/login');
            });
          }} className="others"><Link href="#">Sign Out</Link></li>}
          <div className="cross" onClick={cross}>X</div>
        </ul>
        {isAuth() && <span className="others" id="name">Welcome Back <a title='YOUR Dashboard'><Link to='/dashboard'>{isAuth().name}</Link></a></span>}
        {/*replace upper line to {!isAuth() && <span className="others" id="name">Welcome Back <a href="/dashboard" title='YOUR Dashboard'>Name</a></span>}*/}
        {showhelp && <Helpcenter success={toast.success} failed={toast.error} click={helphandler} />}
      </div>
      <div className="hamburger" onClick={burger}>
        <div className="bun"></div>
        <div className="bun"></div>
        <div className="bun"></div>
      </div>
    </div>
  )
}

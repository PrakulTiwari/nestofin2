import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import AML from '../assests/AML_KYC Policy.pdf';
import P_P from '../assests/Privacy Policy.pdf';
import T_C from '../assests/T_C.pdf';
import T_o_U from '../assests/Terms of Use.pdf';
import R_P from '../assests/Refund Policy-converted.pdf';
export default function Footer() {
    return (
        <div className="window5">
            <div className="last-nav">
                <ul>
                    <li className="others"><Link to="/investing">Investing</Link></li>
                    <li className="others"><Link to="/borrowing">Borrowing</Link></li>
                    <li className="others"><Link to="/planning">Planning</Link></li>
                    <li className="others"><Link to="/Learnmore">About Us</Link></li>
                    <li className="others"><Link to="/app">Go To Home</Link></li>
                    <li><a href="#top">Back to Top</a></li>
                </ul>
            </div>
            <div className="terms-conditions">
                The information contained in this website is for general information purposes only.
                The information is provided by [www.nestofin.com], a property of [Nestofin
                Technologies Private Limited]. While we endeavour to keep the information up to
                date and correct, we make no representations or warranties of any kind, express or
                implied, about the completeness, accuracy, reliability, suitability or availability with
                respect to the website or the information, products, services, or related graphics
                contained on the website for any purpose. Any reliance you place on such information
                is therefore strictly at your own risk.
                    <br />
                <br /> In no event will we be liable for any loss or damage including without limitation,
                    indirect or consequential loss or damage, or any loss or damage whatsoever arising
                    from loss of data or profits arising out of, or in connection with, the use of this
                    website.
                    <br />
                <br /> Through this website you are able to link to other websites which are not under the
                    control of [Nestofin Technologies Private Limited]. We have no control over the
                    nature, content and availability of those sites. The inclusion of any links does not
                    necessarily imply a recommendation or endorse the views expressed within them.
                    <br />
                <br />
                    Every effort is made to keep the website up and running smoothly. However,
                    [Nestofin Technologies Private Limited] takes no responsibility for, and will not be
                    liable for, the website being temporarily unavailable due to technical issues beyond
                    our control.
                </div>
            <div className='footerLinks'>
                <div><Link target='_blank' to={AML}>AML KYC Policy</Link></div>
                <div><Link target='_blank' to={P_P}>Privacy Policy</Link></div>
                <div><Link target='_blank' to={T_C}>Terms-Conditions</Link></div>
                <div><Link target='_blank' to={T_o_U}>Terms of Use</Link></div>
                <div><Link target='_blank' to={R_P}>Refund Policy</Link></div>
            </div>
        </div>
    )
}

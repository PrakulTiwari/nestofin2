import React from 'react';
import './styles.css';
import { Link, Redirect, useHistory } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="window5">
                <div className="last-nav">
                    <ul>
                        <li className="others"><Link to="/investing">Investing</Link></li>
                        <li className="others"><Link to="/borrowing">Borrowing</Link></li>
                        <li className="others"><Link to="/planning">Planning</Link></li>
                        <li className="others"><Link to="/learnmore">Learn More</Link></li>
                        <li className="others"><Link to="/">Go To Home</Link></li>
                        <li><a href="#top">Back to Top</a></li>
                    </ul>
                </div>
                <div className="terms-conditions">
                    We work with our partner Green Dot Bank, Member FDIC, to deliver checking features for the Cash Account.
                    <br />
                    <br /> Checking features are subject to Green Dot Bank’s application and approval. Debit Card is optional and must be requested. Wealthfront Cash Account Visa® Debit Card is issued by Green Dot Bank, Member FDIC, pursuant to a license from
                    Visa U.S.A. Inc. Visa is a registered trademark of Visa International Service Association. Green Dot Bank operates under the following registered trade names: GoBank, Green Dot Bank and Bonneville Bank. All of these registered trade names
                    are used by, and refer to, a single FDIC-insured bank, Green Dot Bank. Deposits under any of these trade names are deposits with Green Dot Bank and are aggregated for deposit insurance coverage. Wealthfront products and services are not
                    provided by Green Dot Bank. Green Dot is a registered trademark of Green Dot Corporation. ©2020 Green Dot Corporation. All rights reserved.
                    <br />
                    <br /> Early availability depends on timing of payor’s payment instructions and fraud prevention restrictions may apply. As such, the availability or timing of early direct deposit may vary from pay period to pay period. Interest does not
                    begin accruing until funds arrive at the program banks, which may take up to one business day.
                    <br />
                    <br />
                </div>
            </div>
    )
}

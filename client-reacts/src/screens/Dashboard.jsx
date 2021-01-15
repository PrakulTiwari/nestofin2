import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuth, getCookie, signout } from '../helpers/auth';
import Footer from '../assests/Footer';
import Editinfo from '../helpers/Editinfo';
import '../assests/styles.css';
import '../assests/getstarted.css';
import '../assests/investing.css';
import { ToastContainer, toast } from 'react-toastify';
import img from '../assests/images/yolk.png';
import Graph from '../helpers/Graph';
import Othernavbar from '../assests/Othernavbar';
import Refundform from '../helpers/Refundform';



function Dashboard({ history }) {
  const [details,setDetails] = useState(false)
  const update = () =>{
    history.go(0)
  }
  useEffect(() => {
    window.scrollTo(0, 0)
});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    textChange: 'Update',
    role: '',
    yolk_count:0,//C
    phonenumber: ''
  });

  useEffect(() => { 
    loadProfile();
  }, []);

  const loadProfile = () => {
    
    if(isAuth()){

        const token = getCookie('token');
        axios
          .get(`${process.env.REACT_APP_API_URL}/user/${isAuth()._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(res => {
            const { role, name, email, yolk_count, phonenumber } = res.data;//C
            setFormData({ ...formData, role, name, email, yolk_count, phonenumber });//C
          })
          .catch(err => {
            toast.error(`Error To Your Information ${err.response.statusText}`);
            if (err.response.status === 401) {
                  signout(() => {
                    history.push('/login');
                  });
            }
          })

        axios
          .get(`${process.env.REACT_APP_API_URL}/user/getbeneficiary/${isAuth()._id}`, {
            headers: {
              Authorization: `Bxyz ${token}`
            }
          })
          .then(res => {
            for (const key in res.data.beneficiary){
              bankdetails[key]=res.data.beneficiary[key]
            }
            setDetails(true)
          })
          .catch(err => {
            toast.error(`${err.response.data.status}`);
          })
      }
    else{
      history.push('/login');
    }  
  };

  const [display, setDisplay] = useState('none') 
    const toggle = () =>{
        const disp = display==='none'?'flex':'none';
        setDisplay(disp)
    }

  const [bankdetails, setbankdetails] = useState({
    bankAccount:'',
    ifsc:'',
    pincode:'',
    state:'',
    city:'',
    address1:''
  })

  const submitbankdetails = () =>{
    if(bankdetails.bankAccount&&bankdetails.ifsc&&bankdetails.address1&&bankdetails.city&&bankdetails.pincode&&bankdetails.state){
      const token = getCookie('token');
      axios.post(`${process.env.REACT_APP_API_URL}/user/addbeneficiary`,{
        ...bankdetails, 
        id:isAuth()._id,
        email:isAuth().email
      },{
        headers:{
          Authorization: `Bxyz ${token}`
        }
      })
      .then(res=>{
        loadProfile()
        toggle()
        toast.success(res.data.status)
      })
      .catch(err=>{
        toast.error(err.response.data.status)
      })
    } else{
      toast.error('Fill All Details')
    }
  }

  return (
            <div className="getstarted-page" id='top'>
                <Othernavbar />
                <ToastContainer />
                <Editinfo display={display} toggle={toggle}>
                <div className='userdetail'>
                  <span className='text-red-600 font-bold'>FILL FORM CAREFULLY THIS CAN'T BE EDITTED</span>
                  <div className="customer_details mx-auto">  
                    <div className="detail">
                      <div className="label">Bank Account :</div>
                      <div className="value rounded"><input onChange={e=>{setbankdetails({...bankdetails, [e.target.name]:e.target.value})}} value={bankdetails.bankAccount} type='text' name="bankAccount" id="" required minlength="9" maxlength="18" pattern="^([a-zA-Z0-9_-]){9,18}$"/></div>
                    </div>
                    <div className="detail">
                      <div className="label">IFSC :</div>
                      <div className="value rounded"><input onChange={e=>{setbankdetails({...bankdetails, [e.target.name]:e.target.value})}} value={bankdetails.ifsc} type="text" name="ifsc"  required minlength="11" maxlength="11" pattern="^[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$"/></div>
                    </div>
                    <div className="detail">
                      <div className="label">ADDRESS :</div>
                      <div className="value rounded"><input onChange={e=>{setbankdetails({...bankdetails, [e.target.name]:e.target.value})}} value={bankdetails.address1} type="text" name="address1" required maxLength='150'/></div>
                    </div>
                    <div className='text-xs text-red-200 text-right'>With in 150 letters</div>
                    <div className="detail">
                      <div className="label">PinCode :</div>
                      <div className="value rounded"><input onChange={e=>{setbankdetails({...bankdetails, [e.target.name]:e.target.value})}} value={bankdetails.pincode} type="text" name="pincode"  required pattern="[0-9]{6}" minlength="6" maxlength="6"/></div>
                    </div>
                    <div className="detail">
                      <div className="label">State :</div>
                      <div className="value rounded"><input onChange={e=>{setbankdetails({...bankdetails, [e.target.name]:e.target.value})}} value={bankdetails.state} type="text" name="state"  required maxLength='50'/></div>
                    </div>
                    <div className="detail">
                      <div className="label">City :</div>
                      <div className="value rounded"><input onChange={e=>{setbankdetails({...bankdetails, [e.target.name]:e.target.value})}} value={bankdetails.city} type="text" name="city"  required maxLength='50'/></div>
                    </div>
                  </div>
                  <button onClick={submitbankdetails} className="m-4 border-4 bg-indigo-200 border-indigo-500 rounded">Submit &#x261E;</button>
                </div>
                </Editinfo>
                <div className="content">
                  <div className="yolklabel">
                    <div className="yolk">
                      <img src={img} alt=""/>
                      <h1>{formData.yolk_count}</h1>
                    </div>
                    <span>Yolk Count</span>
                  </div>

                  <div className='userdetail'>
                    <div className="customer_details">
                      <div className="detail">
                        <div className="label">Name :</div>
                        <div className="value" id="name">{formData.name}</div>
                      </div>
                      <div className="detail">
                        <div className="label">Email :</div>
                        <div className="value" id="email">{formData.email}</div>
                      </div>
                      <div className="detail">
                        <div className="label">Contact Number :</div>
                        <div className="value" id="number">{formData.phonenumber}</div>
                      </div>
                    </div>
                    <div className="totalmoney">
                      <span id="money">{formData.yolk_count*parseInt(process.env.REACT_APP_YOLK_PRICE)}</span> Rs.
                    </div>
                  </div>

                </div>
                
                <div className="graphcontent">
                  {/* <div className="title">
                    PROFIT ANALYSIS
                  </div> */}
                  <div className="profitlossdetail">
                      {/* <div className="graph">
                        <Graph />
                      </div>
                      <div className="durationleft">
                        <i className="fa fa-clock-o" aria-hidden="true"></i> 3 MONTHS
                      </div> */}
                      <div className='userdetail'>
                        <div className="customer_details mx-auto">
                          {details?<div className='userdetail'>
                                    <div className="customer_details">
                                      <div className="detail">
                                        <div className="label">Account Number :</div>
                                        <div className="value" id="name">{bankdetails.bankAccount}</div>
                                      </div>
                                      <div className="detail">
                                        <div className="label">IFSC :</div>
                                        <div className="value" id="email">{bankdetails.ifsc}</div>
                                      </div>
                                      <div className="detail">
                                        <div className="label">ADDRESS :</div>
                                        <div className="value" id="number">{bankdetails.address1}</div>
                                      </div>
                                      <div className="detail">
                                        <div className="label">STATE :</div>
                                        <div className="value" id="number">{bankdetails.state}</div>
                                      </div>
                                      <div className="detail">
                                        <div className="label">PINCODE :</div>
                                        <div className="value" id="number">{bankdetails.pincode}</div>
                                      </div>
                                      <div className="detail">
                                        <div className="label">CITY :</div>
                                        <div className="value" id="number">{bankdetails.city}</div>
                                      </div>
                                    </div>
                                  </div>
                          :<div>No Bank Details found <br/> <button onClick={toggle} className="border-4 bg-indigo-200 border-indigo-500 rounded">Fill Details &#x2712;</button></div>}
                        </div>
                      </div>
                      <Refundform update={update} />  
                  </div>
                </div>
                <Footer />
            </div>
  );
}

export default Dashboard;
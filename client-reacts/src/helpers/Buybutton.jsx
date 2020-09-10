import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuth, getCookie, signout } from '../helpers/auth';
import '../assests/styles.css';
import '../assests/getstarted.css';
import '../assests/investing.css';
import {toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';


const loadscript = (src) =>{
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
    script.onload = () => {
      return resolve();
		}
		script.onerror = () => {
			return reject(false);
		}
  });
}

function Buybutton() {

    let history= useHistory();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password1: '',
        role: '',
        yolk_count:0,//C
        phonenumber:''
      });
    
      useEffect(() => { 
        isAuth() && loadProfile();
      }, []);
    
      const loadProfile = () => {
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
            });
      };

  const name=formData.name;
  const email = formData.email;
  const contact=formData.phonenumber;
  const clickhandler = () =>{
    if(isAuth()){
        loadscript('https://checkout.razorpay.com/v1/checkout.js')
        .then(() => {
          axios.post(`${process.env.REACT_APP_API_URL}/user/order`)
            .then((res) => {
              console.log(`Order details: ${res.data.id}`);
              const options = {
                key: (document.domain==='localhost')?'rzp_test_BMYo49h2TEl6fJ':process.env.REACT_APP_LIVE_KEY,
                amount: res.data.amount.toString(),
                currency: res.data.currency,
                name: "Acme Corp",
                description: "Test Transaction",
                image: "http://localhost:3000/logo192.png",//put your logo image link here
                order_id: res.data.id,
                prefill: {
                    name,
                    email,
                    contact
                },
                handler: (response) => {
                  // console.log(response.razorpay_payment_id+" "+response.razorpay_order_id+" "+response.razorpay_signature);
                },
                theme: {
                  color: "royalblue"
                }
              };
              console.log(`options: ${options}`);
              var rzp1 = new window.Razorpay(options);
              rzp1.open();
            }).catch((error) => {
              console.log(`POST ERROR : ${error}`)
            });
        }).catch((err) => {
            toast.error(`Make Sure You are connected to internet`);
        });
      
      }
      else{
        history.push('/login');
      } 
  }

  return (
    <button
      onClick={clickhandler}
      className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
    >
      BUY NOW
    </button>
  );
}

export default Buybutton;

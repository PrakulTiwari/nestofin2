import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuth, getCookie, signout } from '../helpers/auth';
import '../assests/styles.css';
import '../assests/getstarted.css';
import '../assests/investing.css';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';



function Buybutton() {

  let history = useHistory();
  let [count, setCount] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    role: '',
    yolk_count: 0,//C
    phonenumber: ''
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
  const [buytext, setbuytext] = useState('BUY NOW');
  const [url, seturl] = useState('#');
  const name = formData.name;
  const email = formData.email;
  const contact = formData.phonenumber;
  const clickhandler = () => {
    setbuytext('Wait...')
    if (isAuth()) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/user/order`, {
          count,
          email,
          contact,
          name,
          url: process.env.REACT_APP_API_URL
        })
        .then(res => {
          const postData = JSON.parse(res.data.postData);
          seturl(res.data.url);
          for (let key in postData) {
            let input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('value', postData[key]);
            input.setAttribute('name', key);
            document.getElementById("frm1").appendChild(input);
          } return true
        })
        .then((flag) => { document.frm1.submit() })
        .catch(err => {
          toast.error(`${err.response.data.error}`);
        });
    }
    else {
      history.push('/login');
    }
  }




  const up = () => {
    const temp = count + 1;
    setCount(temp);
  }
  const down = () => {
    if (count > 1) {
      const temp = count - 1;
      setCount(temp);
    }
  }
  return (
    <div className='payment'>
      <form action={url} id='frm1' name='frm1' method="post"></form>
      <div className="count">
        {count}
        <div className="control">
          <div className="button" onClick={up}>&#8593;</div>
          <div className="button" onClick={down}>&#8595;</div>
        </div>
      </div>
      <button
        onClick={clickhandler}
        className='tracking-wide font-semibold text-gray-100 w-full py-4 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
      >
        {buytext}
      </button>
    </div>
  );
}

export default Buybutton;

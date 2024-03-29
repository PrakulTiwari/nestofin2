import React, { useState } from 'react';
import authSvg from '../assests/auth.svg';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { isAuth } from '../helpers/auth';
import { Link, Redirect } from 'react-router-dom';
import '../assests/talwind.min.css';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
const Register = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
    phonenumber: '',
    textChange: 'Sign Up'
  });
  const { name, email, password1, password2, phonenumber, textChange } = formData;
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };
  const [btnstyle, setbtnstyle] = useState({
    cursor: 'not-allowed',
    backgroundColor: '#808080'
  });

  if (name && email && password1 && phonenumber) {
    if (phonenumber.length > 12) {
      if (btnstyle.cursor !== 'pointer') {
        setbtnstyle({
          cursor: 'pointer',
          backgroundColor: '#667eea'
        })
      }
    } else {
      if (btnstyle.cursor !== 'not-allowed') {
        setbtnstyle({
          cursor: 'not-allowed',
          backgroundColor: '#808080'
        })
      }
    }
  }

  const handlePhonenumber = e => {
    setFormData({ ...formData, phonenumber: e });
  }
  const handleSubmit = e => {
    e.preventDefault();
    if (name && email && password1 && phonenumber) {
      if (password1 === password2) {
        setFormData({ ...formData, textChange: 'Submitting' });
        axios
          .post(`${process.env.REACT_APP_API_URL}/register`, {
            name,
            email,
            password: password1,
            phonenumber
          })
          .then(res => {
            setFormData({
              ...formData,
              name: '',
              email: '',
              password1: '',
              password2: '',
              phonenumber: '',
              textChange: 'Submitted'
            });

            toast.success(res.data.message);
          })
          .catch(err => {
            setFormData({
              ...formData,
              name: '',
              email: '',
              password1: '',
              password2: '',
              phonenumber: '',
              textChange: 'Sign Up'
            });
            console.log(err.response);
            toast.error(err.response.data.errors);
          });
      } else {
        toast.error("Passwords don't match");
      }
    } else {
      toast.error('Please fill all fields');
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 text-gray-900 flex justify-center'>
      {isAuth() ? <Redirect to='/dashboard' /> : null}
      <ToastContainer />
      <div className='max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
        <div className='lg:w-1/2 xl:w-5/12 p-6 sm:p-12'>
          <div className='mt-12 flex flex-col items-center'>
            <h1 className='text-2xl xl:text-3xl font-extrabold'>
              Sign Up for <span style={{ textDecoration: 'underline' }}><Link to='/'>NESTO/Fin.</Link></span>
            </h1>
            <p className='text-2m font-extrabold'>Note: The password must contain a number</p>
            <form
              className='w-full flex-1 mt-8 text-indigo-500'
              onSubmit={handleSubmit}
              autoComplete='off'
            >
              <div className='mx-auto max-w-xs relative '>
                <input
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white'
                  type='text'
                  placeholder='Name'
                  onChange={handleChange('name')}
                  value={name}
                />
                <input
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5'
                  type='email'
                  placeholder='Email'
                  onChange={handleChange('email')}
                  value={email}
                />
                <input
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5'
                  type='password'
                  placeholder='Password'
                  onChange={handleChange('password1')}
                  value={password1}
                />
                <input
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5'
                  type='password'
                  placeholder='Confirm Password'
                  onChange={handleChange('password2')}
                  value={password2}
                />
                <PhoneInput
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5'
                  placeholder="Enter phone number"
                  value={phonenumber}
                  onChange={handlePhonenumber}
                  defaultCountry='IN'
                />
                <button
                  type='submit'
                  className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
                  style={btnstyle}
                >
                  <i className='fas fa-user-plus fa 1x w-6  -ml-2' />
                  <span className='ml-3'>{textChange}</span>
                </button>
              </div>
              <div className='my-12 border-b text-center'>
                <div className='leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2'>
                  Signed Up? Activate Your Account
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <Link
                  className='w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5'
                  to='/users/activate'
                  target='_self'
                >
                  <i className='fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500' />
                  <span className='ml-4'>Activate Account</span>
                </Link>
                <strong>Using OTP that was send to your email</strong>
              </div>
              <div className='my-12 border-b text-center'>
                <div className='leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2'>
                  Or sign with email or social login
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <Link
                  className='w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5'
                  to='/login'
                  target='_self'
                >
                  <i className='fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500' />
                  <span className='ml-4'>Sign In</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className='flex-1 bg-indigo-100 text-center hidden lg:flex'>
          <div
            className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Register;

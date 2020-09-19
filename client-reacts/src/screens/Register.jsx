import React, { useState } from 'react';
import authSvg from '../assests/auth.svg';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { authenticate, isAuth } from '../helpers/auth';
import { Link, Redirect } from 'react-router-dom';
import '../assests/talwind.min.css';
import Firebase from '../helpers/Firebase';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
const Register = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
    phonenumber:'',
    textChange: 'Sign Up'
  });

  const [value, setValue] = useState('')
  const [btntext, settext] = useState('Verify Mobile Number');
  const [allowed, setpermission] = useState(false);
  const { name, email, password1, password2, phonenumber, textChange} = formData;
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handlenumberClick=()=>{
    var recaptcha = new Firebase.auth.RecaptchaVerifier('recaptcha',{'size':'invisible'});
    var number = value;
    Firebase.auth().signInWithPhoneNumber(number, recaptcha)
                  .then( function(e) {
                    var code = prompt('Enter the otp', '');
                      if(code === null) return;
                      e.confirm(code).then(function (result) {
                          settext('Mobile Number Verified');
                          setpermission(true);
                          setFormData({ ...formData, phonenumber: result.user.phoneNumber });
                      }).catch(function (error) {
                          console.error( error);
                      });
                  })
                  .catch(function (error) {
                      console.error( `cant authrorised ${error}`);
                  });
  }
  const handleSubmit = e => { 
    e.preventDefault();
    if (name && email && password1 && phonenumber) {
      if(allowed){
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
              phonenumber:'',
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
              phonenumber:'',
              textChange: 'Sign Up'
            });
            settext('Verify Mobile Number');
            setpermission(false);
            console.log(err.response);
            toast.error("An account with that email already exists");
          });
      } else {
        toast.error("Passwords don't match");
      }
      } else {
        toast.error("Please Verify Phone Number");
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
              Sign Up for <Link to='/'>NESTO/Fin.</Link>
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
                  value={value}
                  onChange={setValue}
                />
                <div>
                  <div id="recaptcha"></div>
                  <div
                  onClick={handlenumberClick} 
                  className='bg-indigo-500 text-white text-sm rounded-md p-2 mt-4 mx-auto focus:outline-none w-3/4 text-center'
                  >{btntext}</div>
                </div>
                <button
                  type='submit'
                  className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
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
                <a
                  className='w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5'
                  href='/users/activate'
                  target='_self'
                >
                  <i className='fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500' />
                  <span className='ml-4'>Activate Account</span>
                </a>
              </div>
              <div className='my-12 border-b text-center'>
                <div className='leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2'>
                  Or sign with email or social login
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <a
                  className='w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5'
                  href='/login'
                  target='_self'
                >
                  <i className='fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500' />
                  <span className='ml-4'>Sign In</span>
                </a>
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

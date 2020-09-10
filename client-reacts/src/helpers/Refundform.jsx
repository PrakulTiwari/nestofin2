import React,{useState} from 'react';
import axios from 'axios';
import { authenticate, isAuth } from '../helpers/auth';
import { Link, Redirect } from 'react-router-dom';
import '../assests/talwind.min.css';

function Refundform() {

  const [formvalue, setformvalue] = useState("");
  const [Refundstate, setRefundstate] = useState("");
  const handleClick = () =>{
    if(formvalue){
      axios
        .post(`${process.env.REACT_APP_API_URL}/user/refund`,{
          id:formvalue
        })
        .then((res) => {
          console.log(res)
          if(res.data.error){
            setformvalue('')
            setRefundstate(res.data.error.error.description)
          }
          else{
            setformvalue('')
            setRefundstate(res.data.message)
          }
        }).catch((errors) => {
          setformvalue('')
          console.log(`Refund Error: ${errors.error}`)
        });
    }
    else{
      setformvalue('')
      setRefundstate('Please enter valid payment id');
    }
  }
  return (
    <div>
      <input
        className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5' 
        type="text" 
        value={formvalue} 
        onChange={e => setformvalue(e.target.value)}
      />
      <button
        className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none' 
        type="submit"
        onClick={handleClick}
      >
          Refund
      </button>
        {Refundstate}
    </div>
  );
}

export default Refundform;

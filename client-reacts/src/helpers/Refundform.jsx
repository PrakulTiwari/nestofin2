import React, { useState } from 'react';
import axios from 'axios';
import { isAuth } from '../helpers/auth';
import '../assests/talwind.min.css';
import '../assests/investing.css';

function Refundform() {
  let [count, setCount] = useState(1);
  const [formvalue, setformvalue] = useState("");
  const [Refundstate, setRefundstate] = useState("");
  const handleClick = () => {
    if (formvalue) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/user/refund`, {
          id: formvalue,
          count,
          email: isAuth().email
        })
        .then((res) => {
          console.log(res)
          if (res.data.error) {
            setformvalue('')
            setRefundstate(res.data.error.error.description)
          }
          else {
            setformvalue('')
            setRefundstate(res.data.message)
          }
        }).catch((errors) => {
          setformvalue('')
          console.log(`Refund Error: ${errors.error}`)
        });
    }
    else {
      setformvalue('')
      setRefundstate('Please enter valid payment id');
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
    <div>
      <div style={{ display: 'flex', backgroundColor: 'royalblue' }}>
        <div className="count">
          {count}
          <div className="control">
            <div className="button" onClick={up}>&#8593;</div>
            <div className="button" onClick={down}>&#8595;</div>
          </div>
        </div>
        <input
          className='w-full px-8 py-4 font-medium bg-gray-100 border border-gray-500 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white'
          type="text"
          value={formvalue}
          onChange={e => setformvalue(e.target.value)}
        />
      </div>
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

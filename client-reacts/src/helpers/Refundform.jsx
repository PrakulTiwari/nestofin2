import React,{useState} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getCookie } from '../helpers/auth';
import '../assests/talwind.min.css';
import '../assests/investing.css';
import { isAuth } from '../helpers/auth';

function Refundform(props) {
  let [count,setCount] = useState(1);
  const [refundtext, setRefundtext] = useState('WithDraw')
  const handleClick = () =>{
    const token = getCookie('token')
    setRefundtext('Withdrawing...')
      axios
        .post(`${process.env.REACT_APP_API_URL}/user/withdraw`,{
          count,
          email:isAuth().email,
          id:isAuth()._id
        },{
          headers: {
            Authorization: `Bxyz ${token}`
          }
        })
        .then((res) => {
          setRefundtext('Refund')
          toast.success(res.data.status)
          props.update()
        }).catch((errors) => {
          setRefundtext('Withdraw')
          toast.error(errors.response.data.status)
          console.log(`Refund Error: ${errors.response.data.status}`)
        });
  }

  const up = () => {
    const temp = count+1;
    setCount(temp);
  }
  const down = () => {
    if(count>1){
      const temp = count-1;
      setCount(temp);
    }
  }
  return (
    <div className='payment mx-auto my-4'>
      <div className="count">
        {count}
        <div className="control">
          <div className="button" onClick={up}>&#8593;</div>
          <div className="button" onClick={down}>&#8595;</div>
        </div>
      </div>
      <button
        onClick={handleClick}
        className='tracking-wide font-semibold text-gray-100 w-100 py-4 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
        >
        {refundtext}
      </button>
    </div>
  );
}

export default Refundform;

imREACT_APP_API_URL React, { useState, useEffect } from 'react';
imREACT_APP_API_URL axios from 'axios';
imREACT_APP_API_URL { isAuth, getCookie, signout } from '../helpers/auth';
imREACT_APP_API_URL Footer from '../assests/Footer';
imREACT_APP_API_URL '../assests/styles.css';
imREACT_APP_API_URL '../assests/getstarted.css';
imREACT_APP_API_URL '../assests/investing.css';
imREACT_APP_API_URL { ToastContainer, toast } from 'react-toastify';
imREACT_APP_API_URL img from '../assests/images/yolk.png';
imREACT_APP_API_URL Graph from '../helpers/Graph';
imREACT_APP_API_URL Othernavbar from '../assests/Othernavbar';



function Investing({ history }) {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    textChange: 'Update',
    role: '',
    yolk_count:0//C
  });

  useEffect(() => { 
    loadProfile();
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
        const { role, name, email, yolk_count } = res.data;//C
        setFormData({ ...formData, role, name, email, yolk_count });//C
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

  return (
            <div className="getstarted-page" id='top'>
                <Othernavbar />
                <ToastContainer />
                <div className="content">
                  <div className="yolklabel">
                    <div className="yolk">
                      <img src={img} alt=""/>
                      <h1>{isAuth().yolk_count}</h1>
                    </div>
                    <span>Yolk Count</span>
                  </div>

                  <div className='userdetail'>
                    <div className="customer_details">
                      <div className="detail">
                        <div className="label">Name :</div>
                        <div className="value" id="name">{isAuth().name}</div>
                      </div>
                      <div className="detail">
                        <div className="label">Email :</div>
                        <div className="value" id="email">{isAuth().email}</div>
                      </div>
                      <div className="detail">
                        <div className="label">Contact Number :</div>
                        <div className="value" id="number">9654723472</div>
                      </div>
                    </div>
                    <div className="totalmoney">
                      <span id="money">2,000</span> Rs.
                    </div>
                  </div>

                </div>
                <div className="graphcontent">
                  <div className="title">
                    PROFIT ANALYSIS
                  </div>
                  <div className="profitlossdetail">
                      <div className="graph">
                        <Graph />
                      </div>
                      <div className="durationleft">
                        <i className="fa fa-clock-o" aria-hidden="true"></i> 3 MONTHS
                      </div>
                    </div>
                </div>
                <Footer />
            </div>
  );
}

exREACT_APP_API_URL default Investing;
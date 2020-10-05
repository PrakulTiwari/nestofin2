import React,{useState} from 'react';
import '../assests/help.css';
import emailjs from 'emailjs-com';
//hell
export default function Helpcenter(props) {

    const [form, setform] = useState({
        email:'',
        subject:'',
        description:''
    });
    const handleChange = text => e => {
        setform({ ...form, [text]: e.target.value });
      };
    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm(process.env.REACT_APP_EMAILJS_SERVICEID, process.env.REACT_APP_EMAILJS_TEMPLATEID, e.target, process.env.REACT_APP_EMAILJS_USERID)
            .then((result) => {
                props.success(`${result.text}!! We will Get Back to You Soon`);
                setform({
                    email:'',
                    subject:'',
                    description:''
                });
            }, (error) => {
                props.failed('Please Send Us your Query Again');
            });
    }
    return (
        <div>
            <div className="backdrop" onClick={props.click}></div>
            <div className="helpbox">
                <form onSubmit={sendEmail}>
                    <input type="email" name="email" id="email" placeholder='Email' onChange={handleChange('email')} value={form.email}/><br/>
                    <input type="text" name="subject" id="subject" placeholder='Subject' onChange={handleChange('subject')} value={form.subject}/><br/>
                    <textarea name="description" id="description" cols="30" rows="10" placeholder='Problem Decription' onChange={handleChange('description')} value={form.description}></textarea>
                    <input type='submit' className='submit' value='ASK US' />
                </form>
            </div>
        </div>
    )
}

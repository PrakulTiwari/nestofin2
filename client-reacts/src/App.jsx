import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from './assests/Navbar';
import Homepage from './assests/Homepage';
import Footer from './assests/Footer';
import './assests/styles.css'

function App({ history }) {
  // console.log(`History : ${history}`);
  //fiwjcfnmsrnvjrjkvsnhuvvdsn
  return (
    <div>
        <Navbar />
        <ToastContainer />
        <Homepage />
        <Footer />
    </div>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import App from './App.jsx';
import Learnmore from './screens/Learnmore';
import Planning from './screens/Planning';
import Borrowing from './screens/Borrowing';
import Investing from './screens/Investing';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login.jsx';
import Register from './screens/Register.jsx';
import Activate from './screens/Activate.jsx';
import Private from './screens/Private.jsx';
import Admin from './screens/Admin.jsx';
import ForgetPassword from './screens/ForgetPassword.jsx';
import ResetPassword from './screens/ResetPassword.jsx';

import PrivateRoute from './Routes/PrivateRoute';
import AdminRoute from './Routes/AdminRoute';
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path='/' exact render={props => <Planning {...props} />} />
      <Route path='/learnmore' exact render={props => <Learnmore {...props} />} />
      <Route path='/planning' exact render={props => <Planning {...props} />} />
      <Route path='/investing' exact render={props => <Investing {...props} />} />
      <Route path='/borrowing' exact render={props => <Borrowing {...props} />} />
      {/* <Route path='/dashboard' exact render={props => <Dashboard {...props} />} />  */}
      {/*To check dashboard without login uncomment above line--------------------------------------------*/}
      <Route path='/login' exact render={props => <Login {...props} />} />
      <Route path='/register' exact render={props => <Register {...props} />} />
      <Route path='/users/password/forget' exact render={props => <ForgetPassword {...props} />} />
      <Route path='/users/password/reset' exact render={props => <ResetPassword {...props} />} />
      <Route path='/users/activate' exact render={props => <Activate {...props} />} />
      <PrivateRoute path="/dashboard" exact component={Dashboard} />
      <PrivateRoute path="/private" exact component={Private} />
      <AdminRoute path="/admin" exact component={Admin} />
      <Redirect to='/' />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

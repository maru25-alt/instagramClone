import React from 'react';
import './assets/css/app.css';
import Home from './views/Home'
import Signup from './views/Signup';
import Signin from './views/Signin';
import Profile from './views/Profile';
import {ToastContainer} from 'react-toastify';
import Header from './components/Header'
import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


function App() {
 
  return (
    <Router>
        <div className="app">
          <ToastContainer/>
          <Switch>
            <Route path="/signin">
              <Signin/>
            </Route>
            <Route path="/signup">
              <Signup/>
            </Route>
            <Route path="/profile">
              <Header/>
              <Profile/>
            </Route>
            <Route path="/">
              <Header/>
              <Home/>
            </Route>
            <Redirect from='*' to='/'/>
          </Switch>
          
        </div>
    </Router>
  );
}

export default App;

import Login from '../Login/Login';
import Register from '../Register/Register';
import Dashboard from '../Dashboard/Dashboard';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import './App.css';
import ImageUpload from '../ImageUpload/ImageUpload';
import { Provider } from 'react-redux';
import store from "../../state/store"
import ImageGallary from '../ImageGallary/ImageGallary';
import axios from 'axios';
import { useState,useEffect } from 'react';
import Logout from '../Logout';


function App() {
const [loggedIn,setLoggedIn]=useState(false)

const checkSession = async () => {
  console.log(checkSession)
  try {
    const response = await axios.get("http://localhost:5000/checkSession");

    console.log("response",response)
    setLoggedIn(response.data.loggedIn);
  } catch (error) {
    console.error('Error checking session', error);
    setLoggedIn(false);
  }
};

useEffect(() => {
  checkSession();
}, []);


  return (
    <Provider store={store} >
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/Register' element={<Register/>}/>
        <Route path='/Dashboard' element={<ProtectedRoute  element={Dashboard} />} />
        <Route path='/uploadImage' element={<ProtectedRoute  element={ImageUpload} />} />
        <Route path='imageGallery' element={<ProtectedRoute  element={ImageGallary} />} />
        <Route path='/logout' element={<Logout/>} />
      </Routes>
    </Router>
    </Provider>
  );
}

export default App;

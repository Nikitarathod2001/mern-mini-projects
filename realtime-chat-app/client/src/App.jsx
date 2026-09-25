import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Chat from './pages/Chat';

function Login() {
  return <h1>Login Page</h1>;
}

function Register() {
  return <h1>Register Page</h1>;
}


const App = () => {
  return (
    <>

      <Toaster position='top-right'/>
    
      <BrowserRouter>

        <Routes>

          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/chat' element={<Chat/>}/>

        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App

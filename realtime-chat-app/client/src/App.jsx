import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Chat from './pages/Chat';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>

      <Toaster position='top-right'/>
    
      <BrowserRouter>

        <Routes>

          <Route path='/login' element={<Login/>}/>
          <Route path='/' element={<Register/>}/>
          
          <Route element={<ProtectedRoute/>}>
            <Route path='/chat' element={<Chat/>}/>
          </Route>

        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App

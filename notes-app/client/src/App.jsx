import React from 'react';
import {Routes, Route} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import NoteDetails from './pages/NoteDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      }/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/notes/:id' element={
        <ProtectedRoute>
          <NoteDetails/>
        </ProtectedRoute>
      }/>
    </Routes>
  )
}

export default App

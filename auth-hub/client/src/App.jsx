import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import OAuthSuccess from './pages/OAuthSuccess'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='/oauth-success' element={<OAuthSuccess/>}/>
        <Route element={<ProtectedRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App

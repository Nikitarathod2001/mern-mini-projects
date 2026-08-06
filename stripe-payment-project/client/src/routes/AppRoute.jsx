import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from '../App'
import Success from '../pages/Success'
import Cancel from '../pages/Cancel'

const AppRoute = () => {
  return (
    <Routes>
      <Route path='/success' element={<Success/>}/>
      <Route path='/cancel' element={<Cancel/>}/>
    </Routes>
  )
}

export default AppRoute

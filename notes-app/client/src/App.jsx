import React from 'react';
import {Routes, Route} from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<h1 className='text-3xl font-bold'>Notes App</h1>}/>
    </Routes>
  )
}

export default App

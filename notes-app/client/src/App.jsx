import React from 'react';
import {Routes, Route} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import NoteDetails from './pages/NoteDetails';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/notes/:id' element={<NoteDetails/>}/>
    </Routes>
  )
}

export default App

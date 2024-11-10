import React, { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Dropbox from './pages/Dropbox/Dropbox'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'

const App = () => {

  return (
    <>
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dropbox' element={<Dropbox />} />
        </Routes >
      </div >
    </>
  )
}

export default App
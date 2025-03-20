import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Signup from './components/Auth/Signup'
import Login from './components/Auth/Login'
import Home from './components/Home/Home'

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />
      <div className='w-full h-dvh bg-white/25'>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/signup' element={<Signup />} />
          <Route path='/Login' element={<Login />} />
        </Routes>
      </div>


    </BrowserRouter>
  )
}

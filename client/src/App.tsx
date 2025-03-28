
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Signup from './components/Auth/Signup'
import Login from './components/Auth/Login'
import Home from './components/Home/Home'
import CallingScreen from './components/CallingScreen/CallingScreen'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />
      <div className='w-full h-dvh bg-white/25'>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/signup' element={<Signup />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/call/:id' element={<CallingScreen />} />
        </Routes>
        <Toaster />
      </div>


    </BrowserRouter>
  )
}

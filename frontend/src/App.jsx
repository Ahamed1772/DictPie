import Opener from './Pages/Opener'
import { useNavigate,Route, Routes, Navigate } from 'react-router-dom'
import Login from './Pages/Login'
import SignIn from './Pages/SignIn'
import Dashboard from './Pages/Dashboard'
import Gallery from './Pages/Gallery'
import EmailVerification from './Pages/EmailVerification'
import { useAuthUser } from './hooks/UseAuthUser'

import axios from 'axios'
axios.defaults.withCredentials = true;

//toast
import { Toaster } from 'react-hot-toast'
const App = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  return (
    <div>
      <Routes>
      <Route path='/' element={<Opener />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignIn />} />
      <Route path='/dashboard' element={authUser ? (
            <Dashboard />
          ) : (<Navigate to='/' />)} />
      <Route path='/mySavedGallery' element={authUser ? (
            <Gallery />
          ) : (<Navigate to='/' />)}  />
      <Route path='/verify/email' element={authUser ? (<EmailVerification />) : (<Navigate to='/' />)}/>
    </Routes>
    <Toaster />
    </div>
    
  )
}

export default App
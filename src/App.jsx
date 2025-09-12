
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from './pages/Landing';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Shop from './pages/Shop';


const App = () => {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />

            <Route path='/shop' 
            element={<ProtectedRoute>
              <Shop />
            </ProtectedRoute>}
            />

            <Route path='/cart'
             element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
             }/>

            <Route path='/admin' element={<ProtectedRoute role='admin'>
              <Admin />
            </ProtectedRoute>} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

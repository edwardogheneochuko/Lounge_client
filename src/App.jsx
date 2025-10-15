import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
// auth
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
// user
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import MyOrders from './components/MyOrder'
import Settings from './pages/Settings';
import UserLayout from './layout/UserLayout';
// admin
import Admin from './pages/Admin';
import AdminLayout from './layout/AdminLayout';
import AdminSettings from './pages/AdminSettings';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} /> 

        <Route element={<ProtectedRoute>
               <UserLayout /> 
            </ProtectedRoute>
        }> 
           <Route path='/shop' element={<Shop />} />
           <Route path='/settings' element={<Settings />} />
           <Route path='/cart' element={<Cart />} />
           <Route path='/my-orders' element={<MyOrders />} />
        </Route>

        <Route element={<ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>}>
          <Route path='/admin' element={<Admin />} />
          <Route path='/admin/settings' element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

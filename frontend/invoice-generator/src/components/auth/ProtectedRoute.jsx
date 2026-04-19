import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Login from '../../pages/Auth/Login';
import DashboardLayout from '../layout/DashboardLayout';

const ProtectedRoute = ({children}) => {
    
    const isAuthenticated = true;
    const loading = false;

    if(loading){
        return <div>Loading</div>
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

  return (
    <DashboardLayout>
        {Children ? children : <Outlet />}
    </DashboardLayout>
  )
}

export default ProtectedRoute
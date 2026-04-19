import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage/LandingPage'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Dashboard from './pages/Dashboard/Dashboard'
import AllInvoices from './pages/Invoices/AllInvoices'
import CreateInvoice from './pages/Invoices/CreateInvoice'
import InvoiceDetail from './pages/Invoices/InvoiceDetails'
import ProfilePage from './pages/Profile/ProfilePage'
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* protected routes  */}
          <Route to="/" element={<ProtectedRoute />}>
            <Route to="dashboard" element={<Dashboard />} />
            <Route to="invoices" element={<AllInvoices />} />
            <Route to="invoices/new" element={<CreateInvoice />} />
            <Route to="invoices/:id" element={<InvoiceDetail />} />
            <Route to="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>

      <Toaster 
        toastOptions={{
          className: '',
          style: {
            fontSize: "13px"
          }
        }}
      />


    </div>
  )
}

export default App
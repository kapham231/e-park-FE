import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AdminLogin from './Admin/pages/login.jsx'
import AdminMainPage from './Admin/pages/mainpage.jsx'
import WelcomePage from './pages/welcome.tsx'
import StaffMainPage from './Staff/pages/mainpage.jsx'
import ManagerMainPage from './Manager/pages/mainpage.jsx'
import UserLogin from './User/pages/userlogin.jsx'
import UserHomepage from './User/pages/userhomepage.jsx'

import AuthProvider from './auth/AuthProvider.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
// import PaymentCancel from "./User/pages/paymentcancel.jsx";
// import PaymentSuccess from "./User/pages/paymentsuccess.jsx";

function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='*' element={<WelcomePage />} />
            <Route path='/operator/login' element={<AdminLogin />} />
            <Route path='/user/login' element={<UserLogin />} />
            <Route path='/user/*' element={<UserHomepage />} />
            <Route element={<PrivateRoute />}>
              <Route path='/admin/*' element={<AdminMainPage />} />
              <Route path='/staff/*' element={<StaffMainPage />} />
              <Route path='/manager/*' element={<ManagerMainPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App

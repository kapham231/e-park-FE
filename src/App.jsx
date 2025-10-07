import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// config
import { ROLES } from './config/roles'

// contexts
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleBasedRoute } from './routes/RoleBasedRoute'

import AdminLogin from './Admin/pages/login.jsx'
import AdminMainPage from './Admin/pages/mainpage.jsx'
import WelcomePage from './pages/welcome.jsx'
import StaffMainPage from './Staff/pages/mainpage.jsx'
import ManagerMainPage from './Manager/pages/mainpage.jsx'
import UserLogin from './User/pages/userlogin.jsx'
import UserHomepage from './User/pages/userhomepage.jsx'
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFound from './pages/NotFound'

// import PaymentCancel from "./User/pages/paymentcancel.jsx";
// import PaymentSuccess from "./User/pages/paymentsuccess.jsx";

// import AuthProvider from './auth/AuthProvider.jsx'
// import PrivateRoute from './routes/PrivateRoute.jsx'

// function App() {
//   return (
//     <div className='App'>
//       <Router>
//         <AuthProvider>
//           <Routes>
//             <Route path='*' element={<WelcomePage />} />
//             <Route path='/operator/login' element={<AdminLogin />} />
//             <Route path='/user/login' element={<UserLogin />} />
//             <Route path='/user/*' element={<UserHomepage />} />
//             <Route element={<PrivateRoute />}>
//               <Route path='/admin/*' element={<AdminMainPage />} />
//               <Route path='/staff/*' element={<StaffMainPage />} />
//               <Route path='/manager/*' element={<ManagerMainPage />} />
//             </Route>
//           </Routes>
//         </AuthProvider>
//       </Router>
//     </div>
//   )
// }

function App() {
  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path='/welcome' element={<WelcomePage />} />
            <Route path='/operator/login' element={<AdminLogin />} />
            <Route path='/user/login' element={<UserLogin />} />

            {/* Admin routes */}
            <Route
              path='/admin/*'
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminMainPage />
                </ProtectedRoute>
              }
            />

            {/* Manager routes */}
            <Route
              path='/manager/*'
              element={
                <ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]}>
                  <ManagerMainPage />
                </ProtectedRoute>
              }
            />

            {/* Staff routes */}
            <Route
              path='/staff/*'
              element={
                <ProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]}>
                  <StaffMainPage />
                </ProtectedRoute>
              }
            />

            {/* Customer routes */}
            <Route
              path='/user/*'
              element={
                // <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, '']}>
                <UserHomepage />
                // </ProtectedRoute>
              }
            />

            {/* Unauthorized */}
            <Route path='/unauthorized' element={<UnauthorizedPage />} />

            {/* Home - Redirect based on role */}
            <Route path='/' element={<Home />} />

            {/* 404 */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

// Home component - auto redirect dựa trên role
const Home = () => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to='/welcome' replace />
  }

  // Redirect về homepage của role
  const homepage = getHomepageByRole(user.role)
  return <Navigate to={homepage} replace />
}

export default App

import { useEffect } from "react"
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import UserProfile from './pages/UserProfile'
import Redirect from './pages/Redirect'
import AuthCallback from './pages/AuthCallback'
import { NotFoundState } from './components/common/NotFoundState'

let hasInitializedAuth = false

function App() {
  useEffect(() => {
    if (hasInitializedAuth) return
    hasInitializedAuth = true
    useAuthStore.getState().initializeAuth()
  }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/u/:username" element={<UserProfile />} />
        <Route path="/:shortCode" element={<Redirect />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFoundState heading="not found" description="the page you requested doesn't exist" />} />
      </Route>
    </Routes>
  )
}

export default App

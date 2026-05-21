import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Services from './pages/Services';
import CategoryPage from './pages/CategoryPage';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterUserPage from './pages/RegisterUserPage';
import RegisterProviderPage from './pages/RegisterProviderPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ProvidersPage from './pages/ProvidersPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import StaticPages from './pages/StaticPages';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-user" element={<RegisterUserPage />} />
            <Route path="/register-provider" element={<RegisterProviderPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="/category/:categoryId" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/providers" element={<Layout><ProvidersPage /></Layout>} />
            <Route path="/providers/:id" element={<Layout><ProviderProfilePage /></Layout>} />
            <Route path="/page/:pageId" element={<Layout><StaticPages /></Layout>} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bookings" element={<Layout><BookingHistoryPage /></Layout>} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
          <AdminRoute>
            <Layout><AdminDashboard /></Layout>
          </AdminRoute>
        } />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
}

function AppWithBoundary() {
    return (
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
}

export default AppWithBoundary;

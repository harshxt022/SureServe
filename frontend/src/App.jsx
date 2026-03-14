import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Services from './pages/Services';
import CategoryPage from './pages/CategoryPage';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterUserPage from './pages/RegisterUserPage';
import RegisterProviderPage from './pages/RegisterProviderPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-user" element={<RegisterUserPage />} />
            <Route path="/register-provider" element={<RegisterProviderPage />} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="/category/:categoryId" element={<Layout><CategoryPage /></Layout>} />
        </Routes>
    );
}

export default App;

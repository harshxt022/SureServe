import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    setIsError(false);

    try {
      const endpoint = role === 'user' ? '/api/auth/login' : '/api/auth/login-provider';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful! Redirecting...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', role);
        setTimeout(() => {
          navigate('/dashboard'); // placeholder for now
        }, 1500);
      } else {
        setIsError(true);
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Network error. Please try again.');
    }
  };
  return (
    <>

      {/*  Minimal Nav  */}
      <nav className="w-full p-4 flex justify-between items-center absolute top-0 left-0 right-0 z-10">
        <a href="/" className="flex items-center gap-2 group cursor-pointer text-gray-900 dark:text-white px-4">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <i className="fas fa-home text-lg"></i>
          </div>
          <span className="text-2xl font-bold font-heading tracking-tight">SureServe</span>
        </a>
        <button onClick={() => { /* toggleDarkMode() */ }}
          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4"
          aria-label="Toggle Dark Mode">
          <i className="theme-toggle-icon fas fa-moon text-xl"></i>
        </button>
      </nav>

      {/*  Login Form  */}
      <main className="flex-grow flex items-center justify-center p-4 pt-24 relative overflow-hidden">
        {/*  Decorative  */}
        <div
          className="absolute -top-[10%] -right-[10%] w-[400px] h-[400px] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-[80px] -z-10">
        </div>
        <div
          className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-[80px] -z-10">
        </div>

        <div
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your credentials to access your account</p>
          </div>

          <form id="loginForm" className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a</label>
              <select id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white">
                <option value="user">Customer</option>
                <option value="provider">Service Provider</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="email" id="email" placeholder="you@example.com" required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="password" id="password" placeholder="••••••••" required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-gray-400" />
              </div>
            </div>

            <button type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
              Sign In
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-center text-sm font-medium ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? <br className="sm:hidden" />
            <a href="/register-user" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">User
              Signup</a> or
            <a href="/register-provider"
              className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">Provider Signup</a>
          </p>
        </div>
      </main>


    </>
  );
};

export default LoginPage;

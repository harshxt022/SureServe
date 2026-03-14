import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterUserPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('Creating account...');
    setIsError(false);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! Please log in.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setIsError(true);
        setMessage(data.message || 'Registration failed');
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

      {/*  Register Form  */}
      <main className="flex-grow flex items-center justify-center p-4 pt-24 pb-12 relative overflow-hidden">
        {/*  Decorative  */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-[80px] -z-10">
        </div>
        <div
          className="absolute bottom-[10%] -right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-200/40 dark:bg-cyan-900/20 blur-[80px] -z-10">
        </div>

        <div
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Sign up as a customer to book home services</p>
          </div>

          <form id="registerForm" className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" id="name" placeholder="John Doe" required
                  value={formData.name} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="email" id="email" placeholder="you@example.com" required
                  value={formData.email} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="password" id="password" placeholder="••••••••" required
                  value={formData.password} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <div className="relative">
                <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" id="phone" placeholder="+1 (555) 000-0000"
                  value={formData.phone} onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Address</label>
              <textarea id="address" placeholder="123 Main St..." rows="2"
                value={formData.address} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder-gray-400"></textarea>
            </div>

            <button type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5 mt-2">
              Sign Up as Customer
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-center text-sm font-medium ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <a href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Log In</a>
          </p>
        </div>
      </main>


    </>
  );
};

export default RegisterUserPage;

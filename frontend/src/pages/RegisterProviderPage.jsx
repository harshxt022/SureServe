import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterProviderPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    experience_years: '',
    main_profession: '',
    bio: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('Submitting application...');
    setIsError(false);

    try {
      const response = await fetch('/api/auth/signup-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Application successful! Please log in.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setIsError(true);
        setMessage(data.message || 'Application failed');
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
          className="absolute -top-[10%] content-center -right-[10%] w-[400px] h-[400px] rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-[80px] -z-10">
        </div>
        <div
          className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-pink-200/40 dark:bg-pink-900/20 blur-[80px] -z-10">
        </div>

        <div
          className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-2">Join as a Professional</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Grow your business and connect with customers locally.</p>
          </div>

          <form id="registerForm" className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleRegister}>

            {/*  Column 1: Personal Info  */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="text" id="name" placeholder="John Doe" required
                    value={formData.name} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white placeholder-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="email" id="email" placeholder="you@example.com" required
                    value={formData.email} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white placeholder-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="password" id="password" placeholder="••••••••" required
                    value={formData.password} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white placeholder-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="text" id="phone" placeholder="+1 (555) 000-0000" required
                    value={formData.phone} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white placeholder-gray-400" />
                </div>
              </div>
            </div>

            {/*  Column 2: Professional Details  */}
            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience</label>
                <div className="relative">
                  <i className="fas fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="number" id="experience_years" placeholder="0" min="0" required
                    value={formData.experience_years} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white placeholder-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Profession</label>
                <div className="relative">
                  <i className="fas fa-tools absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="text" id="main_profession" placeholder="e.g., Plumber, Electrician" required
                    value={formData.main_profession} onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white placeholder-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Bio</label>
                <textarea id="bio" placeholder="Describe your skills and services..." rows="4"
                  value={formData.bio} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white placeholder-gray-400"></textarea>
              </div>
            </div>

            <div className="md:col-span-2 mt-4 space-y-4">
              <button type="submit"
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                Submit Application
              </button>

              {message && (
                <p className={`text-center text-sm font-medium ${isError ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </p>
              )}

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account? <a href="/login"
                  className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">Log In</a>
              </p>
            </div>
          </form>

        </div>
      </main>


    </>
  );
};

export default RegisterProviderPage;

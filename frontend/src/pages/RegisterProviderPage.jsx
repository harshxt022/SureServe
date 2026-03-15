import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col relative overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="absolute top-[12%] right-[5%] w-36 h-36 border border-[#E8E8E4] rounded-3xl rotate-12 float-shape opacity-35"></div>
      <div className="absolute bottom-[8%] left-[4%] w-24 h-24 bg-[#4F46E5]/5 rounded-full float-shape opacity-40" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[50%] right-[10%] w-16 h-16 border border-[#4F46E5]/10 rounded-2xl -rotate-12 float-shape opacity-50" style={{ animationDelay: '3.5s' }}></div>
      <div className="absolute top-[30%] left-[8%] w-20 h-20 border border-[#E8E8E4] rounded-full float-shape opacity-25" style={{ animationDelay: '1s' }}></div>

      {/* Nav */}
      <nav className="w-full px-6 lg:px-8 py-6 flex justify-between items-center relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white text-sm font-bold group-hover:rounded-xl transition-all duration-300">
            S
          </div>
          <span className="text-xl font-bold font-heading tracking-tight text-[#1A1A1A]">SureServe</span>
        </Link>
      </nav>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-6 py-8 relative z-10">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-3">Join as a Professional</h1>
            <p className="text-[#6B6B6B]">Grow your business and connect with customers locally</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8E8E4] shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <form id="registerForm" className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleRegister}>
              {/* Column 1 */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Full Name</label>
                  <input type="text" id="name" placeholder="John Doe" required
                    value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
                  <input type="email" id="email" placeholder="you@example.com" required
                    value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Password</label>
                  <input type="password" id="password" placeholder="••••••••" required
                    value={formData.password} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Phone</label>
                  <input type="text" id="phone" placeholder="+1 (555) 000-0000" required
                    value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50" />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Years of Experience</label>
                  <input type="number" id="experience_years" placeholder="0" min="0" required
                    value={formData.experience_years} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Main Profession</label>
                  <input type="text" id="main_profession" placeholder="e.g., Plumber, Electrician" required
                    value={formData.main_profession} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Short Bio</label>
                  <textarea id="bio" placeholder="Describe your skills and services..." rows="5"
                    value={formData.bio} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50 resize-none"></textarea>
                </div>
              </div>

              {/* Submit row */}
              <div className="md:col-span-2 space-y-4 mt-2">
                <button type="submit"
                  className="w-full py-4 rounded-xl font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors text-sm shadow-sm">
                  Submit Application
                </button>

                {message && (
                  <p className={`text-center text-sm font-medium ${isError ? 'text-red-500' : 'text-green-600'}`}>
                    {message}
                  </p>
                )}

                <p className="text-center text-sm text-[#6B6B6B]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#4F46E5] hover:underline font-semibold">Log In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterProviderPage;

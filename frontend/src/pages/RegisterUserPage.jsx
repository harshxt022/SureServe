import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col relative overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="absolute top-[8%] left-[7%] w-28 h-28 border border-[#E8E8E4] rounded-3xl -rotate-12 float-shape opacity-40"></div>
      <div className="absolute bottom-[12%] right-[6%] w-20 h-20 border border-[#E8E8E4] rounded-full float-shape opacity-30" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-[45%] left-[3%] w-14 h-14 bg-[#4F46E5]/5 rounded-2xl rotate-45 float-shape opacity-50" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-[30%] right-[12%] w-24 h-24 border border-[#4F46E5]/10 rounded-full float-shape opacity-30" style={{ animationDelay: '4s' }}></div>

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
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-3">Create Account</h1>
            <p className="text-[#6B6B6B]">Sign up as a customer to book home services</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8E8E4] shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <form id="registerForm" className="space-y-5" onSubmit={handleRegister}>
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
                <input type="text" id="phone" placeholder="+1 (555) 000-0000"
                  value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Home Address</label>
                <textarea id="address" placeholder="123 Main St..." rows="2"
                  value={formData.address} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50 resize-none"></textarea>
              </div>

              <button type="submit"
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors text-sm shadow-sm mt-1">
                Create Account
              </button>
            </form>

            {message && (
              <p className={`mt-5 text-center text-sm font-medium ${isError ? 'text-red-500' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-[#6B6B6B]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4F46E5] hover:underline font-semibold">Log In</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterUserPage;

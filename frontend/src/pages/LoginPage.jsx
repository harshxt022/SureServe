import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
          navigate('/dashboard');
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
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col relative overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="absolute top-[10%] right-[8%] w-32 h-32 border border-[#E8E8E4] rounded-3xl rotate-12 float-shape opacity-40"></div>
      <div className="absolute bottom-[15%] left-[5%] w-24 h-24 border border-[#E8E8E4] rounded-full float-shape opacity-30" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[55%] right-[15%] w-16 h-16 bg-[#4F46E5]/5 rounded-2xl rotate-45 float-shape opacity-60" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-[25%] left-[10%] w-20 h-20 border border-[#4F46E5]/10 rounded-full float-shape opacity-40" style={{ animationDelay: '1s' }}></div>

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
      <main className="flex-grow flex items-center justify-center px-6 relative z-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-3">Welcome back</h1>
            <p className="text-[#6B6B6B]">Enter your credentials to continue</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8E8E4] shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <form id="loginForm" className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">I am a</label>
                <select id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm">
                  <option value="user">Customer</option>
                  <option value="provider">Service Provider</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
                <input type="email" id="email" placeholder="you@example.com" required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Password</label>
                <input type="password" id="password" placeholder="••••••••" required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E8E8E4] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all text-[#1A1A1A] text-sm placeholder-[#6B6B6B]/50" />
              </div>

              <button type="submit"
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors text-sm shadow-sm">
                Sign In
              </button>
            </form>

            {message && (
              <p className={`mt-5 text-center text-sm font-medium ${isError ? 'text-red-500' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-[#6B6B6B]">
            Don't have an account?{' '}
            <Link to="/register-user" className="text-[#4F46E5] hover:underline font-semibold">Sign Up</Link>
            {' '}or{' '}
            <Link to="/register-provider" className="text-[#4F46E5] hover:underline font-semibold">Join as Provider</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

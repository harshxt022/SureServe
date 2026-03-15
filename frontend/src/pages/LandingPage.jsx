import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ExploreMoreModal from '../components/ExploreMoreModal';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const glowRef = useRef(null);

  // Scroll detection for navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cursor-following glow
  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;

    const handleMove = (e) => {
      const rect = hero.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
      glow.style.opacity = '1';
    };
    const handleLeave = () => { glow.style.opacity = '0'; };

    hero.addEventListener('mousemove', handleMove);
    hero.addEventListener('mouseleave', handleLeave);
    return () => {
      hero.removeEventListener('mousemove', handleMove);
      hero.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Magnetic button effect
  useEffect(() => {
    const btns = document.querySelectorAll('.magnetic-btn');
    const handlers = [];

    btns.forEach((btn) => {
      const move = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      };
      const leave = () => { btn.style.transform = 'translate(0, 0)'; };
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', leave);
      handlers.push({ btn, move, leave });
    });

    return () => {
      handlers.forEach(({ btn, move, leave }) => {
        btn.removeEventListener('mousemove', move);
        btn.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  const marqueeItems = [
    '⚡ Electrician', '🔧 Plumber', '❄️ AC Repair', '🧹 Cleaning',
    '🔨 Carpenter', '📺 Appliances', '🖌️ Painting', '🪳 Pest Control',
    '🛠️ Installation', '🌳 Outdoor'
  ];

  return (
    <>
      {/* ── 1. NAVBAR ────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#FAFAF8]/90 backdrop-blur-md shadow-[0_1px_0_#E8E8E4]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white text-sm font-bold group-hover:rounded-xl transition-all duration-300">
                S
              </div>
              <span className="text-xl font-bold font-heading tracking-tight text-[#1A1A1A]">SureServe</span>
            </Link>

            <div className="flex items-center gap-8">
              <a href="#services" className="hidden sm:inline text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">Services</a>
              <a href="#how-it-works" className="hidden sm:inline text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">How It Works</a>
              <Link to="/login" className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">Log In</Link>
              <Link to="/register-user" className="magnetic-btn bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO — Split Screen ──────────────────────── */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden pt-20">
        <div ref={glowRef} className="cursor-glow"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Text */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E8E4] text-xs font-semibold text-[#6B6B6B] mb-8 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] soft-pulse"></span>
                Trusted by 10,000+ Homeowners
              </div>

              <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold font-heading text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
                Home services,<br />
                <span className="text-[#4F46E5]">done right.</span>
              </h1>

              <p className="text-lg text-[#6B6B6B] leading-relaxed mb-10 max-w-md">
                Book verified electricians, plumbers, and AC technicians in minutes. Upfront pricing. Zero hassle.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a href="#services" className="magnetic-btn bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white px-8 py-4 rounded-full font-semibold text-sm transition-colors shadow-md">
                  Explore Services
                </a>
                <Link to="/register-provider" className="magnetic-btn text-[#6B6B6B] hover:text-[#1A1A1A] font-medium text-sm flex items-center gap-2 group transition-colors">
                  Become a Provider
                  <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>

            {/* Right — Blob + Stats */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Gradient blob */}
              <div className="blob w-[420px] h-[420px] rounded-[40%_60%_65%_35%/40%_45%_55%_60%]"
                style={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 40%, #EC4899 100%)',
                  opacity: 0.12,
                }}
              ></div>

              {/* Floating stat cards */}
              <div className="absolute top-[15%] right-[5%] bg-white rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)] float-shape">
                <p className="text-2xl font-bold font-heading text-[#1A1A1A]">4.9★</p>
                <p className="text-xs text-[#6B6B6B]">Avg. Rating</p>
              </div>

              <div className="absolute bottom-[18%] left-[2%] bg-white rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)] float-shape" style={{ animationDelay: '2s' }}>
                <p className="text-2xl font-bold font-heading text-[#1A1A1A]">5K+</p>
                <p className="text-xs text-[#6B6B6B]">Verified Pros</p>
              </div>

              <div className="absolute bottom-[5%] right-[15%] bg-white rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)] float-shape" style={{ animationDelay: '4s' }}>
                <p className="text-2xl font-bold font-heading text-[#1A1A1A]">50K+</p>
                <p className="text-xs text-[#6B6B6B]">Jobs Done</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MARQUEE TICKER ────────────────────────────── */}
      <div className="border-y border-[#E8E8E4] py-5 overflow-hidden bg-[#FAFAF8]">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-sm font-medium text-[#6B6B6B] whitespace-nowrap mx-8 tracking-wide">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── 4. SERVICES — Bento Grid ─────────────────────── */}
      <section id="services" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header with number */}
          <div className="relative mb-16 reveal">
            <span className="section-number absolute -top-8 -left-4 select-none">01</span>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-4">
                Services
              </h2>
              <p className="text-[#6B6B6B] text-lg max-w-md">
                From quick fixes to full overhauls. The right expert for every job.
              </p>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal">
            {/* Large card */}
            <a href="/category/electrical" className="card-accent hover-lift col-span-2 row-span-2 bg-white rounded-3xl p-8 border border-[#E8E8E4] cursor-pointer group transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
              <span className="text-5xl block mb-6">⚡</span>
              <h3 className="text-2xl font-bold font-heading text-[#1A1A1A] mb-2">Electrical</h3>
              <p className="text-[#6B6B6B] text-sm mb-6">Wiring, switches, fans, solar panels and more.</p>
              <span className="text-[#4F46E5] text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <i className="fas fa-arrow-right text-xs"></i>
              </span>
            </a>

            {/* Normal cards */}
            <a href="/category/plumbing" className="card-accent hover-lift bg-white rounded-3xl p-6 border border-[#E8E8E4] cursor-pointer group transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
              <span className="text-3xl block mb-4">🔧</span>
              <h3 className="text-lg font-bold font-heading text-[#1A1A1A]">Plumbing</h3>
              <span className="text-[#4F46E5] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">→</span>
            </a>

            <a href="/category/ac-services" className="card-accent hover-lift bg-white rounded-3xl p-6 border border-[#E8E8E4] cursor-pointer group transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
              <span className="text-3xl block mb-4">❄️</span>
              <h3 className="text-lg font-bold font-heading text-[#1A1A1A]">AC Services</h3>
              <span className="text-[#4F46E5] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">→</span>
            </a>

            <a href="/category/cleaning" className="card-accent hover-lift bg-white rounded-3xl p-6 border border-[#E8E8E4] cursor-pointer group transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
              <span className="text-3xl block mb-4">🧹</span>
              <h3 className="text-lg font-bold font-heading text-[#1A1A1A]">Cleaning</h3>
              <span className="text-[#4F46E5] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">→</span>
            </a>

            <a href="/category/carpentry" className="card-accent hover-lift bg-white rounded-3xl p-6 border border-[#E8E8E4] cursor-pointer group transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
              <span className="text-3xl block mb-4">🔨</span>
              <h3 className="text-lg font-bold font-heading text-[#1A1A1A]">Carpentry</h3>
              <span className="text-[#4F46E5] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">→</span>
            </a>

            {/* Wide card spanning 2 cols */}
            <a href="/category/appliances" className="card-accent hover-lift col-span-2 bg-white rounded-3xl p-6 border border-[#E8E8E4] cursor-pointer group flex items-center gap-6 transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
              <span className="text-4xl">📺</span>
              <div>
                <h3 className="text-lg font-bold font-heading text-[#1A1A1A]">Appliance Repair</h3>
                <p className="text-[#6B6B6B] text-sm">Refrigerators, washing machines, microwaves & more</p>
              </div>
              <i className="fas fa-arrow-right text-[#4F46E5] ml-auto opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </a>
          </div>

          <div className="text-center mt-12 reveal">
            <button
              onClick={() => setIsModalOpen(true)}
              className="magnetic-btn bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white px-8 py-4 rounded-full font-semibold text-sm transition-colors shadow-md"
            >
              View All Categories
            </button>
          </div>

          <ExploreMoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </section>

      {/* ── 5. HOW IT WORKS — Horizontal Timeline ────────── */}
      <section id="how-it-works" className="py-28 border-y border-[#E8E8E4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative mb-20 reveal">
            <span className="section-number absolute -top-8 -left-4 select-none">02</span>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-4">
                How It Works
              </h2>
              <p className="text-[#6B6B6B] text-lg max-w-md">Four steps. That's it.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[3rem] left-[12%] right-[12%] h-[1px] bg-[#E8E8E4]"></div>

            {[
              { num: '01', icon: 'fa-search', title: 'Search', desc: 'Find the right service for your needs.' },
              { num: '02', icon: 'fa-calendar-alt', title: 'Schedule', desc: 'Pick a time slot that works for you.' },
              { num: '03', icon: 'fa-paper-plane', title: 'Confirm', desc: 'Book instantly with upfront pricing.' },
              { num: '04', icon: 'fa-check-circle', title: 'Done', desc: 'Expert completes the work. Pay securely.' },
            ].map((step, i) => (
              <div key={i} className="text-center relative reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-24 h-24 mx-auto bg-white border border-[#E8E8E4] rounded-3xl flex flex-col items-center justify-center relative z-10 shadow-sm mb-6 hover:border-[#4F46E5] transition-colors">
                  <span className="text-xs font-bold text-[#4F46E5] font-heading tracking-widest">{step.num}</span>
                  <i className={`fas ${step.icon} text-xl text-[#1A1A1A] mt-1`}></i>
                </div>
                <h3 className="text-lg font-bold font-heading text-[#1A1A1A] mb-2">{step.title}</h3>
                <p className="text-sm text-[#6B6B6B] max-w-[200px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TRUST + PROVIDERS — Asymmetric ────────────── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative mb-20 reveal">
            <span className="section-number absolute -top-8 -left-4 select-none">03</span>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-4">
                Why SureServe?
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left — Trust Points */}
            <div className="lg:col-span-5 space-y-8 reveal">
              {[
                { icon: 'fa-shield-alt', title: 'Verified Professionals', desc: 'Every provider undergoes a strict background check and skill assessment.' },
                { icon: 'fa-wallet', title: 'Transparent Pricing', desc: 'You approve official quotes before work begins. No hidden charges.' },
                { icon: 'fa-calendar-check', title: 'Easy Scheduling', desc: 'Book exact time slots instantly. No back-and-forth calls.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#4F46E5]/8 flex items-center justify-center group-hover:bg-[#4F46E5] transition-colors duration-300">
                    <i className={`fas ${item.icon} text-[#4F46E5] group-hover:text-white transition-colors text-lg`}></i>
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-heading text-[#1A1A1A] mb-1">{item.title}</h4>
                    <p className="text-sm text-[#6B6B6B] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Provider Cards (offset) */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 reveal">
              <div className="hover-lift bg-white rounded-3xl p-6 border border-[#E8E8E4] sm:mt-12 transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <img src="https://ui-avatars.com/api/?name=Ramesh+Sharma&background=4F46E5&color=fff&size=128" alt="Ramesh Sharma" className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="bg-[#FAFAF8] text-[#1A1A1A] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border border-[#E8E8E4]">
                    <i className="fas fa-star text-[#F59E0B] text-xs"></i> 4.9
                  </div>
                </div>
                <h3 className="text-lg font-bold font-heading text-[#1A1A1A]">Ramesh Sharma</h3>
                <p className="text-[#4F46E5] font-medium text-sm mb-3">Master Electrician</p>
                <p className="text-[#6B6B6B] text-sm line-clamp-2 mb-5">12+ years in residential and commercial wiring, panel upgrades, and circuit repairs.</p>
                <button className="w-full bg-[#FAFAF8] hover:bg-[#4F46E5] text-[#1A1A1A] hover:text-white border border-[#E8E8E4] hover:border-transparent py-3 rounded-xl text-sm font-semibold transition-all duration-300">
                  View Profile
                </button>
              </div>

              <div className="hover-lift bg-white rounded-3xl p-6 border border-[#E8E8E4] transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <img src="https://ui-avatars.com/api/?name=Amit+Verma&background=7C3AED&color=fff&size=128" alt="Amit Verma" className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="bg-[#FAFAF8] text-[#1A1A1A] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border border-[#E8E8E4]">
                    <i className="fas fa-star text-[#F59E0B] text-xs"></i> 5.0
                  </div>
                </div>
                <h3 className="text-lg font-bold font-heading text-[#1A1A1A]">Amit Verma</h3>
                <p className="text-[#7C3AED] font-medium text-sm mb-3">Plumbing Expert</p>
                <p className="text-[#6B6B6B] text-sm line-clamp-2 mb-5">Specializing in leak detection, pipe fitting, and bathroom overhauls with 100% satisfaction.</p>
                <button className="w-full bg-[#FAFAF8] hover:bg-[#4F46E5] text-[#1A1A1A] hover:text-white border border-[#E8E8E4] hover:border-transparent py-3 rounded-xl text-sm font-semibold transition-all duration-300">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CTA — Full-Width Dark ─────────────────────── */}
      <section className="py-32 bg-[#1A1A1A] relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 reveal">
          <h2 className="text-5xl md:text-7xl font-bold font-heading text-white tracking-tight mb-6 leading-[1.05]">
            Let's fix that.
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-lg mx-auto">
            Join thousands of homeowners who trust SureServe for everything from leaky taps to full renovations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#services" className="magnetic-btn bg-white text-[#1A1A1A] px-8 py-4 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg">
              Book a Service
            </a>
            <Link to="/register-provider" className="magnetic-btn border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 px-8 py-4 rounded-full font-semibold text-sm transition-colors">
              Join as a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. FOOTER — Minimal Ivory ────────────────────── */}
      <footer className="py-16 bg-[#FAFAF8] border-t border-[#E8E8E4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link to="/" className="text-2xl font-bold font-heading text-[#1A1A1A] tracking-tight mb-4 inline-block">
                SureServe
              </Link>
              <p className="text-sm text-[#6B6B6B] mt-2">
                Making home services reliable, transparent, and effortlessly easy.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold font-heading text-[#1A1A1A] tracking-widest uppercase mb-5">Platform</h4>
              <ul className="space-y-3 text-sm text-[#6B6B6B]">
                <li><a href="#how-it-works" className="hover:text-[#1A1A1A] transition-colors">How it works</a></li>
                <li><Link to="/services" className="hover:text-[#1A1A1A] transition-colors">Browse Services</Link></li>
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold font-heading text-[#1A1A1A] tracking-widest uppercase mb-5">Providers</h4>
              <ul className="space-y-3 text-sm text-[#6B6B6B]">
                <li><Link to="/register-provider" className="hover:text-[#1A1A1A] transition-colors">Become a Provider</Link></li>
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Provider Guidelines</a></li>
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold font-heading text-[#1A1A1A] tracking-widest uppercase mb-5">Support</h4>
              <ul className="space-y-3 text-sm text-[#6B6B6B]">
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E8E8E4] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#6B6B6B]">
            <p>&copy; 2026 SureServe. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-[#1A1A1A] transition-colors"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-[#1A1A1A] transition-colors"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="hover:text-[#1A1A1A] transition-colors"><i className="fab fa-instagram"></i></a>
              <a href="#" className="hover:text-[#1A1A1A] transition-colors"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExploreMoreModal from '../components/ExploreMoreModal';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>


      {/*  Navbar  */}
      <nav className="glass sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <i className="fas fa-home text-lg"></i>
              </div>
              <a href="/" className="text-2xl font-bold font-heading text-gray-900 dark:text-white tracking-tight">SureServe</a>
            </div>
            <div className="flex items-center space-x-6">
              <button onClick={() => { /* toggleDarkMode() */ }}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Toggle Dark Mode">
                <i className="theme-toggle-icon fas fa-moon text-xl"></i>
              </button>
              <a href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Log
                In</a>
              <a href="/register-user"
                className="relative overflow-hidden group bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full font-medium transition-transform active:scale-95 shadow-md hover:shadow-xl">
                <span
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Sign Up Free</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/*  1. Hero Section  */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/*  Decorative Blobs  */}
        <div className="absolute top-0 inset-x-0 h-[500px] overflow-hidden -z-10 pointer-events-none">
          <div
            className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-purple-200/50 blur-[100px] mix-blend-multiply opacity-70 animate-float">
          </div>
          <div
            className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-200/50 blur-[100px] mix-blend-multiply opacity-70 animate-float"
            style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            #1 Service Marketplace in 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Find Trusted Home <br className="hidden md:block" />
            <span className="text-gradient">Service Professionals</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-light">
            Book top-rated electricians, plumbers, AC technicians, and more in minutes. Get your home running smoothly with
            upfront pricing.
          </p>

          {/*  Search Bar  */}
          <div
            className="max-w-2xl mx-auto mb-12 flex items-center glass rounded-full overflow-hidden p-2 shadow-smooth transition-shadow hover:shadow-hover">
            <div className="pl-4 text-gray-400"><i className="fas fa-search"></i></div>
            <input type="text" placeholder="What service do you need today?"
              className="flex-grow px-4 py-3 bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none" />
            <button
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white dark:hover:text-white transition-all duration-300 shadow-md">
              Search
            </button>
          </div>

          {/*  Hero Buttons  */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="#services"
              className="group flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-3.5 rounded-full font-semibold border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md">
              <i className="fas fa-compass group-hover:rotate-45 transition-transform duration-300"></i> Explore Services
            </a>
            <a href="/register-provider"
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors px-4 py-3.5 group">
              Become a Provider <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>
        </div>
      </section>

      {/*  2. Service Categories  */}
      <section id="services" className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-4">Popular Services</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">From quick fixes to massive overhauls, we have the
              right expert for
              every job.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

            {/*  Category Cards  */}
            <a href="#"
              className="group hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
              <div
                className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 font-heading">Electrician</h3>
            </a>

            <a href="#"
              className="group hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
              <div
                className="w-16 h-16 mx-auto bg-cyan-50 dark:bg-cyan-900/30 text-cyan-500 dark:text-cyan-400 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                <i className="fas fa-faucet"></i>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 font-heading">Plumber</h3>
            </a>

            <a href="#"
              className="group hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
              <div
                className="w-16 h-16 mx-auto bg-sky-50 dark:bg-sky-900/30 text-sky-500 dark:text-sky-400 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                <i className="fas fa-snowflake"></i>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 font-heading">AC Repair</h3>
            </a>

            <a href="#"
              className="group hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
              <div
                className="w-16 h-16 mx-auto bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                <i className="fas fa-broom"></i>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 font-heading">Cleaning</h3>
            </a>

            <a href="#"
              className="group hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
              <div
                className="w-16 h-16 mx-auto bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                <i className="fas fa-hammer"></i>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 font-heading">Carpenter</h3>
            </a>

            <a href="#"
              className="group hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
              <div
                className="w-16 h-16 mx-auto bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                <i className="fas fa-blender"></i>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 font-heading">Appliances</h3>
            </a>

          </div>
        </div>

        <div className="text-center mt-12 mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Explore More Services
          </button>
        </div>

        <ExploreMoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </section>

      {/*  3. How It Works  */}
      <section
        className="py-24 bg-white dark:bg-gray-900 relative border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=')] opacity-50 dark:opacity-10">
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-center text-gray-900 dark:text-white mb-16">How It
            Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/*  Step 1  */}
            <div className="relative text-center group">
              <div
                className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center z-10 relative shadow-sm group-hover:border-blue-500 transition-colors duration-300">
                <i className="fas fa-search text-2xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <div
                className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent">
              </div>
              <h3 className="text-xl font-bold font-heading mt-6 mb-2 text-gray-900 dark:text-white">1. Search</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Find the specific service and review expert profiles.</p>
            </div>

            {/*  Step 2  */}
            <div className="relative text-center group">
              <div
                className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center z-10 relative shadow-sm group-hover:border-purple-500 transition-colors duration-300">
                <i className="far fa-calendar-alt text-2xl text-purple-600 dark:text-purple-400"></i>
              </div>
              <div
                className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent">
              </div>
              <h3 className="text-xl font-bold font-heading mt-6 mb-2 text-gray-900 dark:text-white">2. Availability</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Check their real-time calendar and pick a slot.</p>
            </div>

            {/*  Step 3  */}
            <div className="relative text-center group">
              <div
                className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center z-10 relative shadow-sm group-hover:border-pink-500 transition-colors duration-300">
                <i className="fas fa-paper-plane text-2xl text-pink-600 dark:text-pink-400"></i>
              </div>
              <div
                className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent">
              </div>
              <h3 className="text-xl font-bold font-heading mt-6 mb-2 text-gray-900 dark:text-white">3. Book Slot</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Send a booking request and wait for approval.</p>
            </div>

            {/*  Step 4  */}
            <div className="relative text-center group">
              <div
                className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center z-10 relative shadow-sm group-hover:border-green-500 transition-colors duration-300">
                <i className="fas fa-check-circle text-2xl text-green-500 dark:text-green-400"></i>
              </div>
              <h3 className="text-xl font-bold font-heading mt-6 mb-2 text-gray-900 dark:text-white">4. Job Done</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">The expert completes the work and you pay securely.</p>
            </div>

          </div>
        </div>
      </section>

      {/*  4 & 5. Featured / Trust Signals (Merged Layout)  */}
      <section className="py-24 bg-[#FAFAFC] dark:bg-gray-800/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/*  Left: Trust Signals  */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-6">Why Choose
                SureServe?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">We take the hassle out of home maintenance.
                Guaranteed quality,
                up-front pricing, and a seamless booking experience.</p>

              <div className="space-y-6">
                <div
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                  <div
                    className="w-12 h-12 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white font-heading">Verified Professionals</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Every provider undergoes a strict background
                      check and skill
                      assessment.</p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                  <div
                    className="w-12 h-12 shrink-0 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white font-heading">Transparent Pricing</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">You approve official quotes before any work
                      begins. No hidden
                      charges.</p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                  <div
                    className="w-12 h-12 shrink-0 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center text-xl">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white font-heading">Easy Scheduling</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Say goodbye to back-and-forth calls. Book exact
                      time slots
                      instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/*  Right: Featured Provider Cards  */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 relative">
              {/*  Decoration  */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply blur-2xl opacity-70">
              </div>

              {/*  Card 1  */}
              <div
                className="hover-lift bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-smooth border border-gray-100 dark:border-gray-700 mt-0 sm:mt-12 transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <img src="https://ui-avatars.com/api/?name=Ramesh+Sharma&background=2563eb&color=fff&size=128"
                    alt="Profile" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                  <div
                    className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <i className="fas fa-star text-xs"></i> 4.9
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">Ramesh Sharma</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-4">Master Electrician</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">12+ years of experience in residential
                  and commercial
                  wiring, panel upgrades, and circuit repairs.</p>
                <button
                  className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-blue-600 text-gray-700 dark:text-gray-200 hover:text-white dark:hover:text-white border border-gray-200 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-500 py-3 rounded-xl font-semibold transition-all duration-300">
                  View Profile
                </button>
              </div>

              {/*  Card 2  */}
              <div
                className="hover-lift bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-smooth border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <img src="https://ui-avatars.com/api/?name=Amit+Verma&background=7c3aed&color=fff&size=128" alt="Profile"
                    className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                  <div
                    className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <i className="fas fa-star text-xs"></i> 5.0
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">Amit Verma</h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium text-sm mb-4">Plumbing Expert</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">Specializing in leak detection, pipe
                  fitting, and
                  complete bathroom overhauls with a 100% satisfaction record.</p>
                <button
                  className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-blue-600 text-gray-700 dark:text-gray-200 hover:text-white dark:hover:text-white border border-gray-200 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-500 py-3 rounded-xl font-semibold transition-all duration-300">
                  View Profile
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/*  6. CTA Section  */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900"></div>
        {/*  Abstract SVG Background  */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 C30,40 70,60 100,0 L100,100 L0,100 Z" fill="url(#grad)" />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">Need help at home today?</h2>
          <p className="text-xl text-gray-300 mb-10 font-light">Join thousands of customers finding reliable help, or grow your
            independent business as a provider.</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="#services"
              className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-xl">
              Book a Service Now
            </a>
            <a href="/register-provider"
              className="w-full sm:w-auto glass-dark text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors duration-300 border border-gray-700">
              Join as a Provider
            </a>
          </div>
        </div>
      </section>

      {/*  7. Footer  */}
      <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <a href="/" className="text-3xl font-bold font-heading text-white tracking-tight mb-4 inline-block">SureServe</a>
              <p className="text-sm mt-2 mb-6">Making home services reliable, transparent, and effortlessly easy to book for
                everyone.</p>
              <div className="flex space-x-4">
                <a href="#"
                  className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300"><i
                    className="fab fa-twitter"></i></a>
                <a href="#"
                  className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300"><i
                    className="fab fa-facebook-f"></i></a>
                <a href="#"
                  className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300"><i
                    className="fab fa-instagram"></i></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold font-heading mb-6 tracking-wide">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Browse Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing Structure</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold font-heading mb-6 tracking-wide">Providers</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/register-provider" className="hover:text-white transition-colors">Sign up as Expert</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Provider Rules</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold font-heading mb-6 tracking-wide">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; 2026 SureServe Marketplace. All rights reserved.</p>
            <div className="flex gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png"
                alt="Paypal" className="h-5 opacity-50 grayscale hover:grayscale-0 transition duration-300" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" alt="Visa"
                className="h-5 opacity-50 grayscale hover:grayscale-0 transition duration-300" />
            </div>
          </div>
        </div>
      </footer>


    </>
  );
};

export default LandingPage;

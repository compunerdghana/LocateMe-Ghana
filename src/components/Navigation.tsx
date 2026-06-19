import React, { useState } from 'react';
import { Shield, Hammer, Menu, X, User, LogOut, Code, Award, Layers } from 'lucide-react';
import { UserRole, Profile } from '../types';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: Profile | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Navigation({
  currentView,
  onNavigate,
  currentUser,
  onLoginClick,
  onLogout,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-md shadow-sm" id="app-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer animate-fade-in" onClick={() => onNavigate('home')} id="logo-container">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-md shadow-blue-100">
              <Hammer className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="font-sans font-bold text-lg tracking-tight text-slate-800">
                LocalServer <span className="text-blue-600 font-semibold italic text-base ml-0.5">Ghana</span>
              </span>
              <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Verified Artisans</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              id="nav-home-btn"
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'text-blue-600 bg-blue-50/70 border-b-2 border-blue-600 rounded-b-none'
                  : 'text-slate-600 hover:text-blue-650 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              id="nav-categories-btn"
              onClick={() => onNavigate('categories')}
              className={`px-3.5 py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'categories'
                  ? 'text-blue-600 bg-blue-50/70 border-b-2 border-blue-600 rounded-b-none'
                  : 'text-slate-600 hover:text-blue-650 hover:bg-slate-50'
              }`}
            >
              Categories
            </button>
            <button
              id="nav-search-btn"
              onClick={() => onNavigate('search')}
              className={`px-3.5 py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'search'
                  ? 'text-blue-600 bg-blue-50/70 border-b-2 border-blue-600 rounded-b-none'
                  : 'text-slate-600 hover:text-blue-650 hover:bg-slate-50'
              }`}
            >
              Find Artisan
            </button>
            <button
              id="nav-pricing-btn"
              onClick={() => onNavigate('pricing')}
              className={`px-3.5 py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                currentView === 'pricing'
                  ? 'text-blue-600 bg-blue-50/70 border-b-2 border-blue-600 rounded-b-none'
                  : 'text-slate-600 hover:text-blue-650 hover:bg-slate-55'
              }`}
            >
              Pricing
            </button>
            <button
              id="nav-sql-btn"
              onClick={() => onNavigate('sql')}
              className={`px-3.5 py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'sql'
                  ? 'text-blue-600 bg-blue-50/70 border-b-2 border-blue-600 rounded-b-none'
                  : 'text-slate-600 hover:text-blue-650 hover:bg-slate-50'
              }`}
            >
              <Code className="w-4 h-4" />
              SQL Schema
            </button>
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Active Dashboard Link corresponding to current user role */}
                <button
                  id="nav-dashboard-btn"
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3.5 py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                      : 'bg-transparent text-blue-600 border-blue-300 hover:border-blue-500 hover:bg-blue-50/50'
                  }`}
                >
                  {currentUser.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
                  {currentUser.role === 'artisan' && <Award className="w-3.5 h-3.5" />}
                  {currentUser.role === 'customer' && <Layers className="w-3.5 h-3.5" />}
                  <span>
                    {currentUser.role === 'admin'
                      ? 'Admin Hub'
                      : currentUser.role === 'artisan'
                      ? 'Artisan Portal'
                      : 'My Board'}
                  </span>
                </button>

                {/* Profile Widget */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <img
                    src={currentUser.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                    alt={currentUser.full_name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {currentUser.full_name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100 uppercase">
                    {currentUser.role}
                  </span>
                </div>

                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-650 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onLoginClick}
                className="px-5 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 hover:shadow-lg transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-50 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <button
            id="mobile-nav-home"
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
          >
            Home
          </button>
          <button
            id="mobile-nav-categories"
            onClick={() => {
              onNavigate('categories');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
          >
            Categories
          </button>
          <button
            id="mobile-nav-search"
            onClick={() => {
              onNavigate('search');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-55"
          >
            Find Artisan
          </button>
          <button
            id="mobile-nav-pricing"
            onClick={() => {
              onNavigate('pricing');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
          >
            Pricing
          </button>
          <button
            id="mobile-nav-sql"
            onClick={() => {
              onNavigate('sql');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"
          >
            SQL Database Schema
          </button>

          <hr className="border-slate-200 my-2" />

          {currentUser ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <img
                  src={currentUser.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                  alt={currentUser.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{currentUser.full_name}</h4>
                  <p className="text-xs text-slate-500 capitalize">{currentUser.role} Account</p>
                </div>
              </div>
              <button
                id="mobile-nav-dashboard"
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Go to{' '}
                {currentUser.role === 'admin'
                  ? 'Admin Hub'
                  : currentUser.role === 'artisan'
                  ? 'Artisan Portal'
                  : 'Customer Dashboard'}
              </button>
              <button
                id="mobile-logout"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              id="mobile-login"
              onClick={() => {
                onLoginClick();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

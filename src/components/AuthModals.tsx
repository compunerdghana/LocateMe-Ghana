import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Sparkles, LogIn, Key, Loader2 } from 'lucide-react';
import { UserRole, Profile, GHANA_REGIONS, REGION_CITIES } from '../types';

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: Profile) => void;
}

export default function AuthModals({ isOpen, onClose, onAuthSuccess }: AuthModalsProps) {
  const [tab, setTab] = useState<'login' | 'signup' | 'reset'>('login');
  const [role, setRole] = useState<UserRole>('customer');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('Greater Accra');
  const [city, setCity] = useState('East Legon');

  // Artisan registration additionals
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Electricians');
  const [experience, setExperience] = useState('2');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'err'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Simulated login/signup latency
    setTimeout(() => {
      setLoading(false);
      if (tab === 'login') {
        // Handle mock logins
        if (email.includes('admin')) {
          const adminUser: Profile = {
            id: 'user-admin',
            role: 'admin',
            full_name: 'LocalServer Admin',
            phone: '+233 30 144 5678',
            location: 'Digital Address GA-101-2022, Accra',
            profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
            created_at: new Date().toISOString(),
          };
          onAuthSuccess(adminUser);
          onClose();
          return;
        }

        if (email.includes('artisan')) {
          const artisanUser: Profile = {
            id: 'user-artisan-1',
            role: 'artisan',
            full_name: 'Emmanuel Osei',
            phone: '+233 24 412 3456',
            location: 'East Legon, Accra',
            profile_image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
            created_at: new Date().toISOString(),
          };
          onAuthSuccess(artisanUser);
          onClose();
          return;
        }

        // Generic user login fallback
        const mockLoggedUser: Profile = {
          id: `user-customer-${Math.floor(Math.random() * 1000)}`,
          role: 'customer',
          full_name: fullName || email.split('@')[0] || 'Kwaku Mensah',
          phone: phone || '+233 24 000 0000',
          location: `${city}, ${region}`,
          profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          created_at: new Date().toISOString(),
        };
        onAuthSuccess(mockLoggedUser);
        onClose();
      } else if (tab === 'signup') {
        // Complete mock signup profile creation
        const newUserID = `user-${role}-${Math.floor(Math.random() * 100000)}`;
        const newProfile: Profile = {
          id: newUserID,
          role,
          full_name: fullName || 'New Registered User',
          phone: phone || '+233 24 111 2222',
          location: `${city}, ${region}`,
          profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
          created_at: new Date().toISOString(),
        };

        // If newly created account is an artisan, save profile
        if (role === 'artisan') {
          const newArtisanProfile = {
            id: `artisan-profile-${Math.floor(Math.random() * 1000)}`,
            user_id: newUserID,
            business_name: businessName || `${fullName}'s Technical Works`,
            category,
            description: `Professional ${category} serving ${city} and surrounding areas. Committed to quality service.`,
            region,
            city,
            gps_location: `GP-${city.slice(0, 3).toUpperCase()}-${Math.floor(100+Math.random()*900)}-${Math.floor(1000+Math.random()*9000)}`,
            years_experience: parseInt(experience) || 3,
            verified: false, // Admin approval needed
            featured: false,
            average_rating: 0,
            total_reviews: 0,
            created_at: new Date().toISOString(),
          };

          const savedArtisans = JSON.parse(localStorage.getItem('localserver_artisan_profiles') || '[]');
          savedArtisans.push(newArtisanProfile);
          localStorage.setItem('localserver_artisan_profiles', JSON.stringify(savedArtisans));
        }

        onAuthSuccess(newProfile);
        setMessage({ type: 'success', text: 'Registration completed successfully! Welcome to LocalServer.' });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage({ type: 'success', text: 'A simulated password reset code has been dispatched to your email address.' });
      }
    }, 1200);
  };

  const handleGoogleMockLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const googleMockProfile: Profile = {
        id: 'user-google-1',
        role: 'customer',
        full_name: 'Ghana Google User',
        phone: '+233 20 123 4567',
        location: 'Airport Residential, Accra',
        profile_image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        created_at: new Date().toISOString(),
      };
      onAuthSuccess(googleMockProfile);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setBusinessName('');
    setMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" id="auth-modal-main">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative animate-scale-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 transition z-10 font-bold text-sm cursor-pointer"
        >
          ✕
        </button>

        {/* Header banner */}
        <div className="px-8 pt-8 pb-4 bg-slate-50 border-b border-slate-150 relative">
          <div className="flex items-center gap-2 mb-2 text-blue-600 font-mono text-[10px] uppercase tracking-wider font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-600 animate-spin-slow" />
            <span>SaaS Gateway Portal</span>
          </div>
          <h3 className="font-sans font-black text-slate-800 text-lg tracking-tight">LocalServer Account</h3>
          <p className="text-xs text-slate-500 mt-1">Join the safest digital web system connecting users and trusted artisans.</p>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => { setTab('login'); handleReset(); }}
              className={`pb-2 font-sans text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                tab === 'login' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); handleReset(); }}
              className={`pb-2 font-sans text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                tab === 'signup' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setTab('reset'); handleReset(); }}
              className={`pb-2 font-sans text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                tab === 'reset' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Reset Key
            </button>
          </div>
        </div>

        {/* Modals Form wrapper */}
        <div className="p-8 max-h-[65vh] overflow-y-auto">
          {message && (
            <div
              className={`p-4 rounded-xl border mb-6 text-xs leading-relaxed font-semibold ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-150 text-emerald-700'
                  : 'bg-red-55 border-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1 font-display">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">Testing credentials: admin@localserver.com or artisan@localserver.com</p>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1 font-display">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition duration-200 focus:outline-none flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying Auth Account...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-white" />
                      <span>Sign In with Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Role Choosing Grid */}
              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1.5 font-display">Registering as a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      role === 'customer'
                        ? 'border-blue-550 bg-blue-50/50 text-slate-800 ring-2 ring-blue-500'
                        : 'border-slate-200 bg-slate-100/50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold block">Customer Portal</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Find, review and book verified local artisans</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('artisan')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      role === 'artisan'
                        ? 'border-blue-550 bg-blue-50/50 text-slate-800 ring-2 ring-blue-500'
                        : 'border-slate-200 bg-slate-100/50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold block">Local Artisan</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Get verified, list services, generate leads</span>
                  </button>
                </div>
              </div>

              {/* General inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Kwaku Mensah"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="+233 24 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1 font-display">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="example@localserver.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1 font-display">Pass-Code</label>
                  <input
                    required
                    type="password"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Region and City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1 font-display">Region</label>
                  <select
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setCity(REGION_CITIES[e.target.value][0]);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                  >
                    {GHANA_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1 font-display">City/Town</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                  >
                    {REGION_CITIES[region]?.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specific fields if Artisan */}
              {role === 'artisan' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-3">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">Artisan Verification Info</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-600 font-bold block mb-1">Business Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Osei Electrical Hub"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-bold block mb-1">Specialty Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                      >
                        <option value="Electricians">Electrician</option>
                        <option value="Plumbers">Plumber</option>
                        <option value="Carpenters">Carpenter</option>
                        <option value="Welders">Welder</option>
                        <option value="Painters">Painter</option>
                        <option value="Mechanics">Mechanic</option>
                        <option value="AC Technicians">AC Technician</option>
                        <option value="Masons">Mason/Builder</option>
                        <option value="Tilers">Tiler</option>
                        <option value="CCTV Installers">CCTV Installer</option>
                        <option value="Solar Technicians">Solar Tech</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-bold block mb-1">Years of Practical Experience</label>
                    <input
                      required
                      type="number"
                      min="1"
                      max="50"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-24 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition focus:outline-none flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Provisioning Database Profile...</span>
                    </>
                  ) : (
                    <span>Complete Registration</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {tab === 'reset' && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 animate-fade-in font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Link...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 text-blue-500" />
                      <span>Request Password Reset</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Third-party divider */}
          <div className="relative my-6" id="auth-divider">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase">
              <span className="bg-white px-3 text-slate-400 block">or connect instantly with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <button
            type="button"
            onClick={handleGoogleMockLogin}
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-650 font-sans font-bold text-xs flex items-center justify-center gap-2.5 hover:bg-slate-100 transition focus:outline-none cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.102 1.025 5.047 1.926l2.427-2.334C18.155 1.414 15.44 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.836 11.57-11.758 0-.79-.086-1.397-.19-1.957H12.24z"
              />
            </svg>
            <span>Continue with Google OAuth</span>
          </button>
        </div>
      </div>
    </div>
  );
}

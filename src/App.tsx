import React, { useState, useEffect } from 'react';
import {
  Hammer, Search, ShieldCheck, MapPin, User, Star, ArrowRight, CheckCircle,
  Clock, Award, MessageSquare, Phone, Heart, Code, Copy, Check, Filter, Sparkles, AlertCircle, Calendar, MessageCircle, FileText, Image
} from 'lucide-react';

import {
  UserRole, Profile, ArtisanProfile, Service, Review, Subscription, ArtisanCategory,
  ARTISAN_CATEGORIES, GHANA_REGIONS, REGION_CITIES
} from './types';

import {
  INITIAL_PROFILES, INITIAL_ARTISAN_PROFILES, INITIAL_SERVICES, INITIAL_REVIEWS,
  INITIAL_SUBSCRIPTIONS, PORTFOLIO_MOCK_DATA
} from './data/seedData';

import { SUPABASE_SQL_SCHEMA, DEPLOYMENT_GUIDE_MD } from './data/sqlBlueprint';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AuthModals from './components/AuthModals';
import MomoModal from './components/MomoModal';
import ArtisanDashboard from './components/ArtisanDashboard';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';

export default function App() {
  // Views state: 'home' | 'categories' | 'search' | 'artisan-detail' | 'pricing' | 'dashboard' | 'sql'
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedArtisanId, setSelectedArtisanId] = useState<string | null>(null);

  // Database States (Sync with localStorage)
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [artisanProfiles, setArtisanProfiles] = useState<ArtisanProfile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Authenticated State
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Saved customer specifics
  const [savedFavorites, setSavedFavorites] = useState<string[]>([]);
  const [contactRecords, setContactRecords] = useState<Array<{ artisanId: string; date: string; note: string }>>([]);

  // Payment states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(0);

  // Search states
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [searchRegion, setSearchRegion] = useState<string>('');
  const [searchCity, setSearchCity] = useState<string>('');

  // Individual review inputs
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Contact artisan form inputs
  const [contactMessage, setContactMessage] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // SQL Copy status state
  const [copiedSql, setCopiedSql] = useState(false);

  // On Load: Load cache and sync
  useEffect(() => {
    const cachedProfiles = localStorage.getItem('localserver_profiles');
    const cachedArtisans = localStorage.getItem('localserver_artisan_profiles');
    const cachedServices = localStorage.getItem('localserver_services');
    const cachedReviews = localStorage.getItem('localserver_reviews');
    const cachedSubs = localStorage.getItem('localserver_subscriptions');

    if (cachedProfiles && cachedArtisans && cachedServices && cachedReviews && cachedSubs) {
      setProfiles(JSON.parse(cachedProfiles));
      setArtisanProfiles(JSON.parse(cachedArtisans));
      setServices(JSON.parse(cachedServices));
      setReviews(JSON.parse(cachedReviews));
      setSubscriptions(JSON.parse(cachedSubs));
    } else {
      // First time seed
      setProfiles(INITIAL_PROFILES);
      setArtisanProfiles(INITIAL_ARTISAN_PROFILES);
      setServices(INITIAL_SERVICES);
      setReviews(INITIAL_REVIEWS);
      setSubscriptions(INITIAL_SUBSCRIPTIONS);

      localStorage.setItem('localserver_profiles', JSON.stringify(INITIAL_PROFILES));
      localStorage.setItem('localserver_artisan_profiles', JSON.stringify(INITIAL_ARTISAN_PROFILES));
      localStorage.setItem('localserver_services', JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem('localserver_reviews', JSON.stringify(INITIAL_REVIEWS));
      localStorage.setItem('localserver_subscriptions', JSON.stringify(INITIAL_SUBSCRIPTIONS));
    }

    // Default mock checkouts
    const cachedFavs = localStorage.getItem('localserver_favorites');
    const cachedContacts = localStorage.getItem('localserver_contacts');
    if (cachedFavs) setSavedFavorites(JSON.parse(cachedFavs));
    if (cachedContacts) setContactRecords(JSON.parse(cachedContacts));
  }, []);

  // Sync back on state modification
  const saveStateToLocalStorage = (
    updatedProfiles: Profile[],
    updatedArtisans: ArtisanProfile[],
    updatedServices: Service[],
    updatedReviews: Review[],
    updatedSubs: Subscription[]
  ) => {
    localStorage.setItem('localserver_profiles', JSON.stringify(updatedProfiles));
    localStorage.setItem('localserver_artisan_profiles', JSON.stringify(updatedArtisans));
    localStorage.setItem('localserver_services', JSON.stringify(updatedServices));
    localStorage.setItem('localserver_reviews', JSON.stringify(updatedReviews));
    localStorage.setItem('localserver_subscriptions', JSON.stringify(updatedSubs));
  };

  // Auth Callbacks
  const handleAuthSuccess = (user: Profile) => {
    setCurrentUser(user);
    // Add profile to local DB state list if not exists
    if (!profiles.some((p) => p.id === user.id)) {
      const nextProfiles = [...profiles, user];
      setProfiles(nextProfiles);
      saveStateToLocalStorage(nextProfiles, artisanProfiles, services, reviews, subscriptions);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Admin Commands
  const handleVerifyArtisan = (id: string) => {
    const nextArtisans = artisanProfiles.map((art) =>
      art.id === id ? { ...art, verified: true } : art
    );
    setArtisanProfiles(nextArtisans);
    saveStateToLocalStorage(profiles, nextArtisans, services, reviews, subscriptions);
  };

  const handleUnverifyArtisan = (id: string) => {
    const nextArtisans = artisanProfiles.map((art) =>
      art.id === id ? { ...art, verified: false } : art
    );
    setArtisanProfiles(nextArtisans);
    saveStateToLocalStorage(profiles, nextArtisans, services, reviews, subscriptions);
  };

  const handleDeleteUser = (id: string) => {
    const nextProfiles = profiles.filter((p) => p.id !== id);
    const nextArtisans = artisanProfiles.filter((a) => a.user_id !== id);
    setProfiles(nextProfiles);
    setArtisanProfiles(nextArtisans);
    saveStateToLocalStorage(nextProfiles, nextArtisans, services, reviews, subscriptions);
  };

  const handleDeleteReview = (id: string) => {
    const nextReviews = reviews.filter((r) => r.id !== id);
    setReviews(nextReviews);
    saveStateToLocalStorage(profiles, artisanProfiles, services, nextReviews, subscriptions);
  };

  // Artisan Commands
  const handleUpdateArtisanProfile = (updated: ArtisanProfile) => {
    const nextArtisans = artisanProfiles.map((art) =>
      art.id === updated.id ? updated : art
    );
    setArtisanProfiles(nextArtisans);
    saveStateToLocalStorage(profiles, nextArtisans, services, reviews, subscriptions);
  };

  const handleAddService = (newSvc: Service) => {
    const nextServices = [...services, newSvc];
    setServices(nextServices);
    saveStateToLocalStorage(profiles, artisanProfiles, nextServices, reviews, subscriptions);
  };

  const handleDeleteService = (id: string) => {
    const nextServices = services.filter((s) => s.id !== id);
    setServices(nextServices);
    saveStateToLocalStorage(profiles, artisanProfiles, nextServices, reviews, subscriptions);
  };

  // Payment triggers & Success
  const handleTriggerMomo = (plan: string, amount: number) => {
    setSelectedPlanName(plan);
    setSelectedPlanPrice(amount);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (planName: string, amount: number) => {
    if (!currentUser) return;
    const myArtisanProfile = artisanProfiles.find((ap) => ap.user_id === currentUser.id);
    if (!myArtisanProfile) return;

    // create subscription payload
    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      artisan_id: myArtisanProfile.id,
      plan: planName.toLowerCase() as any,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      active: true,
      price_paid: amount,
    };

    const nextSubs = [newSub, ...subscriptions.filter((s) => s.artisan_id !== myArtisanProfile.id)];
    setSubscriptions(nextSubs);

    // Give featured perk if premium/enterprise
    const nextArtisans = artisanProfiles.map((art) =>
      art.id === myArtisanProfile.id
        ? { ...art, featured: planName.toLowerCase() !== 'free' }
        : art
    );

    setArtisanProfiles(nextArtisans);
    saveStateToLocalStorage(profiles, nextArtisans, services, reviews, nextSubs);
  };

  // Favorites & Contacts
  const toggleFavorite = (artisanId: string) => {
    let nextFavs = [...savedFavorites];
    if (nextFavs.includes(artisanId)) {
      nextFavs = nextFavs.filter((id) => id !== artisanId);
    } else {
      nextFavs.push(artisanId);
    }
    setSavedFavorites(nextFavs);
    localStorage.setItem('localserver_favorites', JSON.stringify(nextFavs));
  };

  const handleContactArtisan = (e: React.FormEvent, artisanId: string) => {
    e.preventDefault();
    if (!contactMessage || !contactPhone) {
      alert('Please write an inquiry message and details first.');
      return;
    }

    const targetArtisan = artisanProfiles.find((a) => a.id === artisanId);
    const targetOwner = profiles.find((p) => p.id === targetArtisan?.user_id);

    // Save contact history entry
    const newRecord = {
      artisanId,
      date: new Date().toISOString(),
      note: contactMessage,
    };

    const nextContacts = [newRecord, ...contactRecords];
    setContactRecords(nextContacts);
    localStorage.setItem('localserver_contacts', JSON.stringify(nextContacts));

    // Clear Form
    setContactMessage('');
    setContactPhone('');

    // Trigger visual notification simulated USSD/SMS
    alert(
      `🔔 LOCALSERVER GHANA SMS DISPATCHER CODE:\n\n` +
      `System initialized! Direct SMS notification alert transmitted securely to local artisan "${targetArtisan?.business_name}" (${targetOwner?.phone || '+233 24 000 1111'}).\n\n` +
      `Artisan will contact you directly on mobile "${contactPhone}" shortly.`
    );
  };

  // Submit live customer review
  const handleSubmitReview = (e: React.FormEvent, artisanId: string) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!newComment.trim()) return;

    // check if already reviewed to avoid double entry
    if (reviews.some((r) => r.artisan_id === artisanId && r.customer_id === currentUser.id)) {
      alert('You have already submitted a rating assessment block for this craftsman.');
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      artisan_id: artisanId,
      customer_id: currentUser.id,
      customer_name: currentUser.full_name,
      rating: newRating,
      comment: newComment,
      created_at: new Date().toISOString(),
    };

    const nextReviews = [newRev, ...reviews];

    // Re-calculate averages instantly
    const relevantReviews = nextReviews.filter((r) => r.artisan_id === artisanId);
    const avgScore = relevantReviews.reduce((sum, curr) => sum + curr.rating, 0) / relevantReviews.length;

    const nextArtisans = artisanProfiles.map((art) =>
      art.id === artisanId
        ? {
            ...art,
            average_rating: parseFloat(avgScore.toFixed(1)),
            total_reviews: relevantReviews.length,
          }
        : art
    );

    setReviews(nextReviews);
    setArtisanProfiles(nextArtisans);
    saveStateToLocalStorage(profiles, nextArtisans, services, nextReviews, subscriptions);

    // reset fields
    setNewComment('');
    setNewRating(5);
    alert('Assessment rating processed successfully!');
  };

  // Search logic
  const filteredArtisans = artisanProfiles.filter((art) => {
    const matchName = art.business_name.toLowerCase().includes(searchName.toLowerCase());
    const matchCat = !searchCategory || art.category === searchCategory;
    const matchRegion = !searchRegion || art.region === searchRegion;
    const matchCity = !searchCity || art.city === searchCity;
    return matchName && matchCat && matchRegion && matchCity;
  });

  const featuredArtisans = artisanProfiles.filter((art) => art.featured);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleNavigateToArtisan = (id: string) => {
    setSelectedArtisanId(id);
    setCurrentView('artisan-detail');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="localserver-ghana-root">
      {/* Top Warning Ribbon */}
      <div className="bg-blue-600 py-2 px-4 text-center text-xs font-bold font-mono tracking-tight text-white flex items-center justify-center gap-1.5 shadow-sm" id="top-verification-tag">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-white shrink-0" />
        <span>Ghana Post GPS & Mobile Money secure payment platform initialized. Registered and Verified: GA-101-2026.</span>
      </div>

      {/* Navigation Header */}
      <Navigation
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setSelectedArtisanId(null);
        }}
        currentUser={currentUser}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container Layout */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="primary-layout">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="space-y-16 animate-fade-in" id="view-home">
            {/* Elegant Hero Slider Layout */}
            <section className="relative px-6 py-16 sm:px-12 sm:py-24 rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm" id="hero-banner">
              <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.02)_0,transparent_55%)] pointer-events-none" />
              
              <div className="relative text-center max-w-3xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-150 text-xs font-bold tracking-wider text-blue-600 uppercase">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Certified Background Checks on All Artisans</span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl font-sans font-black tracking-tight text-slate-905 leading-tight">
                  Find Professional, Reliable <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Artisans</span> in Ghana
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-semibold">
                  locateMe connects homeowners and corporate centers with certified electricians, plumbers, cooks, event planners, developers and other local businesses in Ghana. Verified location and pricing limits.
                </p>

                {/* Direct Integrated Search Widget */}
                <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto mt-8 relative z-20" id="hero-search-bar">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Specialist category, name, tools..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {ARTISAN_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => setCurrentView('search')}
                    className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs uppercase tracking-wide transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-blue-105"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </section>

            {/* Popular Categories Grid */}
            <section className="space-y-6" id="popular-categories-section">
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-sans font-black text-slate-805 tracking-tight">Inspect Popular Fields Categories</h2>
                <p className="text-xs text-slate-450 mt-1 font-semibold">Explore our directory categorized by specialized skills and technical competencies.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 flex-wrap font-display">
                {ARTISAN_CATEGORIES.map((cat_opt) => {
                  const count = artisanProfiles.filter((ap) => ap.category === cat_opt).length;
                  return (
                    <div
                      key={cat_opt}
                      onClick={() => {
                        setSearchCategory(cat_opt);
                        setCurrentView('search');
                      }}
                      className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500/20 hover:bg-slate-50 transition text-center cursor-pointer group hover:shadow-sm"
                    >
                      <h3 className="text-xs font-extrabold text-slate-800 group-hover:text-blue-605 transition truncate">{cat_opt}</h3>
                      <span className="inline-block text-[10px] text-slate-500 font-mono mt-1.5 px-2 py-0.5 rounded bg-slate-100 font-bold">{count} listed</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Featured Artisans Section */}
            <section className="space-y-6" id="featured-artisans-section">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-sans font-extrabold text-slate-805 tracking-tight flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Gold Tier Premium Directory Listings
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Highly-recommended certified local technicians and professionals with consistent high ratings.</p>
                </div>
                <button
                  onClick={() => setCurrentView('search')}
                  className="px-4 py-2 text-xs font-bold text-blue-600 border border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition"
                >
                  Find More Professional Experts →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredArtisans.slice(0, 3).map((artisan) => {
                  const owner = profiles.find((p) => p.id === artisan.user_id);
                  return (
                    <div
                      key={artisan.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden transition flex flex-col justify-between shadow-sm hover:shadow-md animate-scale-up"
                    >
                      <div className="p-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={owner?.profile_image || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a'}
                            alt={owner?.full_name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm animate-fade-in"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-xs font-extrabold text-slate-800">{artisan.business_name}</h3>
                              {artisan.verified && (
                                <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" title="Verified Background Check" />
                              )}
                            </div>
                            <span className="text-[10px] text-blue-600 font-mono tracking-wide uppercase font-bold">{artisan.category}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                          {artisan.description}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            {artisan.city}, {artisan.region}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {artisan.years_experience} Years Experience
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-550 fill-amber-400" />
                          <span className="font-mono text-xs text-slate-700 font-semibold">{artisan.average_rating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-450">({artisan.total_reviews} reviews)</span>
                        </div>

                        <button
                          onClick={() => handleNavigateToArtisan(artisan.id)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                        >
                          View Bio & Specs
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Testimonials */}
            <section className="bg-slate-100 border border-slate-200 p-8 rounded-3xl" id="testimonials">
              <div className="text-center max-w-xl mx-auto mb-8">
                <h2 className="text-lg font-sans font-extrabold text-slate-800">Consistently Trusted Across Ghana</h2>
                <p className="text-xs text-slate-500 mt-1">Reviewing testaments from homeowners in Greater Accra, Kumasi, and Takoradi regions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700 text-xs">
                {[
                  { name: "John Mahama", role: "East Legon, Accra", count: 5, quote: "Excellent wiring repair. Safe, timely, and certified. Strongly recommended." },
                  { name: "Sena Mensah Adjei", role: "Asokwa, Kumasi", count: 5, quote: "The emergency plumber solved our complex sewage leakage on a Sunday morning." },
                  { name: "Yvonne Appiah", role: "Takoradi Area", count: 5, quote: "The CCTV installer was very detailed. Confirms smartphone connection." }
                ].map((test, index) => (
                  <div key={index} className="bg-white p-4.5 rounded-xl border border-slate-200/80 leading-relaxed font-semibold shadow-sm">
                    <div className="flex text-amber-500 gap-0.5 mb-2">
                      {Array.from({ length: test.count }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      ))}
                    </div>
                    <p className="italic text-slate-650 mb-3">"{test.quote}"</p>
                    <span className="font-extrabold text-slate-800 block">{test.name}</span>
                    <span className="text-[10px] text-slate-450 block">{test.role}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: CATEGORIES EXHAUSTIVE PAGE */}
        {currentView === 'categories' && (
          <div className="space-y-6 animate-fade-in" id="view-categories">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Full Directory Specialty Categories</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Select any specialized category to locate verified technicians, professionals, and service providers in Ghana.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="categories-detailed-grid">
              {ARTISAN_CATEGORIES.map((cat_opt) => {
                const count = artisanProfiles.filter((ap) => ap.category === cat_opt).length;
                return (
                  <div
                    key={cat_opt}
                    onClick={() => {
                      setSearchCategory(cat_opt);
                      setCurrentView('search');
                    }}
                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md animate-scale-up"
                  >
                    <div>
                      <h4 className="text-sm font-sans font-bold text-slate-805 mb-1.5">{cat_opt}</h4>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-widest font-bold">{count} Available listings</p>
                    </div>
                    <div className="p-2 bg-slate-100 border border-slate-200 text-blue-600 rounded-xl font-bold">
                      →
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: FULL SEARCH PAGE */}
        {currentView === 'search' && (
          <div className="space-y-6 animate-fade-in" id="view-search">
            <div>
              <h2 className="text-2xl font-sans font-black text-slate-800">Find Certified Specialists & Professionals</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Refine your search parameters to pin-point technicians and service listings in your exact city and region.</p>
            </div>

            {/* Filter controls row */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm" id="search-filters-card">
              <div className="flex items-center gap-2 mb-2 text-xs uppercase font-mono font-bold text-blue-600 select-all">
                <Filter className="w-3.5 h-3.5" />
                <span>Search Filters Panel</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Business Name */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold block mb-1">Entity Name / Keyword</label>
                  <input
                    type="text"
                    placeholder="Search by keyword..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                {/* Categories filter */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold block mb-1">Category Specialty</label>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {ARTISAN_CATEGORIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Region filter */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold block mb-1">Region Location</label>
                  <select
                    value={searchRegion}
                    onChange={(e) => {
                      setSearchRegion(e.target.value);
                      setSearchCity('');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                  >
                    <option value="">All Regions</option>
                    {GHANA_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* City filter */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold block mb-1">City / Town</label>
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                    disabled={!searchRegion}
                  >
                    <option value="">All Cities</option>
                    {searchRegion &&
                      REGION_CITIES[searchRegion]?.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Reset Search Parameters button */}
              {(searchName || searchCategory || searchRegion || searchCity) && (
                <button
                  onClick={() => {
                    setSearchName('');
                    setSearchCategory('');
                    setSearchRegion('');
                    setSearchCity('');
                  }}
                  className="px-4 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition text-[10px] uppercase font-mono text-slate-500 font-bold"
                >
                  Clear Search Filters
                </button>
              )}
            </div>

            {/* Total Results count */}
            <div className="flex justify-between items-center text-xs text-slate-500 px-2">
              <span>Located <span className="text-blue-650 font-extrabold">{filteredArtisans.length}</span> verified results matching parameters</span>
            </div>

            {/* Results Grid List */}
            {filteredArtisans.length === 0 ? (
              <div className="bg-slate-100 border border-slate-200 rounded-3xl p-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 mx-auto bg-white">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-800 font-black text-sm">No Search Results Found</h4>
                  <p className="text-xs text-slate-550 px-12 mt-1 leading-relaxed font-medium">
                    Check your spelling or filter variables. We are expanding to Bono and Volta region communities shortly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="search-results-list">
                {filteredArtisans.map((artisan) => {
                  const owner = profiles.find((p) => p.id === artisan.user_id);
                  const isSaved = savedFavorites.includes(artisan.id);
                  return (
                    <div
                      key={artisan.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden transition flex flex-col justify-between shadow-sm hover:shadow-md animate-scale-up"
                    >
                      <div className="p-4.5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={owner?.profile_image || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a'}
                              alt={owner?.full_name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100 shadow-xs"
                            />
                            <div>
                              <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                                <span className="hover:text-blue-600 transition cursor-pointer" onClick={() => handleNavigateToArtisan(artisan.id)}>
                                  {artisan.business_name}
                                </span>
                                {artisan.verified && (
                                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" title="Background and qualifications validated" />
                                )}
                              </h3>
                              <span className="text-[10px] text-blue-600 font-mono tracking-wider uppercase font-bold">{artisan.category}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleFavorite(artisan.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-50"
                            title={isSaved ? 'Remove Bookmarked Favorite' : 'Save Favorite'}
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-400'}`} />
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                          {artisan.description}
                        </p>

                        <div className="flex flex-col gap-1.5 text-[10px] text-slate-500 font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            <span>Digital Postal: <span className="text-slate-800 font-bold uppercase">{artisan.gps_location}</span> • {artisan.city}, {artisan.region}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>Years of Experience: <span className="text-slate-800 font-black">{artisan.years_experience} yrs</span></span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Rating & Link */}
                      <div className="bg-slate-50 p-4 border-t border-slate-100/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                          <span className="font-mono text-xs text-slate-700 font-bold">{artisan.average_rating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-450">({artisan.total_reviews} reviews)</span>
                        </div>

                        <button
                          onClick={() => handleNavigateToArtisan(artisan.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                        >
                          View Bio
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: ARTISAN SPECIFIC DETAIL BIO PAGE */}
        {currentView === 'artisan-detail' && selectedArtisanId && (
          <div className="space-y-8 animate-fade-in" id="view-artisan-detail">
            {(() => {
              const artisan = artisanProfiles.find((ap) => ap.id === selectedArtisanId);
              if (!artisan) return <p className="text-xs text-slate-500 animate-pulse" id="detail-not-found">Artisan record lookup failure.</p>;
              const owner = profiles.find((p) => p.id === artisan.user_id);
              const artisanServices = services.filter((s) => s.artisan_id === artisan.id);
              const artisanReviews = reviews.filter((r) => r.artisan_id === artisan.id);
              const portfolio = PORTFOLIO_MOCK_DATA[artisan.id] || [
                { title: 'Project Finished Layout', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80', desc: 'Bespoke craftsman installation completed in Ghana.' }
              ];

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column (Details, services, portfolio, reviews) */}
                  <div className="lg:col-span-2 space-y-8" id="detail-left-col">
                    
                    {/* Main banner cards */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={owner?.profile_image || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a'}
                            alt={owner?.full_name}
                            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="font-sans font-black text-xl text-slate-800">{artisan.business_name}</h2>
                              {artisan.verified && (
                                <span className="flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                  ✔ Verified
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-blue-600 font-bold">{artisan.category} Specialty</span>
                            <p className="text-xs text-slate-550 mt-1 font-semibold">Host: {owner?.full_name}</p>
                          </div>
                        </div>

                        {/* Top Rating Display */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 min-w-[120px] text-center shadow-xs">
                          <div className="flex items-center justify-center text-amber-500 gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                            <span className="font-mono text-md font-bold text-slate-800">{artisan.average_rating.toFixed(1)}</span>
                          </div>
                          <span className="text-[10px] text-slate-450 block mt-1 font-bold">{artisan.total_reviews} direct reviews</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-slate-800 text-xs font-black uppercase tracking-wider font-mono">Business Bio Description</h3>
                        <p className="text-xs text-slate-650 leading-relaxed font-semibold p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-xs">
                          {artisan.description}
                        </p>
                      </div>

                      {/* GPS & Area Info */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-normal">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 shadow-xs">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Postal GPS Address</span>
                          <span className="text-slate-800 font-mono font-black uppercase mt-1 block">{artisan.gps_location}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 shadow-xs">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Regional State</span>
                          <span className="text-slate-800 font-black mt-1 block">{artisan.city}, {artisan.region}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 col-span-2 md:col-span-1 shadow-xs">
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Practical Experience</span>
                          <span className="text-slate-800 font-black mt-1 block">{artisan.years_experience} Years Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Services Offered list */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
                      <h3 className="text-slate-800 font-sans text-sm font-extrabold flex items-center gap-1.5">
                        <Award className="w-5 h-5 text-amber-500" />
                        Bespoke Services Offers ({artisanServices.length})
                      </h3>

                      {artisanServices.length === 0 ? (
                        <p className="text-xs text-slate-500 leading-relaxed italic font-bold">No specific service packages configured yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {artisanServices.map((svc) => (
                            <div key={svc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-150 flex justify-between gap-4 shadow-xs">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 mb-1">{svc.service_name}</h4>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">{svc.description}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[10px] text-slate-450 uppercase font-mono block font-bold">Price Range</span>
                                <span className="text-xs text-blue-600 font-black font-mono block mt-1">{svc.price_range}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Portfolio Work projects */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
                      <h3 className="text-slate-800 font-sans text-sm font-extrabold flex items-center gap-1.5">
                        <Image className="w-5 h-5 text-blue-500" />
                        Project Installation Gallery
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {portfolio.map((imgItem, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-150 shadow-xs">
                            <img src={imgItem.img} alt={imgItem.title} className="w-full h-40 object-cover" />
                            <div className="p-3">
                              <h4 className="text-xs font-bold text-slate-800">{imgItem.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-1">{imgItem.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews list */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-6 shadow-sm">
                      <h3 className="text-slate-800 font-sans text-sm font-extrabold flex items-center gap-1.5">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                        Client Evaluations Feed ({artisanReviews.length})
                      </h3>

                      {artisanReviews.length === 0 ? (
                        <p className="text-xs text-slate-550 italic font-medium">No ratings published yet. Be the first to review this artisan!</p>
                      ) : (
                        <div className="space-y-4">
                          {artisanReviews.map((rev) => (
                            <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-150 leading-relaxed font-semibold shadow-xs">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-mono font-bold uppercase border border-blue-100">
                                    {rev.customer_name.slice(0, 2)}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-800">{rev.customer_name}</h4>
                                    <span className="text-[9px] text-slate-400 block">{new Date(rev.created_at).toLocaleDateString()}</span>
                                  </div>
                                </div>

                                <div className="flex text-amber-500 gap-0.5" title={`${rev.rating}/5 stars`}>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Rating submission form */}
                      <form onSubmit={(e) => handleSubmitReview(e, artisan.id)} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                          Submit Client Assessment Rating
                        </h4>

                        {!currentUser ? (
                          <div className="text-center py-2 space-y-2">
                            <p className="text-[11px] text-slate-550 font-bold">You must be logged in as a registered customer to post score reviews.</p>
                            <button
                              type="button"
                              onClick={() => setAuthModalOpen(true)}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
                            >
                              Sign In and Post Review
                            </button>
                          </div>
                        ) : currentUser.role !== 'customer' ? (
                          <p className="text-[11px] text-slate-500 leading-relaxed italic font-semibold">Only clients are eligible to leave comments on local contractors.</p>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-650 font-bold">Score Assessment:</span>
                              <div className="flex items-center gap-1 text-md bg-white p-1.5 rounded-xl border border-slate-150">
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <button
                                    type="button"
                                    key={num}
                                    onClick={() => setNewRating(num)}
                                    className="p-1 focus:outline-none transition shrink-0 cursor-pointer"
                                  >
                                    <Star
                                      className={`w-6 h-6 ${
                                        num <= newRating ? 'text-amber-500 fill-amber-400' : 'text-slate-200'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-slate-550 font-bold block mb-1">Your Detailed Experience Comment</label>
                              <textarea
                                required
                                rows={3}
                                placeholder="Explain details about their timing, response, skills, cleaner cleanup, and general friendliness..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                              />
                            </div>

                            <button
                              type="submit"
                              className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg uppercase tracking-wide transition cursor-pointer"
                            >
                              Approve Rating Comment
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>

                  {/* Right Column (WhatsApp / call booking slider card) */}
                  <div className="space-y-6" id="detail-right-col">
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 sticky top-24 shadow-sm">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-blue-600 font-mono tracking-widest block">Direct Client Contact Card</span>
                        <h3 className="text-slate-800 font-sans text-sm font-extrabold">Contact {owner?.full_name}</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between shadow-xs">
                          <div>
                            <span className="text-[9px] text-slate-450 font-mono block font-bold">Direct Phone Number</span>
                            <span className="text-xs font-black text-slate-800 select-all mt-1 block">{owner?.phone || '+233 24 123 4567'}</span>
                          </div>
                          <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-emerald-100">Call Direct</span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between shadow-xs">
                          <div>
                            <span className="text-[9px] text-slate-450 font-mono block font-bold">GhanaPost Digital Code</span>
                            <span className="text-xs font-mono font-black text-slate-800 uppercase mt-1 block">{artisan.gps_location}</span>
                          </div>
                          <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wide font-bold border border-blue-100">GPS Checked</span>
                        </div>
                      </div>

                      {/* Form initiate connection */}
                      <form onSubmit={(e) => handleContactArtisan(e, artisan.id)} className="p-4 rounded-xl bg-slate-50 border border-slate-205 space-y-4 shadow-xs">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          Simulate SMS Dispatch
                        </h4>
                        
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Your Mobile Phone Contact</label>
                          <input
                            required
                            type="tel"
                            placeholder="+233 24 000 0000"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Short Inquiry Message Description</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="e.g. Please wire a main switchboard in Spintex..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg uppercase tracking-wide transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Transmit Secure SMS
                        </button>
                      </form>

                      {/* WhatsApp trigger representation */}
                      <a
                        href={`https://wa.me/${owner?.phone?.replace(/\s+/g, '') || '233244123456'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-4 rounded-xl border border-slate-200 hover:border-emerald-500/20 text-xs text-slate-600 hover:text-emerald-600 font-bold bg-white hover:bg-slate-50 transition flex items-center justify-center gap-2 shadow-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Open WhatsApp Callback</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 5: PRICING / PREMIUM MEMBERSHIP DETAIL PAGE */}
        {currentView === 'pricing' && (
          <div className="space-y-8 animate-fade-in" id="view-pricing">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-3xl font-black text-slate-805 leading-tight">Ghana's Highest-Yield Lead Engine</h2>
              <p className="text-xs text-slate-500 font-semibold">List your services inside the safest digital directory. Elevating service quality across regional cities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" id="pricing-matrix">
              {/* Box Basic */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Standard Directory Plan</span>
                  <h3 className="text-lg font-extrabold text-slate-800 mt-1">Free Tier</h3>
                  <p className="text-xs text-slate-500 mt-2">Perfect for young apprentices beginning to log service reputations in Accra.</p>
                  
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-2xl font-black text-slate-850">GH₵ 0</span>
                    <span className="text-xs text-slate-450">/ forever</span>
                  </div>

                  <hr className="border-slate-100 my-6" />

                  <ul className="space-y-3.5 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2">✔ List up to 3 services package offers</li>
                    <li className="flex items-center gap-2">✔ Standard category directory display</li>
                    <li className="flex items-center gap-2">✔ Receive customer reviews</li>
                    <li className="flex items-center gap-2 text-slate-350 line-through">✘ Prioritized Search placement</li>
                    <li className="flex items-center gap-2 text-slate-350 line-through">✘ Pro verified system badge</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) {
                      setCurrentView('dashboard');
                    } else {
                      setAuthModalOpen(true);
                    }
                  }}
                  className="w-full mt-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 uppercase tracking-wide font-bold transition cursor-pointer"
                >
                  Join standard listing
                </button>
              </div>

              {/* Box Premium */}
              <div className="p-6 rounded-3xl bg-white border-2 border-blue-500 flex flex-col justify-between relative shadow-md">
                <span className="absolute top-3.5 right-3.5 text-[9px] bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">Top Recommendation</span>
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-blue-600 tracking-wider block">Local Pro Artisans</span>
                  <h3 className="text-lg font-extrabold text-slate-800 mt-1">Premium plan</h3>
                  <p className="text-xs text-slate-600 mt-2 font-medium">Excellent package for independent engineers and contractors wishing to receive instant call leads.</p>
                  
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-3xl font-black text-blue-600 animate-scale-up">GH₵ 50</span>
                    <span className="text-xs text-slate-450">/ month</span>
                  </div>

                  <hr className="border-slate-100 my-6" />

                  <ul className="space-y-3.5 text-xs text-slate-700 font-semibold">
                    <li className="flex items-center gap-2">✔ Unlimited Services Package configurations</li>
                    <li className="flex items-center gap-2 text-blue-600">✔ Priority Featured Placement above free results</li>
                    <li className="flex items-center gap-2 text-blue-600">✔ Pro Verified Safety Badge privileges</li>
                    <li className="flex items-center gap-2">✔ Immediate Mobile Money / Telecel Cash checkout</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) {
                      handleTriggerMomo('Premium', 50);
                    } else {
                      setAuthModalOpen(true);
                    }
                  }}
                  className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-blue-50/20 cursor-pointer"
                >
                  Activate with Mobile Money
                </button>
              </div>

              {/* Box Enterprise */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-purple-600 font-mono block">Contractor Hub Bundle</span>
                  <h3 className="text-lg font-extrabold text-slate-800 mt-1">Enterprise Plan</h3>
                  <p className="text-xs text-slate-500 mt-2">Bespoke technical agencies, engineering networks, and registered companies in Ghana.</p>
                  
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-2xl font-black text-purple-650">GH₵ 120</span>
                    <span className="text-xs text-slate-450">/ month</span>
                  </div>

                  <hr className="border-slate-100 my-6" />

                  <ul className="space-y-3.5 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2">✔ Multi-profile linking on single workspace</li>
                    <li className="flex items-center gap-2">✔ Top-tier corporate placement priority</li>
                    <li className="flex items-center gap-2">✔ Direct digital SMS alert automation system</li>
                    <li className="flex items-center gap-2">✔ Instant developer verification checks</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) {
                      handleTriggerMomo('Enterprise', 120);
                    } else {
                      setAuthModalOpen(true);
                    }
                  }}
                  className="w-full mt-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 uppercase tracking-wide font-bold transition cursor-pointer"
                >
                  Initiate MoMo Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: MEMBERSHIP USER PORTAL DASHBOARD OR ADMIN HUB */}
        {currentView === 'dashboard' && (
          <div className="space-y-6 animate-fade-in" id="view-dashboard">
            {!currentUser ? (
              <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-105 flex items-center justify-center text-blue-600 mx-auto">
                  <User className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <h3 className="text-slate-800 font-sans font-black text-md">Authenticate Dashboard Hub</h3>
                  <p className="text-xs text-slate-500 px-6 mt-1 leading-relaxed font-semibold">
                    Verify account status. Log in to access services list, edit credentials, or check review ratings.
                  </p>
                </div>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Sign In to locateMe Ghana
                </button>
              </div>
            ) : currentUser.role === 'admin' ? (
              <AdminDashboard
                currentUser={currentUser}
                profiles={profiles}
                artisanProfiles={artisanProfiles}
                reviews={reviews}
                subscriptions={subscriptions}
                onVerifyArtisan={handleVerifyArtisan}
                onUnverifyArtisan={handleUnverifyArtisan}
                onDeleteUser={handleDeleteUser}
                onDeleteReview={handleDeleteReview}
              />
            ) : currentUser.role === 'artisan' ? (
              <ArtisanDashboard
                currentUser={currentUser}
                artisanProfiles={artisanProfiles}
                services={services}
                reviews={reviews}
                subscriptions={subscriptions}
                onTriggerMomo={handleTriggerMomo}
                onUpdateProfile={handleUpdateArtisanProfile}
                onAddService={handleAddService}
                onDeleteService={handleDeleteService}
              />
            ) : (
              <CustomerDashboard
                currentUser={currentUser}
                artisanProfiles={artisanProfiles}
                reviews={reviews}
                savedFavorites={savedFavorites}
                contactRecords={contactRecords}
                onNavigateToArtisan={handleNavigateToArtisan}
                onRemoveFavorite={toggleFavorite}
              />
            )}
          </div>
        )}

        {/* VIEW 7: SQL SCHEMA BLUEPRINT PAGE */}
        {currentView === 'sql' && (
          <div className="space-y-8 animate-fade-in" id="view-sql">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <Code className="w-6 h-6 text-blue-600" />
                  Supabase & Local PostgreSQL Blueprint
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">Deploy production-ready schemas, triggers, and precise Row Level Security (RLS) policies directly into Supabase SQL editor.</p>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleCopySql}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase transition tracking-wider rounded-lg flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied standard SQL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>Copy PostgreSQL Schema SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Right Column (Instructions MD) */}
              <div className="lg:col-span-1 space-y-6" id="sql-guide">
                <div className="bg-white border border-slate-205 shadow-sm p-6 rounded-3xl space-y-4">
                  <h3 className="text-blue-600 font-sans text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Setup Steps Guide
                  </h3>
                  
                  <div className="text-xs text-slate-600 leading-relaxed space-y-4 font-semibold">
                    <div className="space-y-1">
                      <span className="font-extrabold text-slate-800 block">1. Run SQL Editor In Supabase</span>
                      <p className="text-slate-500 text-[11px] font-medium">Copy the complete database code block and run it. It configures profiles, artisan columns, ratings recalculations triggers, and Row Level Security permissions.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-extrabold text-slate-800 block">2. Hook Environment Client Secrets</span>
                      <p className="text-slate-500 text-[11px] font-medium">Enter public environment keys inside your Vercel hosting provider dashboard or configure local .env secrets file.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-extrabold text-slate-800 block">3. Establish Portfolios Storage Bag</span>
                      <p className="text-slate-500 text-[11px] font-medium">Set up a Public bucket inside Supabase storage and configure rules allowing write permits to profile with role "artisan".</p>
                    </div>
                  </div>
                </div>

                {/* Database Abstraction Specs Card */}
                <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl space-y-4 text-xs font-normal">
                  <h3 className="text-slate-800 font-sans text-xs font-black uppercase tracking-wider text-blue-600">Abstraction Specifications</h3>
                  <div className="space-y-2 text-slate-600 leading-relaxed font-semibold">
                    <div className="p-2 bg-slate-50 border border-slate-150 rounded flex justify-between">
                      <span className="text-slate-500">Database Engine:</span>
                      <span className="font-mono font-bold text-slate-800">PostgreSQL 15</span>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-150 rounded flex justify-between">
                      <span className="text-slate-500">Security:</span>
                      <span className="font-mono font-bold text-blue-600">Row Level Security</span>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-150 rounded flex justify-between">
                      <span className="text-slate-500">Payment API:</span>
                      <span className="font-mono font-bold text-blue-600 font-black">Paystack GHS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Column Code Display */}
              <div className="lg:col-span-2 space-y-4" id="sql-code-renderer">
                <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl relative">
                  <div className="absolute right-4 top-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 font-bold rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">SUPABASE_POSTGRES_COMPLIANT.sql</span>
                  </div>

                  <h3 className="text-slate-800 font-sans text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-450" />
                    Artisans Database Tables Schemas & Triggers SQL
                  </h3>

                  <pre className="text-[11px] font-mono text-slate-700 bg-slate-50 p-4 rounded-xl max-h-[50vh] overflow-auto border border-slate-150 scrollbar-thin scrollbar-thumb-slate-300">
                    <code>{SUPABASE_SQL_SCHEMA}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer component */}
      <Footer onNavigate={(view) => {
        setCurrentView(view);
        setSelectedArtisanId(null);
      }} />

      {/* Auth Modal Trigger popup */}
      <AuthModals
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Mobile Money USSD simulator modal */}
      <MomoModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedPlanName('');
          setSelectedPlanPrice(0);
        }}
        onSuccess={handlePaymentSuccess}
        planName={selectedPlanName}
        amount={selectedPlanPrice}
      />
    </div>
  );
}

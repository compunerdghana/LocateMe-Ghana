import React, { useState } from 'react';
import {
  User, CheckCircle, Smartphone, Award, Briefcase, Trash2, Plus, Star,
  TrendingUp, Image, MessageSquare, Sparkles, Loader2, Save, FileSpreadsheet
} from 'lucide-react';
import { Profile, ArtisanProfile, Review, Subscription, Service, ARTISAN_CATEGORIES, GHANA_REGIONS, REGION_CITIES } from '../types';

interface ArtisanDashboardProps {
  currentUser: Profile;
  artisanProfiles: ArtisanProfile[];
  services: Service[];
  reviews: Review[];
  subscriptions: Subscription[];
  onTriggerMomo: (plan: string, amount: number) => void;
  onUpdateProfile: (updated: ArtisanProfile) => void;
  onAddService: (newSvc: Omit<Service, 'id'>) => void;
  onDeleteService: (id: string) => void;
}

export default function ArtisanDashboard({
  currentUser,
  artisanProfiles,
  services,
  reviews,
  subscriptions,
  onTriggerMomo,
  onUpdateProfile,
  onAddService,
  onDeleteService,
}: ArtisanDashboardProps) {
  const myProfile = artisanProfiles.find((ap) => ap.user_id === currentUser.id);

  if (!myProfile) {
    return (
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 text-center" id="artisan-dashboard-notfound">
        <h3 className="text-slate-800 font-sans font-black text-sm uppercase">Technical Profile Record Missing</h3>
        <p className="text-xs text-slate-500 mt-2">Please log out and register choosing the local artisan status during initial account creation.</p>
      </div>
    );
  }

  // State hooks
  const [activeTab, setActiveTab] = useState<'analytics' | 'profile' | 'services' | 'portfolio' | 'reviews' | 'billing'>('analytics');

  // Profile forms state
  const [busName, setBusName] = useState(myProfile.business_name);
  const [cat, setCat] = useState(myProfile.category);
  const [desc, setDesc] = useState(myProfile.description);
  const [reg, setReg] = useState(myProfile.region);
  const [cit, setCit] = useState(myProfile.city);
  const [gps, setGps] = useState(myProfile.gps_location);
  const [exp, setExp] = useState(String(myProfile.years_experience));

  // Service form state
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcPrice, setNewSvcPrice] = useState('');
  const [newSvcDesc, setNewSvcDesc] = useState('');

  // Portfolio local simulation list state
  const [portfolioItems, setPortfolioItems] = useState([
    { img: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=400&q=80', title: 'Power Conduit Conduit Setup', desc: 'Conduit implementation for 3-bedroom building model.' },
    { img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80', title: 'Solar Smart Panel Fitting', desc: 'Secure installation on home battery pack system.' }
  ]);
  const [pTitle, setPTitle] = useState('');
  const [pImg, setPImg] = useState('');
  const [pDesc, setPDesc] = useState('');

  // Computed data
  const myServices = services.filter((svc) => svc.artisan_id === myProfile.id);
  const myReviews = reviews.filter((rev) => rev.artisan_id === myProfile.id);
  const myActiveSub = subscriptions.find((sub) => sub.artisan_id === myProfile.id && sub.active);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...myProfile,
      business_name: busName,
      category: cat,
      description: desc,
      region: reg,
      city: cit,
      gps_location: gps,
      years_experience: parseInt(exp) || 3,
    });
    alert('Artisan credentials successfully saved in SaaS database local state!');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    onAddService({
      artisan_id: myProfile.id,
      service_name: newSvcName,
      price_range: newSvcPrice,
      description: newSvcDesc,
    });
    setNewSvcName('');
    setNewSvcPrice('');
    setNewSvcDesc('');
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    setPortfolioItems((prev) => [
      ...prev,
      { img: pImg || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780', title: pTitle, desc: pDesc }
    ]);
    setPTitle('');
    setPImg('');
    setPDesc('');
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-8" id="artisan-dashboard">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-150" id="dash-header">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.profile_image || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a'}
            alt={currentUser.full_name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-black text-slate-800 text-lg tracking-tight">{myProfile.business_name}</h2>
              {myProfile.verified ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider font-mono">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Verified Elite
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-450 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono border border-slate-200">
                  Pending Verification
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Category: <span className="text-blue-600 font-bold">{myProfile.category}</span> • Location: <span className="text-slate-700 font-semibold">{myProfile.city}, {myProfile.region}</span>
            </p>
          </div>
        </div>

        {/* Subscription state display */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono font-bold">Current Tier Membership</p>
            <h4 className="text-xs font-extrabold text-slate-800 capitalize">{myActiveSub ? myActiveSub.plan : 'Free Tier'}</h4>
          </div>
          {!myActiveSub && (
            <button
              onClick={() => setActiveTab('billing')}
              className="ml-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg uppercase tracking-wide transition cursor-pointer shadow shadow-blue-100"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Nav Tabs Row */}
      <div className="flex flex-nowrap overflow-x-auto gap-1 border-b border-slate-150 py-3 mb-6 scrollbar-hide" id="dash-tabs">
        {[
          { id: 'analytics', label: 'Dashboard Live Stat', icon: TrendingUp },
          { id: 'profile', label: 'Modify Credentials', icon: User },
          { id: 'services', label: 'Manage Services', icon: Briefcase },
          { id: 'portfolio', label: 'Upload Works', icon: Image },
          { id: 'reviews', label: 'Client Feedback', icon: MessageSquare },
          { id: 'billing', label: 'Membership Plans', icon: Award },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-4.5 py-2 rounded-xl font-sans text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TABS CONTENT */}
      <div className="mt-4">
        {activeTab === 'analytics' && (
          <div className="space-y-6" id="artisan-tab-analytics font-display">
            {/* Quick stats board */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80">
                <span className="text-xs text-slate-450 uppercase font-mono block font-bold">Direct Leads</span>
                <span className="text-2xl font-black text-slate-800 block mt-1">{(myProfile.total_reviews * 3) + 7}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-bold">▲ 12% vs last month</span>
              </div>
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80">
                <span className="text-xs text-slate-450 uppercase font-mono block font-bold">Profile Views</span>
                <span className="text-2xl font-black text-slate-800 block mt-1">{(myProfile.total_reviews * 18) + 42}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-bold">▲ 24% boost</span>
              </div>
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80">
                <span className="text-xs text-slate-450 uppercase font-mono block font-bold">Current Reviews</span>
                <span className="text-2xl font-black text-slate-800 block mt-1">{myProfile.total_reviews}</span>
                <span className="text-[10px] text-orange-550 flex items-center gap-1 mt-0.5 font-extrabold">
                  ★ {myProfile.average_rating.toFixed(1)} Rating
                </span>
              </div>
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80">
                <span className="text-xs text-slate-450 uppercase font-mono block font-bold">Simulated Revenue</span>
                <span className="text-2xl font-black text-blue-600 block mt-1">GH₵ {(myProfile.total_reviews * 1250)}</span>
                <span className="text-[10px] text-slate-450 block mt-0.5 font-bold">Standard jobs ledger</span>
              </div>
            </div>

            {/* Simulated Lead tracker */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-slate-800 font-sans text-sm font-extrabold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 animate-spin-slow" />
                Recent Call Leads Generation Logs
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Kweku Addo', loc: 'Dzorwulu, Accra', time: '18 mins ago', svc: 'Electrical fuse diagnostics', cell: '+233 24 333 4488' },
                  { name: 'Sarkodie Appiah', loc: 'East Legon', time: 'Yesterday', svc: '3-bedroom conduit system quote', cell: '+233 55 120 4499' },
                  { name: 'Phyllis Mensah', loc: 'Airport Hills', time: '2 days ago', svc: 'Emergency smart lighting issue', cell: '+233 20 892 1010' }
                ].map((lead, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:shadow-sm transition-all duration-200">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">{lead.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{lead.loc} • <span className="text-blue-650 font-bold">{lead.svc}</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-blue-600 font-bold block">{lead.time}</span>
                      <span className="text-[11px] text-slate-850 font-extrabold block mt-0.5 select-all">{lead.cell}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-6 max-w-2xl font-display" id="artisan-tab-profile">
            <h3 className="text-slate-800 font-sans text-sm font-extrabold border-b border-slate-150 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Business Profile Meta Registry</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1">Registered Business Name</label>
                <input
                  required
                  type="text"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1">Artisan Specialty Category</label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                >
                  {ARTISAN_CATEGORIES.map((cat_opt) => (
                    <option key={cat_opt} value={cat_opt}>
                      {cat_opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1">Region</label>
                <select
                  value={reg}
                  onChange={(e) => {
                    setReg(e.target.value);
                    setCit(REGION_CITIES[e.target.value][0]);
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
                <label className="text-xs text-slate-600 font-bold block mb-1">City / Town</label>
                <select
                  value={cit}
                  onChange={(e) => setCit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                >
                  {REGION_CITIES[reg]?.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1">Digital GhanaPost GPS Code</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. GA-120-3022"
                  value={gps}
                  onChange={(e) => setGps(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1">Years of Practical Work Experience</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-600 font-bold block mb-1">Business Bio / Bio Description</label>
              <textarea
                required
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-805 focus:outline-none focus:border-blue-500 leading-relaxed font-semibold"
                placeholder="Write an outstanding elevator pitch about your craftsmanship..."
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase transition focus:outline-none cursor-pointer shadow shadow-blue-100"
            >
              Save Registry Info
            </button>
          </form>
        )}

        {activeTab === 'services' && (
          <div className="space-y-8 font-display" id="artisan-tab-services">
            {/* List service offers */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-slate-805 font-sans text-sm font-extrabold mb-4">Listed Offerings ({myServices.length})</h3>

              {myServices.length === 0 ? (
                <div className="text-center py-6 bg-white border border-slate-200 rounded-xl">
                  <p className="text-slate-400 text-xs text-center p-3">No service sub-modules configured yet. Set up service blocks below to inform shoppers of your price scopes.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myServices.map((svc) => (
                    <div key={svc.id} className="p-4 rounded-xl bg-white border border-slate-205 flex justify-between gap-2.5 hover:shadow-xs transition-all">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{svc.service_name}</h4>
                        <span className="text-[11px] font-mono text-blue-605 block mt-1 font-bold">{svc.price_range}</span>
                        <p className="text-[10px] text-slate-450 mt-1 leading-relaxed font-semibold">{svc.description}</p>
                      </div>
                      <button
                        onClick={() => onDeleteService(svc.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition h-fit cursor-pointer align-top"
                        title="Delete Service Form"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form to insert services */}
            <form onSubmit={handleAddService} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-xl space-y-4">
              <h3 className="text-blue-605 font-sans text-xs font-bold uppercase tracking-wider">Add Technical Service Module</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1">Service Headline Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Fuse box replacement & setup"
                    value={newSvcName}
                    onChange={(e) => setNewSvcName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1">Price Range (GH₵)</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. GH₵ 350 - GH₵ 600"
                    value={newSvcPrice}
                    onChange={(e) => setNewSvcPrice(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  placeholder="Specify the materials provided, parameters of the repair, guarantee terms, and options..."
                  value={newSvcDesc}
                  onChange={(e) => setNewSvcDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow shadow-blue-105"
              >
                <Plus className="w-4 h-4" />
                Add Technical Service Code
              </button>
            </form>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-8 font-display" id="artisan-tab-portfolio">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-slate-805 font-sans text-sm font-extrabold mb-4">Current Installation Photos ({portfolioItems.length})</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolioItems.map((item, i) => (
                  <div key={i} className="group bg-white border border-slate-200 rounded-xl overflow-hidden relative shadow-xs">
                    <img src={item.img} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <h4 className="text-xs font-extrabold text-slate-800 truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-450 line-clamp-1 mt-0.5 font-bold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form append portfolio */}
            <form onSubmit={handleAddPortfolio} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-xl space-y-4">
              <h3 className="text-blue-650 font-sans text-xs font-bold uppercase tracking-wider">Log Finished Installation Project</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1">Installation Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Madina Commercial Substation Panel"
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1">Photo Stock URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://images.unsplash.com/your-image"
                    value={pImg}
                    onChange={(e) => setPImg(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold block mb-1">Short Description</label>
                <input
                  required
                  type="text"
                  placeholder="Specify location, system specs or materials handled..."
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Approve Project Photo Entry
              </button>
            </form>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6 font-display" id="artisan-tab-reviews">
            <h3 className="text-slate-850 font-sans text-sm font-extrabold">Client Feedback Rating Feed ({myReviews.length})</h3>

            {myReviews.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                <p className="text-xs text-slate-400 p-2">No client feedback matches recorded yet. Once verified, share your link to gather client ratings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-xs font-bold uppercase font-mono shadow-xs">
                          {review.customer_name.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-850">{review.customer_name}</h4>
                          <span className="text-[10px] text-slate-400 block font-semibold">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex text-orange-400 gap-0.5" title={`${review.rating}/5 stars`}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < review.rating ? 'fill-orange-450 text-orange-450' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed font-semibold">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6 font-display" id="artisan-tab-billing">
            <div>
              <h3 className="text-slate-805 font-sans text-sm font-extrabold">Membership Subscriptions Management</h3>
              <p className="text-xs text-slate-500 mt-1">Acquire verified tags, appear higher in local client lookup metrics and unlock premium lead features.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan Free */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Standard Listing</span>
                  <h4 className="text-base font-black text-slate-805 mt-1">Free Tier</h4>
                  <p className="text-xs text-slate-500 mt-2">Basic listing under specialty categories without featured metrics.</p>
                  <hr className="border-slate-200 my-4" />
                  <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                    <li className="flex items-center gap-2">✔ List up to 3 services</li>
                    <li className="flex items-center gap-2">✔ Recieve cliente reviews</li>
                    <li className="flex items-center gap-2 text-slate-350 line-through">✘ Featured Placement</li>
                    <li className="flex items-center gap-2 text-slate-350 line-through">✘ Instant SMS Alert Logs</li>
                  </ul>
                </div>
                {!myActiveSub && (
                  <button className="w-full mt-6 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold uppercase border border-slate-220 cursor-not-allowed">
                    Active Free Tier
                  </button>
                )}
              </div>

              {/* Plan Premium */}
              <div className="p-6 rounded-2xl bg-white border-2 border-blue-600 flex flex-col justify-between relative shadow-lg shadow-blue-50 transition-all duration-200 transform hover:-translate-y-1">
                <span className="absolute top-2.5 right-2.5 text-[8px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-150">Highly Popular</span>
                <div>
                  <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest block font-extrabold">Highly Recommended</span>
                  <h4 className="text-base font-black text-slate-805 mt-1">Premium Plan</h4>
                  <p className="text-xs text-slate-500 mt-2">Recommended for independent builders wishing to receive massive calls.</p>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-2xl font-black text-blue-600">GH₵ 50</span>
                    <span className="text-xs text-slate-400 font-bold">/ month</span>
                  </div>
                  <hr className="border-slate-155 my-4" />
                  <ul className="space-y-2 text-xs text-slate-700 font-bold">
                    <li className="flex items-center gap-2">✔ Unlimited listed services</li>
                    <li className="flex items-center gap-2">✔ Gold Featured placement on search</li>
                    <li className="flex items-center gap-2">✔ Dynamic GPS listing with verification</li>
                    <li className="flex items-center gap-2">✔ Professional badge privileges</li>
                  </ul>
                </div>
                <button
                  onClick={() => onTriggerMomo('Premium', 50)}
                  className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    myActiveSub?.plan === 'premium'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-105'
                  }`}
                >
                  {myActiveSub?.plan === 'premium' ? 'Current Active Package' : 'Activate Premium with MoMo'}
                </button>
              </div>

              {/* Plan Enterprise */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:shadow-xs transition-all duration-200">
                <div>
                  <span className="text-[10px] font-mono text-purple-600 uppercase tracking-wider block font-bold">Local Contractor Hub</span>
                  <h4 className="text-base font-black text-purple-700 mt-1">Enterprise Plan</h4>
                  <p className="text-xs text-slate-500 mt-2">Bespoke technical agencies and large-scale contracting networks.</p>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-2xl font-black text-purple-650">GH₵ 120</span>
                    <span className="text-xs text-slate-400 font-bold">/ month</span>
                  </div>
                  <hr className="border-slate-200 my-4" />
                  <ul className="space-y-2 text-xs text-slate-650 font-semibold">
                    <li className="flex items-center gap-2">✔ Multi-member profiles listing</li>
                    <li className="flex items-center gap-2">✔ Top-tier featured slot guarantees</li>
                    <li className="flex items-center gap-2">✔ Custom digital phone callback triggers</li>
                    <li className="flex items-center gap-2">✔ Instant developer verification checks</li>
                  </ul>
                </div>
                <button
                  onClick={() => onTriggerMomo('Enterprise', 120)}
                  className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold uppercase border transition cursor-pointer ${
                    myActiveSub?.plan === 'enterprise'
                      ? 'bg-purple-50 text-purple-650 border border-purple-200'
                      : 'bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  {myActiveSub?.plan === 'enterprise' ? 'Current Active Plan' : 'Buy with Mobile Money'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

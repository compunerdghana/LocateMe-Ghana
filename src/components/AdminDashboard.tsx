import React, { useState } from 'react';
import {
  ShieldCheck, Shield, Users, Award, Star, Trash2, CheckCircle2,
  Lock, TrendingUp, Filter, MessageSquare, Briefcase, RefreshCw, BarChart3
} from 'lucide-react';
import { Profile, ArtisanProfile, Review, Subscription, Service } from '../types';

interface AdminDashboardProps {
  currentUser: Profile;
  profiles: Profile[];
  artisanProfiles: ArtisanProfile[];
  reviews: Review[];
  subscriptions: Subscription[];
  onVerifyArtisan: (id: string) => void;
  onUnverifyArtisan: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onDeleteReview: (id: string) => void;
}

export default function AdminDashboard({
  currentUser,
  profiles,
  artisanProfiles,
  reviews,
  subscriptions,
  onVerifyArtisan,
  onUnverifyArtisan,
  onDeleteUser,
  onDeleteReview,
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'artisans' | 'customers' | 'reviews' | 'subscriptions'>('overview');

  // Computed platform KPIs
  const totalArtisans = ProfilesWithRole('artisan').length;
  const totalCustomers = ProfilesWithRole('customer').length;
  const totalSubscribers = subscriptions.filter((s) => s.active).length;
  const totalRevenue = subscriptions.reduce((acc, curr) => acc + (curr.active ? curr.price_paid : 0), 0);

  function ProfilesWithRole(role: string) {
    return profiles.filter((p) => p.role === role);
  }

  // Find most popular category based on artisans
  const getPopularCategory = () => {
    const counts: Record<string, number> = {};
    artisanProfiles.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    let maxCat = 'Electricians';
    let maxVal = 0;
    Object.entries(counts).forEach(([k, v]) => {
      if (v > maxVal) {
        maxVal = v;
        maxCat = k;
      }
    });
    return { name: maxCat, count: maxVal };
  };

  const topCategory = getPopularCategory();

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-8" id="admin-dashboard-main">
      {/* Admin Title banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-150 mb-6" id="admin-header">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-100">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-blue-600 font-mono tracking-widest uppercase font-extrabold block">locateMe Ghana Hub</span>
            <h2 className="font-sans font-black text-slate-800 text-lg tracking-tight">Main Platform Executive Console</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM STATE: LIVE ON SITE</span>
        </div>
      </div>

      {/* Mini Tabs menu */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-150 pb-3 mb-6 scrollbar-hide" id="admin-tab-nav">
        {[
          { id: 'overview', label: 'Platform Platform Overview', icon: BarChart3 },
          { id: 'artisans', label: 'Artisan Verification List', icon: ShieldCheck },
          { id: 'customers', label: 'Manage Platform Customers', icon: Users },
          { id: 'reviews', label: 'Review Moderations Feed', icon: MessageSquare },
          { id: 'subscriptions', label: 'Subscription Auditing', icon: Award },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id as any)}
              className={`px-4 py-2 rounded-xl font-sans text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'text-slate-650 hover:text-slate-850 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI GRID */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6" id="admin-tab-overview font-display">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-450 uppercase font-mono block font-bold">Registered Artisans</span>
              <span className="text-3xl font-black text-slate-800 block mt-1.5">{totalArtisans}</span>
              <span className="text-[10px] text-slate-450 font-bold block mt-1">Ghanaian directory listings</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-450 uppercase font-mono block font-bold">Total Customers</span>
              <span className="text-3xl font-black text-slate-800 block mt-1.5">{totalCustomers}</span>
              <span className="text-[10px] text-slate-450 font-bold block mt-1">尋求服務的客戶</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-450 uppercase font-mono block font-bold">Active Paid Subs</span>
              <span className="text-3xl font-black text-blue-600 block mt-1.5">{totalSubscribers}</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">MRR activated</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-450 uppercase font-mono block font-bold">Net Platform Income</span>
              <span className="text-3xl font-black text-purple-600 block mt-1.5">GH₵ {totalRevenue}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">MTN & Paystack abstractions</span>
            </div>
          </div>

          {/* Quick Stats list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 leading-relaxed">
              <h3 className="text-slate-800 font-sans text-sm font-bold mb-4">Core Platform Diagnostics</h3>
              <div className="space-y-3.5 text-xs text-slate-600 font-medium">
                <div className="flex justify-between border-b border-slate-150 pb-2">
                  <span className="text-slate-500">Fastest Area Specialty:</span>
                  <span className="text-blue-600 font-bold">{topCategory.name} ({topCategory.count} listed)</span>
                </div>
                <div className="flex justify-between border-b border-slate-150 pb-2">
                  <span className="text-slate-500">Mean Client Assessment Rating:</span>
                  <span className="text-slate-805 font-mono font-bold">4.68 Stars / 5.0</span>
                </div>
                <div className="flex justify-between border-b border-slate-150 pb-2">
                  <span className="text-slate-500">Unprocessed Artisan Logs:</span>
                  <span className="text-red-650 font-bold font-mono">
                    {artisanProfiles.filter((a) => !a.verified).length} awaiting action
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Active Mobile Money Tracers:</span>
                  <span className="text-emerald-605 font-bold">Telecel Cash & MTN MoMo Secure API</span>
                </div>
              </div>
            </div>

            {/* Quick action logger */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-slate-800 font-sans text-sm font-bold mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Live Network Event Stream Logs
              </h3>
              <div className="space-y-2 text-[11px] font-mono text-slate-600">
                <div className="p-2 rounded-xl bg-white border border-slate-150 flex items-center justify-between shadow-sm">
                  <span>[MOMO_SECURE_PAY] GH₵ 50.00 success payload</span>
                  <span className="text-slate-400 font-semibold">3 mins ago</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-150 flex items-center justify-between shadow-sm">
                  <span>[ARTISAN_PROFILE_CREATE] "PowerLink Electrical" registered</span>
                  <span className="text-slate-400 font-semibold">8 mins ago</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-150 flex items-center justify-between shadow-sm">
                  <span>[CLIENT_FEEDBACK_POST] Sena Adjei left 5★ review</span>
                  <span className="text-slate-400 font-semibold">14 mins ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ARTISANS MANAGE */}
      {activeSubTab === 'artisans' && (
        <div className="space-y-4 font-display" id="admin-tab-artisans">
          <h3 className="text-slate-800 font-sans text-sm font-extrabold">Verify Ghanaian Artisans Profiles ({artisanProfiles.length})</h3>
          <p className="text-xs text-slate-500 font-normal">As admin, verify technical business backgrounds or check certificates before granting the top executive green badge on-chain.</p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono tracking-wider border-b border-slate-205 text-[10px] font-bold">
                <tr>
                  <th className="p-4">Artisan Entity</th>
                  <th className="p-4">Business Specialty</th>
                  <th className="p-4">Primary Region/Town</th>
                  <th className="p-4 text-center">Current Rating</th>
                  <th className="p-4">Credentials Audit</th>
                  <th className="p-4 text-right">Verification Commands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {artisanProfiles.map((art) => {
                  const owner = profiles.find((p) => p.id === art.user_id);
                  return (
                    <tr key={art.id} className="hover:bg-slate-50/55 transition">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={owner?.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                          alt={owner?.full_name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-extrabold text-slate-800 block text-xs">{art.business_name}</span>
                          <span className="text-[10px] text-slate-450 font-bold block">Host: {owner?.full_name || 'Kwaku'}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-xs text-blue-650">
                        {art.category}
                      </td>
                      <td className="p-4 font-semibold text-xs text-slate-600">
                        {art.city}, {art.region}
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono text-orange-500 font-bold">★ {art.average_rating.toFixed(1)}</span>
                        <span className="text-[9px] text-slate-400 font-semibold block">({art.total_reviews} reviews)</span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-[10px] bg-slate-100 border border-slate-220 px-2 py-0.5 rounded text-slate-600 font-bold">
                          {art.gps_location}
                        </span>
                      </td>
                      <td className="p-4 text-right text-xs">
                        {art.verified ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-[10px] font-bold text-emerald-600 mr-2 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-150 uppercase tracking-wide">Authorized</span>
                            <button
                              onClick={() => onUnverifyArtisan(art.id)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-100 transition cursor-pointer text-[11px] font-semibold text-slate-600"
                            >
                              Revoke Status
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onVerifyArtisan(art.id)}
                            className="px-3.5 py-1.5 bg-emerald-550 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-emerald-100 transition cursor-pointer uppercase tracking-wider"
                          >
                            Approve & Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOMERS MANAGE */}
      {activeSubTab === 'customers' && (
        <div className="space-y-4 font-display" id="admin-tab-customers">
          <h3 className="text-slate-800 font-sans text-sm font-extrabold">Registered Users Directories ({profiles.length})</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/85 flex items-center justify-between gap-3 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 min-w-0 animate-fade-in">
                  <img
                    src={p.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                    alt={p.full_name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-800 truncate">{p.full_name}</h4>
                    <span className="text-[10px] text-slate-450 font-bold block truncate">{p.phone}</span>
                    <span className={`inline-block text-[9px] px-2 py-0.2 rounded font-bold uppercase font-mono mt-1 ${
                      p.role === 'admin'
                        ? 'bg-red-50 text-red-650 border border-red-100'
                        : p.role === 'artisan'
                        ? 'bg-blue-50 text-blue-650 border border-blue-100'
                        : 'bg-slate-100 text-slate-650 border border-slate-200'
                    }`}>
                      {p.role}
                    </span>
                  </div>
                </div>

                {p.role !== 'admin' && (
                  <button
                    onClick={() => onDeleteUser(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete User Credentials"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS MANAGE */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4 font-display" id="admin-tab-reviews">
          <h3 className="text-slate-800 font-sans text-sm font-extrabold">Client Evaluation Moderation Feed ({reviews.length})</h3>
          <p className="text-xs text-slate-500">Monitor consumer ratings. Delete or flag reviews that violate the community guidelines.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => {
              const targetArtisan = artisanProfiles.find((ap) => ap.id === rev.artisan_id);
              return (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-105 flex items-center justify-center text-xs font-bold uppercase font-mono shadow-sm">
                        {rev.customer_name.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800">{rev.customer_name}</h4>
                        <span className="text-[10px] text-slate-450 font-bold">Reviewing <span className="text-blue-600">{targetArtisan?.business_name}</span></span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-650 italic font-medium leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex text-orange-400 gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < rev.rating ? 'fill-orange-450 text-orange-450' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteReview(rev.id)}
                    className="p-2 bg-white border border-slate-200 rounded-xl hover:border-red-400/20 hover:text-red-655 transition shrink-0 h-fit cursor-pointer self-start"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBSCRIPTIONS AUDITING */}
      {activeSubTab === 'subscriptions' && (
        <div className="space-y-4 font-display" id="admin-tab-subscriptions">
          <h3 className="text-slate-800 font-sans text-sm font-extrabold">Network Subscription Audit Trail</h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs text-slate-705">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-205 font-bold">
                <tr>
                  <th className="p-4">Sub ID</th>
                  <th className="p-4">Artisan Entity</th>
                  <th className="p-4">Paid Tier level</th>
                  <th className="p-4">Payment Cleared</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4">Membership State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {subscriptions.map((sub) => {
                  const targetArtisan = artisanProfiles.find((ap) => ap.id === sub.artisan_id);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-mono text-slate-400 text-[10px]">
                        #{sub.id.slice(0, 8)}...
                      </td>
                      <td className="p-4 font-extrabold text-slate-800">
                        {targetArtisan?.business_name || 'Anonymous Business'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider font-mono ${
                          sub.plan === 'enterprise'
                            ? 'bg-purple-50 text-purple-650 border border-purple-100'
                            : 'bg-blue-50 text-blue-655 border border-blue-100'
                        }`}>
                          {sub.plan}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-600">
                        GH₵ {sub.price_paid.toLocaleString()}
                      </td>
                      <td className="p-4 text-xs font-mono font-semibold text-slate-500">
                        {new Date(sub.end_date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {sub.active ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-110">Active</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Expired</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

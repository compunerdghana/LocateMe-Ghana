import React from 'react';
import {
  Heart, Phone, MessageSquare, Star, Sparkles, MapPin, Award, ArrowUpRight
} from 'lucide-react';
import { Profile, ArtisanProfile, Review } from '../types';

interface CustomerDashboardProps {
  currentUser: Profile;
  artisanProfiles: ArtisanProfile[];
  reviews: Review[];
  savedFavorites: string[]; // Artisan IDs
  contactRecords: Array<{ artisanId: string; date: string; note: string }>;
  onNavigateToArtisan: (id: string) => void;
  onRemoveFavorite: (id: string) => void;
}

export default function CustomerDashboard({
  currentUser,
  artisanProfiles,
  reviews,
  savedFavorites,
  contactRecords,
  onNavigateToArtisan,
  onRemoveFavorite,
}: CustomerDashboardProps) {
  const favoriteArtisans = artisanProfiles.filter((ap) => savedFavorites.includes(ap.id));
  const myReviews = reviews.filter((r) => r.customer_id === currentUser.id);

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-8" id="customer-dashboard">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-150" id="cust-header">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm uppercase shadow-md shadow-blue-100">
            {currentUser.full_name.slice(0, 2)}
          </div>
          <div>
            <h2 className="font-sans font-extrabold text-xl text-slate-800">{currentUser.full_name}</h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Registered Customer • Location: <span className="text-blue-600">{currentUser.location}</span>
            </p>
          </div>
        </div>

        <div className="px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 font-mono font-bold tracking-wider">
          CLIENT MODULE: SAVED STATE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Saved Favorites Column */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4" id="cust-favs">
          <h3 className="text-slate-800 font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-blue-600 text-blue-600" />
            <span>Saved Favorites ({favoriteArtisans.length})</span>
          </h3>

          {favoriteArtisans.length === 0 ? (
            <div className="py-8 text-center bg-white border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-400 p-4 leading-relaxed">You haven't added any favorite artisans yet. Browse the search menu to flag favorite artisans.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteArtisans.map((artisan) => (
                <div key={artisan.id} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2.5 hover:shadow-sm transition-all">
                  <div className="min-w-0 cursor-pointer" onClick={() => onNavigateToArtisan(artisan.id)}>
                    <h4 className="text-xs font-bold text-slate-800 hover:text-blue-600 transition truncate">{artisan.business_name}</h4>
                    <span className="text-[10px] text-blue-600 font-bold block mt-0.5">{artisan.category}</span>
                    <span className="text-[9px] text-slate-400 font-semibold block truncate">{artisan.city}, {artisan.region}</span>
                  </div>

                  <button
                    onClick={() => onRemoveFavorite(artisan.id)}
                    className="p-1 px-2.5 rounded-lg text-xs bg-slate-100 text-slate-400 hover:text-red-650 hover:bg-red-50 transition cursor-pointer font-bold"
                    title="Remove from bookmarks"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact logs */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4 col-span-1 lg:col-span-2" id="cust-contacts">
          <h3 className="text-slate-800 font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Artisans Connected History ({contactRecords.length})</span>
          </h3>

          {contactRecords.length === 0 ? (
            <div className="py-8 text-center bg-white rounded-xl border border-slate-200">
              <p className="text-xs text-slate-400 leading-relaxed">You haven't initiated contact requests to any local artisans yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contactRecords.map((rec, idx) => {
                const artisan = artisanProfiles.find((ap) => ap.id === rec.artisanId);
                return (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-4 hover:shadow-sm transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-800">
                          {artisan?.business_name || 'Autonomous Mechanic Installation'}
                        </h4>
                        <span className="text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.2 rounded font-mono">
                          {artisan?.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal">Contact note: "{rec.note}"</p>
                      <span className="text-[10px] font-mono text-slate-400 block font-semibold">{new Date(rec.date).toLocaleDateString()}</span>
                    </div>

                    <button
                      onClick={() => onNavigateToArtisan(rec.artisanId)}
                      className="p-1.5 px-3 bg-slate-50 border border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 rounded-lg text-xs flex items-center gap-1 transition-all shrink-0 cursor-pointer font-bold"
                    >
                      <span>Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Logs */}
      <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4 font-display" id="cust-reviews">
        <h3 className="text-slate-800 font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>My Assessment & Feedback Logs ({myReviews.length})</span>
        </h3>

        {myReviews.length === 0 ? (
          <div className="py-8 text-center bg-white border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-400">No review ratings posted yet. When checking an artisan, submit ratings to share your experience with other customers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myReviews.map((rev) => {
              const targetArtisan = artisanProfiles.find((ap) => ap.id === rev.artisan_id);
              return (
                <div key={rev.id} className="p-4 rounded-xl bg-white border border-slate-200 flex justify-between gap-4 hover:shadow-sm transition-all">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-800">
                      {targetArtisan?.business_name || 'Local Artisan Workshop'}
                    </h4>
                    <div className="flex text-orange-400 gap-0.5" title={`${rev.rating}/5 stars`}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < rev.rating ? 'fill-orange-450 text-orange-450' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 italic font-medium pt-1">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block font-semibold">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

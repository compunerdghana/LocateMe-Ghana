import React from 'react';
import { Hammer, Github, Phone, ShieldCheck, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 text-slate-400" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 col-span-1 md:col-span-1" id="footer-logo">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
                <Hammer className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="font-sans font-bold text-white text-md">LocalServer Ghana</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The ultimate artisan marketplace inside Ghana. Promoting reliable services with certified background check verification.
            </p>
            <div className="flex items-center gap-1 text-[11px] font-mono tracking-wider text-slate-400 bg-slate-950 px-2.5 py-1 rounded w-fit border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-450" />
              GH POST GPS: GA-101-2026
            </div>
          </div>

          {/* Quick links */}
          <div id="footer-links-marketplace">
            <h3 className="text-white font-sans text-xs font-semibold tracking-wider uppercase mb-4">Marketplace</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Find Licensed Electricians
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Find Emergency Plumbers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Find Solar Technicians
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  Bespoke Carpenters
                </button>
              </li>
            </ul>
          </div>

          {/* Key Ghana Regions */}
          <div id="footer-links-regions">
            <h3 className="text-white font-sans text-xs font-semibold tracking-wider uppercase mb-4">Service Cities</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 justify-start">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Accra & Tema - Greater Accra</span>
              </li>
              <li className="flex items-center gap-1.5 justify-start">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Kumasi & Obuasi - Ashanti</span>
              </li>
              <li className="flex items-center gap-1.5 justify-start">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Takoradi & Sekondi - Western</span>
              </li>
              <li className="flex items-center gap-1.5 justify-start">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Koforidua & Nkawkaw - Eastern</span>
              </li>
            </ul>
          </div>

          {/* Support options */}
          <div id="footer-links-support">
            <h3 className="text-white font-sans text-xs font-semibold tracking-wider uppercase mb-4">Contact & Support</h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+233 30 123 4567 (Helpdesk)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@localserver.com.gh</span>
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block mb-1">Upcoming MoMo Link</span>
                <p className="text-[10px] text-slate-500">MTN MoMo, Telecel Cash & Paystack Integration Abstraction compliant.</p>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-slate-800 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4" id="footer-copyright-row">
          <p>© 2026 LocalServer Ghana. Built for reliable artisans integration. Certified by Ghana Directory Standards.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-blue-450 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-450 transition">Privacy Policy</a>
            <button
              onClick={() => onNavigate('sql')}
              className="text-blue-400 hover:text-blue-350 text-[11px] font-mono transition cursor-pointer"
            >
              Export Schema SQL
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

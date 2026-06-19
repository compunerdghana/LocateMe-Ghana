import React, { useState } from 'react';
import { CreditCard, Wallet, Smartphone, Shield, CheckCircle2, RefreshCw } from 'lucide-react';

interface MomoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (planName: string, amount: number) => void;
  planName: string;
  amount: number;
}

export default function MomoModal({
  isOpen,
  onClose,
  onSuccess,
  planName,
  amount,
}: MomoModalProps) {
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at' | 'card'>('mtn');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'pin-sent' | 'success'>('details');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate standard Ghana payment gateway integration trigger
    setTimeout(() => {
      setLoading(false);
      if (momoProvider === 'card') {
        setPaymentStep('success');
      } else {
        setPaymentStep('pin-sent');
      }
    }, 1500);
  };

  const confirmMockOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaymentStep('success');
    }, 1500);
  };

  const handleFinish = () => {
    onSuccess(planName, amount);
    onClose();
    // reset
    setPaymentStep('details');
    setPhone('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm shadow-2xl" id="momo-modal">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl relative animate-scale-up">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h3 className="font-sans font-bold text-slate-800 text-sm">Ghanaian Payment Gateway</h3>
          </div>
          {paymentStep !== 'success' && (
            <button
              id="close-momo-modal"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Summary */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Subscribing to</p>
              <h4 className="text-xs font-extrabold text-slate-800 capitalize">{planName} Plan</h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Total Charge</p>
              <h4 className="text-base font-black text-blue-600">GH₵ {amount.toLocaleString()}</h4>
            </div>
          </div>

          {paymentStep === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Payment Methods Choice */}
              <div>
                <label className="text-xs text-slate-600 font-bold block mb-2 font-display">Select Payment Channel</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setMomoProvider('mtn')}
                    className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      momoProvider === 'mtn'
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50/80'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">MTN MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMomoProvider('telecel')}
                    className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      momoProvider === 'telecel'
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50/80'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">Telecel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMomoProvider('at')}
                    className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      momoProvider === 'at'
                        ? 'border-blue-400 bg-blue-50 text-blue-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50/80'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">AT Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMomoProvider('card')}
                    className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      momoProvider === 'card'
                        ? 'border-emerald-450 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50/80'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">Debit Card</span>
                  </button>
                </div>
              </div>

              {/* Provider Inputs */}
              {momoProvider !== 'card' ? (
                <div>
                  <label className="text-xs text-slate-600 font-bold block mb-1.5 font-display">Mobile Money Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">+233</span>
                    <input
                      required
                      type="tel"
                      placeholder="54 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-14 pr-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Provide registered mobile wallet phone number.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-600 font-bold block mb-1.5 font-display">Card Number</label>
                    <input
                      required
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 font-bold block mb-1.5 font-display">Expiry Date</label>
                      <input
                        required
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 font-bold block mb-1.5 font-display">CVV Code</label>
                      <input
                        required
                        type="text"
                        placeholder="321"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Secure guarantee */}
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-semibold py-1">
                <Shield className="w-4 h-4 text-emerald-550" />
                <span>Secured in partnership with Paystack Standards</span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all focus:outline-none shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Secure Connection...</span>
                  </>
                ) : (
                  <span>Secure Pay GH₵ {amount.toLocaleString()}</span>
                )}
              </button>
            </form>
          )}

          {paymentStep === 'pin-sent' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-105 flex items-center justify-center mx-auto text-blue-600 animate-pulse animate-bounce">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-800 font-sans font-bold text-sm">USSD Prompt Transmitted</h4>
                <p className="text-xs text-slate-500 px-4 mt-1 leading-relaxed">
                  We have simulated transmitting an authorization prompt to your phone. Check your screen, enter your wallet PIN and authorize this payment.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 max-w-xs mx-auto text-xs text-slate-600 tracking-wide font-mono font-semibold">
                {momoProvider === 'mtn' && '*170# -> Approve'}
                {momoProvider === 'telecel' && '*110# -> Transaction Approval'}
                {momoProvider === 'at' && '*110# -> Approve transaction'}
              </div>

              <button
                onClick={confirmMockOtp}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-650 hover:bg-blue-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider font-mono shadow-md shadow-blue-100 transition duration-200 cursor-pointer"
              >
                {loading ? 'Confirming Wallet Deposit...' : 'Authorize Simulation Key'}
              </button>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-slate-800 font-sans font-bold text-md">Payment Verified Successfully</h4>
                <p className="text-xs text-slate-500 px-4 mt-1">
                  Your transaction has been approved on-chain. Your {planName} plan is now fully activated.
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition cursor-pointer"
              >
                Close & Proceed to Account Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

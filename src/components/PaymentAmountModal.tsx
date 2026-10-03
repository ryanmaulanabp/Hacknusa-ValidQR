'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/LanguageContext';
import { ScanResponse, QrPayload } from '@/lib/types';
import {
  X,
  ShieldCheck,
  Wallet,
  AlertCircle,
  Lock,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface PaymentAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: ScanResponse | null;
  payload: QrPayload | null;
  onPaymentSuccess: (amount: number, txId: string) => void;
}

export default function PaymentAmountModal({
  isOpen,
  onClose,
  response,
  payload,
  onPaymentSuccess,
}: PaymentAmountModalProps) {
  const { t, balance, deductBalance, isDarkMode, isEnglish } = useApp();
  const [amount, setAmount] = useState<number>(35000);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    if (response?.qr_type === 'DINAMIS' && response?.transaction_amount) {
      setAmount(Number(response.transaction_amount));
    } else {
      setAmount(35000);
    }
  }, [response]);

  if (!isOpen || !response) return null;

  const isDynamicLocked = response.qr_type === 'DINAMIS' && !!response.transaction_amount;
  const quickAmounts = [10000, 25000, 50000, 100000];
  const remainingBalance = balance - amount;
  const isInsufficient = remainingBalance < 0;

  const merchantDisplayName =
    response.scanned_name || payload?.merchantName || 'Merchant ValidQR';

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat(isEnglish ? 'en-US' : 'id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw, 10);
    setAmount(isNaN(num) ? 0 : num);
  };

  const handleQuickSelect = (val: number) => {
    setAmount(val);
  };

  const handleExactBalance = () => {
    setAmount(balance);
  };

  const handleOpenPin = () => {
    if (amount <= 0 || isInsufficient) return;
    setPin('');
    setPinError(null);
    setShowPinModal(true);
  };

  const handlePinKeyClick = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 6) {
        submitPayment(nextPin);
      }
    }
  };

  const handlePinBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const submitPayment = (enteredPin: string) => {
    setIsSubmitting(true);
    setPinError(null);

    // Simulate fast PIN verification
    setTimeout(() => {
      const success = deductBalance(amount, merchantDisplayName, response.nmid);
      if (success) {
        setIsSubmitting(false);
        setShowPinModal(false);
        const txId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
        onPaymentSuccess(amount, txId);
      } else {
        setIsSubmitting(false);
        setPinError(t('err_insufficient_balance'));
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0B0D1B] rounded-t-3xl sm:rounded-3xl border border-white/10 text-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200 max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold">{t('page_input_nominal')}</h2>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              ValidQR Protected
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* Merchant Recipient Banner */}
          <div className="p-3.5 rounded-2xl bg-[#141728] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-white font-bold text-sm">
                QR
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  {merchantDisplayName}
                </h4>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  NMID: {response.nmid} • {response.merchant_city || 'BANDUNG'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {isEnglish ? 'Official' : 'Resmi'}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="p-4 rounded-2xl bg-[#181B2F] border border-white/10 text-center">
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              {t('label_nominal_input')}
            </label>

            <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-white">
              <span className="text-indigo-400 text-lg">Rp</span>
              <input
                type="text"
                value={amount > 0 ? amount.toLocaleString(isEnglish ? 'en-US' : 'id-ID') : ''}
                onChange={handleAmountInputChange}
                disabled={isDynamicLocked}
                placeholder="0"
                className={`w-48 bg-transparent text-center text-white font-extrabold text-2xl focus:outline-none ${
                  isDynamicLocked ? 'cursor-not-allowed opacity-90' : ''
                }`}
              />
            </div>

            {/* Quick Amount Chips */}
            {isDynamicLocked ? (
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  {t('dynamic_locked_amount_chip')}
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                {quickAmounts.map(val => (
                  <button
                    key={val}
                    onClick={() => handleQuickSelect(val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      amount === val
                        ? 'bg-[#6C5CE7] text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {formatRupiah(val)}
                  </button>
                ))}

                <button
                  onClick={handleExactBalance}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40"
                >
                  {t('chip_exact_balance')}
                </button>
              </div>
            )}
          </div>

          {/* Balance Calculation Table */}
          <div className="p-4 rounded-2xl bg-[#141728] border border-white/10 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                {t('row_wallet_balance')}
              </span>
              <span className="font-bold text-white">{formatRupiah(balance)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>{t('row_payment_amount')}</span>
              <span className="font-bold text-indigo-400">{formatRupiah(amount)}</span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="font-semibold text-slate-300">{t('row_remaining_balance')}</span>
              <span
                className={`font-extrabold ${
                  isInsufficient ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {formatRupiah(remainingBalance)}
              </span>
            </div>

            {isInsufficient && (
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t('err_insufficient_balance')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-[#0A0D1A] border-t border-white/10">
          <button
            onClick={handleOpenPin}
            disabled={amount <= 0 || isInsufficient}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              amount <= 0 || isInsufficient
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#6C5CE7] to-[#8E7BFD] hover:opacity-95 text-white active:scale-[0.98]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{t('btn_confirm_pay')}</span>
          </button>
        </div>

        {/* PIN Authentication Bottom Sheet Modal */}
        {showPinModal && (
          <div className="absolute inset-0 bg-[#0B0D1B] z-50 flex flex-col justify-between p-6 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">{t('pin_security_header')}</span>
              <button
                onClick={() => setShowPinModal(false)}
                className="p-1.5 rounded-full bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center my-4">
              <h3 className="text-lg font-bold text-white">{t('pin_title')}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('pin_sub_prefix')} <span className="text-indigo-400 font-bold">{formatRupiah(amount)}</span> {t('pin_sub_to')}{' '}
                <span className="text-white font-semibold">{merchantDisplayName}</span>
              </p>

              {/* 6 Dots */}
              <div className="flex items-center justify-center gap-3 my-6">
                {[0, 1, 2, 3, 4, 5].map(idx => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all ${
                      pin.length > idx
                        ? 'bg-[#6C5CE7] scale-110 shadow-lg shadow-indigo-500/50'
                        : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>

              {pinError && (
                <div className="text-xs text-rose-400 font-medium">{pinError}</div>
              )}

              {isSubmitting && (
                <div className="flex items-center justify-center gap-2 text-xs text-indigo-400 mt-2">
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>{t('verifying_transaction')}</span>
                </div>
              )}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto w-full mb-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  onClick={() => handlePinKeyClick(num)}
                  disabled={isSubmitting}
                  className="py-3 rounded-2xl bg-[#181B2F] hover:bg-[#222744] text-white text-xl font-bold transition-all active:scale-90 shadow-sm"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handlePinKeyClick('0')}
                disabled={isSubmitting}
                className="py-3 rounded-2xl bg-[#181B2F] hover:bg-[#222744] text-white text-xl font-bold transition-all active:scale-90 shadow-sm"
              >
                0
              </button>
              <button
                onClick={handlePinBackspace}
                disabled={isSubmitting}
                className="py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold flex items-center justify-center transition-all active:scale-90"
              >
                ⌫
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

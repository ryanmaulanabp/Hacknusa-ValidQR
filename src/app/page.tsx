'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/LanguageContext';
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import BalanceCard from '@/components/BalanceCard';
import ValidQrShield from '@/components/ValidQrShield';
import QuickServicesGrid from '@/components/QuickServicesGrid';
import PromoBanner from '@/components/PromoBanner';
import RecentTransactions from '@/components/RecentTransactions';
import DesktopCompanionWidgets from '@/components/DesktopCompanionWidgets';
import BottomNav from '@/components/BottomNav';
import ScannerModal from '@/components/ScannerModal';
import VerificationPopup from '@/components/VerificationPopup';
import PaymentAmountModal from '@/components/PaymentAmountModal';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import { ScanResponse, QrPayload } from '@/lib/types';
import { DEMO_PRESETS, SELARU_LAT, SELARU_LON } from '@/lib/mockData';
import {
  Wallet,
  ShieldCheck,
  Lock,
  Globe,
  Sun,
  Moon,
  ExternalLink,
  Store,
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldBan,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

function MainAppContent() {
  const {
    t,
    isDarkMode,
    balance,
    isEnglish,
    toggleLanguage,
    toggleTheme,
    transactions,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'wallet' | 'history' | 'profile'>('home');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResponse, setScanResponse] = useState<ScanResponse | null>(null);
  const [qrPayload, setQrPayload] = useState<QrPayload | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isAmountModalOpen, setIsAmountModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successAmount, setSuccessAmount] = useState<number>(0);
  const [successTxId, setSuccessTxId] = useState<string>('');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleScanComplete = (res: ScanResponse, payload: QrPayload) => {
    setIsScannerOpen(false);
    setScanResponse(res);
    setQrPayload(payload);
    setIsVerificationOpen(true);
  };

  const handleProceedToPayment = () => {
    setIsVerificationOpen(false);
    setIsAmountModalOpen(true);
  };

  const handlePaymentSuccess = (amt: number, txId: string) => {
    setIsAmountModalOpen(false);
    setSuccessAmount(amt);
    setSuccessTxId(txId);
    setIsSuccessModalOpen(true);
  };

  // Run a quick preset directly from the desktop companion widget
  const handleRunPreset = async (preset: any) => {
    try {
      const userLat = preset.userLat ?? SELARU_LAT;
      const userLon = preset.userLon ?? SELARU_LON;
      const payloadToSend = {
        nmid: preset.nmid,
        name: preset.merchantName,
        rawPayload: preset.rawPayload,
        latitude: userLat,
        longitude: userLon,
      };

      const res = await fetch('/api/v1/verify/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSend),
      });

      const data: ScanResponse = await res.json();
      const parsed: QrPayload = {
        nmid: preset.nmid,
        merchantName: preset.merchantName,
        merchantCity: preset.city,
        rawPayload: preset.rawPayload,
      };

      setScanResponse(data);
      setQrPayload(parsed);
      setIsVerificationOpen(true);
    } catch (err: any) {
      alert(`Error running preset: ${err.message}`);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isDarkMode ? 'bg-[#070913] text-slate-100' : 'bg-[#F4F6FB] text-slate-900'
      }`}
    >
      {/* Responsive Top Navigation Bar */}
      <ResponsiveNavbar
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        onScanClick={() => setIsScannerOpen(true)}
      />

      {/* Main Container: Full Width Responsive Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left / Main Section */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* Balance Card */}
              <BalanceCard onOpenHistory={() => setActiveTab('history')} />

              {/* ValidQR Shield Status Card */}
              <ValidQrShield onInfoClick={() => setIsScannerOpen(true)} />

              {/* 8 Quick Services */}
              <div
                className={`p-5 rounded-3xl border transition-all ${
                  isDarkMode
                    ? 'bg-[#101424] border-white/10'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <QuickServicesGrid />
              </div>

              {/* Promo Banner */}
              <PromoBanner />

              {/* On Mobile Screens: Show Recent Transactions here */}
              <div className="lg:hidden">
                <RecentTransactions onSeeAll={() => setActiveTab('history')} />
              </div>
            </div>

            {/* Right Section (Desktop View) */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 space-y-6">
              {/* Virtual Card & Test Presets */}
              <DesktopCompanionWidgets
                onRunPreset={handleRunPreset}
                onOpenScanner={() => setIsScannerOpen(true)}
              />

              {/* Recent Transactions List */}
              <div
                className={`p-5 rounded-3xl border transition-all ${
                  isDarkMode
                    ? 'bg-[#101424] border-white/10'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <RecentTransactions onSeeAll={() => setActiveTab('history')} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WALLET */}
        {activeTab === 'wallet' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold">{t('nav_wallet')}</h1>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
                NusaPay Platinum Tier
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Virtual Card Graphic */}
              <div className="rounded-3xl p-6 bg-gradient-to-tr from-[#3B5998] via-[#503EBD] to-[#8E7BFD] text-white shadow-2xl relative overflow-hidden space-y-8">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold tracking-widest text-sm">NUSAPAY</span>
                  <ShieldCheck className="w-6 h-6 text-emerald-300" />
                </div>

                <div>
                  <span className="text-xs text-white/70 block uppercase tracking-wider">
                    Nomor Kartu Virtual
                  </span>
                  <div className="text-xl font-mono tracking-widest font-bold mt-1">
                    4806 •••• •••• 2026
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-white/70 uppercase">Pemilik Rekening</span>
                    <div className="text-sm font-bold tracking-wide">RYAN MAULANA</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/70 uppercase">Saldo Aktif</span>
                    <div className="text-lg font-extrabold text-white">{formatRupiah(balance)}</div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div
                className={`p-6 rounded-3xl border space-y-4 ${
                  isDarkMode
                    ? 'bg-[#101424] border-white/10'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fitur Keamanan Dompet Digital
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold">ValidQR Anti-Fraud Engine</span>
                    </div>
                    <span className="text-emerald-400 font-bold">AKTIF</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold">PIN & Autentikasi 6-Digit</span>
                    </div>
                    <span className="text-indigo-400 font-bold">TERPASANG</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span className="font-semibold">GPS Geofencing Guard</span>
                    </div>
                    <span className="text-sky-400 font-bold">15 METER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold">{t('nav_history')}</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daftar transaksi dan log pemindaian QRIS NusaPay
                </p>
              </div>

              <Link
                href="/history"
                className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 font-bold text-xs border border-indigo-500/30 flex items-center gap-1.5 transition-colors"
              >
                <span>Buka Audit Log Lengkap</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {transactions.map(tx => (
                <div
                  key={tx.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isDarkMode
                      ? tx.status === 'BLOCKED'
                        ? 'bg-[#1C0E10] border-rose-600/30'
                        : 'bg-[#101424] border-white/5'
                      : tx.status === 'BLOCKED'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        tx.status === 'BLOCKED'
                          ? 'bg-rose-500/20 text-rose-400'
                          : tx.type === 'credit'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {tx.status === 'BLOCKED' ? (
                        <ShieldBan className="w-5 h-5" />
                      ) : tx.type === 'credit' ? (
                        '+'
                      ) : (
                        'QR'
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-sm">{tx.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {tx.date} • {tx.category}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">ID: {tx.id}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-bold text-sm ${
                        tx.status === 'BLOCKED'
                          ? 'text-rose-400 line-through'
                          : tx.type === 'credit'
                          ? 'text-emerald-400'
                          : isDarkMode
                          ? 'text-white'
                          : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'credit' ? `+ ${formatRupiah(tx.amount)}` : `- ${formatRupiah(tx.amount)}`}
                    </div>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border ${
                        tx.status === 'BLOCKED'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-extrabold">{t('nav_profile')}</h1>

            {/* Profile Card */}
            <div
              className={`p-6 rounded-3xl border flex items-center gap-5 ${
                isDarkMode
                  ? 'bg-[#101424] border-white/10'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] p-[2px] shadow-lg shadow-indigo-600/30">
                <div className="w-full h-full rounded-[14px] bg-[#181B2F] flex items-center justify-center font-black text-white text-xl">
                  RM
                </div>
              </div>

              <div>
                <h2 className="text-lg font-extrabold">Ryan Maulana</h2>
                <div className="text-xs text-indigo-400 font-bold">NusaPay Platinum Tier</div>
                <div className="text-xs text-slate-400 mt-1">+62 812-3456-7890 • ryan@nusapay.id</div>
              </div>
            </div>

            {/* Settings Menu */}
            <div
              className={`p-6 rounded-3xl border space-y-3 ${
                isDarkMode
                  ? 'bg-[#101424] border-white/10'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Pengaturan Akun & Tampilan
              </h3>

              {/* Language Switch */}
              <div
                onClick={toggleLanguage}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-semibold">Bahasa / Language</span>
                </div>
                <span className="text-xs font-bold text-indigo-400">
                  {isEnglish ? 'English (EN)' : 'Bahasa Indonesia (ID)'}
                </span>
              </div>

              {/* Theme Toggle */}
              <div
                onClick={toggleTheme}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  <span className="text-xs font-semibold">Mode Tampilan</span>
                </div>
                <span className="text-xs font-bold text-slate-300">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>

              {/* Merchant Portal Link */}
              <Link
                href="/merchant-portal"
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold">Merchant Portal (Admin & Stiker QRIS)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Bar (Mobile Only: md:hidden) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        onScanClick={() => setIsScannerOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Camera / Gallery QR Scanner */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {/* 2. 3-Layer Sequential Verification Popup */}
      <VerificationPopup
        isOpen={isVerificationOpen}
        response={scanResponse}
        payload={qrPayload}
        onClose={() => setIsVerificationOpen(false)}
        onProceed={handleProceedToPayment}
      />

      {/* 3. Payment Nominal Amount Input */}
      <PaymentAmountModal
        isOpen={isAmountModalOpen}
        response={scanResponse}
        payload={qrPayload}
        onClose={() => setIsAmountModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 4. Payment Success Celebration & Receipt */}
      <PaymentSuccessModal
        isOpen={isSuccessModalOpen}
        response={scanResponse}
        amount={successAmount}
        txId={successTxId}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setActiveTab('home');
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

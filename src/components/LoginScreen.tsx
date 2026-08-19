import React, { useState } from "react";
import { ShieldCheck, Lock, User, LogIn, Eye, EyeOff, Sparkles, KeyRound, AlertCircle } from "lucide-react";
import { LogoBangli, LogoBali } from "./Logos";

interface LoginScreenProps {
  onLogin: (user: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Masukkan ID Pengguna / NIK / Nama Akses.");
      return;
    }
    if (!password.trim()) {
      setError("Masukkan Kata Sandi akses.");
      return;
    }

    setIsLoading(true);

    // Simulate quick authentication check
    setTimeout(() => {
      setIsLoading(false);
      // Valid login logic
      onLogin(username.trim());
    }, 400);
  };

  const handleQuickLogin = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#1a3a3a_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Top Header Branding Card */}
        <div className="bg-[#1a3a3a] text-white p-6 sm:p-8 rounded-t-2xl border-b-4 border-[#d4af37] shadow-xl text-center space-y-3 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-40 h-40 text-[#d4af37]" />
          </div>

          <div className="mx-auto inline-flex items-center gap-3 bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border-2 border-[#d4af37] shadow-lg">
            <div className="relative group cursor-pointer" title="Lambang Kabupaten Bangli">
              <LogoBangli className="w-12 h-14 transition-transform group-hover:scale-105 filter drop-shadow-md" />
            </div>
            <div className="h-10 w-[1px] bg-white/20" />
            <div className="relative group cursor-pointer" title="Lambang Provinsi Bali">
              <LogoBali className="w-12 h-14 transition-transform group-hover:scale-105 filter drop-shadow-md" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-[#d4af37] px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              SISTEM KOLABORASI TUNGGAKAN PKB
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
              Bersama Pemerintahan Desa
            </h1>
            <p className="text-slate-300 text-xs leading-relaxed max-w-xs mx-auto">
              Kabupaten Bangli • Provinsi Bali
            </p>
          </div>
        </div>

        {/* Login Form Body */}
        <div className="bg-white p-6 sm:p-8 rounded-b-2xl border-x border-b border-slate-200 shadow-xl space-y-6">
          
          <div className="text-center space-y-1">
            <h2 className="text-base font-extrabold text-slate-800 font-display uppercase tracking-wide">
              Masuk ke Dashboard
            </h2>
            <p className="text-xs text-slate-500">
              Silakan masukkan ID Pengguna dan Kata Sandi Anda
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / ID Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                ID Pengguna / User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-[#1a3a3a]" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Contoh: admin / user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#1a3a3a] focus:ring-1 focus:ring-[#1a3a3a] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all placeholder-slate-400"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kata Sandi / Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-[#1a3a3a]" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#1a3a3a] focus:ring-1 focus:ring-[#1a3a3a] rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none transition-all placeholder-slate-400"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a3a3a] hover:bg-[#d4af37] text-white hover:text-[#1a3a3a] font-extrabold py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-display active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses Login...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Sistem</span>
                </>
              )}
            </button>
          </form>

          {/* Helper Preset Login Card */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1 text-slate-600 font-bold">
                <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
                Akses Cepat Demo:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin", "bangli2026")}
                className="bg-slate-50 hover:bg-[#1a3a3a] hover:text-[#d4af37] border border-slate-200 text-slate-700 p-2 rounded-lg text-left transition-all cursor-pointer font-mono"
              >
                <div className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Akses Administrator</div>
                <div className="text-[11px] font-bold">ID: admin</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("petugas", "bangli2026")}
                className="bg-slate-50 hover:bg-[#1a3a3a] hover:text-[#d4af37] border border-slate-200 text-slate-700 p-2 rounded-lg text-left transition-all cursor-pointer font-mono"
              >
                <div className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Akses Petugas/Warga</div>
                <div className="text-[11px] font-bold">ID: petugas</div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          © 2026 Pemerintah Kabupaten Bangli — Sistem Informasi Jejaring Kadus
        </p>

      </div>
    </div>
  );
}

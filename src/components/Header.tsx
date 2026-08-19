import React from "react";
import { Phone, Users, ShieldCheck, Sparkles, LogOut, UserCheck } from "lucide-react";
import { LogoBangli, LogoBali } from "./Logos";

interface HeaderProps {
  totalCount: number;
  favoriteCount: number;
  onOpenAddModal: () => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (fav: boolean) => void;
  currentUser?: string;
  onLogout?: () => void;
}

export default function Header({
  totalCount,
  favoriteCount,
  onOpenAddModal,
  showFavoritesOnly,
  setShowFavoritesOnly,
  currentUser,
  onLogout,
}: HeaderProps) {
  return (
    <header className="relative bg-[#1a3a3a] text-white overflow-hidden border-b-4 border-[#d4af37] shadow-lg min-h-[180px]">
      {/* Background Image: Danau Batur, Gunung Batur & Candi Bentar Bali */}
      <img
        src="/src/assets/images/batur_candi_header_1785389789744.jpg"
        alt="Pemandangan Danau Batur, Gunung Batur, dan Candi Bentar Bali"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Elegant Gradient Dark Overlay to preserve text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a3a]/95 via-[#1a3a3a]/80 to-[#1a3a3a]/95 pointer-events-none" />

      {/* Subtle background lines for Geometric styling */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff),linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff)] bg-[size:30px_30px] bg-[position:0_0,15px_15px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* Logo / Brand Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border-2 border-[#d4af37] shadow-xl shrink-0 flex items-center gap-2.5">
              <div className="relative group cursor-pointer" title="Lambang Resmi Kabupaten Bangli">
                <LogoBangli className="w-12 h-14 sm:w-14 sm:h-16 transition-transform group-hover:scale-105 filter drop-shadow-md" />
              </div>
              <div className="h-10 w-[1px] bg-white/25" />
              <div className="relative group cursor-pointer" title="Lambang Resmi Provinsi Bali">
                <LogoBali className="w-12 h-14 sm:w-14 sm:h-16 transition-transform group-hover:scale-105 filter drop-shadow-md" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xs border border-white/20 text-[#d4af37] px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-widest uppercase font-display shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                SISTEM INFORMASI BERSAMA
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight leading-none text-white drop-shadow-sm">
                Bersama Pemerintahan Desa <span className="text-[#d4af37]">Kab. Bangli</span>
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm max-w-xl font-normal leading-relaxed drop-shadow-xs">
                Pusat data kontak Kelian Banjar Dinas sewilayah Danau & Gunung Batur, Bangli, Bali. Membantu koordinasi kemasyarakatan yang tertata, dinamis, dan inklusif.
              </p>
            </div>
          </div>

          {/* Quick Stats & Actions with geometric styling */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            
            {/* Total Kadus box */}
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3">
              <div className="p-1.5 bg-white/15 text-[#d4af37] rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TOTAL KADUS</div>
                <div className="text-lg font-black text-white font-display leading-tight">{totalCount}</div>
              </div>
            </div>

            {/* Favorite toggle button */}
            <button
              id="toggle-fav-btn"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`transition-all duration-200 border px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer ${
                showFavoritesOnly
                  ? "bg-[#d4af37] border-[#d4af37] text-[#1a3a3a] shadow-md shadow-[#d4af37]/20 font-bold"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${showFavoritesOnly ? "bg-[#1a3a3a]/10" : "bg-white/10"}`}>
                <Phone className={`w-3.5 h-3.5 ${showFavoritesOnly ? "text-[#1a3a3a]" : "text-[#d4af37]"}`} />
              </div>
              <div className="text-left">
                <div className={`text-[10px] ${showFavoritesOnly ? "text-[#1a3a3a]/80" : "text-slate-400"} font-bold uppercase tracking-wider`}>FAVORIT</div>
                <div className="text-base font-black font-display leading-tight">{favoriteCount}</div>
              </div>
            </button>

            {/* Saran Kadus button */}
            <button
              id="header-add-button"
              onClick={onOpenAddModal}
              className="bg-white hover:bg-slate-100 text-[#1a3a3a] px-3.5 py-3 rounded-xl font-bold shadow-md active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-display border border-transparent"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              Tambah Kadus
            </button>

            {/* Logout Button */}
            {onLogout && (
              <button
                id="header-logout-button"
                onClick={onLogout}
                className="bg-red-500/20 hover:bg-red-600 text-red-100 hover:text-white px-3.5 py-3 rounded-xl font-bold border border-red-400/40 shadow-md active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-display"
                title="Keluar dari Sistem (Logout)"
              >
                <LogOut className="w-4 h-4 text-red-300" />
                <span>Keluar</span>
              </button>
            )}

          </div>
        </div>

        {/* Local indicator bar */}
        <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-[#d4af37] animate-ping inline-block" />
            <span className="font-semibold text-slate-200">SISTEM KOLABORASI TUNGGAKAN PKB</span>
            {currentUser && (
              <span className="ml-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                USER: {currentUser}
              </span>
            )}
          </div>
          <div className="font-mono bg-white/5 px-2 py-0.5 rounded text-xs text-[#d4af37] font-semibold border border-white/5 uppercase tracking-wider">
            Provinsi Bali • Indonesia
          </div>
        </div>
      </div>
    </header>
  );
}

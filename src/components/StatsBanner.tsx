import React from "react";
import { Layers, MapPin, BarChart3, HelpCircle, FileText, ExternalLink } from "lucide-react";

interface StatsBannerProps {
  distribution: {
    Bangli: number;
    Kintamani: number;
    Tembuku: number;
    Susut: number;
    total: number;
  };
  activeKecamatan: string;
  onSelectKecamatan: (kec: string) => void;
}

export default function StatsBanner({
  distribution,
  activeKecamatan,
  onSelectKecamatan,
}: StatsBannerProps) {
  const regions = [
    {
      name: "Bangli",
      color: "bg-[#1a3a3a]",
      accentBg: "bg-slate-50",
      textColor: "text-[#1a3a3a]",
      borderColor: "border-slate-200",
      desc: "Kota Administrasi & Pelayanan Publik",
      icon: "🏢",
    },
    {
      name: "Kintamani",
      color: "bg-[#1a3a3a]",
      accentBg: "bg-slate-50",
      textColor: "text-[#1a3a3a]",
      borderColor: "border-slate-200",
      desc: "Kawasan Lereng Gunung & Pariwisata Danau",
      icon: "🌋",
    },
    {
      name: "Tembuku",
      color: "bg-[#1a3a3a]",
      accentBg: "bg-slate-50",
      textColor: "text-[#1a3a3a]",
      borderColor: "border-slate-200",
      desc: "Wilayah Hijau & Desa Adat Tradisional",
      icon: "🌾",
    },
    {
      name: "Susut",
      color: "bg-[#1a3a3a]",
      accentBg: "bg-slate-50",
      textColor: "text-[#1a3a3a]",
      borderColor: "border-slate-200",
      desc: "Pertanian Makmur & Lembah Sungai Indah",
      icon: "🌊",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Interactive subdistrict distribution selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {regions.map((region) => {
          const count = distribution[region.name as keyof typeof distribution] || 0;
          const percentage = ((count / (distribution.total || 1)) * 100).toFixed(1);
          const isSelected = activeKecamatan.toLowerCase() === region.name.toLowerCase();

          return (
            <button
              id={`kec-stats-btn-${region.name.toLowerCase()}`}
              key={region.name}
              onClick={() => onSelectKecamatan(region.name)}
              className={`text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? `bg-white shadow-md border-l-4 border-l-[#d4af37] border-[#1a3a3a] scale-[1.02] z-10 ring-2 ring-[#d4af37]/25`
                  : `bg-white border-slate-200 border-l-4 border-l-[#1a3a3a] hover:border-r-[#d4af37] hover:border-b-[#d4af37] hover:bg-slate-50/50 shadow-xs hover:shadow-md`
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xl">{region.icon}</span>
                <span className="text-[9px] font-mono font-bold bg-[#1a3a3a] text-[#d4af37] px-2 py-0.5 rounded">
                  {percentage}%
                </span>
              </div>

              <h4 className="font-extrabold text-slate-900 font-display text-sm uppercase tracking-wide">
                Kec. {region.name}
              </h4>
              <p className="text-[10px] text-slate-500 line-clamp-1 mb-4">{region.desc}</p>

              <div className="flex items-baseline gap-1.5 pt-1 border-t border-slate-100">
                <span className="text-2xl font-black text-[#1a3a3a] font-display">{count}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">
                  KELIAN WILAYAH
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mini Info Panel showing help and guidelines */}
      <div className="bg-white border-y-4 border-[#1a3a3a] border-x border-x-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-[#1a3a3a] text-[#d4af37] rounded-lg shrink-0 mt-0.5 border border-[#d4af37]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#1a3a3a] font-display text-sm sm:text-base leading-tight uppercase tracking-wide">
              Mengenal Peran Kepala Dusun / Kelian Banjar Dinas
            </h4>
            <p className="text-xs sm:text-xs text-slate-650 mt-1 max-w-4xl leading-relaxed">
              Kelian Banjar Dinas merupakan garda terdepan pelayanan publik kependudukan adat maupun dinas di Bali. Bertugas memantau perkembangan warga serta verifikasi pengantar administrasi desa. Format pesan telah disesuaikan agar santun dengan menyertakan salam pembuka dan ucapan penutup tradisional Bali.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <a
            href="https://banglikab.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-[#d4af37] bg-[#1a3a3a] hover:bg-[#d4af37] hover:text-[#1a3a3a] px-3.5 py-2.5 rounded-lg inline-flex items-center gap-1.5 transition-all uppercase tracking-wider border-l-2 border-l-[#d4af37] shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Portal Hubungan Bangli
          </a>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Phone, Copy, Check, Star, MapPin, Globe, Sparkles } from "lucide-react";
import { Kadus } from "../data/kadusData";

interface KadusCardProps {
  kadus: Kadus;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectSendMessage: (kadus: Kadus) => void;
  onDeleteCustom?: (id: string) => void;
}

export default function KadusCard({
  kadus,
  isFavorite,
  onToggleFavorite,
  onSelectSendMessage,
  onDeleteCustom,
}: KadusCardProps) {
  const [copied, setCopied] = useState(false);

  // Helper formatting for dynamic avatar color & initials
  const getInitials = (nameString: string) => {
    const raw = nameString.replace(/^(I |IDA |A.A |O |COKODA |PANDE |NGAKAN |I.B. )/i, "").trim();
    const parts = raw.split(" ").filter((p) => p !== "");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0]?.[0] || nameString[0] || "?").toUpperCase();
  };

  const getThemeColor = (kecamatan: string) => {
    switch (kecamatan.toLowerCase()) {
      case "bangli":
        return {
          bg: "bg-slate-50 text-slate-800",
          border: "border-[#d4af37]",
          accent: "text-[#1a3a3a]",
          badgeBg: "bg-[#1a3a3a] border-[#d4af37]/40 text-[#d4af37]",
          avatarBg: "bg-[#1a3a3a] text-[#d4af37] border border-[#d4af37]/30",
        };
      case "kintamani":
        return {
          bg: "bg-slate-50 text-slate-800",
          border: "border-slate-300",
          accent: "text-slate-700",
          badgeBg: "bg-slate-800 border-slate-700 text-slate-200",
          avatarBg: "bg-slate-800 text-slate-200 border border-slate-700",
        };
      case "tembuku":
        return {
          bg: "bg-slate-50 text-slate-800",
          border: "border-slate-300",
          accent: "text-slate-700",
          badgeBg: "bg-slate-700 border-slate-600 text-slate-200",
          avatarBg: "bg-slate-700 text-slate-200 border border-slate-650",
        };
      case "susut":
        return {
          bg: "bg-slate-50 text-slate-800",
          border: "border-slate-300",
          accent: "text-slate-700",
          badgeBg: "bg-slate-600 border-slate-500 text-slate-200",
          avatarBg: "bg-slate-600 text-slate-200 border border-slate-550",
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-800",
          border: "border-slate-300",
          accent: "text-slate-750",
          badgeBg: "bg-[#1a3a3a] border-slate-750 text-white",
          avatarBg: "bg-[#1a3a3a] text-white",
        };
    }
  };

  const theme = getThemeColor(kadus.kecamatan);

  // Polishing phone numbers for neat local display, e.g. "0878-4127-8877"
  const formatPhoneNumberForDisplay = (num: string) => {
    let clean = num.replace(/\s/g, "");
    if (clean.length === 12) {
      return `${clean.substring(0, 4)}-${clean.substring(4, 8)}-${clean.substring(8)}`;
    }
    return clean;
  };

  // Raw helper copy of contact details
  const copyToClipboard = () => {
    const textToCopy = `Nama: ${kadus.nama}\nDesa: ${kadus.desa}\nKecamatan: ${kadus.kecamatan}\nAlamat/Banjar: ${kadus.alamat}\nWhatsApp: ${kadus.wa}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Pre-compiled direct WhatsApp link
  const cleanPhone = kadus.wa.replace(/\s/g, "").replace(/-/g, "");
  let formatWa = cleanPhone;
  if (formatWa.startsWith("0")) {
    formatWa = "62" + formatWa.substring(1);
  }
  const defaultText = `Swastyastu / Halo Pak Kadus ${kadus.nama} dari ${kadus.desa}, saya warga yang ingin berkoordinasi terkait urusan Banjar Dinas ${kadus.alamat}.`;
  const waLink = `https://wa.me/${formatWa}?text=${encodeURIComponent(defaultText)}`;

  // Filter if name signifies it's "Kosong" (Some fields say "Kosong (Kedui)")
  const isVacant = kadus.nama.toLowerCase().includes("kosong");

  return (
    <div
      className={`bg-white border relative shadow-xs hover:shadow-md hover:border-[#d4af37] transition-all duration-200 overflow-hidden flex flex-col h-full group ${
        isFavorite
          ? "border-[#d4af37] ring-1 ring-[#d4af37]/25 bg-amber-500/[0.02]"
          : "border-slate-200"
      } rounded-xl border-l-[6px] border-l-[#1a3a3a]`}
    >
      {/* Card Ribbon / Header Tag */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2.5 bg-slate-50/70 group-hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border leading-none shrink-0 ${theme.badgeBg}`}>
            {kadus.kecamatan}
          </span>
          <span className="text-[10px] text-slate-550 font-extrabold tracking-wide truncate uppercase">
            DESA {kadus.desa}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Bookmark Button */}
          <button
            id={`fav-btn-${kadus.id}`}
            onClick={() => onToggleFavorite(kadus.id)}
            title={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isFavorite
                ? "bg-amber-500/10 border-[#d4af37] text-[#d4af37] hover:bg-amber-500/20"
                : "bg-white border-slate-205 text-slate-400 hover:text-amber-500 hover:bg-slate-50"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Main content body */}
      <div className="p-5 flex-1 flex gap-4">
        {/* Visual Badge representing Avatar */}
        <div className="flex flex-col items-center shrink-0">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-display text-sm font-black tracking-tight shadow-sm ${theme.avatarBg}`}>
            {isVacant ? "⏳" : getInitials(kadus.nama)}
          </div>
          {kadus.custom && (
            <span className="text-[7px] font-extrabold bg-[#1a3a3a] text-[#d4af37] border border-[#d4af37]/30 px-1 py-0.5 rounded mt-2 tracking-wider uppercase">
              USER
            </span>
          )}
        </div>

        {/* Text descriptions */}
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h3 className={`font-black font-display leading-tight text-[15px] sm:text-base group-hover:text-[#1a3a3a] transition-colors ${isVacant ? "text-slate-400 italic font-medium" : "text-slate-900"}`}>
              {kadus.nama}
            </h3>
            {isVacant && (
              <span className="text-[9px] text-red-650 font-bold inline-block bg-red-50 border border-red-100 px-1.5 py-0.5 rounded mt-1 leading-none uppercase tracking-wider">
                Posisi Kosong / Sementara
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs text-slate-500">
            {/* Address / Banjar */}
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate leading-normal text-slate-800 font-semibold">{kadus.alamat}</span>
            </div>

            {/* WA number representation */}
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono text-slate-600 select-all font-semibold">
                {formatPhoneNumberForDisplay(kadus.wa)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action footer */}
      <div className="p-4 pt-0 border-t border-slate-50 flex gap-2">
        {/* Copy Details */}
        <button
          id={`copy-btn-${kadus.id}`}
          onClick={copyToClipboard}
          title="Salin Kontak Lengkap"
          className="p-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-650 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-[#1a3a3a]" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Select & Use Custom Message Generator */}
        <button
          id={`msg-btn-${kadus.id}`}
          onClick={() => onSelectSendMessage(kadus)}
          className="flex-1 bg-[#1a3a3a] hover:bg-[#d4af37] text-white hover:text-[#1a3a3a] font-bold rounded-xl text-xs sm:text-xs py-2.5 px-3 transition-colors duration-200 inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider border border-transparent hover:border-[#1a3a3a]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          Template Chat WA
        </button>

        {/* Direct raw chat */}
        <a
          id={`wa-direct-link-${kadus.id}`}
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          title="Buka Chat WhatsApp Instan"
          className="p-2.5 bg-green-500 hover:bg-[#d4af37] text-white hover:text-[#1a3a3a] border border-transparent hover:border-[#1a3a3a] rounded-xl transition-all inline-flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
        >
          <Phone className="w-4 h-4" />
        </a>

        {/* Delete custom ones if appropriate */}
        {kadus.custom && onDeleteCustom && (
          <button
            id={`delete-custom-${kadus.id}`}
            onClick={() => onDeleteCustom(kadus.id)}
            className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
            title="Hapus Data Buatan Sendiri"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

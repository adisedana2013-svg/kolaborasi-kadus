import React, { useState } from "react";
import { X, UserPlus, Phone, Shield, Sparkles } from "lucide-react";
import { Kadus } from "../data/kadusData";

interface AddKadusModalProps {
  onClose: () => void;
  onAdd: (newKadus: Omit<Kadus, "id" | "custom">) => void;
}

export default function AddKadusModal({ onClose, onAdd }: AddKadusModalProps) {
  const [name, setName] = useState("");
  const [kecamatan, setKecamatan] = useState<"Bangli" | "Kintamani" | "Tembuku" | "Susut">("Bangli");
  const [desa, setDesa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [waNum, setWaNum] = useState("");
  const [errorStatus, setErrorStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return setErrorStatus("Mohon lengkapi Nama Kepala Dusun.");
    if (!desa.trim()) return setErrorStatus("Mohon lengkapi Nama Desa.");
    if (!alamat.trim()) return setErrorStatus("Mohon lengkapi Alamat atau Banjar Dinas.");
    if (!waNum.trim()) return setErrorStatus("Mohon lengkapi Nomor WhatsApp.");

    // Clean and validate phone logic
    const sanitizedPhone = waNum.replace(/[\s\-\+]/g, "");
    if (!/^(08|62|8)\d{8,11}$/.test(sanitizedPhone)) {
      return setErrorStatus(
        "Format nomor WhatsApp kurang valid. Gunakan format standar Indonesia, misalnya: 08123xxxxxx atau 628123xxxxxx."
      );
    }

    // Standardize phone saving
    let finalizedPhone = sanitizedPhone;
    if (finalizedPhone.startsWith("8")) {
      finalizedPhone = "08" + finalizedPhone.substring(1);
    }

    onAdd({
      nama: name.trim().toUpperCase(),
      kecamatan,
      desa: desa.trim().toUpperCase(),
      alamat: alamat.trim(),
      wa: finalizedPhone,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative backdrop top illustration colors */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600" />

        {/* Modal close header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold font-display text-slate-900 leading-tight">
                Tambahkan Kadus Mandiri
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simpan data Kepala Dusun untuk keperluan kontak pribadi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorStatus && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <span className="text-sm">⚠️</span>
              <span className="font-medium leading-relaxed">{errorStatus}</span>
            </div>
          )}

          {/* Kadus Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              NAMA KEPALA DUSUN / KELIAN
            </label>
            <input
              type="text"
              placeholder="Contoh: I WAYAN MERTA GUNA"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all"
            />
          </div>

          {/* Region metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                KECAMATAN
              </label>
              <select
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3 py-2.5 text-xs focus:outline-none transition-all cursor-pointer font-sans"
              >
                <option value="Bangli">Bangli</option>
                <option value="Kintamani">Kintamani</option>
                <option value="Tembuku">Tembuku</option>
                <option value="Susut">Susut</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                NAMA DESA
              </label>
              <input
                type="text"
                placeholder="Contoh: JEHEM"
                value={desa}
                onChange={(e) => setDesa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Banjar address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              ALAMAT / NAMA BANJAR DINAS
            </label>
            <input
              type="text"
              placeholder="Contoh: Banjar Dinas Antugan"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all"
            />
          </div>

          {/* Phone number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              NOMOR WHATSAPP (AKTIF)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Contoh: 08123456789"
                value={waNum}
                onChange={(e) => setWaNum(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-[10px] text-slate-500 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              KEAMANAN DATA LOKAL (PRIVACY SECURED)
            </div>
            <p>
              Data yang Anda tambahkan disimpan **khusus** di memori browser Anda sendiri (`localStorage`) dan tidak dikirim ke server luar manapun. Aman digunakan untuk data pribadi.
            </p>
          </div>

          {/* Modal Action footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end bg-slate-50/50 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              Simpan Data Kadus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

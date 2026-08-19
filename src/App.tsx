import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  Trash2,
  Bookmark,
  Sparkles,
  RefreshCw,
  Sliders,
  AlertCircle,
  HelpCircle,
  Star,
  Layers,
  ExternalLink
} from "lucide-react";

// Sub-components
import Header from "./components/Header";
import StatsBanner from "./components/StatsBanner";
import KadusCard from "./components/KadusCard";
import MessageTemplateManager from "./components/MessageTemplateManager";
import AddKadusModal from "./components/AddKadusModal";
import LoginScreen from "./components/LoginScreen";

// Data
import { initialKadusList, Kadus } from "./data/kadusData";

export default function App() {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("kadus_auth_session") === "true";
  });
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem("kadus_user_session") || "Admin";
  });

  const handleLogin = (user: string) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem("kadus_auth_session", "true");
    localStorage.setItem("kadus_user_session", user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("kadus_auth_session");
  };

  // --- States ---
  const [kadusList, setKadusList] = useState<Kadus[]>(initialKadusList);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");
  const [selectedDesa, setSelectedDesa] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMessageTarget, setSelectedMessageTarget] = useState<Kadus | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Initial Loading effects ---
  useEffect(() => {
    // 1. Fetch custom items from localStorage
    try {
      const storedCustom = localStorage.getItem("kadus_custom_list_v1");
      if (storedCustom) {
        const parsedCustom: Kadus[] = JSON.parse(storedCustom);
        // Combine initial official list with custom local listings
        setKadusList([...initialKadusList, ...parsedCustom]);
      }
    } catch (e) {
      console.error("Gagal meload kadus custom regional:", e);
    }

    // 2. Fetch favorites list
    try {
      const storedFavs = localStorage.getItem("kadus_favorites_v1");
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    } catch (e) {
      console.error("Gagal meload favorit:", e);
    }
  }, []);

  // --- Actions ---
  const handleToggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("kadus_favorites_v1", JSON.stringify(updated));
  };

  const handleAddCustomKadus = (fields: Omit<Kadus, "id" | "custom">) => {
    try {
      const storedCustom = localStorage.getItem("kadus_custom_list_v1");
      const currentCustom: Kadus[] = storedCustom ? JSON.parse(storedCustom) : [];

      const newId = `custom-${Date.now()}`;
      const newItem: Kadus = {
        ...fields,
        id: newId,
        custom: true,
      };

      const updatedCustom = [...currentCustom, newItem];
      localStorage.setItem("kadus_custom_list_v1", JSON.stringify(updatedCustom));

      // Re-populate state list
      setKadusList([...initialKadusList, ...updatedCustom]);
    } catch (e) {
      alert("Gagal menambahkan Data Kelian baru.");
    }
  };

  const handleDeleteCustomKadus = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data Kadus buatan sendiri ini secara permanen?")) {
      try {
        const storedCustom = localStorage.getItem("kadus_custom_list_v1");
        const currentCustom: Kadus[] = storedCustom ? JSON.parse(storedCustom) : [];

        const updatedCustom = currentCustom.filter((item) => item.id !== id);
        localStorage.setItem("kadus_custom_list_v1", JSON.stringify(updatedCustom));

        setKadusList([...initialKadusList, ...updatedCustom]);

        // If active message target is deleted, clear it
        if (selectedMessageTarget?.id === id) {
          setSelectedMessageTarget(null);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedKecamatan("all");
    setSelectedDesa("all");
    setShowFavoritesOnly(false);
  };

  const handleClearAllCustomData = () => {
    if (window.confirm("Hapus semua data kustom lokal buatan Anda dan setel ulang ke daftar resmi awal?")) {
      localStorage.removeItem("kadus_custom_list_v1");
      setKadusList(initialKadusList);
      setSelectedMessageTarget(null);
    }
  };

  // --- Dynamic Filtering Logic ---
  // List of unique villages based on current selected subdistrict (Kecamatan)
  const availableVillagesList = useMemo(() => {
    const list = kadusList.filter(
      (k) => selectedKecamatan === "all" || k.kecamatan.toLowerCase() === selectedKecamatan.toLowerCase()
    );
    const uniqueDesas = Array.from(new Set(list.map((k) => k.desa))).sort();
    return uniqueDesas;
  }, [kadusList, selectedKecamatan]);

  // Adjust village selection if it's no longer inside the filtered subdistrict list
  useEffect(() => {
    if (selectedDesa !== "all" && !availableVillagesList.includes(selectedDesa)) {
      setSelectedDesa("all");
    }
  }, [selectedKecamatan, availableVillagesList, selectedDesa]);

  // Filter main list
  const filteredKadusList = useMemo(() => {
    return kadusList.filter((item) => {
      // 1. Search Query validation (Matches name, address, or village name)
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.desa.toLowerCase().includes(q) ||
        item.alamat.toLowerCase().includes(q) ||
        item.wa.includes(q);

      // 2. Kecamatan filter validation
      const matchesKecamatan =
        selectedKecamatan === "all" || item.kecamatan.toLowerCase() === selectedKecamatan.toLowerCase();

      // 3. Desa filter validation
      const matchesDesa =
        selectedDesa === "all" || item.desa.toLowerCase() === selectedDesa.toLowerCase();

      // 4. Favorites filter validation
      const matchesFavorites = !showFavoritesOnly || favorites.includes(item.id);

      return matchesQuery && matchesKecamatan && matchesDesa && matchesFavorites;
    });
  }, [kadusList, searchQuery, selectedKecamatan, selectedDesa, showFavoritesOnly, favorites]);

  // Statistics calculation for Bento card stats (distribution of 4 Kecamatans)
  const regionalDistributionStats = useMemo(() => {
    const stats = {
      Bangli: 0,
      Kintamani: 0,
      Tembuku: 0,
      Susut: 0,
      total: 0,
    };

    kadusList.forEach((item) => {
      if (item.kecamatan === "Bangli") stats.Bangli++;
      if (item.kecamatan === "Kintamani") stats.Kintamani++;
      if (item.kecamatan === "Tembuku") stats.Tembuku++;
      if (item.kecamatan === "Susut") stats.Susut++;
      stats.total++;
    });

    return stats;
  }, [kadusList]);

  // --- Export Excel Styled CSV function ---
  const handleExportCSV = () => {
    if (filteredKadusList.length === 0) {
      alert("Tidak ada data untuk diekspor!");
      return;
    }

    try {
      // CSV Headers with BOM for proper Excel Indonesian character display
      const headers = ["ID", "Kecamatan", "Desa", "Nama Kadus/Kelian", "Banjar Dinas/Alamat", "Nomor WhatsApp"];
      const rows = filteredKadusList.map((item) => [
        item.id,
        item.kecamatan,
        item.desa,
        item.nama,
        item.alamat,
        `="${item.wa}"`, // Force Excel text format for leading zero strings
      ]);

      const csvContent =
        "\uFEFF" + // UTF-8 BOM
        [headers.join(","), ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Direktori_Kadus_Bangli_Filtered_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Gagal mengekspor data ke format CSV.");
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Brand Header */}
      <Header
        totalCount={kadusList.length}
        favoriteCount={favorites.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Layout area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Visual Charts & Subdistrict Distribution */}
        <StatsBanner
          distribution={regionalDistributionStats}
          activeKecamatan={selectedKecamatan}
          onSelectKecamatan={(kec) => {
            // Toggle subdistrict trigger on double click
            if (selectedKecamatan === kec) {
              setSelectedKecamatan("all");
            } else {
              setSelectedKecamatan(kec);
            }
          }}
        />

        {/* Dynamic interactive board (Left: Search/List, Right: Chat Assistant helper) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT SIDE: Filtering controls & Directory list */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Control panel cards */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              
              {/* Filter core titles */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#1a3a3a]" />
                  <h3 className="font-extrabold text-slate-900 font-display uppercase tracking-wide text-xs">Pencarian & Penyaringan</h3>
                </div>
                {(searchQuery || selectedKecamatan !== "all" || selectedDesa !== "all" || showFavoritesOnly) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors uppercase tracking-wider text-[10px]"
                  >
                    <RefreshCw className="w-3 h-3 hover:rotate-45 transition-transform" />
                    Reset Filter
                  </button>
                )}
              </div>

              {/* Filtering form inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                {/* Search Bar query */}
                <div className="md:col-span-6 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4 text-[#1a3a3a]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan nama Kelian, Banjar Dinas, Desa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1a3a3a] focus:ring-1 focus:ring-[#1a3a3a] rounded-lg pl-9.5 pr-4 py-2.5 text-xs sm:text-xs font-semibold focus:outline-none transition-all placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Subdistricts Kecamatan */}
                <div className="md:col-span-3">
                  <select
                    value={selectedKecamatan}
                    onChange={(e) => {
                      setSelectedKecamatan(e.target.value);
                      setSelectedDesa("all"); // Reset village selection on change
                    }}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1a3a3a] focus:ring-1 focus:ring-[#1a3a3a] rounded-lg px-3 py-2.5 text-xs focus:outline-none transition-all cursor-pointer font-bold text-slate-800"
                  >
                    <option value="all">Semua Kecamatan</option>
                    <option value="Bangli">Kec. Bangli</option>
                    <option value="Kintamani">Kec. Kintamani</option>
                    <option value="Tembuku">Kec. Tembuku</option>
                    <option value="Susut">Kec. Susut</option>
                  </select>
                </div>

                {/* Villages Desa */}
                <div className="md:col-span-3">
                  <select
                    value={selectedDesa}
                    onChange={(e) => setSelectedDesa(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1a3a3a] focus:ring-1 focus:ring-[#1a3a3a] rounded-lg px-3 py-2.5 text-xs focus:outline-none transition-all cursor-pointer font-bold text-slate-800"
                  >
                    <option value="all">
                      {selectedKecamatan !== "all" ? `Semua Desa (${selectedKecamatan})` : "Semua Desa"}
                    </option>
                    {availableVillagesList.map((desaName) => (
                      <option key={desaName} value={desaName}>
                        Desa {desaName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Extra Utilities (Density views, Export, Clean custom) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                {/* Stats note */}
                <span className="text-slate-500 font-semibold text-[11px]">
                  TERLIHAT <span className="font-bold text-[#1a3a3a]">{filteredKadusList.length}</span> DARI <span className="font-bold text-slate-705">{kadusList.length}</span> TOTAL BANJAR
                </span>

                {/* Grid Density & Export controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Download Excel Sheet */}
                  <button
                    onClick={handleExportCSV}
                    className="bg-white hover:bg-[#1a3a3a] hover:text-[#d4af37] border border-[#1a3a3a] text-[#1a3a3a] font-bold px-3 py-2 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider shadow-xs"
                    title="Ekspor daftar tersaring ke berkas tabel excel/CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Ekspor CSV (Excel)
                  </button>

                  {/* Clean custom records locally */}
                  {kadusList.some((k) => k.custom) && (
                    <button
                      onClick={handleClearAllCustomData}
                      className="bg-red-50 hover:bg-[#1a3a3a] hover:text-red-350 border border-red-200 text-red-700 font-bold px-2.5 py-2 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 text-[10px] uppercase tracking-wider"
                      title="Bersihkan semua data kustom lokal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Setel Ulang
                    </button>
                  )}

                  {/* View Mode controls */}
                  <div className="bg-slate-100 rounded-lg p-0.5 inline-flex border border-slate-200">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1.5 rounded-md text-[9px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                        viewMode === "grid" ? "bg-[#1a3a3a] text-[#d4af37] shadow-xs" : "text-slate-500 hover:text-slate-705"
                      }`}
                    >
                      GRID CARD
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1.5 rounded-md text-[9px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                        viewMode === "list" ? "bg-[#1a3a3a] text-[#d4af37] shadow-xs" : "text-slate-500 hover:text-slate-705"
                      }`}
                    >
                      LIST CONDENSED
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* DIRECTORY DISPLAY GRID LIST */}
            {filteredKadusList.length === 0 ? (
              <div className="bg-white border-2 border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-xs">
                <div className="text-4xl mb-3">🔍</div>
                <h4 className="font-extrabold text-slate-800 font-display uppercase tracking-wide">Data Kadus Tidak Ditemukan</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Periksa kata kunci pencarian Anda, atau setel ulang filter wilayah untuk memuat seluruh banjar dinas.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 bg-[#1a3a3a] hover:bg-[#d4af37] text-white hover:text-[#1a3a3a] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredKadusList.map((kadus) => (
                  <div key={kadus.id}>
                    <KadusCard
                      kadus={kadus}
                      isFavorite={favorites.includes(kadus.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectSendMessage={(k) => {
                        setSelectedMessageTarget(k);
                        // Instantly scroll smoothly to the message generator box on mobile
                        if (window.innerWidth < 1024) {
                          document.getElementById("msg-gen-box")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      onDeleteCustom={kadus.custom ? handleDeleteCustomKadus : undefined}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Condensed view table */
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#1a3a3a] text-white border-b border-slate-200 font-bold uppercase tracking-wider text-[9px]">
                        <th className="py-4 px-5">Kecamatan / Desa</th>
                        <th className="py-4 px-4">Nama Lengkap Kelian</th>
                        <th className="py-4 px-4">Banjar Dinas / Alamat</th>
                        <th className="py-4 px-4">Nomor WhatsApp</th>
                        <th className="py-2.5 px-5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredKadusList.map((kadus) => {
                        const isFav = favorites.includes(kadus.id);
                        const isVacant = kadus.nama.toLowerCase().includes("kosong");
                        return (
                          <tr key={kadus.id} className="hover:bg-slate-50/50 transition-colors group">
                            {/* Region */}
                            <td className="py-3.5 px-5">
                              <div className="flex flex-col gap-0.5 text-[11px]">
                                <span className="font-bold text-slate-900">{kadus.kecamatan}</span>
                                <span className="text-slate-450 font-mono text-[9px]">DS. {kadus.desa}</span>
                              </div>
                            </td>

                            {/* Name */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className={`font-black ${isVacant ? "text-slate-450 italic" : "text-slate-800"}`}>
                                  {kadus.nama}
                                </span>
                                {kadus.custom && (
                                  <span className="text-[7px] font-extrabold bg-[#1a3a3a] text-[#d4af37] px-1 py-0.5 rounded border border-[#d4af37]/35">
                                    USER
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Alamat */}
                            <td className="py-3.5 px-4 text-slate-800 font-semibold">
                              {kadus.alamat}
                            </td>

                            {/* Phone */}
                            <td className="py-3.5 px-4 font-mono font-semibold">
                              <span className="text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                {kadus.wa}
                              </span>
                            </td>

                            {/* Table actions buttons */}
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleToggleFavorite(kadus.id)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    isFav ? "bg-amber-100 border-[#d4af37] text-[#d4af37]" : "bg-white border-slate-200 text-slate-300 hover:text-amber-500"
                                  }`}
                                  title="Favoritkan"
                                >
                                  <Star className="w-3 h-3 fill-current" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedMessageTarget(kadus);
                                    if (window.innerWidth < 1024) {
                                      document.getElementById("msg-gen-box")?.scrollIntoView({ behavior: "smooth" });
                                    }
                                  }}
                                  className="bg-[#1a3a3a] hover:bg-[#d4af37] border border-transparent text-white hover:text-[#1a3a3a] p-1.5 rounded text-[10px] font-bold cursor-pointer transition-colors"
                                  title="Gunakan Template WhatsApp"
                                >
                                  📨
                                </button>
                                {kadus.custom && (
                                  <button
                                    onClick={() => handleDeleteCustomKadus(kadus.id)}
                                    className="p-1.5 bg-red-105 hover:bg-red-200 text-red-650 rounded-lg cursor-pointer text-[10px]"
                                    title="Hapus"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDE: Custom Message Template Manager */}
          <div id="msg-gen-box" className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
            <MessageTemplateManager
              selectedKadus={selectedMessageTarget}
              onClearSelection={() => setSelectedMessageTarget(null)}
              allKadusList={filteredKadusList}
            />

            {/* Quick Helper Tips Panel */}
            <div className="mt-6 bg-white border-y-4 border-b-[#1a3a3a] border-t-[#d4af37] border-x border-x-slate-200 rounded-xl p-5 shadow-xs space-y-3.5">
              <h4 className="font-bold text-[#1a3a3a] font-display text-sm inline-flex items-center gap-1.5 uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-[#1a3a3a] shrink-0" />
                Panduan Komunikasi Santun Resmi
              </h4>
              <ul className="text-xs text-slate-500 space-y-2 leading-relaxed list-disc list-inside">
                <li>
                  <span className="font-semibold text-slate-800">Gunakan Bahasa yang Sopan</span>: Mulailah pesan dengan ucapan salam kebudayaan (Om Swastyastu) atau ucapan selamat pagi/siang yang formal.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Sebutkan Identitas Lengkap</span>: Selalu sertakan Nama Lengkap Anda serta lokasi Banjar Dinas domisili Anda agar Kelian mudah memverifikasi keanggotaan warga.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Sampaikan Maksud dengan Efisien</span>: Kelian memantau beragam urusan warga banjar dinas secara swadaya, jagalah koordinasi agar senantiasa padat dan lugas.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Hormati Batas Waktu Koordinasi</span>: Hindari mengirim pesan dinas non-darurat di luar jam kerja umum (disarankan maksimal pukul 20:00 WITA).
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* Elegant minimalist footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 text-xs text-slate-450 py-8 text-center border-t-2 border-[#1a3a3a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex justify-center items-center gap-2 text-slate-300 text-[10px]">
            <span>BANGLI</span>
            <span>•</span>
            <span>KINTAMANI</span>
            <span>•</span>
            <span>TEMBUKU</span>
            <span>•</span>
            <span>SUSUT</span>
          </div>

          <p className="font-bold text-slate-800 tracking-wide uppercase text-[10px]">© 2026 Bersama Pemerintahan Desa Kabupaten Bangli, Bali.</p>
          <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Portal database independen terpadu untuk percepatan koordinasi warga dengan aparatur kewilayahan/Kelian Banjar Dinas secara inklusif, akurat, dan terstruktur.
          </p>
        </div>
      </footer>

      {/* Suggested Custom Kadus Modal dialog */}
      {isAddModalOpen && (
        <AddKadusModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCustomKadus}
        />
      )}
    </div>
  );
}

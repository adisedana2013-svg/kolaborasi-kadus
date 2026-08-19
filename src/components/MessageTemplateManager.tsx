import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Send,
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  CheckCircle2,
  X
} from "lucide-react";
import { Kadus } from "../data/kadusData";

export interface MessageTemplate {
  id: string;
  title: string;
  category: "admin" | "laporan" | "kegiatan" | "kustom";
  content: string;
  isDefault?: boolean;
}

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: "tpl-1",
    title: "Urusan Administrasi Kependudukan",
    category: "admin",
    content:
      "Om Swastyastu / Selamat Pagi/Siang Pak {nama},\n\nPerkenalkan saya {pengirim}, warga di lingkungan Banjar Dinas {banjar}, Desa {desa}, Kec. {kecamatan}.\n\nSaya bermaksud berkonsultasi mengenai pengurusan administrasi kependudukan (KTP/KK/Surat Pengantar). Mohon arahan waktu pelayanan atau dokumen yang perlu saya siapkan.\n\nMatur Suksma, terima kasih.",
    isDefault: true,
  },
  {
    id: "tpl-2",
    title: "Laporan & Informasi Kewilayahan",
    category: "laporan",
    content:
      "Om Swastyastu Pak {nama},\n\nIzin menginformasikan terkait situasi lingkungan / fasilitas umum di Banjar Dinas {banjar}, Desa {desa}.\n\nAda hal penting yang perlu kami koordinasikan dengan Bapak selaku Kelian Banjar Dinas. Mohon saran atau jadwal yang luang untuk kami menyampaikan secara langsung.\n\nMatur suksma.",
    isDefault: true,
  },
  {
    id: "tpl-3",
    title: "Koordinasi Kegiatan & Undangan Adat",
    category: "kegiatan",
    content:
      "Om Swastyastu Pak Kelian {nama},\n\nPerkenalkan saya {pengirim}. Kami ingin menyampaikan koordinasi terkait kegiatan warga / undangan di wilayah Banjar Dinas {banjar}, Desa {desa}.\n\nMohon petunjuk dan arahan dari Bapak. Terima kasih atas perhatian dan ketersediaan Bapak.",
    isDefault: true,
  },
  {
    id: "tpl-4",
    title: "Pemberitahuan & Koordinasi Singkat",
    category: "kustom",
    content:
      "Selamat pagi/siang Pak {nama} (Kelian Banjar Dinas {banjar}).\n\nSaya {pengirim} ingin menanyakan perihal koordinasi dinas di wilayah Desa {desa}, Kecamatan {kecamatan}. Mohon dapat menghubungi saya kembali jika Bapak sedang luang. Terima kasih.",
    isDefault: true,
  },
];

const VARIABLE_TAGS = [
  { tag: "{nama}", label: "Nama Kelian", desc: "Nama lengkap Kadus" },
  { tag: "{banjar}", label: "Banjar Dinas", desc: "Alamat / Banjar" },
  { tag: "{desa}", label: "Desa", desc: "Nama Desa" },
  { tag: "{kecamatan}", label: "Kecamatan", desc: "Nama Kecamatan" },
  { tag: "{telepon}", label: "No. WA", desc: "Nomor WhatsApp" },
  { tag: "{pengirim}", label: "Nama Pengirim", desc: "Nama pengirim pesan" },
];

interface MessageTemplateManagerProps {
  selectedKadus: Kadus | null;
  onClearSelection: () => void;
  allKadusList: Kadus[];
}

export default function MessageTemplateManager({
  selectedKadus,
  onClearSelection,
  allKadusList,
}: MessageTemplateManagerProps) {
  // --- States ---
  const [templates, setTemplates] = useState<MessageTemplate[]>(() => {
    try {
      const saved = localStorage.getItem("kadus_custom_templates_v1");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Gagal membaca template:", e);
    }
    return DEFAULT_TEMPLATES;
  });

  const [activeTemplateId, setActiveTemplateId] = useState<string>(() => {
    return templates[0]?.id || "tpl-1";
  });

  const [senderName, setSenderName] = useState(() => {
    return localStorage.getItem("kadus_sender_name_v1") || "";
  });

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form states for Create / Edit Template
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  // Target Kadus selector if none selected via card
  const [targetKadusId, setTargetKadusId] = useState<string>("");

  // Save templates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kadus_custom_templates_v1", JSON.stringify(templates));
    } catch (e) {
      console.error("Gagal menyimpan template:", e);
    }
  }, [templates]);

  // Save sender name
  useEffect(() => {
    localStorage.setItem("kadus_sender_name_v1", senderName);
  }, [senderName]);

  // Current active target
  const activeKadus: Kadus | null =
    selectedKadus ||
    allKadusList.find((k) => k.id === targetKadusId) ||
    allKadusList[0] ||
    null;

  const currentTemplate =
    templates.find((t) => t.id === activeTemplateId) || templates[0];

  // Fill tags dynamically in content
  const compileMessage = (templateContent: string, target: Kadus | null) => {
    if (!templateContent) return "";
    let compiled = templateContent;

    const recipientName = target ? target.nama : "[Nama Kelian]";
    const banjarName = target ? target.alamat : "[Banjar Dinas]";
    const desaName = target ? target.desa : "[Desa]";
    const kecName = target ? target.kecamatan : "[Kecamatan]";
    const phoneNo = target ? target.wa : "[Nomor Telepon]";
    const sender = senderName.trim() ? senderName.trim() : "[Nama Anda / Warga]";

    compiled = compiled.replace(/\{nama\}/gi, recipientName);
    compiled = compiled.replace(/\{banjar\}/gi, banjarName);
    compiled = compiled.replace(/\{desa\}/gi, desaName);
    compiled = compiled.replace(/\{kecamatan\}/gi, kecName);
    compiled = compiled.replace(/\{telepon\}/gi, phoneNo);
    compiled = compiled.replace(/\{pengirim\}/gi, sender);

    return compiled;
  };

  const finalCompiledMessage = compileMessage(
    currentTemplate ? currentTemplate.content : "",
    activeKadus
  );

  // Actions for Create / Edit Form
  const handleStartCreate = () => {
    setEditingTitle("");
    setEditingContent(
      "Om Swastyastu Pak {nama},\n\nPerkenalkan saya {pengirim} dari Banjar Dinas {banjar}, Desa {desa}.\n\n[Tuliskan pesan atau maksud Anda di sini]\n\nMatur Suksma."
    );
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleStartEdit = (tpl: MessageTemplate) => {
    setEditingTitle(tpl.title);
    setEditingContent(tpl.content);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTitle.trim() || !editingContent.trim()) return;

    if (isCreating) {
      const newTpl: MessageTemplate = {
        id: "custom-tpl-" + Date.now(),
        title: editingTitle.trim(),
        category: "kustom",
        content: editingContent,
        isDefault: false,
      };
      setTemplates([...templates, newTpl]);
      setActiveTemplateId(newTpl.id);
      setIsCreating(false);
    } else if (isEditing && currentTemplate) {
      const updated = templates.map((t) =>
        t.id === currentTemplate.id
          ? { ...t, title: editingTitle.trim(), content: editingContent }
          : t
      );
      setTemplates(updated);
      setIsEditing(false);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (templates.length <= 1) {
      alert("Harus menyisakan minimal 1 template pesan.");
      return;
    }
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    if (activeTemplateId === id) {
      setActiveTemplateId(updated[0].id);
    }
  };

  const handleResetDefaultTemplates = () => {
    if (window.confirm("Apakah Anda yakin ingin mengembalikan semua template pesan ke standar awal?")) {
      setTemplates(DEFAULT_TEMPLATES);
      setActiveTemplateId(DEFAULT_TEMPLATES[0].id);
      setIsEditing(false);
      setIsCreating(false);
    }
  };

  const handleInsertTag = (tag: string) => {
    setEditingContent((prev) => prev + " " + tag);
  };

  // WhatsApp send action
  const handleSendWhatsApp = () => {
    if (!activeKadus) return;
    const cleanPhone = activeKadus.wa.replace(/\s/g, "").replace(/-/g, "");
    let formatWa = cleanPhone;
    if (formatWa.startsWith("0")) {
      formatWa = "62" + formatWa.substring(1);
    }
    const waUrl = `https://wa.me/${formatWa}?text=${encodeURIComponent(
      finalCompiledMessage
    )}`;
    window.open(waUrl, "_blank");
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(finalCompiledMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border-2 border-[#1a3a3a] rounded-2xl shadow-xl overflow-hidden font-sans space-y-0">
      
      {/* Header Bar */}
      <div className="bg-[#1a3a3a] text-white p-5 border-b-4 border-[#d4af37] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#d4af37] text-[#1a3a3a] rounded-xl font-bold shadow-xs shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold font-display uppercase tracking-wide text-sm text-white">
              Pengaturan Template Pesan
            </h3>
            <p className="text-slate-300 text-[11px]">
              Atur format pesan WhatsApp sesuai kebutuhan Anda
            </p>
          </div>
        </div>

        <button
          onClick={handleResetDefaultTemplates}
          className="text-[10px] bg-white/10 hover:bg-white/20 text-[#d4af37] px-2.5 py-1.5 rounded-lg border border-white/15 font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          title="Kembalikan semua template ke standar awal"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="p-5 space-y-5">

        {/* Selected Target Banner */}
        {selectedKadus ? (
          <div className="bg-amber-500/10 border border-[#d4af37] p-3.5 rounded-xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#1a3a3a] bg-[#d4af37] px-1.5 py-0.5 rounded mr-1.5">
                PENERIMA DIPILIH
              </span>
              <div className="font-black text-slate-900 text-xs truncate mt-1">
                {selectedKadus.nama}
              </div>
              <div className="text-[10px] text-slate-600 truncate">
                Banjar Dinas {selectedKadus.alamat}, Desa {selectedKadus.desa}
              </div>
            </div>
            <button
              onClick={onClearSelection}
              className="p-1.5 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-lg shrink-0 cursor-pointer text-xs"
              title="Ganti Penerima"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Pilih Kelian Banjar Dinas Tujuan:
            </label>
            <select
              value={targetKadusId}
              onChange={(e) => setTargetKadusId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#1a3a3a] focus:outline-none transition-all cursor-pointer"
            >
              {allKadusList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} — Banjar {k.alamat} (Desa {k.desa})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sender Name Field */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Nama Anda (Pengirim Pesan):
          </label>
          <input
            type="text"
            placeholder="Contoh: Wayan Suardana / Warga Banjar Dinas"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#1a3a3a] focus:outline-none transition-all placeholder-slate-400"
          />
        </div>

        {/* Template Tabs Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Pilih Format Template:
            </label>
            {!isCreating && !isEditing && (
              <button
                onClick={handleStartCreate}
                className="text-[10px] bg-[#1a3a3a] hover:bg-[#d4af37] text-white hover:text-[#1a3a3a] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Buat Template Baru
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {templates.map((tpl) => {
              const isActive = tpl.id === activeTemplateId;
              return (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setActiveTemplateId(tpl.id);
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#1a3a3a] text-[#d4af37] shadow-sm border border-[#1a3a3a]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  <span className="truncate max-w-[140px]">{tpl.title}</span>
                  {!tpl.isDefault && (
                    <span className="text-[8px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-black">
                      KUSTOM
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CREATE / EDIT TEMPLATE EDITOR FORM */}
        {(isCreating || isEditing) ? (
          <form onSubmit={handleSaveTemplate} className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">
                {isCreating ? "➕ Buat Template Baru" : "✏️ Edit Format Template"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Batal
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                Judul Template:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Pesan Undangan Rapat Banjar"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1a3a3a]"
              />
            </div>

            {/* Variable Tag Inserter Chips */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                Klik Tag Variabel Untuk Menyelipkan Data Otomatis:
              </label>
              <div className="flex flex-wrap gap-1">
                {VARIABLE_TAGS.map((vt) => (
                  <button
                    key={vt.tag}
                    type="button"
                    onClick={() => handleInsertTag(vt.tag)}
                    className="bg-white hover:bg-[#1a3a3a] hover:text-[#d4af37] border border-slate-300 text-slate-700 text-[10px] font-mono font-bold px-2 py-1 rounded transition-colors cursor-pointer"
                    title={vt.desc}
                  >
                    + {vt.tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                Isi Format Pesan:
              </label>
              <textarea
                rows={6}
                required
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1a3a3a] font-mono leading-relaxed"
                placeholder="Tuliskan format pesan Anda di sini..."
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1a3a3a] hover:bg-[#d4af37] text-white hover:text-[#1a3a3a] font-extrabold text-xs rounded-lg shadow-sm transition-all cursor-pointer uppercase tracking-wider"
              >
                Simpan Template
              </button>
            </div>
          </form>
        ) : (
          /* PREVIEW & ACTIVE ACTIONS */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-slate-800 font-display uppercase tracking-wide flex items-center gap-1.5">
                <span>Preview Hasil Pesan</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({currentTemplate?.title})
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(currentTemplate)}
                  className="p-1.5 bg-slate-100 hover:bg-[#1a3a3a] text-slate-600 hover:text-[#d4af37] rounded-lg transition-colors cursor-pointer text-xs"
                  title="Edit format template ini"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(currentTemplate.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-colors cursor-pointer text-xs"
                  title="Hapus template ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Compiled Output Text Box */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap border border-slate-700 relative shadow-inner min-h-[140px] selection:bg-[#d4af37] selection:text-slate-900">
              {finalCompiledMessage}
            </div>

            {/* Sending Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyMessage}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold py-3 px-3 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSendWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-3 rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-display active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Kirim WA</span>
              </button>
            </div>
          </div>
        )}

        {/* Legend / Variable Tag Hints */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3 h-3 text-[#1a3a3a]" />
            Keterangan Variabel Otomatis:
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-500 font-mono">
            <div><span className="font-bold text-slate-800">&#123;nama&#125;</span> : Nama Kadus</div>
            <div><span className="font-bold text-slate-800">&#123;banjar&#125;</span> : Banjar Dinas</div>
            <div><span className="font-bold text-slate-800">&#123;desa&#125;</span> : Nama Desa</div>
            <div><span className="font-bold text-slate-800">&#123;kecamatan&#125;</span> : Kecamatan</div>
            <div><span className="font-bold text-slate-800">&#123;pengirim&#125;</span> : Nama Anda</div>
            <div><span className="font-bold text-slate-800">&#123;telepon&#125;</span> : No. WhatsApp</div>
          </div>
        </div>

      </div>
    </div>
  );
}

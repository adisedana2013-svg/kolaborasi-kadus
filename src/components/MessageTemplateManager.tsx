import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Send,
  RotateCcw,
  Info,
  X,
  Paperclip,
  Download,
  Share2,
  Image as ImageIcon,
  File as FileIcon,
  UploadCloud,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Kadus } from "../data/kadusData";

export interface AttachedFileInfo {
  name: string;
  size: number;
  type: string;
  dataUrl?: string; // base64 representation
  linkUrl?: string; // optional online link (Drive / Cloud)
}

export interface MessageTemplate {
  id: string;
  title: string;
  category: "admin" | "laporan" | "kegiatan" | "kustom";
  content: string;
  isDefault?: boolean;
  attachment?: AttachedFileInfo | null;
}

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: "tpl-1",
    title: "Urusan Administrasi Kependudukan",
    category: "admin",
    content:
      "Om Swastyastu / Selamat Pagi/Siang Pak {nama},\n\nPerkenalkan saya {pengirim}, warga di lingkungan Banjar Dinas {banjar}, Desa {desa}, Kec. {kecamatan}.\n\nSaya bermaksud berkonsultasi mengenai pengurusan administrasi kependudukan (KTP/KK/Surat Pengantar).\n{lampiran}\n{link_lampiran}\nMohon arahan waktu pelayanan atau dokumen yang perlu saya siapkan.\n\nMatur Suksma, terima kasih.",
    isDefault: true,
  },
  {
    id: "tpl-2",
    title: "Laporan & Informasi Kewilayahan",
    category: "laporan",
    content:
      "Om Swastyastu Pak {nama},\n\nIzin menginformasikan terkait situasi lingkungan / fasilitas umum di Banjar Dinas {banjar}, Desa {desa}.\n\nBersama ini kami lampirkan dokumen/foto pendukung:\n{lampiran}\n{link_lampiran}\n\nMohon saran atau jadwal yang luang untuk kami menyampaikan secara langsung. Matur suksma.",
    isDefault: true,
  },
  {
    id: "tpl-3",
    title: "Koordinasi Kegiatan & Undangan Dinas",
    category: "kegiatan",
    content:
      "Om Swastyastu Pak Kelian {nama},\n\nPerkenalkan saya {pengirim}. Kami ingin menyampaikan koordinasi terkait agenda / undangan kegiatan di wilayah Banjar Dinas {banjar}, Desa {desa}.\n\nBerkas lampiran undangan & susunan acara:\n{lampiran}\n{link_lampiran}\n\nMohon petunjuk dan arahan dari Bapak. Terima kasih atas perhatian dan ketersediaan Bapak.",
    isDefault: true,
  },
  {
    id: "tpl-4",
    title: "Surat Edaran & Sosialisasi Warga",
    category: "kustom",
    content:
      "Selamat pagi/siang Pak {nama} (Kelian Banjar Dinas {banjar}).\n\nIzin meneruskan informasi penting dan Surat Edaran untuk warga di wilayah Desa {desa}, Kecamatan {kecamatan}.\n\nBerkas Surat Edaran:\n{lampiran}\n{link_lampiran}\n\nMohon bantuan untuk dapat disosialisasikan kepada krama/warga banjar dinas. Terima kasih atas kerja samanya.",
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
  { tag: "{lampiran}", label: "Nama Berkas", desc: "Teks nama file lampiran" },
  { tag: "{link_lampiran}", label: "Link Tautan", desc: "Link tautan dokumen / drive" },
];

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

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
      const saved = localStorage.getItem("kadus_custom_templates_v2");
      if (saved) {
        return JSON.parse(saved);
      }
      // Migrate v1 templates if available
      const oldV1 = localStorage.getItem("kadus_custom_templates_v1");
      if (oldV1) {
        return JSON.parse(oldV1);
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
  const [editingAttachment, setEditingAttachment] = useState<AttachedFileInfo | null>(null);
  const [editingLinkUrl, setEditingLinkUrl] = useState("");

  // Live message override attachment (allows user to attach file per-message without altering template)
  const [liveAttachmentOverride, setLiveAttachmentOverride] = useState<AttachedFileInfo | null>(null);

  // Target Kadus selector if none selected via card
  const [targetKadusId, setTargetKadusId] = useState<string>("");

  // Guidance modal for desktop WhatsApp Web when file is downloaded/copied
  const [showDesktopGuideModal, setShowDesktopGuideModal] = useState(false);
  const [desktopModalData, setDesktopModalData] = useState<{ fileName: string; phone: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const liveFileInputRef = useRef<HTMLInputElement>(null);

  // Save templates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kadus_custom_templates_v2", JSON.stringify(templates));
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

  // Active attachment resolved: live override takes precedence, then template attachment
  const activeAttachment: AttachedFileInfo | null =
    liveAttachmentOverride !== null
      ? liveAttachmentOverride
      : currentTemplate?.attachment || null;

  // Fill tags dynamically in content
  const compileMessage = (
    templateContent: string,
    target: Kadus | null,
    attachment: AttachedFileInfo | null
  ) => {
    if (!templateContent) return "";
    let compiled = templateContent;

    const recipientName = target ? target.nama : "[Nama Kelian]";
    const banjarName = target ? target.alamat : "[Banjar Dinas]";
    const desaName = target ? target.desa : "[Desa]";
    const kecName = target ? target.kecamatan : "[Kecamatan]";
    const phoneNo = target ? target.wa : "[Nomor Telepon]";
    const sender = senderName.trim() ? senderName.trim() : "[Nama Anda / Warga]";

    const attachmentNameTag = attachment
      ? `📎 [Lampiran Berkas: ${attachment.name}]`
      : "";
    const attachmentLinkTag = attachment?.linkUrl
      ? `🔗 Tautan Dokumen: ${attachment.linkUrl}`
      : "";

    compiled = compiled.replace(/\{nama\}/gi, recipientName);
    compiled = compiled.replace(/\{banjar\}/gi, banjarName);
    compiled = compiled.replace(/\{desa\}/gi, desaName);
    compiled = compiled.replace(/\{kecamatan\}/gi, kecName);
    compiled = compiled.replace(/\{telepon\}/gi, phoneNo);
    compiled = compiled.replace(/\{pengirim\}/gi, sender);
    compiled = compiled.replace(/\{lampiran\}/gi, attachmentNameTag);
    compiled = compiled.replace(/\{link_lampiran\}/gi, attachmentLinkTag);

    // If attachment exists but user didn't write {lampiran} tag in template,
    // automatically append an attachment note so it is never omitted
    if (attachment && !templateContent.includes("{lampiran}")) {
      compiled += `\n\n📎 Lampiran Berkas: ${attachment.name}`;
      if (attachment.linkUrl && !templateContent.includes("{link_lampiran}")) {
        compiled += `\n🔗 Unduh Tautan: ${attachment.linkUrl}`;
      }
    }

    // Clean up empty lines from un-used tags
    compiled = compiled.replace(/^\s*[\r\n]/gm, "\n").trim();

    return compiled;
  };

  const finalCompiledMessage = compileMessage(
    currentTemplate ? currentTemplate.content : "",
    activeKadus,
    activeAttachment
  );

  // File upload handler for template editor
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Ukuran berkas maksimal 8 MB agar pengiriman cepat & ringan.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEditingAttachment({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        dataUrl: reader.result as string,
        linkUrl: editingLinkUrl.trim() || undefined,
      });
    };
    reader.readAsDataURL(file);
  };

  // File upload handler for live preview override
  const handleLiveFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Ukuran berkas maksimal 8 MB agar pengiriman cepat & ringan.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLiveAttachmentOverride({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        dataUrl: reader.result as string,
        linkUrl: activeAttachment?.linkUrl || undefined,
      });
    };
    reader.readAsDataURL(file);
  };

  // Actions for Create / Edit Form
  const handleStartCreate = () => {
    setEditingTitle("");
    setEditingContent(
      "Om Swastyastu Pak {nama},\n\nPerkenalkan saya {pengirim} dari Banjar Dinas {banjar}, Desa {desa}.\n\nBerikut terlampir dokumen/berkas terkait:\n{lampiran}\n{link_lampiran}\n\nMohon petunjuk dan arahan Bapak. Matur Suksma."
    );
    setEditingAttachment(null);
    setEditingLinkUrl("");
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleStartEdit = (tpl: MessageTemplate) => {
    setEditingTitle(tpl.title);
    setEditingContent(tpl.content);
    setEditingAttachment(tpl.attachment || null);
    setEditingLinkUrl(tpl.attachment?.linkUrl || "");
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTitle.trim() || !editingContent.trim()) return;

    const attachmentPayload: AttachedFileInfo | null = editingAttachment
      ? {
          ...editingAttachment,
          linkUrl: editingLinkUrl.trim() || undefined,
        }
      : editingLinkUrl.trim()
      ? {
          name: "Dokumen Tautan Online",
          size: 0,
          type: "application/link",
          linkUrl: editingLinkUrl.trim(),
        }
      : null;

    if (isCreating) {
      const newTpl: MessageTemplate = {
        id: "custom-tpl-" + Date.now(),
        title: editingTitle.trim(),
        category: "kustom",
        content: editingContent,
        isDefault: false,
        attachment: attachmentPayload,
      };
      setTemplates([...templates, newTpl]);
      setActiveTemplateId(newTpl.id);
      setIsCreating(false);
    } else if (isEditing && currentTemplate) {
      const updated = templates.map((t) =>
        t.id === currentTemplate.id
          ? {
              ...t,
              title: editingTitle.trim(),
              content: editingContent,
              attachment: attachmentPayload,
            }
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
      setLiveAttachmentOverride(null);
      setIsEditing(false);
      setIsCreating(false);
    }
  };

  const handleInsertTag = (tag: string) => {
    setEditingContent((prev) => prev + " " + tag);
  };

  // Helper to trigger download of attached file
  const handleDownloadAttachment = (attachment: AttachedFileInfo) => {
    if (attachment.dataUrl) {
      const a = document.createElement("a");
      a.href = attachment.dataUrl;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (attachment.linkUrl) {
      window.open(attachment.linkUrl, "_blank");
    }
  };

  // Primary Action: Kirim WA + File sekaligus
  const handleSendWhatsAppUnified = async () => {
    if (!activeKadus) return;

    const cleanPhone = activeKadus.wa.replace(/\s/g, "").replace(/-/g, "");
    let formatWa = cleanPhone;
    if (formatWa.startsWith("0")) {
      formatWa = "62" + formatWa.substring(1);
    }

    // 1. If an attachment with dataUrl exists, test Web Share API
    if (activeAttachment && activeAttachment.dataUrl) {
      try {
        const fileObj = dataURLtoFile(activeAttachment.dataUrl, activeAttachment.name);

        if (
          navigator.canShare &&
          navigator.canShare({ files: [fileObj] }) &&
          typeof navigator.share === "function"
        ) {
          // Native Web Share with file & text together
          await navigator.share({
            title: currentTemplate?.title || "Pesan Kelian Banjar",
            text: finalCompiledMessage,
            files: [fileObj],
          });
          return;
        }
      } catch (err: any) {
        // If user cancelled share sheet, just abort
        if (err?.name === "AbortError") {
          return;
        }
        console.warn("Web Share API tidak didukung pada browser ini, beralih ke WhatsApp Web:", err);
      }

      // 2. Desktop Fallback:
      // Download the file automatically for user
      handleDownloadAttachment(activeAttachment);

      // Try copy image to clipboard if image
      if (activeAttachment.type.startsWith("image/") && navigator.clipboard?.write) {
        try {
          const resp = await fetch(activeAttachment.dataUrl);
          const blob = await resp.blob();
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob }),
          ]);
        } catch (e) {
          console.warn("Clipboard image write failed:", e);
        }
      }

      // Copy text to clipboard as backup
      try {
        await navigator.clipboard.writeText(finalCompiledMessage);
      } catch (e) {
        // ignore
      }

      // Open WhatsApp Web with pre-filled text
      const waUrl = `https://wa.me/${formatWa}?text=${encodeURIComponent(finalCompiledMessage)}`;
      window.open(waUrl, "_blank");

      // Show Desktop helper modal
      setDesktopModalData({ fileName: activeAttachment.name, phone: formatWa });
      setShowDesktopGuideModal(true);
      return;
    }

    // 3. Normal text-only send (or link attachment already embedded in text)
    const waUrl = `https://wa.me/${formatWa}?text=${encodeURIComponent(finalCompiledMessage)}`;
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
              Format Pesan & Lampiran File
            </h3>
            <p className="text-slate-300 text-[11px]">
              Template pesan WhatsApp + lampiran file berkas jadi satu
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
            placeholder="Contoh: Wayan Suardana / Petugas Pelayanan"
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
              const hasAttach = !!tpl.attachment;
              return (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setActiveTemplateId(tpl.id);
                    setLiveAttachmentOverride(null);
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
                  {hasAttach && (
                    <span
                      title="Memiliki lampiran berkas"
                      className="text-[10px] text-amber-400 font-normal"
                    >
                      📎
                    </span>
                  )}
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
        {isCreating || isEditing ? (
          <form
            onSubmit={handleSaveTemplate}
            className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-4 animate-fadeIn"
          >
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
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
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
                placeholder="Contoh: Pesan Undangan Rapat / Sosialisasi PKB"
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

            {/* ATTACH FILE INPUT FOR TEMPLATE */}
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#1a3a3a]" />
                  Lampiran Berkas / Dokumen Template (Opsional)
                </span>
                {editingAttachment && (
                  <button
                    type="button"
                    onClick={() => setEditingAttachment(null)}
                    className="text-[10px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Hapus Berkas
                  </button>
                )}
              </div>

              {editingAttachment ? (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="w-9 h-9 rounded-lg bg-[#1a3a3a] text-[#d4af37] flex items-center justify-center shrink-0">
                    {editingAttachment.type.startsWith("image/") ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {editingAttachment.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {formatFileSize(editingAttachment.size)} • Siap dikirim bersama pesan
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] bg-white border border-slate-300 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Ganti
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <UploadCloud className="w-4 h-4 text-[#1a3a3a]" />
                    Pilih File Lampiran (PDF, Foto, Dokumen, Undangan)
                  </button>
                  <p className="text-[9px] text-slate-400 text-center mt-1">
                    Maks. 8 MB • PDF, Gambar JPG/PNG, Word, Excel
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
              />

              {/* Document Link Input */}
              <div className="pt-1 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Link Tautan Cloud / Google Drive (Opsional):
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... atau link berkas online"
                  value={editingLinkUrl}
                  onChange={(e) => setEditingLinkUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1a3a3a]"
                />
              </div>
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
          <div className="space-y-4">
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

            {/* LIVE ATTACHMENT STATUS / SELECTOR */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#1a3a3a]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-800">
                    Berkas Lampiran Pengiriman
                  </span>
                </div>
                {activeAttachment && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    Siap Terkirim
                  </span>
                )}
              </div>

              {activeAttachment ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white border border-slate-200 p-2.5 rounded-lg shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#1a3a3a] text-[#d4af37] flex items-center justify-center shrink-0">
                      {activeAttachment.type.startsWith("image/") ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {activeAttachment.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {formatFileSize(activeAttachment.size)}
                        {activeAttachment.linkUrl && " • Link tersedia"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleDownloadAttachment(activeAttachment)}
                      className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded inline-flex items-center gap-1 cursor-pointer transition-colors"
                      title="Unduh / Buka berkas lampiran"
                    >
                      <Download className="w-3 h-3" />
                      Unduh
                    </button>
                    <button
                      type="button"
                      onClick={() => liveFileInputRef.current?.click()}
                      className="text-[10px] font-bold text-[#1a3a3a] bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded cursor-pointer transition-colors"
                      title="Ganti berkas untuk pengiriman saat ini"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => setLiveAttachmentOverride({ name: "", size: 0, type: "" })}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                      title="Hapus lampiran untuk pesan ini"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 p-2 bg-white border border-dashed border-slate-300 rounded-lg">
                  <div className="text-[11px] text-slate-500">
                    Belum ada berkas terlampir pada template ini.
                  </div>
                  <button
                    type="button"
                    onClick={() => liveFileInputRef.current?.click()}
                    className="text-[10px] font-extrabold bg-[#1a3a3a] hover:bg-[#d4af37] text-white hover:text-[#1a3a3a] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" />
                    Lampirkan File
                  </button>
                </div>
              )}

              <input
                ref={liveFileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
                onChange={handleLiveFileChange}
              />
            </div>

            {/* SENDING ACTION BUTTONS */}
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
                onClick={handleSendWhatsAppUnified}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-3 rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-display active:scale-95"
                title={
                  activeAttachment
                    ? "Kirim pesan beserta file lampiran jadi satu ke WhatsApp"
                    : "Kirim pesan teks langsung ke WhatsApp"
                }
              >
                {activeAttachment ? (
                  <>
                    <Paperclip className="w-4 h-4" />
                    <span>Kirim WA + File</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim WA</span>
                  </>
                )}
              </button>
            </div>

            {activeAttachment && (
              <p className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-center font-medium">
                ✨ File <strong>{activeAttachment.name}</strong> akan dikirimkan bersama teks pesan WhatsApp (mendukung pengiriman langsung satu kesatuan di HP/Web Share & WhatsApp Web).
              </p>
            )}
          </div>
        )}

        {/* Legend / Variable Tag Hints */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3 h-3 text-[#1a3a3a]" />
            Keterangan Variabel Otomatis:
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-500 font-mono">
            <div>
              <span className="font-bold text-slate-800">&#123;nama&#125;</span> : Nama Kadus
            </div>
            <div>
              <span className="font-bold text-slate-800">&#123;banjar&#125;</span> : Banjar Dinas
            </div>
            <div>
              <span className="font-bold text-slate-800">&#123;desa&#125;</span> : Nama Desa
            </div>
            <div>
              <span className="font-bold text-slate-800">&#123;kecamatan&#125;</span> : Kecamatan
            </div>
            <div>
              <span className="font-bold text-slate-800">&#123;pengirim&#125;</span> : Nama Anda
            </div>
            <div>
              <span className="font-bold text-slate-800">&#123;telepon&#125;</span> : No. WhatsApp
            </div>
            <div>
              <span className="font-bold text-slate-800">&#123;lampiran&#125;</span> : Berkas File
            </div>
            <div>
              <span className="font-bold text-slate-800">&#123;link_lampiran&#125;</span> : Link Online
            </div>
          </div>
        </div>
      </div>

      {/* GUIDANCE MODAL FOR DESKTOP WHATSAPP WEB */}
      {showDesktopGuideModal && desktopModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border-2 border-[#1a3a3a] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 font-display text-base">
                    Pesan & Berkas Siap Dikirim!
                  </h4>
                  <p className="text-xs text-slate-500">
                    Jendela WhatsApp Web telah dibuka
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDesktopGuideModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-emerald-600" />
                Berkas Lampiran: {desktopModalData.fileName}
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed text-[11px]">
                <li>
                  Teks pesan sudah otomatis terisi di kolom chat WhatsApp tujuan.
                </li>
                <li>
                  Berkas lampiran telah otomatis diunduh ke komputer Anda (dan disalin ke clipboard jika gambar).
                </li>
                <li>
                  <strong>Di WhatsApp Web:</strong> Cukup tekan tombol ikon klip 📎 pada chat atau tekan <code>Ctrl + V</code> untuk melampirkan berkas, lalu kirim!
                </li>
              </ul>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => {
                  if (activeAttachment) {
                    handleDownloadAttachment(activeAttachment);
                  }
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Lagi
              </button>
              <button
                onClick={() => setShowDesktopGuideModal(false)}
                className="px-4 py-2 bg-[#1a3a3a] hover:bg-[#d4af37] text-white hover:text-[#1a3a3a] text-xs font-extrabold rounded-lg uppercase tracking-wider transition-all cursor-pointer"
              >
                Selesai / Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

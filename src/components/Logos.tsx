import React from "react";

export function LogoBangli({ className = "w-12 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 230"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Kabupaten Bangli"
    >
      {/* Black Pentagonal Base */}
      <polygon
        points="100,6 194,72 158,214 42,214 6,72"
        fill="#0d0d0d"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <polygon
        points="100,12 188,75 154,208 46,208 12,75"
        stroke="#d4af37"
        strokeWidth="2"
      />

      {/* Top Yellow Star */}
      <polygon
        points="100,16 103,26 113,26 105,32 108,42 100,36 92,42 95,32 87,26 97,26"
        fill="#ffea00"
      />

      {/* Blue Mountain (Gunung Batur) & Water (Danau Batur) */}
      <path
        d="M 38,135 Q 70,95 100,90 Q 130,95 162,135 Z"
        fill="#0277bd"
      />
      <path
        d="M 40,135 C 70,125 130,125 160,135 L 160,155 L 40,155 Z"
        fill="#0288d1"
      />
      {/* Water ripple lines */}
      <line x1="50" y1="140" x2="150" y2="140" stroke="#80deea" strokeWidth="1.5" />
      <line x1="60" y1="146" x2="140" y2="146" stroke="#80deea" strokeWidth="1.5" />
      <line x1="70" y1="151" x2="130" y2="151" stroke="#80deea" strokeWidth="1" />

      {/* Candi Bentar (Gate) Left & Right */}
      {/* Left Candi Bentar */}
      <path
        d="M 52,152 L 52,100 L 60,95 L 60,105 L 68,102 L 68,115 L 75,112 L 75,152 Z"
        fill="#ffd54f"
        stroke="#795548"
        strokeWidth="1"
      />
      {/* Right Candi Bentar */}
      <path
        d="M 148,152 L 148,100 L 140,95 L 140,105 L 132,102 L 132,115 L 125,112 L 125,152 Z"
        fill="#ffd54f"
        stroke="#795548"
        strokeWidth="1"
      />

      {/* Meru Center (Black & Gold Roofs) */}
      <path d="M 92,152 L 92,60 L 100,45 L 108,60 L 108,152 Z" fill="#212121" />
      {/* Meru Tiers */}
      <polygon points="82,145 118,145 114,138 86,138" fill="#111" stroke="#ffd54f" strokeWidth="0.8" />
      <polygon points="84,136 116,136 112,129 88,129" fill="#111" stroke="#ffd54f" strokeWidth="0.8" />
      <polygon points="86,127 114,127 110,120 90,120" fill="#111" stroke="#ffd54f" strokeWidth="0.8" />
      <polygon points="88,118 112,118 108,111 92,111" fill="#111" stroke="#ffd54f" strokeWidth="0.8" />
      <polygon points="90,109 110,109 106,102 94,102" fill="#111" stroke="#ffd54f" strokeWidth="0.8" />
      <polygon points="92,100 108,100 104,93 96,93" fill="#111" stroke="#ffd54f" strokeWidth="0.8" />
      <polygon points="94,91 106,91 103,84 97,84" fill="#111" stroke="#ffd54f" strokeWidth="0.8" />
      <polygon points="95,82 105,82 102,75 98,75" fill="#111" stroke="#ffd54f" strokeWidth="0.8" />
      <polygon points="96,73 104,73 101,65 99,65" fill="#111" stroke="#ffd54f" strokeWidth="0.8" />

      {/* Padi (Rice - Left) */}
      <path
        d="M 38,155 C 22,120 30,80 85,55"
        stroke="#ffca28"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Padi Grains */}
      <circle cx="34" cy="140" r="3" fill="#ffc107" />
      <circle cx="30" cy="125" r="3" fill="#ffc107" />
      <circle cx="30" cy="110" r="3" fill="#ffc107" />
      <circle cx="35" cy="95" r="3" fill="#ffc107" />
      <circle cx="45" cy="82" r="3" fill="#ffc107" />
      <circle cx="58" cy="70" r="3" fill="#ffc107" />

      {/* Kapas (Cotton - Right) */}
      <path
        d="M 162,155 C 178,120 170,80 115,55"
        stroke="#2e7d32"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Cotton Pods */}
      <circle cx="166" cy="140" r="4.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
      <circle cx="170" cy="125" r="4.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
      <circle cx="170" cy="110" r="4.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
      <circle cx="165" cy="95" r="4.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
      <circle cx="155" cy="82" r="4.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />

      {/* BANGLI Red Banner */}
      <rect x="70" y="156" width="60" height="13" rx="2" fill="#c62828" stroke="#ffffff" strokeWidth="0.8" />
      <text
        x="100"
        y="166"
        fill="#ffffff"
        fontSize="9.5"
        fontWeight="900"
        textAnchor="middle"
        fontFamily="sans-serif"
        letterSpacing="1.5"
      >
        BANGLI
      </text>

      {/* Chain & Hibiscus Base */}
      <path d="M 60,171 Q 100,180 140,171" stroke="#ffd54f" strokeWidth="3" />
      <path d="M 52,176 Q 100,195 148,176" fill="#2e7d32" />
      {/* Flowers */}
      <circle cx="75" cy="184" r="5" fill="#d32f2f" />
      <circle cx="92" cy="186" r="5" fill="#d32f2f" />
      <circle cx="108" cy="186" r="5" fill="#d32f2f" />
      <circle cx="125" cy="184" r="5" fill="#d32f2f" />

      {/* Motto Banner: BHUKTI MUKTI BHAKTI */}
      <path
        d="M 32,192 Q 100,208 168,192 L 164,204 Q 100,218 36,204 Z"
        fill="#b71c1c"
        stroke="#ffffff"
        strokeWidth="0.8"
      />
      <text
        x="100"
        y="204"
        fill="#ffffff"
        fontSize="7.5"
        fontWeight="800"
        textAnchor="middle"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        BHUKTI MUKTI BHAKTI
      </text>
    </svg>
  );
}

export function LogoBali({ className = "w-12 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 230"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Provinsi Bali"
    >
      {/* Royal Blue Pentagonal Base */}
      <polygon
        points="100,6 194,72 158,214 42,214 6,72"
        fill="#002bb8"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <polygon
        points="100,12 188,75 154,208 46,208 12,75"
        stroke="#ffe082"
        strokeWidth="2"
      />

      {/* Top Yellow Star */}
      <polygon
        points="100,16 103,26 113,26 105,32 108,42 100,36 92,42 95,32 87,26 97,26"
        fill="#ffea00"
      />

      {/* Meru Tower Center (Gold) */}
      <path d="M 94,152 L 94,55 L 100,42 L 106,55 L 106,152 Z" fill="#ffd54f" />
      {/* Meru Roofs */}
      <polygon points="80,145 120,145 116,137 84,137" fill="#ffb300" stroke="#fff" strokeWidth="0.5" />
      <polygon points="82,135 118,135 114,127 86,127" fill="#ffb300" stroke="#fff" strokeWidth="0.5" />
      <polygon points="84,125 116,125 112,117 88,117" fill="#ffb300" stroke="#fff" strokeWidth="0.5" />
      <polygon points="86,115 114,115 110,107 90,107" fill="#ffb300" stroke="#fff" strokeWidth="0.5" />
      <polygon points="88,105 112,105 108,97 92,97" fill="#ffb300" stroke="#fff" strokeWidth="0.5" />
      <polygon points="90,95 110,95 106,87 94,87" fill="#ffb300" stroke="#fff" strokeWidth="0.5" />
      <polygon points="92,85 108,85 104,77 96,77" fill="#ffb300" stroke="#fff" strokeWidth="0.5" />
      <polygon points="94,75 106,75 103,67 97,67" fill="#ffb300" stroke="#fff" strokeWidth="0.5" />
      <polygon points="95,65 105,65 102,57 98,57" fill="#ffb300" stroke="#fff" strokeWidth="0.5" />

      {/* Gold Candi Bentar (Gate) */}
      <path
        d="M 50,152 L 50,95 L 58,90 L 58,100 L 66,97 L 66,110 L 74,107 L 74,152 Z"
        fill="#ffe082"
        stroke="#ffb300"
        strokeWidth="1"
      />
      <path
        d="M 150,152 L 150,95 L 142,90 L 142,100 L 134,97 L 134,110 L 126,107 L 126,152 Z"
        fill="#ffe082"
        stroke="#ffb300"
        strokeWidth="1"
      />

      {/* Kapas (Cotton - Left) */}
      <path
        d="M 38,155 C 20,120 30,75 85,50"
        stroke="#00e676"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="34" cy="140" r="4.5" fill="#ffffff" stroke="#00e676" strokeWidth="1.5" />
      <circle cx="30" cy="125" r="4.5" fill="#ffffff" stroke="#00e676" strokeWidth="1.5" />
      <circle cx="30" cy="110" r="4.5" fill="#ffffff" stroke="#00e676" strokeWidth="1.5" />
      <circle cx="35" cy="95" r="4.5" fill="#ffffff" stroke="#00e676" strokeWidth="1.5" />

      {/* Padi (Rice - Right) */}
      <path
        d="M 162,155 C 180,120 170,75 115,50"
        stroke="#ffea00"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="166" cy="140" r="3" fill="#ffea00" />
      <circle cx="170" cy="125" r="3" fill="#ffea00" />
      <circle cx="170" cy="110" r="3" fill="#ffea00" />
      <circle cx="165" cy="95" r="3" fill="#ffea00" />

      {/* Red Chain Base */}
      <rect x="52" y="156" width="96" height="8" rx="2" fill="#d32f2f" />
      <circle cx="60" cy="160" r="2.5" fill="#ffd54f" />
      <circle cx="70" cy="160" r="2.5" fill="#ffd54f" />
      <circle cx="80" cy="160" r="2.5" fill="#ffd54f" />
      <circle cx="90" cy="160" r="2.5" fill="#ffd54f" />
      <circle cx="100" cy="160" r="2.5" fill="#ffd54f" />
      <circle cx="110" cy="160" r="2.5" fill="#ffd54f" />
      <circle cx="120" cy="160" r="2.5" fill="#ffd54f" />
      <circle cx="130" cy="160" r="2.5" fill="#ffd54f" />

      {/* Scroll Banner BALI DWIPA JAYA */}
      <path
        d="M 40,166 Q 100,176 160,166 L 156,182 Q 100,192 44,182 Z"
        fill="#ffffff"
        stroke="#002bb8"
        strokeWidth="1"
      />
      <text
        x="100"
        y="180"
        fill="#002bb8"
        fontSize="9"
        fontWeight="900"
        textAnchor="middle"
        fontFamily="sans-serif"
        letterSpacing="0.8"
      >
        BALI DWIPA JAYA
      </text>

      {/* Red Lotus Base */}
      <path d="M 50,186 Q 100,210 150,186" fill="#c62828" />
      <path d="M 65,188 L 75,202 L 85,188 L 100,205 L 115,188 L 125,202 L 135,188 Z" fill="#e53935" />
    </svg>
  );
}

/**
 * Dual Logos component showing Kabupaten Bangli + Provinsi Bali side by side
 */
export function DualLogos({
  size = "md",
  showLabels = true,
}: {
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}) {
  const dimensions = {
    sm: "w-8 h-9",
    md: "w-11 h-13",
    lg: "w-14 h-16",
  }[size];

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-xs p-1.5 sm:p-2 rounded-xl border border-white/20 shadow-inner">
      <div className="flex items-center gap-1.5">
        <div className="relative group cursor-pointer" title="Lambang Kabupaten Bangli">
          <LogoBangli className={`${dimensions} transition-transform group-hover:scale-105 drop-shadow-md`} />
        </div>
        <div className="relative group cursor-pointer" title="Lambang Provinsi Bali">
          <LogoBali className={`${dimensions} transition-transform group-hover:scale-105 drop-shadow-md`} />
        </div>
      </div>
      {showLabels && (
        <div className="border-l border-white/20 pl-2 text-left font-display">
          <div className="text-[10px] sm:text-[11px] font-black text-[#d4af37] leading-none uppercase tracking-wider">
            KAB. BANGLI
          </div>
          <div className="text-[9px] sm:text-[10px] font-bold text-white/90 leading-tight uppercase tracking-wider">
            PROV. BALI
          </div>
        </div>
      )}
    </div>
  );
}

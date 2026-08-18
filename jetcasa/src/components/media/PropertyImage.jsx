import { memo } from 'react'

/**
 * Cenas SVG geradas no cliente para ilustrar os imóveis.
 * Não dependem de rede nem de CDN — desenham sempre, mesmo offline —
 * e variam de tom conforme o `seed` para que cada anúncio pareça único.
 */

const SKIES = [
  ['#0b3a8f', '#3f7fd8', '#f6c88a'], // fim de tarde
  ['#0d5fb8', '#5aa7ef', '#dff1ff'], // dia limpo
  ['#123a6b', '#2f6fb5', '#ffd9a8'], // dourado
  ['#0a2f6b', '#4f8ddc', '#eaf4ff'], // manhã
]

const WALLS = [
  ['#ffffff', '#e6ecf5'],
  ['#fdf6ec', '#efe0c9'],
  ['#eef2f7', '#d8e1ec'],
  ['#fbeee6', '#e8d5c6'],
]

function hash(seed = '') {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

function Palm({ x, y, s = 1, tone = '#14532d' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C -3 -22 -2 -38 2 -54" stroke="#6b4423" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g fill={tone} opacity="0.95">
        <path d="M2 -54 C -18 -62 -30 -54 -36 -44 C -22 -52 -10 -52 2 -48Z" />
        <path d="M2 -54 C 22 -63 34 -55 40 -45 C 26 -53 14 -53 2 -48Z" />
        <path d="M2 -54 C -8 -74 -2 -86 8 -92 C 2 -78 2 -66 4 -56Z" />
        <path d="M2 -54 C 16 -70 30 -72 40 -70 C 24 -66 12 -60 4 -52Z" />
      </g>
    </g>
  )
}

function Sky({ gid, sun = true }) {
  return (
    <>
      <rect width="800" height="600" fill={`url(#${gid})`} />
      {sun && <circle cx="640" cy="120" r="46" fill="#fff3c4" opacity="0.55" />}
      {sun && <circle cx="640" cy="120" r="24" fill="#fff8e1" opacity="0.9" />}
      <g fill="#ffffff" opacity="0.5">
        <ellipse cx="170" cy="110" rx="80" ry="24" />
        <ellipse cx="230" cy="98" rx="54" ry="20" />
        <ellipse cx="520" cy="80" rx="62" ry="18" />
      </g>
    </>
  )
}

/* ---------------------------- variantes ---------------------------- */

function Villa({ wall }) {
  return (
    <>
      <rect y="380" width="800" height="220" fill="#7bab5e" />
      <rect y="418" width="800" height="182" fill="#6da052" />
      <path d="M60 420h300v-40H60z" fill="#cfd8e3" />
      {/* corpo principal */}
      <rect x="180" y="200" width="330" height="220" fill={wall[0]} />
      <rect x="180" y="200" width="330" height="24" fill={wall[1]} />
      <rect x="470" y="150" width="200" height="270" fill={wall[1]} />
      <rect x="150" y="186" width="390" height="18" rx="4" fill="#2f4157" />
      <rect x="452" y="136" width="236" height="18" rx="4" fill="#2f4157" />
      {/* janelas */}
      <g fill="#1e3a5f" opacity="0.85">
        <rect x="212" y="238" width="80" height="60" rx="3" />
        <rect x="312" y="238" width="80" height="60" rx="3" />
        <rect x="412" y="238" width="60" height="60" rx="3" />
        <rect x="500" y="190" width="140" height="80" rx="3" />
        <rect x="212" y="330" width="180" height="90" rx="3" />
      </g>
      <g stroke={wall[0]} strokeWidth="4">
        <path d="M252 238v60M352 238v60M570 190v80M500 230h140M302 330v90" />
      </g>
      {/* porta e alpendre */}
      <rect x="500" y="320" width="70" height="100" fill="#8a5a2b" />
      <rect x="596" y="300" width="14" height="120" fill={wall[1]} />
      <rect x="660" y="300" width="14" height="120" fill={wall[1]} />
      <rect x="586" y="288" width="100" height="16" rx="4" fill="#2f4157" />
      <Palm x={110} y={470} s={1.35} />
      <Palm x={720} y={492} s={1.1} tone="#166534" />
      <ellipse cx="330" cy="500" rx="150" ry="26" fill="#87b96a" />
    </>
  )
}

function House({ wall }) {
  return (
    <>
      <rect y="400" width="800" height="200" fill="#82ae63" />
      <rect x="180" y="250" width="440" height="170" fill={wall[0]} />
      <path d="M150 254 400 140l250 114z" fill="#b4462f" />
      <path d="M150 254 400 140l250 114z" fill="#000" opacity="0.08" />
      <rect x="360" y="320" width="80" height="100" fill="#8a5a2b" />
      <circle cx="428" cy="372" r="4" fill="#f5c542" />
      <g fill="#1e3a5f" opacity="0.85">
        <rect x="220" y="300" width="90" height="70" rx="3" />
        <rect x="490" y="300" width="90" height="70" rx="3" />
      </g>
      <g stroke={wall[0]} strokeWidth="4">
        <path d="M265 300v70M220 335h90M535 300v70M490 335h90" />
      </g>
      <rect x="180" y="414" width="440" height="10" fill={wall[1]} />
      <Palm x={710} y={470} s={1.15} />
      <rect x="60" y="404" width="90" height="16" rx="6" fill="#8fbb72" />
      <ellipse cx="400" cy="470" rx="230" ry="28" fill="#8ec06f" />
    </>
  )
}

function Tower({ wall, tone }) {
  const floors = Array.from({ length: 9 })
  return (
    <>
      <rect y="470" width="800" height="130" fill="#9aa7b6" />
      <rect x="60" y="300" width="150" height="180" fill={wall[1]} opacity="0.8" />
      <rect x="620" y="260" width="140" height="220" fill={wall[1]} opacity="0.8" />
      <rect x="250" y="120" width="300" height="360" fill={wall[0]} />
      <rect x="250" y="120" width="300" height="18" fill={tone} />
      {floors.map((_, i) => (
        <g key={i}>
          <rect x="266" y={158 + i * 34} width="120" height="22" rx="2" fill="#1e3a5f" opacity="0.8" />
          <rect x="402" y={158 + i * 34} width="132" height="22" rx="2" fill="#1e3a5f" opacity="0.65" />
          <rect x="250" y={186 + i * 34} width="300" height="3" fill={wall[1]} />
        </g>
      ))}
      <rect x="360" y="420" width="80" height="60" fill="#22364d" />
      <rect x="352" y="410" width="96" height="12" rx="4" fill={tone} />
      <Palm x={140} y={520} s={1.2} />
      <Palm x={690} y={530} s={1} />
      <rect y="470" width="800" height="8" fill="#8b98a8" />
    </>
  )
}

function Duplex({ wall, tone }) {
  return (
    <>
      <rect y="420" width="800" height="180" fill="#7fae63" />
      <rect x="150" y="180" width="500" height="240" fill={wall[0]} />
      <rect x="150" y="180" width="500" height="16" fill={tone} />
      <rect x="150" y="300" width="500" height="8" fill={wall[1]} />
      <g fill="#1e3a5f" opacity="0.85">
        <rect x="180" y="212" width="130" height="70" rx="3" />
        <rect x="340" y="212" width="130" height="70" rx="3" />
        <rect x="500" y="212" width="120" height="70" rx="3" />
        <rect x="180" y="330" width="200" height="80" rx="3" />
        <rect x="420" y="330" width="120" height="80" rx="3" />
      </g>
      <rect x="560" y="340" width="70" height="80" fill="#8a5a2b" />
      <g stroke={wall[0]} strokeWidth="4">
        <path d="M245 212v70M405 212v70M560 212v70M280 330v80" />
      </g>
      <rect x="150" y="284" width="500" height="14" rx="3" fill={tone} opacity="0.8" />
      <Palm x={90} y={500} s={1.25} />
      <Palm x={730} y={480} s={1} />
    </>
  )
}

function Pool({ wall }) {
  return (
    <>
      <rect y="300" width="800" height="300" fill="#8fbf6d" />
      <rect x="120" y="120" width="560" height="150" fill={wall[0]} />
      <rect x="120" y="120" width="560" height="16" fill="#2f4157" />
      <g fill="#1e3a5f" opacity="0.8">
        <rect x="160" y="160" width="150" height="80" rx="3" />
        <rect x="340" y="160" width="150" height="80" rx="3" />
        <rect x="520" y="160" width="120" height="80" rx="3" />
      </g>
      <rect x="80" y="300" width="640" height="24" fill="#e7ecf2" />
      <rect x="140" y="330" width="520" height="180" rx="18" fill="#2196d1" />
      <rect x="160" y="348" width="480" height="146" rx="12" fill="#40b6e8" />
      <g stroke="#ffffff" strokeOpacity="0.55" strokeWidth="6" fill="none">
        <path d="M180 400c40-16 80 16 120 0s80-16 120 0 80 16 120 0" />
        <path d="M180 450c40-16 80 16 120 0s80-16 120 0 80 16 120 0" />
      </g>
      <g fill="#ffffff">
        <rect x="80" y="380" width="46" height="12" rx="6" />
        <rect x="80" y="404" width="46" height="12" rx="6" />
        <rect x="676" y="380" width="46" height="12" rx="6" />
      </g>
      <Palm x={720} y={330} s={1.3} />
      <Palm x={70} y={330} s={1.05} />
    </>
  )
}

function Beach({ wall }) {
  return (
    <>
      <rect y="330" width="800" height="120" fill="#2a9dd6" />
      <g stroke="#ffffff" strokeOpacity="0.6" strokeWidth="5" fill="none">
        <path d="M0 370c50-14 100 14 150 0s100-14 150 0 100 14 150 0 100-14 150 0 100 14 150 0" />
        <path d="M0 410c50-14 100 14 150 0s100-14 150 0 100 14 150 0 100-14 150 0 100 14 150 0" />
      </g>
      <path d="M0 450h800v150H0z" fill="#f2dcae" />
      <path d="M0 450c120 30 240 10 400 26s280 8 400-16v-10H0z" fill="#e8cd99" />
      <rect x="220" y="230" width="360" height="120" fill={wall[0]} />
      <path d="M190 232 400 150l210 82z" fill="#c2703f" />
      <g fill="#1e3a5f" opacity="0.8">
        <rect x="250" y="262" width="90" height="60" rx="3" />
        <rect x="470" y="262" width="90" height="60" rx="3" />
      </g>
      <rect x="370" y="272" width="60" height="78" fill="#8a5a2b" />
      <Palm x={120} y={520} s={1.5} />
      <Palm x={700} y={540} s={1.25} />
      <Palm x={640} y={500} s={0.95} tone="#166534" />
    </>
  )
}

function Land({ wall, variant }) {
  const rows = Array.from({ length: 6 })
  return (
    <>
      <rect y="300" width="800" height="300" fill={variant === 'land-2' ? '#c9b878' : '#8dbb66'} />
      <path d="M0 300h800v40H0z" fill="#000" opacity="0.06" />
      {/* horizonte com casas ao fundo */}
      <g fill={wall[1]} opacity="0.9">
        <rect x="40" y="250" width="70" height="50" />
        <rect x="130" y="262" width="54" height="38" />
        <rect x="640" y="246" width="90" height="54" />
      </g>
      {/* lote demarcado */}
      <path d="M120 560 300 330h340l160 230z" fill={variant === 'land-2' ? '#d8c88c' : '#9dcb73'} stroke="#ffffff" strokeWidth="6" strokeDasharray="18 12" />
      {rows.map((_, i) => (
        <path
          key={i}
          d={`M${186 + i * 20} ${520 - i * 30} H${640 - i * 22}`}
          stroke="#ffffff"
          strokeOpacity="0.28"
          strokeWidth="3"
        />
      ))}
      {/* estacas de marcação */}
      {[[120, 560], [300, 330], [640, 330], [780, 560]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x - 3} y={y - 40} width="6" height="40" fill="#8a5a2b" />
          <rect x={x - 14} y={y - 52} width="28" height="14" rx="3" fill="#f59e0b" />
        </g>
      ))}
      <Palm x={70} y={430} s={1.1} />
      <Palm x={735} y={400} s={0.9} />
    </>
  )
}

function Aerial({ gid }) {
  return (
    <>
      <rect width="800" height="600" fill="#8fbf6d" />
      <path d="M0 0h800v600H0z" fill={`url(#${gid})`} opacity="0.12" />
      {/* estradas */}
      <rect y="230" width="800" height="52" fill="#6b7280" />
      <rect x="330" width="56" height="600" fill="#6b7280" />
      <g stroke="#f8fafc" strokeWidth="4" strokeDasharray="26 22">
        <path d="M0 256h800M358 0v600" />
      </g>
      {/* quarteirões */}
      {[
        [40, 40, 250, 150],
        [430, 30, 320, 160],
        [40, 330, 250, 220],
        [430, 320, 150, 100],
        [610, 320, 150, 230],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#a7cf83" stroke="#ffffff" strokeWidth="4" />
          <rect x={x + 18} y={y + 18} width={w * 0.42} height={h * 0.4} fill="#e8eef6" />
          <rect x={x + 18} y={y + 18} width={w * 0.42} height={h * 0.4} fill="#000" opacity="0.05" />
          <rect x={x + w * 0.56} y={y + h * 0.5} width={w * 0.32} height={h * 0.34} fill="#dfe7f1" />
        </g>
      ))}
      <circle cx="470" cy="430" r="34" fill="#39a7dd" />
      <g fill="#3f8f4d" opacity="0.75">
        <circle cx="120" cy="290" r="16" />
        <circle cx="200" cy="300" r="12" />
        <circle cx="700" cy="270" r="18" />
      </g>
    </>
  )
}

function Office({ wall, tone }) {
  return (
    <>
      <rect y="480" width="800" height="120" fill="#98a4b3" />
      <rect x="120" y="90" width="270" height="390" fill={wall[0]} />
      <rect x="410" y="180" width="280" height="300" fill={wall[1]} />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x="140" y={116 + i * 36} width="230" height="24" fill="#22447a" opacity={0.55 + (i % 3) * 0.12} />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x="432" y={206 + i * 38} width="236" height="26" fill="#22447a" opacity={0.45 + (i % 3) * 0.14} />
      ))}
      <rect x="120" y="90" width="270" height="14" fill={tone} />
      <rect x="410" y="180" width="280" height="14" fill={tone} />
      <rect x="200" y="420" width="110" height="60" fill="#1f3557" />
      <rect x="190" y="410" width="130" height="12" rx="4" fill={tone} />
      <rect y="480" width="800" height="6" fill="#8894a5" />
      <g fill="#4b5563">
        <rect x="470" y="440" width="60" height="26" rx="6" />
        <rect x="560" y="446" width="50" height="20" rx="5" />
      </g>
    </>
  )
}

function Warehouse({ wall, tone }) {
  return (
    <>
      <rect y="440" width="800" height="160" fill="#9aa7b6" />
      <path d="M90 250 400 150l310 100v210H90z" fill={wall[0]} />
      <path d="M90 250 400 150l310 100z" fill={tone} opacity="0.85" />
      <rect x="180" y="330" width="180" height="130" fill="#4b5f7a" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x="180" y={336 + i * 21} width="180" height="10" fill="#37485e" />
      ))}
      <rect x="430" y="330" width="220" height="90" fill="#1e3a5f" opacity="0.7" />
      <g stroke={wall[0]} strokeWidth="5">
        <path d="M540 330v90M430 375h220" />
      </g>
      <rect x="420" y="440" width="260" height="10" fill="#7c8899" />
      <rect y="440" width="800" height="6" fill="#8894a5" />
    </>
  )
}

function Construction({ wall, tone }) {
  return (
    <>
      <rect y="450" width="800" height="150" fill="#b9a37f" />
      <rect x="200" y="180" width="330" height="270" fill={wall[1]} />
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect x="200" y={180 + i * 68} width="330" height="10" fill="#9aa5b4" />
          {Array.from({ length: 4 }).map((__, j) => (
            <rect key={j} x={210 + j * 82} y={190 + i * 68} width="18" height="58" fill="#aeb8c6" />
          ))}
        </g>
      ))}
      {/* grua */}
      <rect x="600" y="120" width="14" height="330" fill={tone} />
      <rect x="430" y="112" width="290" height="12" fill={tone} />
      <path d="M607 112 720 124M607 112 430 124" stroke={tone} strokeWidth="4" />
      <rect x="486" y="124" width="8" height="70" fill="#94a3b8" />
      <rect x="470" y="194" width="40" height="28" fill="#f59e0b" />
      {/* andaimes e vedação */}
      <g stroke="#f59e0b" strokeWidth="6">
        <path d="M120 450v-60M170 450v-60M120 410h50" />
      </g>
      <g fill="#f59e0b">
        <rect x="60" y="426" width="120" height="10" rx="3" />
        <rect x="640" y="426" width="120" height="10" rx="3" />
      </g>
      <rect y="450" width="800" height="8" fill="#a89170" />
    </>
  )
}

function InteriorLiving({ wall, tone }) {
  return (
    <>
      <rect width="800" height="600" fill={wall[0]} />
      <rect y="430" width="800" height="170" fill="#c9a781" />
      <path d="M0 430h800v14H0z" fill="#b08f6a" />
      {/* janela */}
      <rect x="470" y="90" width="270" height="250" rx="6" fill="#8fd0f0" />
      <rect x="470" y="90" width="270" height="250" rx="6" fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <path d="M605 90v250M470 215h270" stroke="#e2e8f0" strokeWidth="8" />
      <path d="M470 250h270v90H470z" fill="#7cc27f" opacity="0.5" />
      {/* sofá */}
      <rect x="90" y="300" width="300" height="90" rx="18" fill={tone} />
      <rect x="90" y="270" width="300" height="60" rx="18" fill={tone} opacity="0.85" />
      <rect x="120" y="286" width="70" height="46" rx="10" fill="#ffffff" opacity="0.5" />
      <rect x="290" y="286" width="70" height="46" rx="10" fill="#ffffff" opacity="0.4" />
      <rect x="86" y="386" width="16" height="30" rx="4" fill="#7c5a3a" />
      <rect x="378" y="386" width="16" height="30" rx="4" fill="#7c5a3a" />
      {/* mesa e tapete */}
      <ellipse cx="300" cy="470" rx="260" ry="52" fill="#d9c3a5" />
      <rect x="200" y="410" width="180" height="16" rx="6" fill="#8a5a2b" />
      <rect x="216" y="426" width="10" height="34" fill="#8a5a2b" />
      <rect x="354" y="426" width="10" height="34" fill="#8a5a2b" />
      {/* candeeiro e quadro */}
      <rect x="640" y="360" width="10" height="90" fill="#475569" />
      <path d="M615 360h60l-14-40h-32z" fill="#fde68a" />
      <rect x="110" y="120" width="150" height="110" rx="6" fill="#e2e8f0" />
      <rect x="126" y="136" width="118" height="78" fill={tone} opacity="0.5" />
    </>
  )
}

function InteriorKitchen({ wall, tone }) {
  return (
    <>
      <rect width="800" height="600" fill={wall[0]} />
      <rect y="440" width="800" height="160" fill="#d6d3d1" />
      <g opacity="0.5" stroke="#bcb8b4" strokeWidth="3">
        <path d="M0 480h800M0 530h800M120 440v160M320 440v160M520 440v160M700 440v160" />
      </g>
      {/* armários superiores */}
      <rect x="60" y="120" width="330" height="120" rx="6" fill={tone} />
      <path d="M225 120v120" stroke={wall[0]} strokeWidth="6" />
      <rect x="150" y="172" width="60" height="8" rx="4" fill="#e2e8f0" />
      <rect x="240" y="172" width="60" height="8" rx="4" fill="#e2e8f0" />
      {/* bancada */}
      <rect x="60" y="330" width="420" height="22" rx="6" fill="#334155" />
      <rect x="60" y="352" width="420" height="110" fill={tone} opacity="0.9" />
      <path d="M200 352v110M340 352v110" stroke={wall[0]} strokeWidth="6" />
      {/* ilha */}
      <rect x="520" y="352" width="230" height="24" rx="6" fill="#334155" />
      <rect x="540" y="376" width="190" height="110" fill={tone} />
      <rect x="600" y="300" width="8" height="52" fill="#94a3b8" />
      <path d="M604 300c0-22 40-22 40 0" stroke="#94a3b8" strokeWidth="8" fill="none" />
      {/* janela e bancos */}
      <rect x="520" y="110" width="220" height="150" rx="6" fill="#8fd0f0" stroke="#e2e8f0" strokeWidth="10" />
      <path d="M630 110v150" stroke="#e2e8f0" strokeWidth="8" />
      <g fill="#8a5a2b">
        <rect x="560" y="300" width="10" height="52" />
        <rect x="700" y="300" width="10" height="52" />
      </g>
      <rect x="90" y="250" width="120" height="60" rx="6" fill="#e2e8f0" />
    </>
  )
}

function InteriorOffice({ wall, tone }) {
  return (
    <>
      <rect width="800" height="600" fill={wall[0]} />
      <rect y="430" width="800" height="170" fill="#94a3b8" opacity="0.35" />
      <rect x="420" y="80" width="340" height="280" rx="6" fill="#8fd0f0" stroke="#e2e8f0" strokeWidth="10" />
      <path d="M590 80v280M420 220h340" stroke="#e2e8f0" strokeWidth="8" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${40 + i * 220} ${300})`}>
          <rect width="180" height="18" rx="5" fill={tone} />
          <rect x="14" y="18" width="10" height="60" fill="#64748b" />
          <rect x="156" y="18" width="10" height="60" fill="#64748b" />
          <rect x="52" y="-52" width="76" height="52" rx="4" fill="#1e293b" />
          <rect x="60" y="-44" width="60" height="36" fill="#38bdf8" opacity="0.8" />
          <rect x="80" y="0" width="20" height="6" fill="#334155" />
          <rect x="30" y="90" width="60" height="16" rx="8" fill="#475569" />
        </g>
      ))}
      <rect x="40" y="120" width="140" height="150" rx="6" fill={tone} opacity="0.4" />
      <g fill="#3f8f4d" opacity="0.8">
        <circle cx="740" cy="420" r="28" />
        <rect x="730" y="440" width="20" height="30" fill="#8a5a2b" />
      </g>
    </>
  )
}

const VARIANTS = {
  villa: Villa,
  house: House,
  tower: Tower,
  duplex: Duplex,
  pool: Pool,
  beach: Beach,
  land: Land,
  'land-2': Land,
  aerial: Aerial,
  office: Office,
  warehouse: Warehouse,
  construction: Construction,
  'interior-living': InteriorLiving,
  'interior-kitchen': InteriorKitchen,
  'interior-office': InteriorOffice,
}

const INTERIOR = new Set(['interior-living', 'interior-kitchen', 'interior-office', 'aerial'])

function PropertyImage({ variant = 'villa', seed = '', className = '', alt = '' }) {
  const h = hash(`${seed}${variant}`)
  const sky = SKIES[h % SKIES.length]
  const wall = WALLS[(h >>> 3) % WALLS.length]
  const tone = INTERIOR.has(variant)
    ? ['#7c8a9c', '#0f766e', '#a1662f', '#5b6b7f'][(h >>> 5) % 4]
    : ['#0052ff', '#0f766e', '#b45309', '#475569'][(h >>> 5) % 4]
  const Scene = VARIANTS[variant] ?? Villa
  const gid = `sky-${h.toString(36)}`

  return (
    <svg
      viewBox="0 0 800 600"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="55%" stopColor={sky[1]} />
          <stop offset="100%" stopColor={sky[2]} />
        </linearGradient>
      </defs>
      {!INTERIOR.has(variant) && <Sky gid={gid} />}
      <Scene wall={wall} tone={tone} variant={variant} gid={gid} />
    </svg>
  )
}

export default memo(PropertyImage)

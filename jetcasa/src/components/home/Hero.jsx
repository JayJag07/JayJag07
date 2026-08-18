import SearchBar from '../search/SearchBar'

/**
 * Hero com cena de Luanda desenhada em SVG (baía, marginal e torres),
 * animada de forma subtil e sem qualquer pedido de rede.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <svg viewBox="0 0 1440 720" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <defs>
            <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#04143b" />
              <stop offset="45%" stopColor="#0b3f8f" />
              <stop offset="78%" stopColor="#2f7fd0" />
              <stop offset="100%" stopColor="#f6c88a" />
            </linearGradient>
            <linearGradient id="hero-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d4d86" />
              <stop offset="100%" stopColor="#062f57" />
            </linearGradient>
            <linearGradient id="hero-veil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" stopOpacity="0.62" />
              <stop offset="55%" stopColor="#020617" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          <rect width="1440" height="720" fill="url(#hero-sky)" />
          <circle cx="1140" cy="470" r="70" fill="#ffe6b0" opacity="0.55" />
          <circle cx="1140" cy="470" r="40" fill="#fff4d6" opacity="0.85" />

          {/* skyline distante */}
          <g fill="#0a2a5c" opacity="0.9">
            {[
              [40, 300, 60, 240], [110, 350, 44, 190], [166, 250, 70, 290],
              [250, 320, 50, 220], [312, 280, 66, 260], [390, 200, 54, 340],
              [456, 330, 48, 210], [516, 260, 74, 280], [604, 300, 46, 240],
              [664, 220, 62, 320], [740, 320, 52, 220], [806, 270, 68, 270],
              [890, 310, 44, 230], [948, 240, 60, 300], [1022, 330, 50, 210],
              [1086, 290, 66, 250], [1168, 260, 52, 280], [1234, 330, 60, 210],
              [1308, 280, 72, 260], [1392, 320, 48, 220],
            ].map(([x, y, w, h], i) => (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h} />
                <g fill="#ffd98a" opacity="0.5">
                  {Array.from({ length: Math.floor(h / 40) }).map((_, r) => (
                    <rect key={r} x={x + 8} y={y + 16 + r * 40} width={w - 16} height={10} />
                  ))}
                </g>
              </g>
            ))}
          </g>

          {/* baía */}
          <rect y="560" width="1440" height="160" fill="url(#hero-water)" />
          <g stroke="#7fc4ef" strokeOpacity="0.35" strokeWidth="4" fill="none">
            <path d="M0 600c60-14 120 14 180 0s120-14 180 0 120 14 180 0 120-14 180 0 120 14 180 0 120-14 180 0 120 14 180 0">
              <animate attributeName="stroke-opacity" values="0.35;0.15;0.35" dur="6s" repeatCount="indefinite" />
            </path>
            <path d="M0 650c60-14 120 14 180 0s120-14 180 0 120 14 180 0 120-14 180 0 120 14 180 0 120-14 180 0 120 14 180 0" />
          </g>

          {/* marginal em primeiro plano */}
          <path d="M0 560h1440v18H0z" fill="#0f172a" opacity="0.6" />
          <g fill="#0b1220" opacity="0.85">
            <rect y="578" width="1440" height="142" />
          </g>
          <g stroke="#f8fafc" strokeOpacity="0.28" strokeWidth="4" strokeDasharray="30 26">
            <path d="M0 636h1440" />
          </g>
          {/* palmeiras da marginal */}
          {[80, 300, 560, 820, 1080, 1340].map((x, i) => (
            <g key={x} transform={`translate(${x} 590) scale(${1 + (i % 3) * 0.15})`} fill="#0f3d24">
              <path d="M0 0C-4-26-3-46 3-66" stroke="#3f2d1c" strokeWidth="6" fill="none" />
              <path d="M3-66C-20-76-34-66-40-54C-24-64-10-64 3-59Z" />
              <path d="M3-66C26-77 40-67 46-55C30-65 16-65 3-59Z" />
              <path d="M3-66C-8-90 0-104 12-110C4-94 3-80 5-68Z" />
            </g>
          ))}

          <rect width="1440" height="720" fill="url(#hero-veil)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-32">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white ring-1 ring-white/25 backdrop-blur">
          O seu portal imobiliário em Angola
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white text-balance drop-shadow-sm sm:text-5xl lg:text-6xl">
          Encontre a sua próxima casa, apartamento ou{' '}
          <span className="text-gold-400">terreno</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          De forma rápida e segura — em Luanda, Benguela, Huambo, Cabinda e em todas as províncias
          do país. Valores em Kwanza, documentação verificada.
        </p>

        <div className="mt-9 animate-[var(--animate-fade-up)]">
          <SearchBar variant="hero" />
        </div>
      </div>
    </section>
  )
}

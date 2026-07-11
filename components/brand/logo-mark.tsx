import { BRAND } from "@/lib/brand";

/**
 * The PaperLab mark: a flask (the "lab" in PaperLab) holding a small
 * connected-node network (the "AI"). Built from plain SVG primitives only —
 * every element here also renders correctly inside next/og's ImageResponse
 * (satori), so this single component is reused for the in-app UI, the
 * favicon, the apple touch icon, and the social share image.
 */
export function LogoMark({
  size = 64,
  detailed = true,
}: {
  size?: number;
  detailed?: boolean;
}) {
  const r = size * 0.22;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pl-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BRAND.colors.primary} />
          <stop offset="100%" stopColor={BRAND.colors.accent} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#pl-bg)" />
      {/* flask glass */}
      <path
        d="M42 14 H58 V34 L79 80 Q83 88 74 88 H26 Q17 88 21 80 L42 34 Z"
        fill={BRAND.colors.void}
        opacity={0.92}
      />
      {/* liquid level */}
      <path
        d="M31 58 H69 L79 80 Q83 88 74 88 H26 Q17 88 21 80 Z"
        fill={BRAND.colors.accent}
        opacity={0.6}
      />
      {detailed && (
        <g>
          <line x1="40" y1="72" x2="52" y2="64" stroke={BRAND.colors.ink} strokeWidth="2.4" />
          <line x1="52" y1="64" x2="64" y2="74" stroke={BRAND.colors.ink} strokeWidth="2.4" />
          <circle cx="40" cy="72" r="4" fill={BRAND.colors.ink} />
          <circle cx="52" cy="64" r="4" fill={BRAND.colors.ink} />
          <circle cx="64" cy="74" r="4" fill={BRAND.colors.ink} />
        </g>
      )}
    </svg>
  );
}

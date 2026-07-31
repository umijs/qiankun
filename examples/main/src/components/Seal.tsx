/**
 * The brand chop, stamped 乾坤. It carries the logo's construction rather than its shape:
 * a purple field cut by an amber corner, which is what the mark does with its rings.
 */
export default function Seal({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" role="img" aria-label="qiankun seal">
      <rect width="36" height="36" rx="7" fill="#6051A5" />
      {/* the amber cut, mirroring the logo's notched rings */}
      <path d="M36 22v7a7 7 0 0 1-7 7h-7z" fill="#E5A540" />
      <rect x="2.5" y="2.5" width="31" height="31" rx="5" fill="none" stroke="#F6F7F9" strokeOpacity="0.3" />
      <text
        x="10"
        y="15"
        fontSize="12"
        fill="#F6F7F9"
        fontFamily="'Songti SC', 'STSong', serif"
        fontWeight="600"
        textAnchor="middle"
        dominantBaseline="central"
      >
        乾
      </text>
      <text
        x="24"
        y="15"
        fontSize="12"
        fill="#F6F7F9"
        fontFamily="'Songti SC', 'STSong', serif"
        fontWeight="600"
        textAnchor="middle"
        dominantBaseline="central"
      >
        坤
      </text>
    </svg>
  );
}

/** The cinnabar seal: the shell's brand chop, stamped 乾坤. */
export default function Seal({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" role="img" aria-label="qiankun seal">
      <rect width="36" height="36" rx="7" fill="#D93026" />
      <rect x="2.5" y="2.5" width="31" height="31" rx="5" fill="none" stroke="#F6F7F9" strokeOpacity="0.35" />
      <text
        x="10"
        y="16"
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
        x="26"
        y="21"
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

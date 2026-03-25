interface MaterialIconProps {
  icon: string;
  size?: number;
  color?: string;
  filled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function MaterialIcon({ icon, size = 24, color, filled = false, className = '', style }: MaterialIconProps) {
  return (
    <span
      className={`ms ${className}`}
      style={{
        fontSize: size,
        color,
        fontVariationSettings: filled ? "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24" : "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24",
        ...style,
      }}
    >
      {icon}
    </span>
  );
}

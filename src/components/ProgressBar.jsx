export default function ProgressBar({
  value,
  className = "",
  height = 8,
  label,
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div
      className={`bar ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={label}
    >
      <div className="bar__fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}

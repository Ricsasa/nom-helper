/**
 * The two squares are the whole logo: green for user action, violet for system
 * provenance. Squares, never circles (design 5.2).
 */
export function BrandSquares({ size = 10, gap = 'gap-2' }: { size?: number; gap?: string }) {
  const box = { width: `${size}px`, height: `${size}px` };
  return (
    <div className={`flex ${gap}`} aria-hidden="true">
      <div className="bg-green" style={box} />
      <div className="bg-violet" style={box} />
    </div>
  );
}

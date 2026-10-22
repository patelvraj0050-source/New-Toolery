import { useState, useRef, useCallback, useEffect } from 'react';
import { MoveHorizontal, Eye } from 'lucide-react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Original',
  afterLabel = 'Publication Cutout',
  aspectRatio = '4/3',
  className = '',
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e) => {
      if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging, handleMove]);

  return (
    <div
      ref={containerRef}
      className={`before-after-container relative overflow-hidden select-none rounded-2xl border border-white/10 shadow-2xl ${className}`}
      style={{
        aspectRatio,
        cursor: isDragging ? 'ew-resize' : 'default',
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* Background (After / Cutout) */}
      <div
        className="absolute inset-0 w-full h-full bg-checkerboard flex items-center justify-center overflow-hidden"
        style={{
          backgroundSize: '20px 20px',
          backgroundImage:
            'linear-gradient(45deg, #1c1d29 25%, transparent 25%), linear-gradient(-45deg, #1c1d29 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1c1d29 75%), linear-gradient(-45deg, transparent 75%, #1c1d29 75%)',
          backgroundColor: '#12131c',
        }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-full object-contain pointer-events-none"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {afterLabel}
        </div>
      </div>

      {/* Foreground (Before / Original with clip-path) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-contain pointer-events-none"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
          <Eye size={12} className="text-indigo-400" />
          {beforeLabel}
        </div>
      </div>

      {/* Divider Line & Interactive Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 via-cyan-400 to-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-900/90 border border-indigo-400/80 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.6)] flex items-center justify-center cursor-ew-resize pointer-events-auto hover:scale-110 active:scale-95 transition-transform"
        >
          <MoveHorizontal size={16} className="text-cyan-300" />
        </div>
      </div>
    </div>
  );
}

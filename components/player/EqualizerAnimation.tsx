import React from 'react';

export const EqualizerAnimation: React.FC<{ isPlaying?: boolean; color?: string }> = ({
  isPlaying = true,
  color = 'bg-emerald-400'
}) => {
  return (
    <div className="flex items-end gap-0.5 h-4 w-4">
      <span className={`w-0.5 rounded-full ${color} ${isPlaying ? 'animate-eq-1' : 'h-1.5'}`} />
      <span className={`w-0.5 rounded-full ${color} ${isPlaying ? 'animate-eq-2' : 'h-3'}`} />
      <span className={`w-0.5 rounded-full ${color} ${isPlaying ? 'animate-eq-3' : 'h-2'}`} />
      <span className={`w-0.5 rounded-full ${color} ${isPlaying ? 'animate-eq-4' : 'h-1'}`} />
    </div>
  );
};

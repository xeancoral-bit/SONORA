import React from 'react';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#08090c] flex flex-col justify-center items-center select-none">
      {/* Immersive background aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full relative z-10 py-8 px-4 flex justify-center items-center min-h-screen">
        {children}
      </div>
    </div>
  );
}

import React from 'react';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0a0c] select-none">
      {/* Immersive subtle ambient aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-blue-500/[0.04] rounded-full blur-[100px] sm:blur-[140px]" />
      </div>

      {/* Cross-gadget responsive scrollable container (smartphones, tablets, laptops, ultrawide) */}
      <div className="auth-viewport w-full flex items-center justify-center">
        <div className="w-full max-w-[460px] relative z-10 my-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

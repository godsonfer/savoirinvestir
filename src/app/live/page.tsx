'use client';

import React from 'react';
import Image from 'next/image';

export default function Live(): React.JSX.Element {
  return (
    <div className="w-full  bg-[#111827] bg-opacity-95 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animations de fond */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 md:w-72 h-48 md:h-72 bg-[#0097A7]/5 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/3 w-48 md:w-72 h-48 md:h-72 bg-[#D6620F]/5 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-48 md:w-72 h-48 md:h-72 bg-[#0097A7]/5 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute -bottom-8 -left-8 w-48 md:w-72 h-48 md:h-72 bg-[#D6620F]/5 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-6000" />
      </div>

      {/* Overlay gradient subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/10 to-[#D6620F]/10 mix-blend-overlay" />

      <div className="relative mx-auto text-center z-10">
        {/* Logo */}
        <div className="mb-12 transform hover:scale-105 transition-transform duration-300">
          <Image src="/logo.svg" alt="Logo" width={120} height={90} className="mx-auto drop-shadow-2xl" />
        </div>

        {/* Contenu principal */}
        <div className="relative backdrop-blur-xl bg-white/[0.02] p-12 rounded-2xl shadow-2xl border border-white/[0.05]">
          <div className="space-y-10">
            {/* Badge "Bientôt disponible" */}
            <div className="inline-block animate-float">
              <span className="px-6 py-3 rounded-full bg-[#0097A7]/10 text-[#0097A7] text-sm font-medium border border-[#0097A7]/20 flex items-center gap-2 backdrop-blur-sm">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Bientôt disponible
              </span>
            </div>

            {/* Titre principal avec animation de gradient */}
            <h1 className="text-6xl font-bold mb-4 animate-gradient bg-gradient-to-r from-[#0097A7] via-[#D6620F] to-[#0097A7] bg-300% bg-clip-text text-transparent flex items-center justify-center gap-3">
              <svg className="w-12 h-12 text-[#0097A7]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Prochainement
              <svg className="w-12 h-12 text-[#D6620F]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </h1>

            {/* Sous-titre avec effet de fade */}
            <h2 className="text-2xl text-[#FEFFFF]/60 font-light flex items-center justify-center gap-2">
              <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Cette section est en cours de développement
            </h2>

            {/* Message principal avec style amélioré */}
            <p className="text-lg text-[#FEFFFF]/40 leading-relaxed max-w-2xl mx-auto">
              Nous travaillons actuellement sur de nouvelles fonctionnalités passionnantes 
              pour améliorer votre expérience. Revenez bientôt pour découvrir les nouveautés !
            </p>

            {/* Barre de progression animée */}
            <div className="max-w-md mx-auto mt-8">
              <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden backdrop-blur-sm">
                <div className="w-1/2 h-full bg-gradient-to-r from-[#0097A7] to-[#D6620F] animate-progress" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour les animations personnalisées */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .bg-300\% {
          background-size: 300% 300%;
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.2); }
          66% { transform: translate(-20px, 20px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 

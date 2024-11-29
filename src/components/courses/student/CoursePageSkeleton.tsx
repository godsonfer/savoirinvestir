
export const CoursePageSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0097A7]/20 via-black/5 to-black/90">
            <section className="relative h-[85vh] md:h-[80vh]">
                {/* Background skeleton avec effet de pulse */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 animate-pulse" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                </div>

                <div className="absolute inset-0 z-10">
                    <div className="container mx-auto px-4 h-full">
                        <div className="flex flex-col lg:flex-row gap-6 md:gap-12 h-full items-center pt-16 md:pt-0">
                            {/* Colonne de gauche */}
                            <div className="flex-1 space-y-6 w-full">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-3">
                                    <div className="h-8 w-24 md:w-32 bg-white/10 rounded-full animate-pulse" />
                                    <div className="h-8 w-24 md:w-32 bg-white/10 rounded-full animate-pulse" />
                                </div>

                                {/* Titre */}
                                <div className="space-y-3">
                                    <div className="h-8 md:h-12 w-full md:w-3/4 bg-white/10 rounded-lg animate-pulse" />
                                    <div className="h-8 md:h-12 w-2/3 md:w-1/2 bg-white/10 rounded-lg animate-pulse" />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <div className="h-4 md:h-6 w-full bg-white/10 rounded animate-pulse" />
                                    <div className="h-4 md:h-6 w-5/6 bg-white/10 rounded animate-pulse" />
                                    <div className="h-4 md:h-6 w-4/6 bg-white/10 rounded animate-pulse hidden md:block" />
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex flex-wrap gap-3">
                                    <div className="h-10 w-28 md:w-32 bg-white/10 rounded-lg animate-pulse" />
                                    <div className="h-10 w-28 md:w-32 bg-white/10 rounded-lg animate-pulse" />
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div 
                                            key={i}
                                            className="bg-white/10 rounded-xl p-4 animate-pulse"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20" />
                                                <div className="space-y-2">
                                                    <div className="h-4 md:h-6 w-12 md:w-16 bg-white/20 rounded" />
                                                    <div className="h-3 md:h-4 w-16 md:w-20 bg-white/20 rounded" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Boutons de dialogue */}
                                <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-10 w-28 md:w-32 bg-white/10 rounded-lg animate-pulse flex-shrink-0" />
                                    ))}
                                </div>
                            </div>

                            {/* Colonne de droite - Carte d'inscription */}
                            <div className="w-full lg:w-[420px] xl:w-[480px] mt-6 lg:mt-0">
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6">
                                    <div className="space-y-8">
                                        {/* Prix */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-10 md:h-12 w-32 bg-white/10 rounded-lg animate-pulse" />
                                            <div className="h-4 md:h-6 w-24 bg-white/10 rounded animate-pulse" />
                                        </div>

                                        {/* Bouton d'action */}
                                        <div className="h-12 md:h-14 w-full bg-gradient-to-r from-[#0097A7]/30 to-[#D6620F]/30 rounded-xl animate-pulse" />

                                        {/* Features */}
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                                                    <div className="h-4 md:h-6 w-36 md:w-48 bg-white/10 rounded animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
} 

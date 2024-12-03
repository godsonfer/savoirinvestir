export const WelcomeSection = () => {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Une Formation Complete pour Réussir en Trading
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Notre plateforme vous offre une formation complète et structurée, 
                            conçue par des traders professionnels. Que vous soyez débutant ou 
                            trader expérimenté, nos cours s'adaptent à votre niveau.
                        </p>
                        <div className="space-y-4">
                            {[
                                "Analyse technique et fondamentale",
                                "Gestion des risques et du capital",
                                "Psychologie du trading",
                                "Stratégies avancées de trading"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-teal-600" />
                                    </div>
                                    <span className="text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-video rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-500 shadow-2xl">
                            {/* Vous pouvez ajouter une image ou une vidéo ici */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 

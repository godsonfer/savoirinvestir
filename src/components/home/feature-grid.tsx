interface Feature {
    title: string;
    description: string;
    icon: string;
}

export const FeatureGrid = () => {
    const features: Feature[] = [
        {
            title: "Analyse Technique Avancée",
            description: "Maîtrisez les outils et indicateurs techniques pour prendre des décisions éclairées",
            icon: "📊"
        },
        {
            title: "Trading en Direct",
            description: "Sessions de trading en direct avec nos experts pour un apprentissage pratique",
            icon: "🎯"
        },
        {
            title: "Gestion des Risques",
            description: "Apprenez à protéger et faire fructifier votre capital avec des stratégies éprouvées",
            icon: "🛡️"
        },
        {
            title: "Communauté Active",
            description: "Rejoignez une communauté de traders et partagez vos expériences",
            icon: "👥"
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Pourquoi Choisir Notre Formation ?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Découvrez nos fonctionnalités uniques pour accélérer votre apprentissage
                        et devenir un trader performant.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">{feature.icon}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 

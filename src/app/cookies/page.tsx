"use client"

export default function PolitiqueCookies() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique des Cookies</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
                        <p className="text-gray-600">
                            Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile 
                            lorsque vous visitez un site web. Les cookies nous permettent de reconnaître votre 
                            appareil et d&apos;améliorer votre expérience utilisateur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Types de cookies utilisés</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-800">Cookies essentiels</h3>
                                <p className="text-gray-600">Nécessaires au fonctionnement du site</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">Cookies analytiques</h3>
                                <p className="text-gray-600">Pour comprendre comment les visiteurs utilisent notre site</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">Cookies de préférences</h3>
                                <p className="text-gray-600">Pour mémoriser vos choix et personnaliser votre expérience</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Gestion des cookies</h2>
                        <p className="text-gray-600">
                            Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez 
                            supprimer tous les cookies déjà présents sur votre ordinateur et paramétrer la plupart 
                            des navigateurs pour qu&apos;ils les bloquent.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
} 

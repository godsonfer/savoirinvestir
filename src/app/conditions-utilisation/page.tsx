"use client"

export default function ConditionsUtilisation() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions d&apos;Utilisation</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptation des conditions</h2>
                        <p className="text-gray-600">
                            En accédant et en utilisant ce site, vous acceptez d&apos;être lié par ces conditions 
                            d&apos;utilisation, toutes les lois et règlements applicables, et acceptez que vous 
                            êtes responsable du respect des lois locales applicables.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Propriété intellectuelle</h2>
                        <p className="text-gray-600">
                            Tout le contenu présent sur ce site (textes, images, vidéos, etc.) est la propriété 
                            exclusive d&apos;Invest Mastery Mind et est protégé par les lois sur la propriété 
                            intellectuelle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Responsabilité</h2>
                        <p className="text-gray-600">
                            Les informations fournies sur ce site le sont à titre informatif uniquement. 
                            Invest Mastery Mind ne peut garantir l&apos;exactitude, l&apos;exhaustivité ou 
                            la pertinence des informations fournies.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
} 

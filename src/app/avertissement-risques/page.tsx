"use client"

export default function AvertissementRisques() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Avertissement sur les Risques</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Le trading comporte des risques significatifs de perte en capital.
                                </p>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Risques liés au trading</h2>
                        <p className="text-gray-600">
                            Le trading de produits financiers comporte un niveau élevé de risque et peut entraîner 
                            la perte de tout ou partie de votre investissement. Les performances passées ne préjugent 
                            pas des performances futures.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Absence de conseils financiers</h2>
                        <p className="text-gray-600">
                            Le contenu de ce site et nos formations sont fournis à titre purement éducatif. 
                            Nous ne fournissons pas de conseils financiers personnalisés ni de recommandations 
                            d&apos;investissement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommandations</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Ne tradez qu&apos;avec des fonds que vous pouvez vous permettre de perdre</li>
                            <li>Consultez un conseiller financier professionnel avant toute décision d&apos;investissement</li>
                            <li>Formez-vous et comprenez les risques avant de commencer à trader</li>
                            <li>Utilisez toujours une gestion des risques appropriée</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
} 

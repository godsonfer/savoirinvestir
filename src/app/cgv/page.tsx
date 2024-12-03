"use client"

export default function CGV() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales de Vente</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Objet</h2>
                        <p className="text-gray-600">
                            Les présentes CGV régissent les relations entre Invest Mastery Mind et ses clients 
                            dans le cadre de la vente de formations et services en ligne liés au trading et à 
                            l&apos;investissement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Prix et paiement</h2>
                        <p className="text-gray-600">
                            Les prix sont indiqués en euros TTC. Le paiement s&apos;effectue en ligne via des 
                            moyens de paiement sécurisés. L&apos;accès aux formations est activé après 
                            confirmation du paiement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Droit de rétractation</h2>
                        <p className="text-gray-600">
                            Conformément à la législation en vigueur, vous disposez d&apos;un délai de 14 jours 
                            pour exercer votre droit de rétractation à compter de la date d&apos;achat.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Propriété intellectuelle</h2>
                        <p className="text-gray-600">
                            Tout le contenu des formations est protégé par les droits de propriété intellectuelle. 
                            L&apos;accès aux formations est strictement personnel et non cessible.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Responsabilité</h2>
                        <p className="text-gray-600">
                            Nos formations sont à but éducatif uniquement. Nous ne pouvons garantir de résultats 
                            spécifiques. Chaque client est responsable de ses décisions d&apos;investissement.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
} 

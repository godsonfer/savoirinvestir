"use client"

export default function PolitiqueConfidentialite() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Collecte des données</h2>
                        <p className="text-gray-600">
                            Nous collectons les informations suivantes :
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                            <li>Nom et prénom</li>
                            <li>Adresse email</li>
                            <li>Données de connexion et d&apos;utilisation</li>
                            <li>Informations de paiement (via des processeurs sécurisés)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Utilisation des données</h2>
                        <p className="text-gray-600">
                            Vos données sont utilisées pour :
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                            <li>Gérer votre compte et accès aux formations</li>
                            <li>Vous envoyer des informations sur nos services</li>
                            <li>Améliorer nos services et votre expérience utilisateur</li>
                            <li>Respecter nos obligations légales</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Protection des données</h2>
                        <p className="text-gray-600">
                            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données 
                            personnelles contre tout accès, modification, divulgation ou destruction non autorisée.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Vos droits</h2>
                        <p className="text-gray-600">
                            Conformément au RGPD, vous disposez des droits suivants :
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                            <li>Droit d&apos;accès à vos données</li>
                            <li>Droit de rectification</li>
                            <li>Droit à l&apos;effacement</li>
                            <li>Droit à la portabilité</li>
                            <li>Droit d&apos;opposition</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
} 

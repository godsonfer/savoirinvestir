"use client"

export default function MentionsLegales() {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Informations légales</h2>
                        <p className="text-gray-600">
                            Invest Mastery Mind<br />
                            Société [Type de société] au capital de [montant] euros<br />
                            RCS Paris : [Numéro]<br />
                            Siège social : 123 Rue du Trading, 75001 Paris<br />
                            N° TVA : [Numéro]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Hébergeur</h2>
                        <p className="text-gray-600">
                            [Nom de l&apos;hébergeur]<br />
                            Adresse : [Adresse de l&apos;hébergeur]<br />
                            Contact : [Contact de l&apos;hébergeur]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Directeur de la publication</h2>
                        <p className="text-gray-600">
                            [Nom du directeur]<br />
                            Contact : [Email du directeur]
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
} 

import { Metadata } from 'next'
import React from 'react'
import { LastUpdated } from '@/components/ui/last-updated'

export const metadata: Metadata = {
  title: 'Conditions d&apos;utilisation | Plateforme de Formation',
  description: 'Conditions générales d&apos;utilisation de notre plateforme de formation en trading et investissement',
}

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-xl z-10">
            <h1 className="text-3xl font-bold text-gray-900">
              Conditions d&apos;utilisation
            </h1>
          </div>
          
          <div className="px-8 py-6 overflow-y-auto">
            <div className="space-y-6 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptation des conditions</h2>
                <p>
                  En accédant et en utilisant cette plateforme de formation, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. 
                  Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description du service</h2>
                <p>
                  Notre plateforme propose des formations en ligne dans le domaine du trading et de l&apos;investissement. 
                  Les contenus sont fournis à titre éducatif uniquement et ne constituent pas des conseils financiers personnalisés.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Compte utilisateur</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion.</li>
                  <li>Vous devez avoir au moins 18 ans pour créer un compte.</li>
                  <li>Vous vous engagez à fournir des informations exactes et à jour.</li>
                  <li>Nous nous réservons le droit de suspendre ou supprimer votre compte en cas de violation des conditions.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
                <p>
                  Tout le contenu disponible sur la plateforme (vidéos, textes, images, etc.) est protégé par les droits de propriété intellectuelle.
                  La reproduction ou distribution non autorisée de ce contenu est strictement interdite.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Avertissement sur les risques</h2>
                <p>
                  Le trading et l&apos;investissement comportent des risques significatifs de perte. Les performances passées ne garantissent pas 
                  les résultats futurs. Vous devez évaluer votre situation financière et vos objectifs avant de prendre des décisions d&apos;investissement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Modifications</h2>
                <p>
                  Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication.
                  Votre utilisation continue de la plateforme après ces modifications constitue votre acceptation des nouvelles conditions.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <LastUpdated />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage 

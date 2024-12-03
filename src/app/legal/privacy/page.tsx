import { Metadata } from 'next'
import React from 'react'
import { LastUpdated } from '@/components/ui/last-updated'

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Plateforme de Formation',
  description: 'Notre politique de confidentialité concernant la collecte et l&apos;utilisation de vos données personnelles',
}

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 rounded-t-xl z-10">
            <h1 className="text-3xl font-bold text-gray-900">
              Politique de confidentialité
            </h1>
          </div>
          
          <div className="px-8 py-6 overflow-y-auto">
            <div className="space-y-6 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Collecte des données</h2>
                <p>Nous collectons les informations suivantes :</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Informations d&apos;identification (nom, email)</li>
                  <li>Données de connexion et d&apos;utilisation</li>
                  <li>Informations de paiement (via nos processeurs de paiement sécurisés)</li>
                  <li>Préférences d&apos;apprentissage et progression dans les formations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Utilisation des données</h2>
                <p>Nous utilisons vos données pour :</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Gérer votre compte et vous fournir accès aux formations</li>
                  <li>Personnaliser votre expérience d&apos;apprentissage</li>
                  <li>Vous informer des mises à jour et nouvelles formations</li>
                  <li>Améliorer nos services et développer de nouveaux contenus</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Protection des données</h2>
                <p>
                  Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès,
                  modification, divulgation ou destruction non autorisée.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Cookies et technologies similaires</h2>
                <p>
                  Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, analyser l&apos;utilisation 
                  de nos services et personnaliser le contenu.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Vos droits</h2>
                <p>Vous disposez des droits suivants concernant vos données personnelles :</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Droit d&apos;accès et de rectification</li>
                  <li>Droit à l&apos;effacement (&apos;droit à l&apos;oubli&apos;)</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d&apos;opposition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Contact</h2>
                <p>
                  Pour toute question concernant cette politique ou pour exercer vos droits, contactez-nous à :{' '}
                  <a href="mailto:privacy@example.com" className="text-cyan-600 hover:underline">
                    privacy@example.com
                  </a>
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

export default PrivacyPage 

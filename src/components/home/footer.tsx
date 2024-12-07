"use client"
import { useSubscribeNewLetter } from '@/features/home/subscribe-new-letter';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Footer = () => {
    const [currentYear, setCurrentYear] = useState<number>(2024);
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const {mutate: subscribeNewLetter} = useSubscribeNewLetter();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setShowPopup(true);
            setEmail('');
            subscribeNewLetter({email}, {
                onSuccess: () => {
                    setTimeout(() => setShowPopup(false), 5000);
                },
                onError: () => {
                    setShowPopup(false);
                }
            });
        }
    };

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 relative overflow-hidden">
            {/* Animations en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -top-48 -left-48 animate-blob"></div>
                <div className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl top-1/2 left-1/2 animate-blob animation-delay-2000"></div>
                <div className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -bottom-48 -right-48 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section principale */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-20">
                    {/* À propos */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white mb-6 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-teal-500 after:mt-2">
                            INVEST MASTERY MIND
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            Votre partenaire de confiance pour maîtriser l&apos;art de 
                            l&apos;investissement et atteindre l&apos;indépendance financière.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { icon: Facebook, link: "#" },
                                { icon: Twitter, link: "#" },
                                { icon: Instagram, link: "#" },
                                { icon: Youtube, link: "#" }
                            ].map((social, index) => (
                                <a 
                                    key={index}
                                    href={social.link}
                                    className="hover:text-teal-500 transition-all duration-300 transform hover:-translate-y-1"
                                    aria-label={`Suivez-nous sur ${social.icon.name}`}
                                >
                                    <social.icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Mentions Légales */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-8 relative after:content-[''] after:block after:w-8 after:h-1 after:bg-teal-500 after:mt-2">
                            Mentions Légales
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <a 
                                    href="/conditions-utilisation" 
                                    className="hover:text-teal-500 transition-all duration-300 flex items-center space-x-2 group"
                                >
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-500 transition-all duration-300"></span>
                                    <span>Conditions d&apos;utilisation</span>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="/politique-confidentialite" 
                                    className="hover:text-teal-500 transition-all duration-300 flex items-center space-x-2 group"
                                >
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-500 transition-all duration-300"></span>
                                    <span>Politique de confidentialité</span>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="/mentions-legales" 
                                    className="hover:text-teal-500 transition-all duration-300 flex items-center space-x-2 group"
                                >
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-500 transition-all duration-300"></span>
                                    <span>Mentions légales</span>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="/cookies" 
                                    className="hover:text-teal-500 transition-all duration-300 flex items-center space-x-2 group"
                                >
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-500 transition-all duration-300"></span>
                                    <span>Politique des cookies</span>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="/cgv" 
                                    className="hover:text-teal-500 transition-all duration-300 flex items-center space-x-2 group"
                                >
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-500 transition-all duration-300"></span>
                                    <span>CGV</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-8 relative after:content-[''] after:block after:w-8 after:h-1 after:bg-teal-500 after:mt-2">
                            Contact
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-teal-500" />
                                <span>Parakou, Borgou, Benin</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-teal-500" />
                                <a href="tel:+22997979797" className="hover:text-teal-500 transition-colors">
                                    +229 01 96 00 46 37
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-teal-500" />
                                <a href="mailto:contact@investmasterymind.com" className="hover:text-teal-500 transition-colors">
                                    contact@investmasterymind.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter modifiée */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-8 relative after:content-[''] after:block after:w-8 after:h-1 after:bg-teal-500 after:mt-2">
                            Newsletter
                        </h4>
                        <p className="text-gray-400 mb-6">
                            Recevez nos dernières actualités et offres spéciales
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Votre email"
                                    className="px-4 py-3 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 backdrop-blur-sm"
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 flex items-center justify-center space-x-2 group backdrop-blur-sm"
                                >
                                    <span>S&apos;abonner</span>
                                    <Mail className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Avertissement sur les risques */}
                <div className="border-t border-gray-800 py-6">
                    <div className="max-w-3xl mx-auto transform hover:scale-[1.01] transition-all duration-300">
                        <div className="relative px-6 py-5 bg-gradient-to-br from-red-950/30 to-red-900/10 rounded-xl backdrop-blur-sm border border-red-900/20 shadow-lg hover:shadow-red-900/5">
                            {/* Effet de brillance */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent blur-xl"></div>
                            
                            {/* Icône d'avertissement avec animation */}
                            <div className="flex items-center justify-center mb-4 animate-pulse">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                            </div>

                            {/* Titre */}
                            <h4 className="text-red-400 font-semibold text-lg mb-4 text-center">
                                Avertissement important
                            </h4>

                            {/* Contenu avec effet de hover sur les paragraphes */}
                            <div className="space-y-4">
                                <div className="group p-3 rounded-lg transition-all duration-300 hover:bg-red-950/30">
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Ce site est <span className="text-red-400 font-medium">strictement à but éducatif</span> et pédagogique. 
                                        Nous ne fournissons <span className="text-red-400 font-medium">aucun conseil en investissement</span> personnalisé 
                                        ni recommandation financière. Tout le contenu présenté est uniquement destiné à des fins 
                                        d&apos;information et d&apos;apprentissage.
                                    </p>
                                </div>

                                <div className="group p-3 rounded-lg transition-all duration-300 hover:bg-red-950/30">
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Le trading et l&apos;investissement comportent des <span className="text-red-400 font-medium">risques significatifs de perte en capital</span>. 
                                        Les performances passées ne préjugent pas des performances futures. 
                                        Avant toute décision d&apos;investissement, il est <span className="text-red-400 font-medium">fortement recommandé</span> de 
                                        consulter un conseiller financier qualifié et agréé.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Barre de copyright */}
                <div className="border-t border-gray-800 py-8 text-center text-gray-400">
                    <p>© {currentYear} Invest Mastery Mind. Tous droits réservés. </p>
                    <p className="mt-2 text-sm">
                        En utilisant ce site, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité. 
                    </p>
                </div>
            </div>

            {/* Popup de confirmation */}
            {showPopup && (
                <div className="fixed bottom-8 right-8 bg-white text-gray-900 p-4 rounded-lg shadow-xl animate-slideIn flex items-center space-x-4 z-50">
                    <div className="bg-teal-100 p-2 rounded-full">
                        <Mail className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                        <h5 className="font-semibold">Inscription réussie !</h5>
                        <p className="text-sm text-gray-600">Merci de vous être inscrit à notre newsletter.</p>
                    </div>
                    <button 
                        onClick={() => setShowPopup(false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </footer>
    );
} 

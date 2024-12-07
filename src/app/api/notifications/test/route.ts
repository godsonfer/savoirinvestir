import { NextResponse } from 'next/server';
import webpush from 'web-push';

export async function GET() {
  try {
    // Récupérer l'abonnement depuis votre base de données
    // Pour le test, nous utiliserons un abonnement statique
    const subscription = {
      endpoint: 'ENDPOINT_URL', // À remplacer par l'endpoint réel
      keys: {
        p256dh: 'P256DH_KEY', // À remplacer par la clé p256dh réelle
        auth: 'AUTH_KEY' // À remplacer par la clé auth réelle
      }
    };

    const payload = JSON.stringify({
      title: 'Test de notification',
      body: 'Ceci est une notification de test!',
    });

    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ message: 'Notification envoyée avec succès!' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la notification' },
      { status: 500 }
    );
  }
} 

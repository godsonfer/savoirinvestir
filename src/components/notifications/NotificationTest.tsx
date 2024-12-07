import { Button } from "@/components/ui/button";

export function NotificationTest() {
  const sendTestNotification = async () => {
    try {
      const response = await fetch('/api/notifications/test', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la notification');
      }

      const data = await response.json();
      console.log('Notification envoyée:', data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Button 
      onClick={sendTestNotification}
      variant="outline"
    >
      Tester les notifications
    </Button>
  );
} 

// Types de base pour les graphiques
export interface BaseChartData {
    id: string;
    title: string;
    category?: string;
}

// Type pour le graphique de progression
export interface LineChartData extends BaseChartData {
    progress: number;
    timestamp: number;
}

// Type pour le graphique en barres des catégories
export interface BarChartData extends BaseChartData {
    count: number;
}

// Type pour le graphique des heures de formation
export interface HoursChartData extends BaseChartData {
    duration: number;
    completed: number;
} 

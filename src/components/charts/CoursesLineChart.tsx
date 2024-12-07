import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
    TooltipItem
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Types locaux pour les données du graphique
interface BaseChartData {
    id: string;
    title: string;
    category?: string;
}

interface LineChartData extends BaseChartData {
    progress: number;
    timestamp: number;
}

export interface LineChartProps {
    courses: LineChartData[];
}

// Fonction utilitaire pour formater les dates
const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
    });
};

// Fonction utilitaire pour formater les pourcentages
const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
};

export const CoursesLineChart: React.FC<LineChartProps> = ({ courses }) => {
    // Trier les cours par timestamp
    const sortedCourses = [...courses].sort((a, b) => a.timestamp - b.timestamp);

    // Formater les dates pour les labels
    const labels = sortedCourses.map(course => formatDate(course.timestamp));

    const data = {
        labels,
        datasets: [
            {
                label: 'Progression des cours',
                data: sortedCourses.map(course => course.progress),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: window.innerWidth < 768 ? 3 : 4,
                pointHoverRadius: window.innerWidth < 768 ? 4 : 6,
                borderWidth: window.innerWidth < 768 ? 2 : 3,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: window.innerWidth < 768 ? 'bottom' : 'top',
                align: 'center',
                labels: {
                    color: 'rgb(209, 213, 219)',
                    font: {
                        size: window.innerWidth < 768 ? 11 : 13,
                        weight: 'normal'
                    },
                    padding: window.innerWidth < 768 ? 12 : 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: window.innerWidth < 768 ? 6 : 8
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                titleColor: '#FFFFFF',
                bodyColor: '#FFFFFF',
                padding: window.innerWidth < 768 ? 8 : 12,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                displayColors: false,
                titleFont: {
                    size: window.innerWidth < 768 ? 11 : 13
                },
                bodyFont: {
                    size: window.innerWidth < 768 ? 11 : 13
                },
                callbacks: {
                    label: function(context: TooltipItem<'line'>) {
                        return `Progression : ${formatPercentage(context.parsed.y)}`;
                    },
                    title: function(context) {
                        const timestamp = sortedCourses[context[0].dataIndex].timestamp;
                        return formatDate(timestamp);
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(75, 85, 99, 0.1)',
                },
                ticks: {
                    color: 'rgb(156, 163, 175)',
                    font: {
                        size: window.innerWidth < 768 ? 10 : 12
                    },
                    padding: window.innerWidth < 768 ? 6 : 10,
                    callback: function(value) {
                        return formatPercentage(value as number);
                    }
                },
                beginAtZero: true,
                max: 100
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'rgb(156, 163, 175)',
                    font: {
                        size: window.innerWidth < 768 ? 10 : 12
                    },
                    padding: window.innerWidth < 768 ? 6 : 10,
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    return (
        <div className="w-full h-[300px] md:h-[300px] bg-gray-900/50 rounded-xl p-3 md:p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
            <Line options={options} data={data} />
        </div>
    );
}; 

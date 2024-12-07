import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    TooltipItem
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Types locaux pour les données du graphique
interface BaseChartData {
    id: string;
    title: string;
    category?: string;
}

interface HoursChartData extends BaseChartData {
    duration: number;
    completed: number;
}

export interface HoursChartProps {
    courses: HoursChartData[];
}

// Fonction utilitaire pour formater les heures
const formatHours = (minutes: number): string => {
    const hours = Math.round(minutes / 60);
    return `${hours}h`;
};

export const HoursBarChart: React.FC<HoursChartProps> = ({ courses }) => {
    // Trier les cours par durée
    const sortedCourses = [...courses].sort((a, b) => b.duration - a.duration);

    const data = {
        labels: sortedCourses.map(course => course.title),
        datasets: [
            {
                label: 'Heures totales',
                data: sortedCourses.map(course => Math.round(course.duration / 60)),
                backgroundColor: 'rgba(236, 72, 153, 0.7)',
                borderColor: 'rgb(236, 72, 153)',
                borderWidth: 1,
                borderRadius: 4,
                barThickness: window.innerWidth < 768 ? 20 : 30,
            },
            {
                label: 'Heures complétées',
                data: sortedCourses.map(course => Math.round(course.completed / 60)),
                backgroundColor: 'rgba(236, 72, 153, 0.3)',
                borderColor: 'rgb(236, 72, 153)',
                borderWidth: 1,
                borderRadius: 4,
                barThickness: window.innerWidth < 768 ? 20 : 30,
            }
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    color: 'rgb(209, 213, 219)',
                    font: {
                        size: window.innerWidth < 768 ? 11 : 13
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
                    label: function(context: TooltipItem<'bar'>) {
                        const datasetLabel = context.dataset.label || '';
                        const value = formatHours(context.parsed.y * 60);
                        return `${datasetLabel} : ${value}`;
                    }
                }
            }
        },
        scales: {
            y: {
                stacked: true,
                beginAtZero: true,
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
                        return formatHours(value as number * 60);
                    }
                }
            },
            x: {
                stacked: true,
                grid: {
                    display: false
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
        <div className="w-full h-[300px] bg-gray-900/50 rounded-xl p-3 md:p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10">
            <Bar options={options} data={data} />
        </div>
    );
}; 

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

interface BarChartData extends BaseChartData {
    count: number;
}

export interface BarChartProps {
    courses: BarChartData[];
}

// Fonction utilitaire pour formater le nombre de cours
const formatCourseCount = (count: number): string => {
    return `${count} ${count > 1 ? 'cours' : 'cours'}`;
};

export const CoursesBarChart: React.FC<BarChartProps> = ({ courses }) => {
    // Trier les catégories par nombre de cours
    const sortedCourses = [...courses].sort((a, b) => b.count - a.count);

    const data = {
        labels: sortedCourses.map(course => course.title),
        datasets: [
            {
                label: 'Nombre de cours par catégorie',
                data: sortedCourses.map(course => course.count),
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
                barThickness: window.innerWidth < 768 ? 20 : 30,
            },
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
                display: false
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
                        return formatCourseCount(context.parsed.y);
                    }
                }
            }
        },
        scales: {
            y: {
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
                    stepSize: 1,
                    callback: function(value) {
                        return formatCourseCount(value as number);
                    }
                }
            },
            x: {
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
        <div className="w-full h-[300px] bg-gray-900/50 rounded-xl p-3 md:p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
            <Bar options={options} data={data} />
        </div>
    );
}; 

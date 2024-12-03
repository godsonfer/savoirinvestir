"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { theme } from '@/lib/theme';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: typeof theme.light | typeof theme.dark;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setMounted(true);
        const root = window.document.documentElement;
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
        setIsDarkMode(initialDarkMode);
        
        if (initialDarkMode) {
            root.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            const root = window.document.documentElement;
            if (isDarkMode) {
                root.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                root.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        }
    }, [isDarkMode, mounted]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ 
            isDarkMode, 
            toggleTheme, 
            colors: isDarkMode ? theme.dark : theme.light 
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 

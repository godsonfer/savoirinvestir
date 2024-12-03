"use client"
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { HeroSection } from "./hero-section";
import { WelcomeSection } from "./welcome-section";
import { FeatureGrid } from "./feature-grid";

export const HomePage = () => {
    const { signOut } = useAuthActions();

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <HeroSection />
                <WelcomeSection />
                <FeatureGrid />
                <div className="fixed top-4 right-4">
                    <Button onClick={() => void signOut()}>Déconnexion</Button>
                </div>
            </main>
        </div>
    );
}




"use client"
import { Button } from "@/components/ui/button";

import { useAuthActions } from "@convex-dev/auth/react";

export const HomePage = () => {
        const { signOut } = useAuthActions();

        return (<Button onClick={() => void signOut()}>Logout</Button>);
}




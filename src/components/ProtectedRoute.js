'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/lib/auth';

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    // To avoid hydration mismatch, we must ensure the server and initial client render match.
    // The user wants to see the dashboard immediately, so we default to isAuthorized=true.
    // If subsequent verification fails, we redirect to login.
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const checkAuth = async () => {
            try {
                // Check locally first
                const token = authService.getToken();
                const isLocalValid = !!(token && !authService.isTokenExpired(token));

                if (!isLocalValid) {
                    setIsAuthorized(false);
                    setIsChecking(false);
                    router.push('/login');
                    return;
                }

                // Verify with server in background
                const isValid = await authService.verifyToken();

                if (!isValid) {
                    setIsAuthorized(false);
                    router.push('/login');
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthorized(false);
                router.push('/login');
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [router, mounted]);

    if (isChecking) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background font-figtree">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-openpos-purple/20 border-t-openpos-purple rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}

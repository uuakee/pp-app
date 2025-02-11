import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function WithAuth(props: P) {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('id');

            if (!token || !id) {
                router.push('/');
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
} 
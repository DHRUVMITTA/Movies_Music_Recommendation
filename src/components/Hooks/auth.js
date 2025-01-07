import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');

            if (token) {
                try {
                    const response = await fetch('http://127.0.0.1:5000/auth/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token }),
                    });

                    if (response.ok) {
                        setIsAuthenticated(true);
                        if (window.location.pathname === "/SignIn") {
                            navigate('/HomePage', { replace: true });
                        }
                    } else {
                        setIsAuthenticated(false);
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        if (window.location.pathname !== "/SignIn") {
                            navigate('/SignIn', { replace: true });
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
                if (window.location.pathname !== "/SignIn") {
                    navigate('/SignIn', { replace: true });
                }
            }
        };

        checkAuth();
    }, [navigate]);

    return isAuthenticated;
};

export default useAuth;

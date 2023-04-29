import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        if (window.scrollY) {
            document.documentElement.style.scrollBehavior = 'auto';
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.style.removeProperty('scroll-behavior');
            }, 20);
        }
    }, [pathname]);

    return null;
}

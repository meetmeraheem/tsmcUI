import { useCallback, useEffect } from 'react';

export const UseSetActiveClass = () => {
    const setActiveClass = useCallback(() => {
        const windowWidth = window.innerWidth;
        const navContainer = document.getElementById('PrivacyPolicy');
        const element = document.elementFromPoint(windowWidth / 2, 80);
        const currentId = element?.closest(`[id*='Item-']`);
        if (currentId) {
            const currentActive = navContainer?.querySelector(`[class="nav-link active"]`) as HTMLAnchorElement;
            if (currentActive) {
                if (currentActive?.href.indexOf(currentId.id) < 0) {
                    currentActive?.classList.remove('active');
                    const link = navContainer?.querySelector(`[href*="${currentId.id}"]`);
                    link?.classList.add('active');
                }
            } else {
                const link = navContainer?.querySelector(`[href*="${currentId.id}"]`);
                link?.classList.add('active');
            }
        }
    }, []);

    const disabledSetActiveClass = useCallback(({ target } : any)  => {
        const navContainer = document.getElementById('PrivacyPolicy');
        if (target.classList.contains('nav-link')) {
            const currentActiveElements = navContainer?.querySelectorAll(`[class="nav-link active"]`);
            currentActiveElements?.forEach((item) => {
                if (target !== item) {
                    item.classList.remove('active');
                }
            });
        }
    }, []);

    useEffect(() => {
        document.addEventListener('wheel', setActiveClass);
        document.addEventListener('click', disabledSetActiveClass);
        return () => {
            document.removeEventListener('wheel', setActiveClass);
            document.removeEventListener('click', disabledSetActiveClass);
        };
    }, [setActiveClass, disabledSetActiveClass]);
};

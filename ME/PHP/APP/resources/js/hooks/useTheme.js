import { useState, useEffect } from 'react';

export function useTheme() {
    const [dark, setDark] = useState(() =>
        document.documentElement.classList.contains('dark'),
    );

    const toggleTheme = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem('theme', next ? 'dark' : 'light');
        } catch (e) {
            // ignore storage errors (private mode)
        }
    };

    return { dark, toggleTheme };
}

/**
 * Tracks the html.dark attribute reactively, so components rendered outside
 * the useTheme() owner (layouts) still follow live theme toggles.
 */
export function useHtmlDark() {
    const [dark, setDark] = useState(() =>
        document.documentElement.classList.contains('dark'),
    );

    useEffect(() => {
        const el = document.documentElement;
        const observer = new MutationObserver(() => {
            setDark(el.classList.contains('dark'));
        });
        observer.observe(el, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return dark;
}

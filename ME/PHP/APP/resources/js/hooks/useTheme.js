import { useState } from 'react';

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

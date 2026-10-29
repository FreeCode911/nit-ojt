import SpotlightCard, { type SpotlightCardProps } from '../reactbits/SpotlightCard/SpotlightCard';
import { useHtmlDark } from '../../hooks/useTheme';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Mirrors the app's `.card` look exactly (bg-white / bg-slate-800/60 over
 * backdrop-blur, slate borders, shadow-sm, rounded-2xl) while adding the
 * React Bits pointer spotlight.
 */
const CARD_LOOK = {
    light: {
        surface: '#ffffff',
        border: 'rgba(226, 232, 240, 0.6)',
        shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    dark: {
        surface: 'rgba(30, 41, 59, 0.6)',
        border: 'rgba(51, 65, 85, 0.6)',
        shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
} as const;

type SurfaceProps = {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    spotlightColor?: string;
    intensity?: number;
    proximity?: number;
    borderGlow?: number;
    flare?: boolean;
};

export default function SpotlightSurface({
    children,
    className = '',
    style,
    spotlightColor,
    intensity,
    proximity = 70,
    borderGlow,
    flare = false,
}: SurfaceProps) {
    const dark = useHtmlDark();
    const look = CARD_LOOK[dark ? 'dark' : 'light'];

    return (
        <SpotlightCard
            theme={dark ? 'dark' : 'light'}
            spotlightColor={spotlightColor ?? (dark ? '#818cf8' : '#4f46e5')}
            intensity={intensity ?? (dark ? 0.26 : 0.13)}
            proximity={proximity}
            borderGlow={borderGlow ?? (dark ? 0.55 : 0.4)}
            flare={flare}
            className={`backdrop-blur rounded-2xl! ${className}`}
            style={
                {
                    '--spotlight-card-surface': look.surface,
                    '--spotlight-card-border': look.border,
                    '--spotlight-card-shadow': look.shadow,
                    ...style,
                } as CSSProperties
            }
        >
            {children}
        </SpotlightCard>
    );
}

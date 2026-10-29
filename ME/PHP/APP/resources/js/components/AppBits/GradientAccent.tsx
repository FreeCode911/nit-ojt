import GradientText from '../reactbits/GradientText/GradientText';
import type { ReactNode } from 'react';

interface GradientAccentProps {
    children?: ReactNode;
    className?: string;
}

/**
 * Brand-palette animated gradient for page title accents (React Bits
 * GradientText with fixed brand colors). Slower and calmer than the
 * landing hero variant so it stays tasteful in app chrome.
 */
export default function GradientAccent({ children, className = '' }: GradientAccentProps) {
    return (
        <GradientText
            colors={['#4f46e5', '#7c3aed', '#a855f7', '#4f46e5']}
            animationSpeed={9}
            yoyo
            glow={0.08}
            className={className}
        >
            {children}
        </GradientText>
    );
}

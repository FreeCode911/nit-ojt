import StarBorder from '../reactbits/StarBorder/StarBorder';
import { useHtmlDark } from '../../hooks/useTheme';
import type { ReactNode } from 'react';

interface StarSubmitProps {
    children?: ReactNode;
    disabled?: boolean;
    className?: string;
}

/**
 * React Bits StarBorder-wrapped submit button styled after `.btn-primary`
 * (indigo/violet, compact form sizing). `as='button'` keeps submit semantics.
 */
export default function StarSubmit({ children, disabled, className = 'w-full' }: StarSubmitProps) {
    const dark = useHtmlDark();

    return (
        <StarBorder
            as='button'
            type='submit'
            disabled={disabled}
            theme={dark ? 'dark' : 'light'}
            duration={3.5}
            glow={0.6}
            radius={14}
            thickness={1.1}
            sparkle
            backgroundColor='#4f46e5'
            textColor='#ffffff'
            borderColor={dark ? 'rgba(165, 180, 252, 0.35)' : 'rgba(79, 70, 229, 0.25)'}
            className={`px-6! py-3! justify-center text-sm font-medium shadow-md hover:shadow-lg transition-opacity disabled:opacity-60 ${className}`}
        >
            {children}
        </StarBorder>
    );
}

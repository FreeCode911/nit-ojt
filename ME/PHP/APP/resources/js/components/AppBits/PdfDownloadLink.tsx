import { useState } from 'react';
import type { ReactNode } from 'react';

interface PdfDownloadLinkProps {
    href: string;
    className?: string;
    children?: ReactNode;
    busyLabel?: string;
    resetAfterMs?: number;
}

/**
 * Anchor for certificate PDF downloads with visible click feedback. The
 * response is a file attachment, so the page itself never changes — the
 * brief spinner makes it obvious the click registered while the browser
 * saves the document.
 */
export default function PdfDownloadLink({
    href,
    className = '',
    children,
    busyLabel = 'Generating…',
    resetAfterMs = 6000,
}: PdfDownloadLinkProps) {
    const [busy, setBusy] = useState(false);

    const handleClick = () => {
        setBusy(true);
        setTimeout(() => setBusy(false), resetAfterMs);
    };

    return (
        <a href={href} className={className} onClick={handleClick} aria-busy={busy}>
            {busy ? (
                <>
                    <span
                        aria-hidden='true'
                        className='inline-block w-3.5 h-3.5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin align-[-2px]'
                    />
                    {busyLabel}
                </>
            ) : (
                children
            )}
        </a>
    );
}

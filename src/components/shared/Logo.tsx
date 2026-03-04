import type { CSSProperties } from 'react';

interface LogoProps {
    textColor?: string;
    size?: 'default' | 'small';
    className?: string;
    style?: CSSProperties;
}

export default function Logo({ textColor, size = 'default', className, style }: LogoProps) {
    const markStyle: CSSProperties | undefined = size === 'small'
        ? { width: '32px', height: '32px', borderRadius: '8px', fontSize: '15px' }
        : undefined;
    const textStyle: CSSProperties | undefined = textColor ? { color: textColor } : undefined;

    return (
        <div className={`logo ${className ?? ''}`} style={style}>
            <div className="logo-mark" style={markStyle}>✦</div>
            <div className="logo-text" style={textStyle}>Card<span>Wise</span></div>
        </div>
    );
}

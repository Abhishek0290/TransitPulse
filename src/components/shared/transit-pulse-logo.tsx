import React from 'react';

interface TransitPulseLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  variant?: 'horizontal' | 'vertical' | 'icon-only';
}

export function TransitPulseLogo({ 
  size = 'md', 
  className = '', 
  showText = true,
  variant = 'horizontal'
}: TransitPulseLogoProps) {
  const sizeClasses = {
    sm: { 
      icon: 'w-6 h-6', 
      text: 'text-lg', 
      container: 'space-x-2',
      iconSize: 16
    },
    md: { 
      icon: 'w-8 h-8', 
      text: 'text-xl', 
      container: 'space-x-3',
      iconSize: 20
    },
    lg: { 
      icon: 'w-12 h-12', 
      text: 'text-3xl', 
      container: 'space-x-4',
      iconSize: 28
    }
  };

  const currentSize = sizeClasses[size];

  const iconElement = (
    <div
      className={`
        relative p-2 rounded-xl
        bg-gradient-to-br from-primary via-[#00FFFF] to-accent
        ${currentSize.icon}
        flex items-center justify-center
        hover:shadow-lg transition-shadow duration-200
      `}
      style={{
        boxShadow: '0 0 15px rgba(0, 191, 255, 0.3)'
      }}
    >
      {/* Static professional geometric logo design */}
      <svg 
        width={currentSize.iconSize} 
        height={currentSize.iconSize} 
        viewBox="0 0 24 24" 
        fill="none"
        className="relative z-10"
      >
        {/* TransitPulse+ monogram - T and P integrated design */}
        
        {/* Letter "T" structure */}
        <rect x="4" y="4" width="8" height="1.5" fill="#111111" rx="0.75" />
        <rect x="7.25" y="4" width="1.5" height="8" fill="#111111" rx="0.75" />
        
        {/* Letter "P" structure with connection points */}
        <rect x="12" y="4" width="1.5" height="12" fill="#111111" rx="0.75" />
        <rect x="12" y="4" width="5" height="1.5" fill="#111111" rx="0.75" />
        <rect x="12" y="8.25" width="4" height="1.5" fill="#111111" rx="0.75" />
        <rect x="15.5" y="5.5" width="1.5" height="2.75" fill="#111111" rx="0.75" />
        
        {/* Tech connection nodes */}
        <circle cx="8" cy="14" r="1" fill="#111111" />
        <circle cx="20" cy="8" r="1" fill="#111111" />
        <circle cx="20" cy="16" r="1" fill="#111111" />
        
        {/* Connection lines */}
        <line x1="9" y1="12" x2="8" y2="13" stroke="#111111" strokeWidth="1" />
        <line x1="17" y1="8.5" x2="19" y2="8" stroke="#111111" strokeWidth="1" />
        <line x1="17" y1="12" x2="19" y2="16" stroke="#111111" strokeWidth="1" />
        
        {/* Static geometric accents */}
        <rect x="3" y="18" width="2" height="2" fill="#111111" rx="1" />
        <rect x="19" y="3" width="2" height="2" fill="#111111" rx="1" />
      </svg>
    </div>
  );

  const textElement = showText && (
    <span 
      className={`
        ${currentSize.text} font-black 
        bg-gradient-to-r from-neon-blue via-[#00FFFF] to-neon-green 
        bg-clip-text text-transparent
      `}
      style={{ 
        fontFamily: 'Montserrat, sans-serif'
      }}
    >
      TransitPulse+
    </span>
  );

  if (variant === 'icon-only') {
    return <div className={className}>{iconElement}</div>;
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        {iconElement}
        {textElement}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {iconElement}
      {textElement}
    </div>
  );
}
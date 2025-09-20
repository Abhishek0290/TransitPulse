import React from 'react';
import { TransitPulseLogo } from './transit-pulse-logo';
import { navigationService } from '../../services/navigation-service';

interface NavigationHeaderProps {
  className?: string;
}

export function NavigationHeader({ className = '' }: NavigationHeaderProps) {
  const handleLogoClick = () => {
    navigationService.navigateTo('home');
  };

  return (
    <div className={`absolute top-4 left-4 z-50 ${className}`}>
      <button
        onClick={handleLogoClick}
        className="transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
        aria-label="Go to home"
      >
        <TransitPulseLogo size="sm" variant="icon-only" />
      </button>
    </div>
  );
}
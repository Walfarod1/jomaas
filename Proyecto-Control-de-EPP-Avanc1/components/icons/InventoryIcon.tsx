
import React from 'react';

const InventoryIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 .001 0M20 7s0 0-.001 0M12 11c-3.333 0-6-1.343-6-3s2.667-3 6-3 6 1.343 6 3-2.667 3-6 3z" />
  </svg>
);

export default InventoryIcon;
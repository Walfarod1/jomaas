import React from 'react';

const DeliveryIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75v4.5a3 3 0 01-3 3h-1.5a3 3 0 01-3-3v-4.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-3a3 3 0 00-3-3H9a3 3 0 00-3 3v10.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H7.5a3 3 0 00-3 3v10.5a3 3 0 003 3h1.5" />
  </svg>
);

export default DeliveryIcon;
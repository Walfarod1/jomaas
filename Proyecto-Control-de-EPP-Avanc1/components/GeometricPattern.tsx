import React from 'react';

interface GeometricPatternProps {
  position: 'top-left' | 'bottom-right';
}

const GeometricPattern: React.FC<GeometricPatternProps> = ({ position }) => {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0 transform rotate-180',
  };

  return (
    <div className={`absolute ${positionClasses[position]} w-[40vw] max-w-md h-auto z-0 pointer-events-none`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 453 336"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path d="M-58.5 224L156.5 0H339.5L124.5 224H-58.5Z" fill="#F472B6" />
        <path d="M157 0L339.5 224H124.5L-58 0H157Z" fill="#A78BFA" />
        <path
          d="M109 336L324 112L282.5 31.5L-11.5 255.5L109 336Z"
          fill="#F97316"
        />
        <path
          d="M282.5 31.5L324 112L453 112L390 -9.00001L282.5 31.5Z"
          fill="#34D399"
        />
        <path
          d="M339 224.5L453 112L390 -9L282 31.5L339 224.5Z"
          fill="#60A5FA"
        />
        <path
          d="M339.5 224L282.5 31.5L324 112L339.5 224Z"
          fill="#EC4899"
        />
        <path d="M339.5 224L124.5 224L109 336L339.5 224Z" fill="#C084FC" />
        <path d="M156.5 0H339.5L124.5 224L-58.5 224L156.5 0Z" fill="url(#paint0_linear_1_2)" fillOpacity="0.3"/>
        <defs>
          <linearGradient
            id="paint0_linear_1_2"
            x1="140.5"
            y1="112"
            x2="313"
            y2="112"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0"/>
            <stop offset="1" stopColor="white"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default GeometricPattern;
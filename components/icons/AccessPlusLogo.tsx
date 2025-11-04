import React from 'react';

interface AccessPlusLogoProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

export const AccessPlusLogo: React.FC<AccessPlusLogoProps> = ({ color, ...props }) => (
  <svg
    // Aspect ratio matches the provided logo image
    viewBox="0 0 470 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <text
      x="50%"
      y="55%" // Adjust for better visual vertical alignment
      dominantBaseline="middle"
      textAnchor="middle"
      fontFamily="Inter, sans-serif"
      fontSize="95"
      fontWeight="900"
      fill={color || '#FCF9E8'}
      letterSpacing="-9"
    >
      ACCESS+
    </text>
  </svg>
);

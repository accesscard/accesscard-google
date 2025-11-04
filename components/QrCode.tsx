import React from 'react';

// This is a static representation of a QR code for mockup purposes.
// In a real application, a library would generate this SVG dynamically based on the value.
export const QrCode: React.FC<{ value: string }> = ({ value }) => (
  <svg width="128" height="128" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path fill="#000" d="M0 0h7v7H0zm8 0h7v7H8zm8 0h7v7h-7zm8 0h7v7h-7zm8 0h7v7h-7zM0 8h7v7H0zm8 8h7v7H8zm8 0h7v7h-7zm8 8h7v7h-7zM0 16h7v7H0zm8 0h7v7H8zm8 8h7v7h-7zm8-8h7v7h-7zm8 0h7v7h-7zM0 24h7v7H0zm8 8h7v7H8zm8-8h7v7h-7zm8 0h7v7h-7zm8 8h7v7h-7zM0 32h7v7H0zm8 0h7v7H8zm8 8h7v7h-7zm8-8h7v7h-7zm8 0h7v7h-7zM0 40h7v7H0zm8-8h7v7H8zm8 0h7v7h-7zm8 8h7v7h-7zm8 0h7v7h-7zM24 8h7v7h-7zm8 8h7v7h-7zM24 24h7v7h-7zm8 8h7v7h-7zM24 40h7v7h-7zm-8-8h7v7h-7z" />
    <path fill="#000" d="M8 40h7v7H8zm25-32h7v7h-7zm-8 8h7v7h-7zm-8-8h7v7h-7z" />
  </svg>
);

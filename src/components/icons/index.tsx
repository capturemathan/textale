import React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement>;

export const IconLogo = ({ className = 'size-6', featherAccent = '#FFECAE', ...props }: IconProps & { featherAccent?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    className={`inline-block ${className}`}
    {...props}
  >
    {/* Chat bubble */}
    <path
      d="M25.5 48.2C25.5 34.9 36.3 24.1 49.6 24.1C62.9 24.1 73.7 34.9 73.7 48.2C73.7 61.5 62.9 72.3 49.6 72.3C45.7 72.3 42 71.4 38.7 69.8L27.3 76.1L29.6 64.7C27 60.1 25.5 54.4 25.5 48.2Z"
      stroke="currentColor"
      strokeWidth="4.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Conversation dots */}
    <circle cx="40.2" cy="48.3" r="2.9" fill="currentColor" />
    <circle cx="49.7" cy="48.3" r="2.9" fill="currentColor" />
    <circle cx="59.2" cy="48.3" r="2.9" fill="currentColor" />

    {/* Feather / pen */}
    <path
      d="M49.8 78.7C55.2 66.6 62.7 54.6 71.4 44.7C78.1 37.1 84.4 32.8 88.4 31.1C88.3 36.2 86.4 44.1 81.5 51.5C74.6 62 63.6 70.5 49.8 78.7Z"
      fill="currentColor"
    />
    <path
      d="M49.7 78.8C57.4 65.4 66.8 54.8 80.9 41.8"
      stroke={featherAccent}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M59.8 64.8L72.8 63.1M64.5 57.7L77.4 55.4M69.5 50.7L81.4 47.6M74.3 44.8L84 40.6"
      stroke={featherAccent}
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity=".95"
    />
  </svg>
);

const BaseIcon: React.FC<IconProps & { children: React.ReactNode }> = ({ className = '', children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block ${className}`}
    {...props}
  >
    {children}
  </svg>
);

// Navigation
export const IconHome = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M3 11 C8 6.5 11 3.5 12 3 C13 3.5 16 6.5 21 11 M5 11 C5 15 4.8 19 5.5 20.5 C6.5 21.5 10 21 12 21 C14 21 17.5 21.5 18.5 20.5 C19.2 19 19 15 19 11 M9 21 C9.2 16 8.5 13 10.5 13 C12 13 13 13 14.5 13 C15.5 13 14.8 16 15 21" />
  </BaseIcon>
);

export const IconActivity = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M2 12.5 C4.5 12 5.5 12.8 7 12 C8 11.5 9 7 9.5 6 C10 8 10.5 14 11 16 C11.8 19.5 12 19 13 15 C13.5 12 14.5 9.5 15.5 12 C16 13 18 12.2 22 12.5" />
  </BaseIcon>
);


export const IconClock = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 2.5C17.5 2.5 21.5 6.5 21.5 12C21.5 17.5 17.5 21.5 12 21.5C6.5 21.5 2.5 17.5 2.5 12C2.5 6.5 6.5 2.5 12 2.5z" />
    <path d="M12 6.5 C11.8 8.5 12.2 10 12 12 C13 12.5 14.5 13.5 15.5 14.5" />
  </BaseIcon>
);

export const IconType = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M4 6 C8 5.8 16 5.8 20 6 M12 6 C11.5 12 12.5 18 12 20 M9 20 C11 19.8 13 19.8 15 20" />
  </BaseIcon>
);

export const IconSmile = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 2.5C17.5 2.5 21.5 6.5 21.5 12C21.5 17.5 17.5 21.5 12 21.5C6.5 21.5 2.5 17.5 2.5 12C2.5 6.5 6.5 2.5 12 2.5z" />
    <path d="M8 9 C8.5 8.8 9.5 8.8 10 9 M14 9 C14.5 8.8 15.5 8.8 16 9" />
    <path d="M7 14 C9 17 15 17 17 14" />
  </BaseIcon>
);

export const IconLink = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M10 13 C11 14 13 14 14 13 L16.5 10.5 C18 9 18 7 16.5 5.5 C15 4 13 4 11.5 5.5 L10.5 6.5 M14 11 C13 10 11 10 10 11 L7.5 13.5 C6 15 6 17 7.5 18.5 C9 20 11 20 12.5 18.5 L13.5 17.5" />
  </BaseIcon>
);

export const IconTrophy = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M7 3.5 C10 3.2 14 3.2 17 3.5 C17.5 7 16.5 11 12 13 C7.5 11 6.5 7 7 3.5 Z M7 5 C5 4.5 3 5.5 3 7 C3 9 4.5 10 6 10.5 M17 5 C19 4.5 21 5.5 21 7 C21 9 19.5 10 18 10.5 M12 13 C12 15 11.5 17 11.5 17 M8 20 C11 19.5 13 19.5 16 20 M9 17 C11 16.8 13 16.8 15 17" />
  </BaseIcon>
);


// Actions
export const IconUpload = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 16 C12 12 11.8 8 12 4 M7 9 C9 6 11 4.5 12 4 C13 4.5 15 6 17 9 M5 16 C4.5 18 5 20 7 20 C10 20.2 14 20.2 17 20 C19 20 19.5 18 19 16" />
  </BaseIcon>
);

export const IconShare = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 15 C12 11 11.8 6 12 3 M7 7 C9 4.5 11 3.5 12 3 C13 3.5 15 4.5 17 7 M5 12 C4 13 4 15 4 17 C4 19 5 21 7 21 C10 21.2 14 21.2 17 21 C19 21 20 19 20 17 C20 15 20 13 19 12" />
  </BaseIcon>
);

export const IconDownload = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 4 C12 8 11.8 12 12 16 M7 11 C9 14 11 15.5 12 16 C13 15.5 15 14 17 11 M5 18 C4.5 19 5 21 7 21 C10 21.2 14 21.2 17 21 C19 21 19.5 19 19 18" />
  </BaseIcon>
);

export const IconReset = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M3.5 12 C3.5 7 7 3.5 12 3.5 C16 3.5 19.5 6 20.5 10 M20.5 10 L16.5 9 M20.5 10 L21 5 M20.5 12 C20.5 17 17 20.5 12 20.5 C8 20.5 4.5 18 3.5 14 M3.5 14 L7.5 15 M3.5 14 L3 19" />
  </BaseIcon>
);

export const IconClose = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M6 6 C10 10 14 14 18 18 M18 6 C14 10 10 14 6 18" />
  </BaseIcon>
);

export const IconChevronRight = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M9 5 C11 8 14 11 15 12 C14 13 11 16 9 19" />
  </BaseIcon>
);


export const IconInfo = ({ className = 'size-4', ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <circle cx="12" cy="12" r="9.5" strokeWidth="2.25" />
    <path d="M12 11v5" strokeWidth="2.75" strokeLinecap="round" />
    <circle cx="12" cy="7.25" r="1.35" fill="currentColor" stroke="none" />
  </svg>
);


export const IconCheck = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M5 12 C7 14 8 16 9 17 C12 12 16 8 20 6" />
  </BaseIcon>
);

export const IconFilter = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M3 5 C8 4.8 16 4.8 21 5 C19 7.5 16 11 15 13 C14.8 15 15 18 14.5 20 C12.5 21 11.5 20 9.5 20 C9 18 9.2 15 9 13 C8 11 5 7.5 3 5 Z" />
  </BaseIcon>
);


// Status/Decorative
export const IconShield = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 3 C15 4 18 4.5 20 4.5 C20.5 10 19 16 12 21 C5 16 3.5 10 4 4.5 C6 4.5 9 4 12 3 Z" />
  </BaseIcon>
);

export const IconLock = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M7 11 C11 10.8 13 10.8 17 11 C18.5 11.5 18.5 14 18.5 16 C18.5 18 18.5 20 17 20.5 C13 21 11 21 7 20.5 C5.5 20 5.5 18 5.5 16 C5.5 14 5.5 11.5 7 11 Z" />
    <path d="M8 11 C7.8 7 9 4 12 4 C15 4 16.2 7 16 11 M12 15 C12 16 11.8 17 12 17" strokeWidth="2.5" strokeLinecap="round" />
  </BaseIcon>
);


export const IconLoader = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 3C16.9 3.1 20.9 7.1 21 12C20.9 16.9 16.9 20.9 12 21C7.1 20.9 3.1 16.9 3 12" />
  </BaseIcon>
);

export const IconZap = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M13 3 C11 7 9 11 8 13 C11 13 13 12.5 14 13 C12.5 16 11.5 18 10 21 C12 17 14 13 15 11 C12 11 10 11.5 9 11 C10.5 8 11.5 6 13 3 Z" />
  </BaseIcon>
);

export const IconHash = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M5 9 C10 8.8 15 8.8 20 9 M4 15 C9 14.8 14 14.8 19 15 M10 4 C9.5 9 9 14 8 20 M16 4 C15.5 9 15 14 14 20" />
  </BaseIcon>
);

export const IconMessageCircle = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 2.5C17.5 2.5 21.5 6.5 21.5 12C21.5 17.5 17.5 21.5 12 21.5C9.5 21.5 7 20.5 5 19L3 21L4.5 17C3 15.5 2.5 13.5 2.5 12C2.5 6.5 6.5 2.5 12 2.5z" />
  </BaseIcon>
);

export const IconBarChart = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M18 20 C18 14 18 10 18 5 M12 20 C12 16 12 12 12 9 M6 20 C6 18 6 16 6 14 M4 20 C10 20.2 14 20.2 20 20" />
  </BaseIcon>
);

export const IconArrowRight = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M5 12 C10 11.8 15 11.8 19 12 M13 6 C15 8 17 10 19 12 C17 14 15 16 13 18" />
  </BaseIcon>
);

export const IconMenu = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" />
  </BaseIcon>
);

export const IconSparkles = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M12 3L13.8 8.2C14.1 9 14.8 9.7 15.6 10L20.8 11.8C21.7 12.1 21.7 13.4 20.8 13.7L15.6 15.5C14.8 15.8 14.1 16.5 13.8 17.3L12 22.5C11.7 23.4 10.4 23.4 10.1 22.5L8.3 17.3C8 16.5 7.3 15.8 6.5 15.5L1.3 13.7C0.4 13.4 0.4 12.1 1.3 11.8L6.5 10C7.3 9.7 8 9 8.3 8.2L10.1 3C10.4 2.1 11.7 2.1 12 3Z" />
    <path d="M19 4L19.7 6.1C19.9 6.6 20.3 7 20.8 7.2L22.9 7.9C23.4 8.1 23.4 8.8 22.9 9L20.8 9.7C20.3 9.9 19.9 10.3 19.7 10.8L19 12.9C18.8 13.4 18.1 13.4 17.9 12.9L17.2 10.8C17 10.3 16.6 9.9 16.1 9.7L14 9C13.5 8.8 13.5 8.1 14 7.9L16.1 7.2C16.6 7 17 6.6 17.2 6.1L17.9 4C18.1 3.5 18.8 3.5 19 4Z" />
  </BaseIcon>
);

export const IconSmartphone = (props: IconProps) => (
  <BaseIcon {...props}>
    <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
    <path d="M12 18h.01" strokeWidth="2.5" />
  </BaseIcon>
);

export const IconDotsVertical = (props: IconProps) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
  </BaseIcon>
);

export const IconFileText = (props: IconProps) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </BaseIcon>
);


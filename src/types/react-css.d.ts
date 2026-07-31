import 'react';

declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
    WebkitMaskImage?: string;
    maskImage?: string;
  }
}


export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type DotType = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
export type CornerSquareType = 'square' | 'dot' | 'extra-rounded' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | null;
export type CornerDotType = 'square' | 'dot' | null;
export type QRShapeType = 'square' | 'circle';

export interface QRConfig {
  url: string;
  fgColor: string;
  bgColor: string;
  size: number;
  level: ErrorCorrectionLevel;
  includeMargin: boolean;
  style: 'squares' | 'dots';
  logo?: string;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  qrShape: QRShapeType;
}

export interface ShapeOption<T = string | null> {
  id: string;
  name: string;
  type: T;
  svgTemplate: string;
}

export interface LogoPreset {
  id: string;
  name: string;
  svgTemplate: string;
}

export interface Preset {
  id: string;
  name: string;
  fgColor: string;
  bgColor: string;
  style: 'squares' | 'dots';
}

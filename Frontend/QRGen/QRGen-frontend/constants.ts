
import { Preset, LogoPreset, ShapeOption, DotType, CornerSquareType, CornerDotType, QRShapeType } from './types';

export const PRESETS: Preset[] = [
  { id: 'black-white', name: 'Black & White', fgColor: '#000000', bgColor: '#FFFFFF', style: 'squares' },
  { id: 'grey-green', name: 'Grey & Vibrant Green', fgColor: '#4B5563', bgColor: '#bef264', style: 'dots' },
  { id: 'black-orange', name: 'Black & Orange', fgColor: '#000000', bgColor: '#f59e0b', style: 'squares' },
  { id: 'blue-orange', name: 'Blue & Orange', fgColor: '#3b82f6', bgColor: '#f97316', style: 'dots' },
  { id: 'coral-teal', name: 'Coral & Teal', fgColor: '#fb7185', bgColor: '#2dd4bf', style: 'squares' },
  { id: 'blue-red', name: 'Blue & Red', fgColor: '#2563eb', bgColor: '#ef4444', style: 'dots' },
  { id: 'black-yellow', name: 'Black & Yellow', fgColor: '#1f2937', bgColor: '#facc15', style: 'squares' },
  { id: 'violet-dahlia', name: 'Ultra Violet & Blooming Dahlia', fgColor: '#7c3aed', bgColor: '#fda4af', style: 'dots' },
];

export const LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'globe',
    name: 'Website',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{fgColor}" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{fgColor}" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1"/></svg>'
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'
  },
];

export const DOT_TYPE_OPTIONS: ShapeOption<DotType>[] = [
  {
    id: 'square',
    name: 'Square',
    type: 'square',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="4" y="4" width="16" height="16"/></svg>'
  },
  {
    id: 'rounded',
    name: 'Rounded',
    type: 'rounded',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>'
  },
  {
    id: 'dots',
    name: 'Dots',
    type: 'dots',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><circle cx="12" cy="12" r="8"/></svg>'
  },
  {
    id: 'classy',
    name: 'Classy',
    type: 'classy',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M12 4L20 12L12 20L4 12Z"/></svg>'
  },
  {
    id: 'classy-rounded',
    name: 'Classy Rounded',
    type: 'classy-rounded',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M12 4C16 4 20 8 20 12C20 16 16 20 12 20C8 20 4 16 4 12C4 8 8 4 12 4Z"/></svg>'
  },
  {
    id: 'extra-rounded',
    name: 'Extra Rounded',
    type: 'extra-rounded',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="3" y="3" width="18" height="18" rx="6"/></svg>'
  },
];

export const CORNER_SQUARE_OPTIONS: ShapeOption<CornerSquareType>[] = [
  {
    id: 'square',
    name: 'Square',
    type: 'square',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="3" y="3" width="18" height="18" stroke="{fgColor}" stroke-width="2" fill="none"/><rect x="7" y="7" width="10" height="10" fill="{fgColor}"/></svg>'
  },
  {
    id: 'dot',
    name: 'Dot',
    type: 'dot',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><circle cx="12" cy="12" r="9" stroke="{fgColor}" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="5" fill="{fgColor}"/></svg>'
  },
  {
    id: 'extra-rounded',
    name: 'Extra Rounded',
    type: 'extra-rounded',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="3" y="3" width="18" height="18" rx="6" stroke="{fgColor}" stroke-width="2" fill="none"/><rect x="7" y="7" width="10" height="10" rx="3" fill="{fgColor}"/></svg>'
  },
  {
    id: 'rounded',
    name: 'Rounded',
    type: 'rounded',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="3" y="3" width="18" height="18" rx="4" stroke="{fgColor}" stroke-width="2" fill="none"/><rect x="7" y="7" width="10" height="10" rx="2" fill="{fgColor}"/></svg>'
  },
  {
    id: 'dots',
    name: 'Dots',
    type: 'dots',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><circle cx="12" cy="6" r="4"/><circle cx="6" cy="18" r="4"/><circle cx="18" cy="18" r="4"/></svg>'
  },
  {
    id: 'classy',
    name: 'Classy',
    type: 'classy',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M3 3L12 3L12 12L3 12Z"/><path d="M12 12L21 12L21 21L12 21Z"/></svg>'
  },
  {
    id: 'classy-rounded',
    name: 'Classy Rounded',
    type: 'classy-rounded',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><path d="M3 3C3 3 12 3 12 12C12 3 21 3 21 3" stroke="{fgColor}" stroke-width="3" fill="none"/></svg>'
  },
  {
    id: 'none',
    name: 'None',
    type: null,
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{fgColor}" stroke-width="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>'
  },
];

export const CORNER_DOT_OPTIONS: ShapeOption<CornerDotType>[] = [
  {
    id: 'square',
    name: 'Square',
    type: 'square',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="6" y="6" width="12" height="12"/></svg>'
  },
  {
    id: 'dot',
    name: 'Dot',
    type: 'dot',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><circle cx="12" cy="12" r="6"/></svg>'
  },
  {
    id: 'none',
    name: 'None',
    type: null,
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{fgColor}" stroke-width="2"><line x1="8" y1="8" x2="16" y2="16"/><line x1="16" y1="8" x2="8" y2="16"/></svg>'
  },
];

export const QR_SHAPE_OPTIONS: ShapeOption<QRShapeType>[] = [
  {
    id: 'square',
    name: 'Square',
    type: 'square',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>'
  },
  {
    id: 'circle',
    name: 'Circle',
    type: 'circle',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="{fgColor}"><circle cx="12" cy="12" r="10"/></svg>'
  },
];

export const DEFAULT_URL = 'https://example.com';

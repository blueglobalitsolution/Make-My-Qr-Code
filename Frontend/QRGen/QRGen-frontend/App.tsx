import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Download,
  Copy,
  Palette,
  Link as LinkIcon,
  RefreshCw,
  CheckCircle2,
  Share2,
  QrCode,
  Info,
  ShieldCheck,
  Infinity,
  X,
  Image as ImageIcon,
  Upload,
  Trash2,
  Shapes
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { QRConfig, Preset } from './types';
import { PRESETS, DEFAULT_URL, LOGO_PRESETS, DOT_TYPE_OPTIONS, CORNER_SQUARE_OPTIONS, CORNER_DOT_OPTIONS } from './constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const App: React.FC = () => {
  const [config, setConfig] = useState<QRConfig>({
    url: '',
    fgColor: '#000000',
    bgColor: '#ffffff',
    size: 1024,
    level: 'H',
    includeMargin: true,
    style: 'squares',
    logo: undefined,
    dotType: 'square',
    cornerSquareType: 'square',
    cornerDotType: 'square',
  });

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const pendingDownloadRef = useRef<'png' | 'svg' | null>(null);
  const [registerData, setRegisterData] = useState({ name: '', number: '', email: '' });
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const [copying, setCopying] = useState(false);

  const [downloading, setDownloading] = useState<'png' | 'svg' | null>(null);
  const [logoPresetId, setLogoPresetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logo' | 'customize' | 'styles'>('logo');
  const mobileQrRef = useRef<HTMLDivElement>(null);
  const desktopQrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateLogoDataUrl = useCallback((svgTemplate: string, fgColor: string): string => {
    return 'data:image/svg+xml,' + encodeURIComponent(
      svgTemplate.replace(/{fgColor}/g, fgColor)
    );
  }, []);

  const getLogoDataUrl = useCallback((): string | undefined => {
    if (logoPresetId) {
      const preset = LOGO_PRESETS.find(p => p.id === logoPresetId);
      if (preset) {
        return generateLogoDataUrl(preset.svgTemplate, config.fgColor);
      }
    }
    return config.logo;
  }, [logoPresetId, config.logo, config.fgColor, generateLogoDataUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setConfig(prev => ({ ...prev, logo: dataUrl }));
      setLogoPresetId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleLogoPresetSelect = (presetId: string) => {
    setLogoPresetId(presetId);
    setConfig(prev => ({ ...prev, logo: undefined }));
  };

  const handleRemoveLogo = () => {
    setConfig(prev => ({ ...prev, logo: undefined }));
    setLogoPresetId(null);
  };

  useEffect(() => {
    const logoDataUrl = getLogoDataUrl();
    const options = {
      width: 1024,
      height: 1024,
      type: 'svg' as const,
      data: config.url || DEFAULT_URL,
      dotsOptions: {
        color: config.fgColor,
        type: config.dotType,
      },
      backgroundOptions: {
        color: config.bgColor,
      },
      qrOptions: {
        errorCorrectionLevel: config.level as any
      },
      margin: config.includeMargin ? 40 : 10,
      image: logoDataUrl,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.28,
        margin: 10,
      },
      cornersSquareOptions: config.cornerSquareType ? {
        color: config.fgColor,
        type: config.cornerSquareType,
      } : undefined,
      cornersDotOptions: config.cornerDotType ? {
        color: config.fgColor,
        type: config.cornerDotType,
      } : undefined,
    };

    if (!qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling(options);
    } else {
      qrCodeInstance.current.update(options);
    }

    const updateQrLocation = () => {
      if (!qrCodeInstance.current) return;

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      const target = isDesktop ? desktopQrRef.current : mobileQrRef.current;

      if (target) {
        if (mobileQrRef.current && mobileQrRef.current !== target) mobileQrRef.current.innerHTML = '';
        if (desktopQrRef.current && desktopQrRef.current !== target) desktopQrRef.current.innerHTML = '';

        target.innerHTML = '';
        qrCodeInstance.current.append(target);

        const svg = target.querySelector('svg');
        if (svg) {
          svg.style.width = '100%';
          svg.style.height = '100%';
          svg.style.borderRadius = '12px';
          svg.setAttribute('viewBox', '0 0 1024 1024');
          if (!config.bgColor || config.bgColor === 'transparent') {
            svg.style.backgroundColor = '#ffffff';
          }
        }
      }
    };

    updateQrLocation();
    window.addEventListener('resize', updateQrLocation);
    return () => window.removeEventListener('resize', updateQrLocation);
  }, [config, getLogoDataUrl]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, url: e.target.value }));
  };

  const handleColorChange = (key: 'fgColor' | 'bgColor', value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: Preset) => {
    setConfig(prev => ({
      ...prev,
      fgColor: preset.fgColor,
      bgColor: preset.bgColor,
      style: preset.style,
      dotType: preset.style === 'dots' ? 'dots' : 'square',
    }));
  };

  const handleDownloadClick = (extension: 'png' | 'svg') => {
    pendingDownloadRef.current = extension;
    setShowRegisterModal(true);
  };

  const handleRegister = async () => {
    if (!registerData.name || !registerData.number || !registerData.email) {
      setRegisterError('All fields are required');
      return;
    }

    setRegistering(true);
    setRegisterError('');

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        const downloadType = pendingDownloadRef.current;
        setShowRegisterModal(false);
        setRegisterData({ name: '', number: '', email: '' });
        pendingDownloadRef.current = null;

        if (downloadType) {
          setTimeout(() => downloadQR(downloadType), 100);
        }
      } else {
        setRegisterError(data.error || 'Registration failed');
      }
    } catch (err) {
      setRegisterError('Failed to connect to server');
    } finally {
      setRegistering(false);
    }
  };

  const downloadQR = useCallback(async (extension: 'png' | 'svg') => {
    // Find active container
    const container = desktopQrRef.current?.querySelector('svg') ? desktopQrRef.current : mobileQrRef.current;
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    try {
      setDownloading(extension);

      const filename = `makemyqrcode-com.${extension}`;

      if (extension === 'svg') {
        // SVG Download: Direct serialization
        const clonedSvg = svg.cloneNode(true) as SVGElement;
        clonedSvg.setAttribute('width', '250px');
        clonedSvg.setAttribute('height', '250px');
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(clonedSvg);
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        // PNG Download: High-res rasterization via Canvas
        const canvas = document.createElement('canvas');
        // Set resolution (1024x1024)
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // SVG to Image
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          // Fill background manually to ensure no transparency issues
          ctx.fillStyle = config.bgColor || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);

          // Download from Canvas
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = filename;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          setDownloading(null);
        };
        img.src = url;
        return;
      }
    } catch (err) {
      console.error('Failed to download:', err);
    }
    if (extension !== 'png') {
      setDownloading(null);
    }
  }, [config.bgColor]);

  const copyToClipboard = useCallback(async () => {
    // Find active container
    const container = desktopQrRef.current?.querySelector('svg') ? desktopQrRef.current : mobileQrRef.current;
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    setCopying(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = config.bgColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            setTimeout(() => setCopying(false), 2000);
          } else {
            setCopying(false);
          }
        });
      };
      img.src = url;
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopying(false);
    }
  }, [config.bgColor]);

  // Helper to render the QR Card (avoiding duplication)
  const renderPreviewCard = (ref: React.RefObject<HTMLDivElement>, isMobile: boolean) => (
    <div className={`relative group p-6 md:p-8 bg-white border border-slate-200 rounded-3xl md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center transition-transform hover:scale-[1.01] ${isMobile ? 'lg:hidden mb-8' : 'hidden lg:flex'}`}>
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 w-full max-w-[400px] aspect-square bg-white flex items-center justify-center"
        style={{ backgroundColor: config.bgColor }}
      >
        <div ref={ref} className={`w-full h-full transition-all duration-500 ${!config.url ? 'blur-sm opacity-20' : 'blur-0 opacity-100'}`} />
        {!config.url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg">
              <QrCode className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-pulse" />
              <p className="text-slate-600 font-medium text-sm">Enter URL to generate</p>
            </div>
                  {(config.logo || logoPresetId) && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <img
                        src={getLogoDataUrl()}
                        alt="Selected logo"
                        className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-slate-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Logo applied</p>
                        <p className="text-xs text-slate-500">
                          {logoPresetId ? 'Color adapts to QR foreground' : 'Auto-scaled to 28% for scannability'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50 selection:bg-blue-500/30">
      {/* Header */}


      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Controls */}
        <div className="lg:col-span-7 space-y-8">
          {/* URL Input Section */}
          <section className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Destination URL</h2>
            </div>
            <div className="relative group">
              <input
                type="url"
                placeholder="https://yourlink.com"
                value={config.url}
                onChange={handleUrlChange}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 px-5 text-lg transition-all text-slate-900 placeholder:text-slate-400"
              />
              <button
                onClick={() => setConfig(prev => ({ ...prev, url: '' }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

          </section>

          {/* Mobile Preview (Hidden on Desktop) */}
          {renderPreviewCard(mobileQrRef, true)}

          {/* Customization Grid */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Colors */}
            <section className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-lg shadow-slate-200/50">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-4">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="text-slate-500 text-sm font-medium">Foreground</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{config.fgColor.toUpperCase()}</span>
                    <input
                      type="color"
                      value={config.fgColor}
                      onChange={(e) => handleColorChange('fgColor', e.target.value)}
                      className="w-[30px] h-[30px] rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="text-slate-500 text-sm font-medium">Background</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{config.bgColor.toUpperCase()}</span>
                    <input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) => handleColorChange('bgColor', e.target.value)}
                      className="w-[30px] h-[30px] rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Tabbed Section: Logo / Customize / Styles */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('logo')}
                className={`w-1/3 flex items-center justify-center gap-2 py-4 px-2 text-sm font-semibold transition-all ${activeTab === 'logo'
                  ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Add Logo</span>
                <span className="sm:hidden">Logo</span>
              </button>
              <button
                onClick={() => setActiveTab('customize')}
                className={`w-1/3 flex items-center justify-center gap-2 py-4 px-2 text-sm font-semibold transition-all ${activeTab === 'customize'
                  ? 'text-pink-600 bg-pink-50 border-b-2 border-pink-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <Shapes className="w-4 h-4" />
                <span className="hidden sm:inline">Customize Design</span>
                <span className="sm:hidden">Design</span>
              </button>
              <button
                onClick={() => setActiveTab('styles')}
                className={`w-1/3 flex items-center justify-center gap-2 py-4 px-2 text-sm font-semibold transition-all ${activeTab === 'styles'
                  ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Quick Styles</span>
                <span className="sm:hidden">Styles</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Add Logo Tab */}
              {activeTab === 'logo' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-md shadow-indigo-600/20"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </button>
                    {(config.logo || logoPresetId) && (
                      <button
                        onClick={handleRemoveLogo}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-all border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Logo
                      </button>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 mb-3">Or choose a preset icon (adapts to QR color):</p>
                    <div className="flex flex-wrap gap-2">
                      {LOGO_PRESETS.map((preset) => {
                        const presetDataUrl = generateLogoDataUrl(preset.svgTemplate, config.fgColor);
                        return (
                          <button
                            key={preset.id}
                            onClick={() => handleLogoPresetSelect(preset.id)}
                            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all hover:scale-105 ${logoPresetId === preset.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-slate-200 hover:border-indigo-300 bg-white'
                              }`}
                            title={preset.name}
                          >
                            <img src={presetDataUrl} alt={preset.name} className="w-6 h-6" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* Customize Design Tab */}
              {activeTab === 'customize' && (
                <div className="space-y-6">
                  {/* Body Shape */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-3">Body Shape</h3>
                    <div className="flex flex-wrap gap-2">
                      {DOT_TYPE_OPTIONS.map((option) => {
                        const previewUrl = 'data:image/svg+xml,' + encodeURIComponent(
                          option.svgTemplate.replace(/{fgColor}/g, '#334155')
                        );
                        return (
                          <button
                            key={option.id}
                            onClick={() => setConfig(prev => ({ ...prev, dotType: option.type }))}
                            className={`w-[40px] h-[40px] p-[5px] rounded-xl border-2 flex items-center justify-center transition-all hover:scale-105 ${config.dotType === option.type
                              ? 'border-pink-500 bg-pink-50 shadow-md'
                              : 'border-slate-200 hover:border-pink-300 bg-white'
                              }`}
                            title={option.name}
                          >
                            <img src={previewUrl} alt={option.name} className="w-full h-full" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Eye Frame Shape */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-3">Eye Frame Shape</h3>
                    <div className="flex flex-wrap gap-2">
                      {CORNER_SQUARE_OPTIONS.map((option) => {
                        const previewUrl = 'data:image/svg+xml,' + encodeURIComponent(
                          option.svgTemplate.replace(/{fgColor}/g, '#334155')
                        );
                        return (
                          <button
                            key={option.id}
                            onClick={() => setConfig(prev => ({ ...prev, cornerSquareType: option.type }))}
                            className={`w-[40px] h-[40px] p-[5px] rounded-xl border-2 flex items-center justify-center transition-all hover:scale-105 ${config.cornerSquareType === option.type
                              ? 'border-pink-500 bg-pink-50 shadow-md'
                              : 'border-slate-200 hover:border-pink-300 bg-white'
                              }`}
                            title={option.name}
                          >
                            <img src={previewUrl} alt={option.name} className="w-full h-full" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Eye Ball Shape */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-3">Eye Ball Shape</h3>
                    <div className="flex flex-wrap gap-2">
                      {CORNER_DOT_OPTIONS.map((option) => {
                        const previewUrl = 'data:image/svg+xml,' + encodeURIComponent(
                          option.svgTemplate.replace(/{fgColor}/g, '#334155')
                        );
                        return (
                          <button
                            key={option.id}
                            onClick={() => setConfig(prev => ({ ...prev, cornerDotType: option.type }))}
                            className={`w-[40px] h-[40px] p-[5px] rounded-xl border-2 flex items-center justify-center transition-all hover:scale-105 ${config.cornerDotType === option.type
                              ? 'border-pink-500 bg-pink-50 shadow-md'
                              : 'border-slate-200 hover:border-pink-300 bg-white'
                              }`}
                            title={option.name}
                          >
                            <img src={previewUrl} alt={option.name} className="w-full h-full" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Styles Tab */}
              {activeTab === 'styles' && (
                <div className="flex flex-wrap gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/50 transition-all hover:bg-slate-50 hover:shadow-md"
                    >
                      <div className="flex -space-x-3">
                        <div
                          className="w-6 h-6 rounded-full border border-slate-200 shadow-sm z-10"
                          style={{ backgroundColor: preset.fgColor }}
                        />
                        <div
                          className="w-6 h-6 rounded-full border border-slate-200 shadow-sm"
                          style={{ backgroundColor: preset.bgColor }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{preset.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Preview & Actions */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-8 w-full space-y-8">
            {/* Desktop Preview (Hidden on Mobile) */}
            {renderPreviewCard(desktopQrRef, false)}

            {/* Floating Badge */}



            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={!config.url || !!downloading}
                  onClick={() => handleDownloadClick('png')}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                >
                  {downloading === 'png' ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {downloading === 'png' ? 'Saving...' : 'PNG'}
                </button>
                <button
                  disabled={!config.url || !!downloading}
                  onClick={() => handleDownloadClick('svg')}
                  className="w-full flex items-center justify-center gap-2 bg-[#42bd14] hover:bg-[#42bd14]/90 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-xl shadow-[#42bd14]/20 active:scale-[0.98]"
                >
                  {downloading === 'svg' ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {downloading === 'svg' ? 'Saving...' : 'SVG'}
                </button>
              </div>


            </div>

          </div>
        </div>

      </main >

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => {
                setShowRegisterModal(false);
                setRegisterError('');
                pendingDownloadRef.current = null;
              }}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Quick Registration</h2>
            <p className="text-slate-500 mb-6">Please fill in your details to download the QR code</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-4 text-slate-900"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={registerData.number}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow + at start, then numbers only
                    if (/^[+]?[0-9]*$/.test(value)) {
                      setRegisterData(prev => ({ ...prev, number: value }));
                    }
                  }}
                  className="w-full border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-4 text-slate-900"
                  placeholder="e.g. +1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-4 text-slate-900"
                  placeholder="Enter your email"
                />
              </div>

              {registerError && (
                <p className="text-red-500 text-sm">{registerError}</p>
              )}

              <button
                onClick={handleRegister}
                disabled={registering}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                {registering ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Submit & Download'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div >
  );
};

export default App;

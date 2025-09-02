import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { supabase } from '../lib/supabase';
import { Upload, Eye, Save, RotateCcw } from 'lucide-react';
import { Alert } from '../components/Alert';

interface FormBranding {
  id: string;
  user_id: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  created_at: string;
  updated_at: string;
}

const FONT_OPTIONS = [
  { value: 'Montserrat', label: 'Montserrat (Default)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
];

const PRESET_COLORS = [
  { name: 'TestiFlow Default', primary: '#01004d', secondary: '#01b79e' },
  { name: 'Ocean Blue', primary: '#0066cc', secondary: '#00a8ff' },
  { name: 'Forest Green', primary: '#2d5a27', secondary: '#4caf50' },
  { name: 'Sunset Orange', primary: '#e65100', secondary: '#ff9800' },
  { name: 'Royal Purple', primary: '#4a148c', secondary: '#9c27b0' },
  { name: 'Crimson Red', primary: '#b71c1c', secondary: '#f44336' },
];

export const Branding: React.FC = () => {
  const { user } = useAuth();
  const subscription = useSubscription();
  const [, setBranding] = useState<FormBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#01004d');
  const [secondaryColor, setSecondaryColor] = useState('#01b79e');
  const [fontFamily, setFontFamily] = useState('Montserrat');

  useEffect(() => {
    fetchBranding();
  }, [user]);

  const fetchBranding = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('form_branding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setBranding(data);
        setLogoUrl(data.logo_url || '');
        setPrimaryColor(data.primary_color);
        setSecondaryColor(data.secondary_color);
        setFontFamily(data.font_family);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching branding:', error);
      setError('Failed to load branding settings');
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const brandingData = {
        user_id: user.id,
        logo_url: logoUrl.trim() || null,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        font_family: fontFamily,
      };

      console.log('Saving branding data:', { ...brandingData, logo_url: brandingData.logo_url ? `${brandingData.logo_url.substring(0, 50)}...` : null });
      const { data, error } = await supabase
        .from('form_branding')
        .upsert(brandingData, {
          onConflict: 'user_id',
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Branding saved successfully:', { ...data, logo_url: data.logo_url ? `${data.logo_url.substring(0, 50)}...` : null });
      setBranding(data);
      setSuccess('Branding settings saved successfully!');
    } catch (error) {
      console.error('Error saving branding:', error);
      setError('Failed to save branding settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLogoUrl('');
    setPrimaryColor('#01004d');
    setSecondaryColor('#01b79e');
    setFontFamily('Montserrat');
  };

  const applyPreset = (preset: typeof PRESET_COLORS[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setLogoUrl(base64);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to process image');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError('Failed to upload image');
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-950"></div>
      </div>
    );
  }

  // Show upgrade prompt for Standard users
  if (!subscription.limits.canUseBranding) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Branding</h1>
                <p className="text-gray-600">Customize the appearance of your testimonial collection forms</p>
              </div>
              
              <UpgradePrompt 
                feature="Custom Branding"
                description="Customize your forms with your logo, brand colors, and fonts to create a professional experience that matches your brand identity."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Branding</h1>
              <p className="text-gray-600">Customize the appearance of your testimonial collection forms</p>
            </div>

            {error && (
              <div className="mb-6">
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError(null)}
                />
              </div>
            )}

            {success && (
              <div className="mb-6">
                <Alert
                  type="success"
                  message={success}
                  onClose={() => setSuccess(null)}
                />
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Settings Panel */}
              <div className="space-y-6">
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://example.com/logo.png"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                        <button
                          type="button"
                          disabled={uploading}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              <span>Upload</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a URL or upload an image file (PNG, JPG, or SVG recommended, max 2MB)
                    </p>
                  </div>

                  {/* Color Presets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Color Presets
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_COLORS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex space-x-1">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.primary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: preset.secondary }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-700">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex space-x-3 items-center">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                        placeholder="#01004d"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Used for headers and primary buttons</p>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex space-x-3 items-center">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                        placeholder="#01b79e"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Used for accents and highlights</p>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-primary-950 text-white py-3 px-4 rounded-lg hover:bg-primary-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                </div>

                {/* Form Preview */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <div 
                    className="px-6 py-8 text-center text-white"
                    style={{ 
                      backgroundColor: primaryColor,
                      fontFamily: fontFamily 
                    }}
                  >
                    {logoUrl && (
                      <div className="flex justify-center mb-4">
                        <img 
                          src={logoUrl} 
                          alt="Logo" 
                          className="h-12 max-w-48 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <h1 className="text-2xl font-bold mb-2">Share Your Experience</h1>
                    <p className="text-white/90">We'd love to hear about your experience with us!</p>
                  </div>

                  <div className="p-6 space-y-6" style={{ fontFamily: fontFamily }}>
                    {/* Rating Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        How would you rate your experience? *
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className="w-8 h-8 flex items-center justify-center"
                          >
                            <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Form Fields Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        John Smith
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Testimonial *
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 h-20 flex items-start">
                        <span className="text-sm">This product has been amazing for our business...</span>
                      </div>
                    </div>

                    {/* Submit Button Preview */}
                    <button
                      type="button"
                      className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors"
                      style={{ 
                        backgroundColor: secondaryColor,
                        fontFamily: fontFamily 
                      }}
                    >
                      Submit Testimonial
                    </button>
                  </div>
                </div>

                {/* Color Palette Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Current Color Palette</h4>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-gray-300 mb-2"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <div className="text-xs text-gray-600">Primary</div>
                      <div className="text-xs font-mono text-gray-500">{primaryColor}</div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-gray-300 mb-2"
                        style={{ backgroundColor: secondaryColor }}
                      ></div>
                      <div className="text-xs text-gray-600">Secondary</div>
                      <div className="text-xs font-mono text-gray-500">{secondaryColor}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
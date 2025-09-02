import React, { useState, useEffect } from 'react';
import { Download, FileText, Code, X, Copy, CheckCircle, Eye, Star } from 'lucide-react';
import { ExportTestimonial, exportToCSV, exportToJSON, generateSocialMediaPost, generateWebsiteWidget } from '../utils/exportUtils';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { supabase } from '../lib/supabase';

interface ExportModalProps {
  testimonials: ExportTestimonial[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ testimonials, onClose, onSuccess }) => {
  const { user } = useAuth();
  const subscription = useSubscription();
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'social' | 'widget'>('csv');
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('approved');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [branding, setBranding] = useState<{ primary_color: string; secondary_color: string; font_family: string } | null>(null);

  // Fetch user's branding
  useEffect(() => {
    const fetchBranding = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('form_branding')
          .select('primary_color, secondary_color, font_family')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data) {
          setBranding(data);
        }
      } catch (error) {
        console.error('Error fetching branding:', error);
      }
    };

    fetchBranding();
  }, [user]);

  // Reset selections when format changes
  useEffect(() => {
    setSelectedTestimonials([]);
    setSelectAll(true);
  }, [selectedFormat]);

  // Get approved testimonials
  const approvedTestimonials = testimonials.filter(t => t.status === 'approved');
  
  // Filter testimonials based on status filter
  const statusFilteredTestimonials = statusFilter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.status === statusFilter);

  // Final filtered testimonials based on selection
  const filteredTestimonials = selectAll 
    ? statusFilteredTestimonials 
    : statusFilteredTestimonials.filter(t => selectedTestimonials.includes(t.id));

  // Reset selections when status filter changes
  useEffect(() => {
    setSelectAll(true);
    setSelectedTestimonials([]);
  }, [statusFilter]);

  // For widget, default to approved testimonials
  const widgetTestimonials = selectedTestimonials.length > 0 
    ? approvedTestimonials.filter(t => selectedTestimonials.includes(t.id))
    : approvedTestimonials.slice(0, 3);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (!checked) {
      setSelectedTestimonials([]);
    }
  };

  const handleTestimonialSelect = (testimonialId: string, checked: boolean) => {
    if (checked) {
      setSelectedTestimonials([...selectedTestimonials, testimonialId]);
    } else {
      setSelectedTestimonials(selectedTestimonials.filter(id => id !== testimonialId));
      setSelectAll(false);
    }
  };


  const handleExport = () => {
    switch (selectedFormat) {
      case 'csv':
        if (filteredTestimonials.length === 0) {
          onSuccess('Please select at least one testimonial to export');
          return;
        }
        exportToCSV(filteredTestimonials);
        onSuccess(`Exported ${filteredTestimonials.length} testimonials to CSV`);
        onClose();
        break;
      case 'json':
        if (filteredTestimonials.length === 0) {
          onSuccess('Please select at least one testimonial to export');
          return;
        }
        exportToJSON(filteredTestimonials);
        onSuccess(`Exported ${filteredTestimonials.length} testimonials to JSON`);
        onClose();
        break;
      case 'social':
        if (selectedTestimonials.length !== 1) {
          onSuccess('Please select exactly one testimonial for social media post');
          return;
        }
        const testimonial = statusFilteredTestimonials.find(t => t.id === selectedTestimonials[0]);
        if (testimonial) {
          const socialContent = generateSocialMediaPost(testimonial);
          setGeneratedContent(socialContent);
        }
        break;
      case 'widget':
        if (widgetTestimonials.length === 0) {
          onSuccess('No approved testimonials available for widget');
          return;
        }
        const widgetContent = generateWebsiteWidget(
          widgetTestimonials, 
          branding?.primary_color || '#01004d', 
          branding?.secondary_color || '#01b79e',
          branding?.font_family || 'Montserrat'
        );
        setGeneratedContent(widgetContent);
        break;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Export Testimonials</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {generatedContent ? (
            /* Generated Content View */
           <div id="generated-content" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedFormat === 'social' ? 'Social Media Post' : 'Website Widget Code'}
                </h3>
                <button
                  onClick={() => setGeneratedContent('')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Back to Export Options
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFormat === 'social' ? 'Copy this text for your social media post:' : 'Copy this HTML code for your website:'}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      copied 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono bg-white p-3 rounded border max-h-96 overflow-y-auto">
                  {generatedContent}
                </pre>
              </div>
              
              <div className="text-center">
                <button
                  onClick={onClose}
                  className="bg-primary-950 text-white px-6 py-2 rounded-lg hover:bg-primary-900 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Export Options View */
            <>
              <div className="space-y-6">
                {/* Export Format Selection */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Export Format</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedFormat('csv')}
                      className={`w-full p-4 border rounded-lg text-left transition-colors ${
                        selectedFormat === 'csv'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-green-600" />
                        <div>
                          <div className="font-medium">CSV Spreadsheet</div>
                          <div className="text-sm text-gray-500">For analysis in Excel/Google Sheets</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedFormat('json')}
                      disabled={!subscription.limits.canUseAdvancedExports}
                      className={`w-full p-4 border rounded-lg text-left transition-colors relative ${
                        !subscription.limits.canUseAdvancedExports
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 
                        selectedFormat === 'json'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Code className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-medium">JSON Data</div>
                          <div className="text-sm text-gray-500">For developers and integrations</div>
                          {!subscription.limits.canUseAdvancedExports && (
                            <div className="text-xs text-accent-600 font-medium">Premium Feature</div>
                          )}
                        </div>
                      </div>
                      {!subscription.limits.canUseAdvancedExports && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-600 font-medium">Premium Only</span>
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedFormat('widget')}
                      disabled={!subscription.limits.canUseAdvancedExports}
                      className={`w-full p-4 border rounded-lg text-left transition-colors relative ${
                        !subscription.limits.canUseAdvancedExports
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 
                        selectedFormat === 'widget'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Code className="h-6 w-6 text-purple-600" />
                        <div>
                          <div className="font-medium">Website Widget</div>
                          <div className="text-sm text-gray-500">HTML code to embed on your website</div>
                          {!subscription.limits.canUseAdvancedExports && (
                            <div className="text-xs text-accent-600 font-medium">Premium Feature</div>
                          )}
                        </div>
                      </div>
                      {!subscription.limits.canUseAdvancedExports && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-600 font-medium">Premium Only</span>
                        </div>
                      )}
                    </button>

                    {/* Show upgrade prompt for restricted formats */}
                    {!subscription.limits.canUseAdvancedExports && (selectedFormat === 'json' || selectedFormat === 'widget') && (
                      <div className="mt-4">
                        <UpgradePrompt 
                          feature="Advanced Exports"
                          description="JSON exports and website widgets are available with Premium"
                          inline
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Filter for CSV/JSON */}
                {(selectedFormat === 'csv' || selectedFormat === 'json') && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'approved', label: 'Approved Only', count: testimonials.filter(t => t.status === 'approved').length },
                        { value: 'pending', label: 'Pending Only', count: testimonials.filter(t => t.status === 'pending').length },
                        { value: 'rejected', label: 'Rejected Only', count: testimonials.filter(t => t.status === 'rejected').length },
                        { value: 'all', label: 'All Status', count: testimonials.length }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setStatusFilter(option.value as any)}
                          className={`p-3 border rounded-lg text-left transition-colors ${
                            statusFilter === option.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-medium text-sm">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.count} testimonials</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonial Selection for CSV/JSON */}
                {(selectedFormat === 'csv' || selectedFormat === 'json' || selectedFormat === 'social') && statusFilteredTestimonials.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedFormat === 'social' ? 'Select a Testimonial' : 'Select Testimonials'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="select-all"
                          checked={selectAll}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-primary-950 focus:ring-primary-500"
                          disabled={selectedFormat === 'social'}
                        />
                        <label htmlFor="select-all" className="text-sm text-gray-700">
                          {selectedFormat === 'social' ? 'Choose one testimonial' : `Select All (${statusFilteredTestimonials.length})`}
                        </label>
                      </div>
                    </div>

                    {selectedFormat === 'social' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-700">
                          💡 Select exactly one testimonial to generate a social media post
                        </p>
                      </div>
                    )}

                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                      {statusFilteredTestimonials.map((testimonial) => (
                        <div key={testimonial.id} className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0">
                          <input
                            type={selectedFormat === 'social' ? 'radio' : 'checkbox'}
                            name={selectedFormat === 'social' ? 'social-testimonial' : undefined}
                            checked={selectAll || selectedTestimonials.includes(testimonial.id)}
                            onChange={(e) => {
                              if (selectedFormat === 'social') {
                                setSelectedTestimonials([testimonial.id]);
                                setSelectAll(false);
                              } else {
                                handleTestimonialSelect(testimonial.id, e.target.checked);
                              }
                            }}
                            className="rounded border-gray-300 text-primary-950 focus:ring-primary-500"
                            disabled={selectAll}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900">{testimonial.name}</span>
                              <div className="flex">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 truncate">"{testimonial.message}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Widget Testimonial Selection */}
                {selectedFormat === 'widget' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Select Testimonials for Widget</h3>
                    
                    {approvedTestimonials.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No approved testimonials available for widget</p>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-blue-700">
                            💡 Select specific testimonials or leave unselected to use your top 3 approved testimonials automatically
                          </p>
                        </div>

                        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                          {approvedTestimonials.map((testimonial) => (
                            <div key={testimonial.id} className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0">
                              <input
                                type="checkbox"
                                checked={selectedTestimonials.includes(testimonial.id)}
                                onChange={(e) => handleTestimonialSelect(testimonial.id, e.target.checked)}
                                className="rounded border-gray-300 text-primary-950 focus:ring-primary-500"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">{testimonial.name}</span>
                                  <div className="flex">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                  </div>
                                  {/* Video thumbnail preview */}
                                  {testimonial.video_url && (
                                    <div style={{ marginBottom: '12px', position: 'relative', cursor: 'pointer' }}>
                                      <div style={{ 
                                        width: '100%', 
                                        height: '80px', 
                                        background: `linear-gradient(135deg, ${branding?.primary_color || '#01004d'}, ${branding?.secondary_color || '#01b79e'})`, 
                                        borderRadius: '8px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                      }}>
                                        <div style={{ 
                                          background: 'rgba(255,255,255,0.9)', 
                                          borderRadius: '50%', 
                                          width: '30px', 
                                          height: '30px', 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          justifyContent: 'center' 
                                        }}>
                                          <span style={{ color: branding?.primary_color || '#01004d', fontSize: '12px' }}>▶</span>
                                        </div>
                                      </div>
                                      <div style={{ 
                                        position: 'absolute', 
                                        bottom: '4px', 
                                        left: '4px', 
                                        background: 'rgba(0,0,0,0.7)', 
                                        color: 'white', 
                                        padding: '2px 4px', 
                                        borderRadius: '4px', 
                                        fontSize: '8px' 
                                      }}>
                                        Video
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 truncate">"{testimonial.message}"</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Export Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Export Summary</h4>
                      <p className="text-sm text-gray-600">
                        {selectedFormat === 'widget' 
                          ? `${widgetTestimonials.length} testimonials selected for widget`
                          : selectedFormat === 'social'
                          ? `${selectedTestimonials.length} testimonial selected`
                          : `${filteredTestimonials.length} testimonials selected`
                        }
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {selectedFormat === 'widget' && (
                        <button
                          onClick={() => {
                            setShowPreview(!showPreview);
                            if (!showPreview) {
                              setTimeout(() => {
                                document.getElementById('widget-preview')?.scrollIntoView({ 
                                  behavior: 'smooth', 
                                  block: 'start' 
                                });
                              }, 100);
                            }
                          }}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                        </button>
                      )}
                      <button
                        onClick={handleExport}
                        disabled={
                          (selectedFormat === 'social' && selectedTestimonials.length !== 1) ||
                          ((selectedFormat === 'csv' || selectedFormat === 'json') && filteredTestimonials.length === 0) ||
                          (selectedFormat === 'widget' && widgetTestimonials.length === 0)
                        }
                        className="bg-primary-950 text-white px-6 py-2 rounded-lg hover:bg-primary-900 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="h-4 w-4" />
                        <span>
                          {selectedFormat === 'csv' || selectedFormat === 'json' ? 'Download' : 'Generate'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Widget Preview */}
                {(selectedFormat === 'widget' && showPreview && widgetTestimonials.length > 0) && (
                 <div id="widget-preview" className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">How this will look on your website:</span>
                      </div>
                      <div className="p-6">
                        {/* Render the actual widget */}
                        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Montserrat, system-ui, sans-serif' }}>
                          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>What Our Customers Say</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {widgetTestimonials.map(testimonial => (
                              <div key={testimonial.id} style={{ 
                                background: '#f9f9f9', 
                                padding: '20px', 
                                borderRadius: '12px', 
                                borderLeft: `4px solid ${branding?.secondary_color || '#01b79e'}`, 
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                              }}>
                                <div style={{ display: 'flex', marginBottom: '8px' }}>
                                  {'★'.repeat(testimonial.rating)}<span style={{ color: '#ddd' }}>{'★'.repeat(5 - testimonial.rating)}</span>
                                </div>
                                <p style={{ margin: '0 0 15px 0', fontStyle: 'italic', color: branding?.primary_color || '#555', lineHeight: '1.5' }}>"{testimonial.message}"</p>
                                <div style={{ fontSize: '14px', color: '#777', fontWeight: '500' }}>
                                  - {testimonial.name}{testimonial.company ? `, ${testimonial.company}` : ''}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        This preview shows exactly how the widget will appear on your website. Videos show as clickable thumbnails that open in a modal.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Download, FileText, Code, Share2, X, Copy, CheckCircle } from 'lucide-react';
import { ExportTestimonial, exportToCSV, exportToJSON, generateSocialMediaPost, generateWebsiteWidget } from '../utils/exportUtils';

interface ExportModalProps {
  testimonials: ExportTestimonial[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ testimonials, onClose, onSuccess }) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'social' | 'widget'>('csv');
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Filter testimonials based on selection
  const filteredTestimonials = selectAll 
    ? testimonials 
    : testimonials.filter(t => selectedTestimonials.includes(t.id));

  const approvedTestimonials = testimonials.filter(t => t.status === 'approved');

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
    const exportData = filteredTestimonials;
    
    if (exportData.length === 0) {
      onSuccess('Please select at least one testimonial to export');
      return;
    }

    switch (selectedFormat) {
      case 'csv':
        exportToCSV(exportData);
        onSuccess(`Exported ${exportData.length} testimonials to CSV`);
        onClose();
        break;
      case 'json':
        exportToJSON(exportData);
        onSuccess(`Exported ${exportData.length} testimonials to JSON`);
        onClose();
        break;
      case 'social':
        if (exportData.length === 1) {
          const content = generateSocialMediaPost(exportData[0]);
          setGeneratedContent(content);
        } else {
          onSuccess('Please select exactly one testimonial for social media post');
        }
        break;
      case 'widget':
        const content = generateWebsiteWidget(approvedTestimonials);
        setGeneratedContent(content);
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
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
            <div className="space-y-4">
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
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
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
              
              <div className="flex justify-end">
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
            <div className="space-y-6">
              {/* Export Format Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Export Format</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedFormat('csv')}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedFormat === 'csv'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-medium">CSV Spreadsheet</div>
                        <div className="text-sm text-gray-500">For analysis in Excel/Sheets</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedFormat('json')}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedFormat === 'json'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Code className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="font-medium">JSON Data</div>
                        <div className="text-sm text-gray-500">For developers/integrations</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedFormat('social')}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedFormat === 'social'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Share2 className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="font-medium">Social Media Post</div>
                        <div className="text-sm text-gray-500">Ready-to-post content</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedFormat('widget')}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedFormat === 'widget'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Code className="h-6 w-6 text-orange-600" />
                      <div>
                        <div className="font-medium">Website Widget</div>
                        <div className="text-sm text-gray-500">HTML code for your site</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedFormat === 'social' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-purple-900 mb-2">📱 Social Media Post</h4>
                  <p className="text-sm text-purple-700">
                    Select exactly <strong>one testimonial</strong> to generate a ready-to-post social media update with stars, quote, and hashtags.
                  </p>
                </div>
              )}

              {selectedFormat === 'widget' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-orange-900 mb-2">🌐 Website Widget</h4>
                  <p className="text-sm text-orange-700">
                    Generates HTML code showing your <strong>top 3 approved testimonials</strong> that you can embed directly on your website.
                  </p>
                </div>
              )}

              {/* Testimonial Selection */}
              {(selectedFormat === 'csv' || selectedFormat === 'json') && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Select Testimonials</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="select-all"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-primary-950 focus:ring-primary-500"
                      />
                      <label htmlFor="select-all" className="text-sm text-gray-700">
                        Select All ({testimonials.length})
                      </label>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={selectAll || selectedTestimonials.includes(testimonial.id)}
                          onChange={(e) => handleTestimonialSelect(testimonial.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary-950 focus:ring-primary-500"
                          disabled={selectAll}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{testimonial.name}</span>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <span key={i} className="text-yellow-400">★</span>
                              ))}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testimonial.status === 'approved' 
                                ? 'bg-secondary-100 text-secondary-800' 
                                : testimonial.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {testimonial.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">"{testimonial.message}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Single Testimonial Selection for Social Media */}
              {selectedFormat === 'social' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Testimonial for Social Post</h3>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    {approvedTestimonials.map((testimonial) => (
                      <button
                        key={testimonial.id}
                        onClick={() => setSelectedTestimonials([testimonial.id])}
                        className={`w-full text-left p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                          selectedTestimonials.includes(testimonial.id) ? 'bg-primary-50 border-primary-200' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{testimonial.name}</span>
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">"{testimonial.message}"</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Export Summary</h4>
                    <p className="text-sm text-gray-600">
                      {selectedFormat === 'widget' 
                        ? `Will include top 3 approved testimonials (${approvedTestimonials.length} available)`
                        : selectedFormat === 'social'
                        ? `${selectedTestimonials.length} testimonial selected`
                        : `${filteredTestimonials.length} testimonials selected`
                      }
                    </p>
                  </div>
                  <button
                    onClick={handleExport}
                    disabled={
                      (selectedFormat === 'social' && selectedTestimonials.length !== 1) ||
                      ((selectedFormat === 'csv' || selectedFormat === 'json') && filteredTestimonials.length === 0) ||
                      (selectedFormat === 'widget' && approvedTestimonials.length === 0)
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
          )}

          {/* Generated Content Display */}
          {generatedContent && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Generated Content</h4>
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
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{generatedContent}</pre>
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
          )}
        </div>
      </div>
    </div>
  );
};
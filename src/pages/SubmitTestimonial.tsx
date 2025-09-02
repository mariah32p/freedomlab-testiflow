import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Star, Send, CheckCircle, X, Play, Image as ImageIcon } from 'lucide-react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { useEmailNotifications } from '../hooks/useEmailNotifications';

interface TestimonialForm {
  id: string;
  title: string;
  description: string;
  thank_you_message: string;
  is_active: boolean;
  user_id: string;
  allow_image_uploads?: boolean;
  allow_video_uploads?: boolean;
  max_image_size_mb?: number;
  max_video_size_mb?: number;
}

interface FormBranding {
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  font_family: string;
}

interface FormField {
  id: string;
  field_type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'rating' | 'email' | 'url';
  label: string;
  placeholder: string;
  options: string[];
  is_required: boolean;
  sort_order: number;
}
export const SubmitTestimonial: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { sendNewTestimonialNotification } = useEmailNotifications();
  const [form, setForm] = useState<TestimonialForm | null>(null);
  const [branding, setBranding] = useState<FormBranding | null>(null);
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [customResponses, setCustomResponses] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) {
        setError('Invalid form ID');
        setLoading(false);
        return;
      }

      try {
        // Create anonymous client for public form access
        const anonClient = supabase;
        
        const { data, error } = await anonClient
          .from('testimonial_forms')
          .select('*')
          .eq('id', formId)
          .eq('is_active', true)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('No form found with ID:', formId);
            setError('Form not found or inactive');
          } else {
            console.error('Supabase error:', error);
            setError('Failed to load form');
          }
        } else if (!data) {
          console.log('No form found with ID:', formId);
          setError('Form not found or inactive');
        } else {
          console.log('Form loaded successfully:', data);
          setForm(data);
          
          // Fetch branding for this form's owner (using same anon client)
          const { data: brandingData } = await anonClient
            .from('form_branding')
            .select('*')
            .eq('user_id', data.user_id)
            .maybeSingle();
          
          if (brandingData) {
            setBranding(brandingData);
          }

          // Fetch custom fields for this form (using same anon client)
          const { data: fieldsData } = await anonClient
            .from('form_fields')
            .select('*')
            .eq('form_id', data.id)
            .order('sort_order', { ascending: true });
          
          if (fieldsData) {
            setCustomFields(fieldsData);
          }
        }
      } catch (error) {
        console.error('Error fetching form:', error);
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSizeMB = form?.max_image_size_mb || 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB}MB`);
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    // Validate file size (max 100MB)
    const maxSizeMB = form?.max_video_size_mb || 100;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Video must be smaller than ${maxSizeMB}MB`);
      return;
    }

    setVideoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setVideoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  const uploadMediaFiles = async () => {
    const uploadedUrls: { image_url?: string; video_url?: string } = {};

    if (imageFile) {
      setUploadingMedia(true);
      try {
        // Convert to base64 for storage
        const reader = new FileReader();
        const imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        uploadedUrls.image_url = imageBase64;
      } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
      }
    }

    if (videoFile) {
      setUploadingMedia(true);
      try {
        // Convert to base64 for storage
        const reader = new FileReader();
        const videoBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(videoFile);
        });
        uploadedUrls.video_url = videoBase64;
      } catch (error) {
        console.error('Error processing video:', error);
        throw new Error('Failed to process video');
      }
    }

    setUploadingMedia(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || rating === 0) {
      setError('Please provide a rating before submitting');
      return;
    }

    // Check if form owner has reached testimonial limit (Standard plan)
    try {
      const { data: ownerData } = await supabase
        .from('stripe_customers')
        .select('customer_id')
        .eq('user_id', form.user_id)
        .maybeSingle();

      if (ownerData) {
        const { data: subscriptionData } = await supabase
          .from('stripe_subscriptions')
          .select('price_id, status')
          .eq('customer_id', ownerData.customer_id)
          .maybeSingle();

        // Check if Standard plan (price_1Rznb5Dn6VTzl81bjqFfCagv)
        if (subscriptionData?.price_id === 'price_1Rznb5Dn6VTzl81bjqFfCagv') {
          
          // Count existing testimonials for this user's forms
          const { data: userForms } = await supabase
            .from('testimonial_forms')
            .select('id')
            .eq('user_id', form.user_id);

          if (userForms && userForms.length > 0) {
            const formIds = userForms.map(f => f.id);
            const { count } = await supabase
              .from('testimonials')
              .select('*', { count: 'exact', head: true })
              .in('form_id', formIds);

            if (count && count >= 25) {
              setError('This form has reached its testimonial limit. Please contact the form owner.');
              return;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking testimonial limits:', error);
      // Continue with submission if check fails
    }

    // Validate required custom fields
    for (const field of customFields) {
      if (field.is_required && !customResponses[field.id]?.trim()) {
        setError(`Please fill in the required field: ${field.label}`);
        return;
      }
    }
    setSubmitting(true);
    setError(null);

    try {
      // Upload media files first
      const mediaUrls = await uploadMediaFiles();

      const { data: testimonialData, error } = await supabase
        .from('testimonials')
        .insert([{
          form_id: form.id,
          name,
          email,
          company: company || null,
          message,
          rating,
          status: 'pending',
          image_url: mediaUrls.image_url || null,
          video_url: mediaUrls.video_url || null
        }])
        .select()
        .single();

      if (error || !testimonialData) {
        if (error && error.code === 'PGRST116') {
          console.log('No form found with ID:', formId);
          setError('Form not found or inactive');
        } else {
          console.error('Supabase error:', error);
          setError('Failed to load form');
        }
      }

      // Save custom field responses
      if (customFields.length > 0) {
        const responses = customFields
          .filter(field => customResponses[field.id]?.trim())
          .map(field => ({
            testimonial_id: testimonialData.id,
            field_id: field.id,
            value: customResponses[field.id]
          }));

        if (responses.length > 0) {
          const { error: responsesError } = await supabase
            .from('form_responses')
            .insert(responses);

          if (responsesError) {
            console.error('Error saving custom responses:', responsesError);
            // Don't fail the whole submission for this
          }
        }
      }

      // Send email notification to form owner
      try {
        await sendNewTestimonialNotification(
          {
            name,
            company: company || undefined,
            rating,
            message,
          },
          form.title,
          form.user_id
        );
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the testimonial submission if email fails
      }

      console.log('Testimonial submitted successfully');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setError('Failed to submit testimonial. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-950"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <p className="text-gray-600">Please check the form link and try again.</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">Form not found</div>
          <p className="text-gray-600">This form may have been deactivated or removed.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600">{form.thank_you_message}</p>
        </div>
      </div>
    );
  }

  // Get branding values with fallbacks
  const primaryColor = branding?.primary_color || '#01004d';
  const secondaryColor = branding?.secondary_color || '#01b79e';
  const fontFamily = branding?.font_family || 'Montserrat';
  const logoUrl = branding?.logo_url;

  const renderCustomField = (field: FormField) => {
    const value = customResponses[field.id] || '';
    const updateValue = (newValue: string) => {
      setCustomResponses(prev => ({ ...prev, [field.id]: newValue }));
    };

    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <div>
          <input
            type={field.field_type}
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={field.placeholder}
            required={field.is_required}
          />
          {field.field_type === 'url' && (
            <p className="text-xs text-gray-500 mt-1">
              Please include http:// or https:// (e.g., https://www.example.com)
            </p>
          )}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={field.placeholder}
            required={field.is_required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required={field.is_required}
          >
            <option value="">Select an option...</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => updateValue(e.target.value)}
                  className="text-primary-500 focus:ring-primary-500"
                  required={field.is_required}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const selectedValues = value ? value.split(',') : [];
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateValue([...selectedValues, option].join(','));
                    } else {
                      updateValue(selectedValues.filter(v => v !== option).join(','));
                    }
                  }}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'rating':
        const ratingValue = parseInt(value) || 0;
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => updateValue(star.toString())}
                className="p-1 transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= ratingValue
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12" style={{ fontFamily }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div 
            className="px-6 py-8 text-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex justify-center mb-4">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="h-8 max-w-32 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    // Show fallback icon
                    const fallback = document.createElement('div');
                    fallback.innerHTML = '<svg class="h-8 w-8 text-white" viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="14" fill="currentColor"/></svg>';
                    e.currentTarget.parentNode?.appendChild(fallback);
                  }}
                />
              ) : (
                <TestiFlowIcon className="h-8 w-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
            <p className="text-white/90">{form.description}</p>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate your experience? *
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-colors"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your company name"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Testimonial *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ 
                    '--tw-ring-color': secondaryColor,
                    fontFamily 
                  } as React.CSSProperties}
                  placeholder="Tell us about your experience..."
                />
              </div>

               {/* Custom Fields */}
               {customFields.map((field) => (
                 <div key={field.id}>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     {field.label}
                     {field.is_required && <span className="text-red-500 ml-1">*</span>}
                   </label>
                   {renderCustomField(field)}
                 </div>
               ))}
              {/* Submit Button */}
              {/* Media Upload Section */}
              {(form.allow_image_uploads || form.allow_video_uploads) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Media (Optional)</h3>
                  
                  {/* Image Upload */}
                  {form.allow_image_uploads && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                      </label>
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload an image</p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF up to {form.max_image_size_mb || 10}MB
                            </p>
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Video Upload */}
                  {form.allow_video_uploads && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Video
                      </label>
                      {videoPreview ? (
                        <div className="relative">
                          <video 
                            src={videoPreview} 
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                            controls
                          />
                          <button
                            type="button"
                            onClick={removeVideo}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="video-upload"
                          />
                          <label htmlFor="video-upload" className="cursor-pointer">
                            <Play className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload a video</p>
                            <p className="text-xs text-gray-500 mt-1">
                              MP4, MOV, AVI up to 100MB
                            </p>
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || rating === 0 || uploadingMedia}
                  className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: secondaryColor,
                    fontFamily 
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting && rating > 0 && !uploadingMedia) {
                      e.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  {submitting || uploadingMedia ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{uploadingMedia ? 'Processing media...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Testimonial</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
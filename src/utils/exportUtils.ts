// Export utilities for testimonials
export interface ExportTestimonial {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  rating: number;
  status: string;
  submitted_at: string;
  form_title: string;
  custom_responses?: Record<string, string>;
}

export const exportToCSV = (testimonials: ExportTestimonial[], filename: string = 'testimonials') => {
  // Define CSV headers
  const headers = [
    'Name',
    'Email', 
    'Company',
    'Rating',
    'Testimonial',
    'Status',
    'Submitted Date',
    'Form',
    'Custom Fields'
  ];

  // Convert testimonials to CSV rows
  const rows = testimonials.map(testimonial => [
    testimonial.name,
    testimonial.email,
    testimonial.company || '',
    testimonial.rating.toString(),
    `"${testimonial.message.replace(/"/g, '""')}"`, // Escape quotes
    testimonial.status,
    new Date(testimonial.submitted_at).toLocaleDateString(),
    testimonial.form_title,
    testimonial.custom_responses ? 
      Object.entries(testimonial.custom_responses)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ') : ''
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (testimonials: ExportTestimonial[], filename: string = 'testimonials') => {
  const jsonContent = JSON.stringify(testimonials, null, 2);
  
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateSocialMediaPost = (testimonial: ExportTestimonial): string => {
  const truncatedMessage = testimonial.message.length > 200 
    ? testimonial.message.substring(0, 200) + '...'
    : testimonial.message;
    
  const stars = '⭐'.repeat(testimonial.rating);
  
  return `${stars} Customer Love!\n\n"${truncatedMessage}"\n\n- ${testimonial.name}${testimonial.company ? `, ${testimonial.company}` : ''}\n\n#CustomerSuccess #Testimonial`;
};

export const generateWebsiteWidget = (testimonials: ExportTestimonial[], _primaryColor: string = '#01004d', secondaryColor: string = '#01b79e'): string => {
  const approvedTestimonials = testimonials.filter(t => t.status === 'approved').slice(0, 3);
  
  return `<!-- Testimonials Widget -->
<div class="testimonials-widget" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
  <h3 style="text-align: center; margin-bottom: 20px; color: #333;">What Our Customers Say</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    ${approvedTestimonials.map(testimonial => `
    <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border-left: 4px solid ${secondaryColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="display: flex; margin-bottom: 8px;">
        ${'★'.repeat(testimonial.rating)}<span style="color: #ddd;">${'★'.repeat(5 - testimonial.rating)}</span>
      </div>
      <p style="margin: 0 0 15px 0; font-style: italic; color: #555; line-height: 1.5;">"${testimonial.message}"</p>
      <div style="font-size: 14px; color: #777;">
        - ${testimonial.name}${testimonial.company ? `, ${testimonial.company}` : ''}
      </div>
    </div>`).join('')}
  </div>
</div>`;
};
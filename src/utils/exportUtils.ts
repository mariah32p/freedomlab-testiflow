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
  image_url?: string;
  video_url?: string;
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

export const generateWebsiteWidget = (testimonials: ExportTestimonial[], primaryColor: string = '#01004d', secondaryColor: string = '#01b79e', fontFamily: string = 'Montserrat'): string => {
  const approvedTestimonials = testimonials.filter(t => t.status === 'approved').slice(0, 3);
  
  return `<!-- TestiFlow Testimonials Widget -->
<div class="testimonials-widget" style="max-width: 1000px; margin: 0 auto; padding: 20px; font-family: '${fontFamily}', system-ui, sans-serif;">
  <h3 style="text-align: center; margin-bottom: 20px; color: #333; font-family: '${fontFamily}', system-ui, sans-serif;">What Our Customers Say</h3>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    ${approvedTestimonials.map(testimonial => `
    <div class="testimonial-card" style="background: #f9f9f9; padding: 20px; border-radius: 12px; border-left: 4px solid ${secondaryColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; font-family: '${fontFamily}', system-ui, sans-serif;">
      <div style="display: flex; margin-bottom: 8px;">
        ${'★'.repeat(testimonial.rating)}<span style="color: #ddd;">${'★'.repeat(5 - testimonial.rating)}</span>
      </div>
      ${testimonial.image_url ? `
      <div style="margin-bottom: 12px;">
        <img src="${testimonial.image_url}" alt="Customer photo" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid ${secondaryColor};" onclick="openTestimonialModal('${testimonial.id}', '${testimonial.image_url}', '${testimonial.name}', '${testimonial.message}', ${testimonial.rating})">
      </div>` : ''}
      ${testimonial.video_url ? `
      <div style="margin-bottom: 12px; position: relative; cursor: pointer;" onclick="openTestimonialModal('${testimonial.id}', '${testimonial.video_url}', '${testimonial.name}', '${testimonial.message}', ${testimonial.rating}, true)">
        <div style="width: 100%; height: 120px; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative;">
          <div style="background: rgba(255,255,255,0.9); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <span style="color: ${primaryColor}; font-size: 16px;">▶</span>
          </div>
          <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
            Video Testimonial
          </div>
        </div>
      </div>` : ''}
      <p style="margin: 0 0 15px 0; font-style: italic; color: #555; line-height: 1.5;">"${testimonial.message}"</p>
      <div style="font-size: 14px; color: #777; font-family: '${fontFamily}', system-ui, sans-serif;">
        - ${testimonial.name}${testimonial.company ? `, ${testimonial.company}` : ''}
      </div>
    </div>`).join('')}
  </div>
</div>

<!-- Modal for video/image testimonials -->
<div id="testimonial-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center; font-family: '${fontFamily}', system-ui, sans-serif;">
  <div style="background: white; border-radius: 12px; max-width: 600px; width: 90%; max-height: 80%; overflow: hidden; position: relative; font-family: '${fontFamily}', system-ui, sans-serif;">
    <button onclick="closeTestimonialModal()" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; z-index: 1001;">×</button>
    <div id="modal-content" style="padding: 20px; font-family: '${fontFamily}', system-ui, sans-serif;"></div>
  </div>
</div>

<script>
function openTestimonialModal(id, mediaUrl, name, message, rating, isVideo = false) {
  const modal = document.getElementById('testimonial-modal');
  const content = document.getElementById('modal-content');
  
  const stars = '★'.repeat(rating) + '<span style="color: #ddd;">' + '★'.repeat(5 - rating) + '</span>';
  
  content.innerHTML = \`
    <div style="text-align: center;">
      \${isVideo ? 
        \`<video controls style="width: 100%; max-height: 300px; border-radius: 8px; margin-bottom: 20px;">
           <source src="\${mediaUrl}" type="video/mp4">
           Your browser does not support the video tag.
         </video>\` :
        \`<img src="\${mediaUrl}" alt="Customer photo" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin: 0 auto 20px; border: 3px solid ${secondaryColor};">\`
      }
      <div style="margin-bottom: 12px;">\${stars}</div>
      <p style="font-style: italic; color: #555; line-height: 1.6; margin-bottom: 16px; font-family: '${fontFamily}', system-ui, sans-serif;">"\${message}"</p>
      <div style="font-weight: 600; color: ${primaryColor}; font-family: '${fontFamily}', system-ui, sans-serif;">- \${name}</div>
    </div>
  \`;
  
  modal.style.display = 'flex';
}

function closeTestimonialModal() {
  document.getElementById('testimonial-modal').style.display = 'none';
}

// Close modal when clicking outside
document.getElementById('testimonial-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeTestimonialModal();
  }
});
</script>`;
};
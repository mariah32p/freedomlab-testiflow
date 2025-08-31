import React, { useState, useEffect, useRef } from 'react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { User, LogOut, Plus, Settings, Eye, Copy, ExternalLink, Star, CheckCircle, X, Clock, Upload, Save, Palette, Download, FileText, Code, Share2, LayoutDashboard, FileInput } from 'lucide-react';

// --- DEMO CONFIGURATION ---
interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  activeTab: 'dashboard' | 'forms' | 'testimonials' | 'branding';
}

const demoSteps: DemoStep[] = [
  { id: 'start', title: 'Welcome to Your Dashboard', description: 'This is the command center for all your customer testimonials.', duration: 5000, activeTab: 'dashboard' },
  { id: 'create-form', title: 'Step 1: Create a Collection Form', description: 'First, we\'ll create a beautiful, branded form to send to customers.', duration: 8000, activeTab: 'forms' },
  { id: 'customer-submission', title: 'Step 2: Customer Submits Feedback', description: 'Your customer receives the form and shares their experience.', duration: 10000, activeTab: 'forms' },
  { id: 'review-testimonial', title: 'Step 3: Review New Testimonials', description: 'New submissions appear instantly, ready for your approval.', duration: 8000, activeTab: 'testimonials' },
  { id: 'customize-branding', title: 'Step 4: Customize Your Branding', description: 'Apply your brand colors and logo for a seamless customer experience.', duration: 8000, activeTab: 'branding' },
  { id: 'export-share', title: 'Step 5: Export & Share Your Testimonials', description: 'Easily export testimonials as data, or embed a widget directly on your website.', duration: 12000, activeTab: 'testimonials' },
];

// --- HELPER HOOK for realistic typing effect ---
const useTypingEffect = (text: string, duration: number) => {
  const [typedText, setTypedText] = useState('');
  useEffect(() => {
    setTypedText('');
    if (text) {
      const interval = duration / text.length;
      let i = 0;
      const timer = setInterval(() => {
        setTypedText(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) {
          clearInterval(timer);
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [text, duration]);
  return typedText;
};


export const Demo: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const currentStep = demoSteps[currentStepIndex];

  // --- All Demo State ---
  const [formTitle, setFormTitle] = useState('');
  const [formCreated, setFormCreated] = useState(false);
  const [customerRating, setCustomerRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const typedCustomerName = useTypingEffect(customerName, 2000);
  const [customerMessage, setCustomerMessage] = useState('');
  const typedCustomerMessage = useTypingEffect(customerMessage, 4000);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<any>(null);
  const [testimonialApproved, setTestimonialApproved] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#01004d');
  const [secondaryColor, setSecondaryColor] = useState('#01b79e');
  const [logoUrl, setLogoUrl] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<'csv' | 'json' | 'widget'>('csv');
  const [generatedContent, setGeneratedContent] = useState('');
  
  // Refs for auto-scrolling
  const testimonialListRef = useRef<HTMLDivElement>(null);
  const exportSectionRef = useRef<HTMLDivElement>(null);


  // --- MOCK DATA ---
  const mockExistingTestimonial = {
    id: 't-001', name: 'Mike Chen', company: 'StartupXYZ', message: 'Amazing product! The testimonial management features are exactly what we needed.', rating: 5, status: 'approved', submitted_at: '2025-08-28T14:20:00Z',
  };
   const mockNewTestimonial = {
    id: 't-002', name: 'Sarah Johnson', company: 'TechCorp', message: 'TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!', rating: 5, status: 'pending', submitted_at: new Date().toISOString(),
  };
  const mockExportData = [mockExistingTestimonial, {...mockNewTestimonial, status: 'approved'}];

  // --- LOGIC for auto-advancing steps and progress bar ---
  useEffect(() => {
    const advanceTimer = setTimeout(() => {
      setCurrentStepIndex((prev) => (prev + 1) % demoSteps.length);
    }, currentStep.duration);

    const progressTimer = setInterval(() => {
      setProgress(p => p + (100 / (currentStep.duration / 50)));
    }, 50);

    return () => {
      clearTimeout(advanceTimer);
      clearInterval(progressTimer);
      setProgress(0);
    };
  }, [currentStepIndex]);

  // --- CORE ANIMATION LOGIC for each step ---
  useEffect(() => {
    // Reset animations on step change
    if (currentStepIndex === 0) {
      setFormTitle('');
      setFormCreated(false);
      setCustomerRating(0);
      setCustomerName('');
      setCustomerMessage('');
      setFormSubmitted(false);
      setNewTestimonial(null);
      setTestimonialApproved(false);
      setPrimaryColor('#01004d');
      setSecondaryColor('#01b79e');
      setLogoUrl('');
      setShowExportModal(false);
      setGeneratedContent('');
    }

    switch (currentStep.id) {
      case 'create-form':
        setFormCreated(false);
        setTimeout(() => setFormTitle('Customer Experience Survey'), 1000);
        setTimeout(() => setFormCreated(true), 5000);
        break;
      
      case 'customer-submission':
        setTimeout(() => setCustomerRating(5), 1000);
        setTimeout(() => setCustomerName('Sarah Johnson'), 2000);
        setTimeout(() => setCustomerMessage('TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!'), 4500);
        setTimeout(() => setFormSubmitted(true), 9000);
        break;

      case 'review-testimonial':
        setTimeout(() => {
          setNewTestimonial(mockNewTestimonial);
          setTimeout(() => testimonialListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 200);
        }, 1000);
        setTimeout(() => setTestimonialApproved(true), 5000);
        break;

      case 'customize-branding':
        setTimeout(() => setLogoUrl('/2.png'), 1500); // Make sure you have a logo image at public/2.png
        setTimeout(() => setPrimaryColor('#2563eb'), 3500);
        setTimeout(() => setSecondaryColor('#10b981'), 5500);
        break;

      case 'export-share':
        setTimeout(() => {
          setShowExportModal(true);
          setTimeout(() => exportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
        }, 1000);
        setTimeout(() => setSelectedExportFormat('widget'), 4000);
        setTimeout(() => handleGenerateExport('widget'), 7000);
        break;
    }
  }, [currentStep.id, currentStepIndex]);
  
  // --- EXPORT CONTENT GENERATION ---
  const handleGenerateExport = (format: 'csv' | 'json' | 'widget') => {
      switch (format) {
          case 'widget':
              setGeneratedContent(`\n<div class="testiflow-widget">\n  <h3>What Our Customers Say</h3>\n  ${mockExportData.map(t => `\n  <div class="testimonial-card">\n    <p>"${t.message}"</p>\n    <span>- ${t.name}</span>\n  </div>`).join('')}\n</div>`);
              break;
          case 'csv':
              setGeneratedContent(`Name,Company,Rating,Message\n"Mike Chen","StartupXYZ",5,"Amazing product..."\n"Sarah Johnson","TechCorp",5,"TestiFlow has completely..."`);
              break;
          case 'json':
              setGeneratedContent(JSON.stringify(mockExportData, null, 2));
              break;
      }
  };


  return (
    <div className="h-screen w-full bg-gray-100 font-sans flex flex-col overflow-hidden">
        {/* --- FAKE HEADER --- */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
                <TestiFlowIcon className="h-8 w-8 text-primary-950" />
                <span className="text-xl font-bold text-gray-800">TestiFlow</span>
            </div>
            <div className="flex items-center space-x-4">
                 <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">sarah@techcorp.com</span>
                <LogOut className="h-5 w-5 text-gray-400 cursor-pointer" />
            </div>
        </header>

        <div className="flex flex-grow min-h-0">
            {/* --- FAKE SIDEBAR --- */}
            <nav className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0">
                <ul className="space-y-2">
                    {['dashboard', 'forms', 'testimonials', 'branding'].map(tab => (
                        <li key={tab}>
                            <a href="#" className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium capitalize transition-colors ${currentStep.activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                                {tab === 'dashboard' && <LayoutDashboard className="h-5 w-5" />}
                                {tab === 'forms' && <FileInput className="h-5 w-5" />}
                                {tab === 'testimonials' && <Star className="h-5 w-5" />}
                                {tab === 'branding' && <Palette className="h-5 w-5" />}
                                <span>{tab}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-grow p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* SECTION: Forms */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Forms</h2>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                           {currentStep.id === 'create-form' && !formCreated && (
                                <div className="flex items-center space-x-4 animate-pulse">
                                    <Plus className="h-6 w-6 text-blue-500"/>
                                    <input type="text" value={formTitle} readOnly placeholder="Naming your new form..." className="flex-grow p-2 border-b-2 border-blue-200 focus:outline-none"/>
                                </div>
                           )}
                           {formCreated && (
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md animate-fade-in">
                                    <p className="font-medium text-gray-700">📄 {formTitle || 'Customer Experience Survey'}</p>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500">1 Submission</span>
                                        <button className="text-sm font-medium text-blue-600 hover:underline">View</button>
                                    </div>
                                </div>
                           )}
                           {currentStep.id < 'create-form' && (
                                <p className="text-gray-500">You haven't created any forms yet.</p>
                           )}
                        </div>
                    </section>
                     {/* SECTION: Customer Submission Preview */}
                    {currentStep.id === 'customer-submission' && (
                         <section className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer View</h2>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-lg mx-auto">
                                <div className="p-8 text-center text-white" style={{ backgroundColor: primaryColor, transition: 'background-color 1s ease' }}>
                                    <h1 className="text-2xl font-bold mb-2">Share Your Experience</h1>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">How would you rate us?</label>
                                        <div className="flex space-x-1">
                                            {[1,2,3,4,5].map(star => <Star key={star} className={`h-8 w-8 transition-all duration-300 ${star <= customerRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                                        </div>
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input type="text" value={typedCustomerName} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial</label>
                                        <textarea rows={3} value={typedCustomerMessage} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"/>
                                    </div>
                                     <button className="w-full text-white py-3 rounded-lg font-semibold" style={{ backgroundColor: secondaryColor, transition: 'background-color 1s ease' }}>
                                        {formSubmitted ? <CheckCircle className="mx-auto animate-bounce" /> : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION: Testimonials */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
                            <div ref={exportSectionRef}>
                                <button
                                    onClick={() => setShowExportModal(true)} 
                                    className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-all duration-300 ${currentStep.id === 'export-share' ? 'scale-110 shadow-lg' : ''}`}
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>
                        <div ref={testimonialListRef} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                            {/* Existing Testimonial */}
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center"><User className="h-5 w-5 text-gray-500" /></div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800">{mockExistingTestimonial.name}</p>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">approved</span>
                                    </div>
                                    <p className="text-sm text-gray-600 italic">"{mockExistingTestimonial.message}"</p>
                                </div>
                            </div>
                            {/* New Testimonial (animated) */}
                            {newTestimonial && (
                                <div className="flex items-start space-x-4 bg-blue-50 p-4 rounded-md border border-blue-200 animate-fade-in">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center"><User className="h-5 w-5 text-gray-500" /></div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-gray-800">{newTestimonial.name}</p>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-500 ${testimonialApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {testimonialApproved ? 'approved' : 'pending'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">"{newTestimonial.message}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* SECTION: Branding Preview */}
                    {currentStep.id === 'customize-branding' && (
                        <section className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Branding Preview</h2>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-lg mx-auto">
                                <div className="p-8 text-center text-white flex flex-col justify-center items-center min-h-[150px]" style={{ backgroundColor: primaryColor, transition: 'background-color 1s ease' }}>
                                    {logoUrl && <img src={logoUrl} alt="logo" className="h-10 mb-4 animate-fade-in"/>}
                                    <h1 className="text-xl font-bold">Your Branded Form</h1>
                                </div>
                                <div className="p-6">
                                    <button className="w-full text-white py-3 rounded-lg font-semibold" style={{ backgroundColor: secondaryColor, transition: 'background-color 1s ease' }}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                    
                    {/* SECTION: Export Modal */}
                    {currentStep.id === 'export-share' && showExportModal && (
                        <section className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Export Options</h2>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                                 <div className="grid grid-cols-3 gap-3">
                                    <button onClick={() => { setSelectedExportFormat('csv'); handleGenerateExport('csv'); }} className={`p-3 border rounded-lg text-center transition-colors ${selectedExportFormat === 'csv' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                                        <FileText className="h-6 w-6 text-green-600 mx-auto mb-1" />
                                        <span className="font-medium text-sm">CSV</span>
                                    </button>
                                    <button onClick={() => { setSelectedExportFormat('json'); handleGenerateExport('json'); }} className={`p-3 border rounded-lg text-center transition-colors ${selectedExportFormat === 'json' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                                        <Code className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                                        <span className="font-medium text-sm">JSON</span>
                                    </button>
                                     <button onClick={() => { setSelectedExportFormat('widget'); handleGenerateExport('widget'); }} className={`p-3 border rounded-lg text-center transition-colors ${selectedExportFormat === 'widget' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                                        <Share2 className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                                        <span className="font-medium text-sm">Widget</span>
                                    </button>
                                 </div>
                                 {generatedContent && (
                                    <div className="bg-gray-800 text-white rounded-lg p-4 animate-fade-in">
                                        <pre className="text-xs whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                                            {generatedContent}
                                        </pre>
                                    </div>
                                 )}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
        
        {/* --- STORYTELLER / PROGRESS BAR --- */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0 relative">
            <div className="w-full bg-gray-200 rounded-full h-1 absolute top-0 left-0">
                <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}></div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold">{currentStepIndex + 1}</span>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">{currentStep.title}</h3>
                    <p className="text-sm text-gray-600">{currentStep.description}</p>
                </div>
            </div>
        </footer>
    </div>
  );
};
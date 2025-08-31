import React, a{ useState, useEffect, useRef, memo } from 'react';
import { TestiFlowIcon } from '../components/TestiFlowIcon';
import { User, LogOut, Plus, Settings, Eye, Copy, Star, CheckCircle, X, Download, FileText, Code, Share2, LayoutDashboard, FileInput, Palette, Filter, Tag, Cpu, Globe, Link as LinkIcon, Twitter, Sun, Moon } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


// --- DEMO CONFIGURATION & NARRATIVE ---
interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  activeTab: 'dashboard' | 'forms' | 'testimonials' | 'branding' | 'integrations';
}

const demoSteps: DemoStep[] = [
  { id: 'dashboard', title: 'Monitor Your Performance', description: 'Start with a high-level overview of submission rates and customer sentiment.', duration: 7000, activeTab: 'dashboard' },
  { id: 'create-form', title: 'Build a Custom Form', description: 'Create a new form and add a custom field to gather specific insights.', duration: 9000, activeTab: 'forms' },
  { id: 'customer-submission', title: 'Seamless Customer Experience', description: 'Your customer receives the link and submits their feedback through the branded form.', duration: 9000, activeTab: 'forms' },
  { id: 'triage-new', title: 'Triage New Submissions', description: 'A new testimonial from Sarah Johnson just arrived. Let\'s filter the list to see it.', duration: 8000, activeTab: 'testimonials' },
  { id: 'review-approve', title: 'Review Details & Approve', description: 'Use the detail panel to view all data, including AI-generated tags, before approving.', duration: 9000, activeTab: 'testimonials' },
  { id: 'branding', title: 'Customize Form & Widget Branding', description: 'Apply your brand identity, including fonts and colors, for a consistent look.', duration: 8000, activeTab: 'branding' },
  { id: 'integrate', title: 'Integrate & Share Everywhere', description: 'Embed a customizable widget, use the developer API, or generate social media assets.', duration: 12000, activeTab: 'integrations' },
];

// --- MOCK DATA ---
const initialTestimonials = [
    { id: 't-001', name: 'Mike Chen', company: 'StartupXYZ', message: 'Amazing product! The testimonial management features are exactly what we needed for our marketing campaigns.', rating: 5, status: 'approved', submitted_at: '2025-08-28T14:20:00Z', form_title: 'Product Feedback', ai_tags: ['Ease of Use', 'Marketing'], custom_answers: {} },
    { id: 't-003', name: 'Emily Davis', company: 'GrowthCo', message: 'The export features are incredible. We can now easily use testimonials across all our marketing channels.', rating: 4, status: 'approved', submitted_at: '2025-08-27T09:15:00Z', form_title: 'Customer Experience Survey', ai_tags: ['Integration', 'Marketing'], custom_answers: {} },
];
const newTestimonialPayload = {
    id: 't-002', name: 'Sarah Johnson', company: 'TechCorp', message: 'TestiFlow has completely transformed how we collect customer feedback. The automated workflows save us hours every week!', rating: 5, status: 'pending', submitted_at: new Date().toISOString(), form_title: 'Customer Experience Survey', ai_tags: ['Workflow', 'Automation', 'Efficiency'], custom_answers: { "What is your role?": "CTO" }
};
const chartData = [
    { name: 'May', submissions: 18 }, { name: 'Jun', submissions: 25 }, { name: 'Jul', submissions: 32 }, { name: 'Aug', submissions: 28 },
];

// --- HELPER HOOKS & COMPONENTS ---
const useTypingEffect = (text: string, duration: number, start: boolean) => {
    const [typedText, setTypedText] = useState('');
    useEffect(() => {
        setTypedText('');
        if (start && text) {
            const interval = duration / text.length;
            let i = 0;
            const timer = setInterval(() => {
                setTypedText(prev => prev + text.charAt(i)); i++;
                if (i >= text.length) clearInterval(timer);
            }, interval);
            return () => clearInterval(timer);
        }
    }, [text, duration, start]);
    return typedText;
};

const AnimatedCounter = memo(({ to, duration }: { to: number; duration: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const step = to / (duration / 16);
        const timer = setInterval(() => {
            setCount(prev => {
                if (prev + step >= to) { clearInterval(timer); return to; }
                return prev + step;
            });
        }, 16);
        return () => clearInterval(timer);
    }, [to, duration]);
    return <span>{Math.round(count).toLocaleString()}</span>;
});


// --- MAIN DEMO COMPONENT ---
export const Demo: React.FC = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const currentStep = demoSteps[currentStepIndex];

    // --- All Demo State ---
    const [showFormModal, setShowFormModal] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const typedFormTitle = useTypingEffect(formTitle, 1500, currentStep.id === 'create-form');
    const [formCreated, setFormCreated] = useState(false);
    const [showCustomerView, setShowCustomerView] = useState(false);
    const [customerMessage, setCustomerMessage] = useState('');
    const typedCustomerMessage = useTypingEffect(customerMessage, 3000, showCustomerView);
    
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTestimonialId, setSelectedTestimonialId] = useState<string | null>(initialTestimonials[0].id);
    
    const [primaryColor, setPrimaryColor] = useState('#01004d');
    const [font, setFont] = useState('Inter');
    
    const [widgetDarkMode, setWidgetDarkMode] = useState(false);
    const [activeIntegrationTab, setActiveIntegrationTab] = useState('widget');

    const listRef = useRef<HTMLDivElement>(null);

    // --- Auto-advance and Progress Bar Logic ---
    useEffect(() => {
        const advanceTimer = setTimeout(() => setCurrentStepIndex((prev) => (prev + 1) % demoSteps.length), currentStep.duration);
        const progressTimer = setInterval(() => setProgress(p => p + (100 / (currentStep.duration / 50))), 50);
        return () => { clearTimeout(advanceTimer); clearInterval(progressTimer); setProgress(0); };
    }, [currentStepIndex]);

    // --- Core Demo Animation Logic ---
    useEffect(() => {
        // Reset state at the beginning of the loop
        if (currentStepIndex === 0) {
            setShowFormModal(false); setFormTitle(''); setFormCreated(false); setShowCustomerView(false);
            setTestimonials(initialTestimonials); setStatusFilter('all'); setSelectedTestimonialId(initialTestimonials[0].id);
            setPrimaryColor('#01004d'); setFont('Inter'); setWidgetDarkMode(false); setActiveIntegrationTab('widget');
        }

        switch (currentStep.id) {
            case 'create-form':
                setTimeout(() => setShowFormModal(true), 500);
                setTimeout(() => setFormTitle('Customer Experience Survey'), 1000);
                setTimeout(() => { setShowFormModal(false); setFormCreated(true); }, 7000);
                break;
            case 'customer-submission':
                setTimeout(() => setShowCustomerView(true), 500);
                setTimeout(() => setCustomerMessage(newTestimonialPayload.message), 2000);
                setTimeout(() => setShowCustomerView(false), 8500);
                break;
            case 'triage-new':
                setSelectedTestimonialId(null);
                setTimeout(() => setTestimonials(prev => [newTestimonialPayload, ...prev]), 1000);
                setTimeout(() => setStatusFilter('pending'), 4000);
                setTimeout(() => {
                    setSelectedTestimonialId(newTestimonialPayload.id);
                    listRef.current?.querySelector(`[data-id="${newTestimonialPayload.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 6000);
                break;
            case 'review-approve':
                setTimeout(() => {
                    setTestimonials(prev => prev.map(t => t.id === newTestimonialPayload.id ? { ...t, status: 'approved' } : t));
                }, 4000);
                setTimeout(() => { setStatusFilter('all'); setSelectedTestimonialId(newTestimonialPayload.id); }, 7000);
                break;
            case 'branding':
                setTimeout(() => setPrimaryColor('#2563eb'), 2000);
                setTimeout(() => setFont('Roboto Slab'), 5000);
                break;
            case 'integrate':
                setSelectedTestimonialId(null);
                setTimeout(() => setActiveIntegrationTab('api'), 4000);
                setTimeout(() => setActiveIntegrationTab('social'), 8000);
                break;
        }
    }, [currentStep.id, currentStepIndex]);
    
    const selectedTestimonial = testimonials.find(t => t.id === selectedTestimonialId);
    const filteredTestimonials = statusFilter === 'all' ? testimonials : testimonials.filter(t => t.status === statusFilter);

    // --- RENDER ---
    return (
        <div className="h-screen w-full bg-gray-50 font-sans flex flex-col overflow-hidden text-gray-800">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <TestiFlowIcon className="h-8 w-8" style={{ color: primaryColor, transition: 'color 1s ease' }} />
                    <span className="text-xl font-bold">TestiFlow</span>
                </div>
                <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium">sarah@techcorp.com</span>
                    <LogOut className="h-5 w-5 text-gray-400 cursor-pointer" />
                </div>
            </header>

            <div className="flex flex-grow min-h-0">
                {/* Sidebar */}
                <nav className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0 flex flex-col">
                    <ul className="space-y-1">
                        {[
                            { id: 'dashboard', icon: LayoutDashboard }, { id: 'forms', icon: FileInput },
                            { id: 'testimonials', icon: Star }, { id: 'branding', icon: Palette },
                            { id: 'integrations', icon: Share2 }, { id: 'settings', icon: Settings },
                        ].map(tab => (
                            <li key={tab.id}>
                                <a href="#" className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-semibold capitalize transition-colors ${currentStep.activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.id}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-auto p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm font-semibold">Ready to Launch?</p>
                        <button className="mt-2 w-full text-white py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: primaryColor, transition: 'background-color 1s ease' }}>Upgrade Plan</button>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="flex-grow p-8 overflow-y-auto">
                    {currentStep.activeTab === 'dashboard' && (
                        <div className="animate-fade-in">
                            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm border"><h3 className="text-sm font-medium text-gray-500">Total Submissions</h3><p className="text-3xl font-bold mt-1"><AnimatedCounter to={874} duration={2000}/></p></div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border"><h3 className="text-sm font-medium text-gray-500">Avg. Rating</h3><p className="text-3xl font-bold mt-1">4.82 <Star className="inline-block h-6 w-6 text-yellow-400 -mt-1"/></p></div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border"><h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3><p className="text-3xl font-bold mt-1">12.7%</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border mt-6 h-80">
                                <h3 className="font-semibold mb-4">Submissions This Quarter</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}}/>
                                        <Bar dataKey="submissions" fill={primaryColor} radius={[4, 4, 0, 0]} style={{ transition: 'fill 1s ease' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                    {currentStep.activeTab === 'forms' && (
                         <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold">Forms</h1>
                                <button onClick={() => setShowFormModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"><Plus className="h-5 w-5" /><span>New Form</span></button>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                {formCreated ? <div className="text-gray-700 font-medium">📄 Customer Experience Survey</div> : <div className="text-gray-400">No forms created yet.</div>}
                            </div>
                        </div>
                    )}
                     {currentStep.activeTab === 'testimonials' && (
                        <div className="h-full flex space-x-6">
                           <div className="w-1/3 flex-shrink-0 h-full flex flex-col">
                               <div className="flex justify-between items-center mb-4">
                                   <h1 className="text-2xl font-bold">Inbox</h1>
                                   <Filter className="h-5 w-5 text-gray-400"/>
                               </div>
                               <div className="flex space-x-2 mb-4">
                                   {['all', 'pending', 'approved'].map(s => (
                                       <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}>{s}</button>
                                   ))}
                               </div>
                               <div ref={listRef} className="flex-grow overflow-y-auto bg-white border rounded-lg p-2 space-y-2">
                                   {filteredTestimonials.map(t => (
                                       <div key={t.id} data-id={t.id} onClick={() => setSelectedTestimonialId(t.id)} className={`p-3 rounded-md cursor-pointer transition-colors ${selectedTestimonialId === t.id ? 'bg-blue-50' : 'hover:bg-gray-50'} ${t.id === newTestimonialPayload.id && currentStep.id === 'triage-new' ? 'animate-pulse' : ''}`}>
                                           <div className="flex justify-between items-center mb-1">
                                               <p className="font-semibold text-sm">{t.name}</p>
                                               <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize transition-colors ${t.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{t.status}</span>
                                           </div>
                                           <p className="text-xs text-gray-500 truncate">"{t.message}"</p>
                                       </div>
                                   ))}
                               </div>
                           </div>
                           <div className={`w-2/3 h-full bg-white border rounded-lg shadow-sm transition-transform duration-500 ease-in-out ${selectedTestimonial ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                               {selectedTestimonial && (
                                   <div className="p-6 h-full flex flex-col">
                                       <div className="flex justify-between items-start mb-4">
                                           <div>
                                               <h2 className="text-xl font-bold">{selectedTestimonial.name}</h2>
                                               <p className="text-sm text-gray-500">{selectedTestimonial.company}</p>
                                           </div>
                                           {selectedTestimonial.status === 'pending' && <button onClick={() => setTestimonials(prev => prev.map(t => t.id === selectedTestimonialId ? { ...t, status: 'approved' } : t))} className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"><CheckCircle className="h-5 w-5"/><span>Approve</span></button>}
                                       </div>
                                       <div className="flex space-x-1 mb-4">{[...Array(selectedTestimonial.rating)].map((_,i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current"/>)}</div>
                                       <p className="text-base italic bg-gray-50 p-4 rounded-md mb-6 flex-grow">"{selectedTestimonial.message}"</p>
                                       <div className="border-t pt-4">
                                           <h4 className="text-sm font-semibold mb-2 flex items-center"><Cpu className="h-4 w-4 mr-2"/>AI-Generated Tags</h4>
                                           <div className="flex flex-wrap gap-2">{selectedTestimonial.ai_tags.map(tag => <span key={tag} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>)}</div>
                                       </div>
                                   </div>
                               )}
                           </div>
                        </div>
                    )}
                    {currentStep.activeTab === 'branding' && (
                        <div className="animate-fade-in">
                            <h1 className="text-3xl font-bold mb-6">Branding</h1>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div><label className="font-semibold">Primary Color</label><div className="w-12 h-10 mt-2 rounded" style={{backgroundColor: primaryColor, transition:'background-color 1s ease'}}></div></div>
                                    <div><label className="font-semibold">Font Family</label><p className="text-2xl mt-2" style={{fontFamily: font, transition: 'font-family 1s ease'}}>{font}</p></div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Live Preview</h3>
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                                        <div className="p-8 text-center text-white" style={{ backgroundColor: primaryColor, transition: 'background-color 1s ease' }}><h1 className="text-xl font-bold" style={{fontFamily: font, transition: 'font-family 1s ease'}}>Share Your Experience</h1></div>
                                        <div className="p-6"><button className="w-full text-white py-2 rounded-lg" style={{ backgroundColor: primaryColor, transition: 'background-color 1s ease', fontFamily: font, transitionProperty: 'background-color, font-family' }}>Submit</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {currentStep.activeTab === 'integrations' && (
                        <div className="animate-fade-in">
                            <h1 className="text-3xl font-bold mb-6">Integrate & Share</h1>
                            <div className="flex space-x-2 border-b mb-6">
                                {['widget', 'api', 'social'].map(t => <button key={t} onClick={() => setActiveIntegrationTab(t)} className={`px-4 py-2 text-sm font-semibold capitalize ${activeIntegrationTab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{t}</button>)}
                            </div>
                            {activeIntegrationTab === 'widget' && (<div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-4">Embeddable Widget</h3>
                                    <div className="flex items-center space-x-4 mb-4"><p>Appearance</p><button onClick={() => setWidgetDarkMode(!widgetDarkMode)} className={`px-3 py-1 rounded-full flex items-center space-x-2 ${widgetDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>{widgetDarkMode ? <Moon size={14}/> : <Sun size={14}/>}<span>{widgetDarkMode ? 'Dark' : 'Light'}</span></button></div>
                                    <div className="h-64 rounded-lg overflow-hidden"><SyntaxHighlighter language="html" style={vscDarkPlus} customStyle={{height: '100%', margin:0}}>{`<script src="https://cdn.testiflow.io/widget.js" data-id="YOUR-ID"></script>`}</SyntaxHighlighter></div>
                                </div>
                                <div className={`p-6 rounded-lg transition-colors ${widgetDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <h4 className={`font-bold mb-4 ${widgetDarkMode ? 'text-white' : 'text-black'}`}>What Our Customers Say</h4>
                                    <div className={`p-4 rounded-lg ${widgetDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <div className="flex space-x-1 mb-2">{[...Array(5)].map((_,i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current"/>)}</div>
                                        <p className={`italic text-sm mb-2 ${widgetDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>"{initialTestimonials[0].message}"</p>
                                        <p className={`font-semibold text-xs ${widgetDarkMode ? 'text-white' : 'text-black'}`}>- {initialTestimonials[0].name}</p>
                                    </div>
                                </div>
                            </div>)}
                            {activeIntegrationTab === 'api' && (<div>
                                <h3 className="font-semibold mb-4">Developer API</h3>
                                <p className="text-sm text-gray-600 mb-2">Fetch approved testimonials as JSON. Perfect for custom implementations.</p>
                                <div className="h-48 rounded-lg overflow-hidden"><SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{height: '100%', margin:0}}>{`curl -X GET "https://api.testiflow.io/v1/testimonials" \\\n-H "Authorization: Bearer YOUR_API_KEY"`}</SyntaxHighlighter></div>
                            </div>)}
                            {activeIntegrationTab === 'social' && (<div>
                                <h3 className="font-semibold mb-4">Social Media Card</h3>
                                <div className="w-full max-w-md bg-white border rounded-xl p-4 shadow-lg">
                                    <div className="flex items-center space-x-3 mb-3"><Twitter className="h-6 w-6 text-blue-400 fill-current"/><span className="font-bold">TechCorp</span><span className="text-gray-500">@techcorp</span></div>
                                    <p className="mb-4">We love hearing from our amazing customers! Big thanks to Sarah Johnson for the kind words. 🙌</p>
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex space-x-1 mb-2">{[...Array(5)].map((_,i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current"/>)}</div>
                                        <p className="italic text-sm mb-2">"{newTestimonialPayload.message}"</p>
                                        <p className="font-semibold text-xs">- {newTestimonialPayload.name}, TechCorp</p>
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    )}

                </main>
            </div>
            
            {/* Storyteller / Progress Bar */}
            <footer className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0 relative">
                <div className="w-full bg-gray-200 h-1 absolute top-0 left-0"><div className="bg-blue-600 h-1" style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}></div></div>
                <div className="flex items-center space-x-4">
                    <div className="font-bold text-gray-800">{currentStep.title}</div>
                    <p className="text-sm text-gray-600 flex-grow">{currentStep.description}</p>
                    <span className="text-lg font-bold text-blue-600">{currentStepIndex + 1}<span className="text-gray-300 font-normal">/{demoSteps.length}</span></span>
                </div>
            </footer>
            
             {/* Form Modal & Customer View Overlay */}
            {showFormModal && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in"><div className="bg-white p-8 rounded-lg shadow-2xl space-y-4"><h2 className="text-xl font-bold">Create New Form</h2><input type="text" value={typedFormTitle} readOnly className="p-2 border rounded-md w-96"/></div></div>}
            {showCustomerView && <div className="absolute inset-0 bg-white p-8 animate-fade-in flex items-center justify-center"><div className="max-w-xl w-full space-y-4 shadow-2xl p-8 rounded-lg border"><h2 className="text-2xl font-bold text-center">Share Your Experience</h2><textarea rows={4} value={typedCustomerMessage} readOnly className="p-2 border rounded-md w-full bg-gray-50"/></div></div>}
        </div>
    );
};
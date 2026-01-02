import React, { useState } from 'react';
import { CONTACT_INFO } from '../constants.tsx';

const ContactForm: React.FC = () => {
    const [status, setStatus] = useState<null | 'success' | 'error'>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('success');
        setTimeout(() => setStatus(null), 5000);
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-black mb-2 text-slate-800">Get in Touch</h2>
            <p className="text-slate-500 mb-8">Have a question or feedback? We'd love to hear from you.</p>

            {status === 'success' ? (
                <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl border border-emerald-100 mb-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        ✓
                    </div>
                    <p className="font-medium">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                        <input 
                            required 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input 
                            required 
                            type="email" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                    <textarea 
                        required 
                        rows={5}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="Tell us what's on your mind..."
                    ></textarea>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                    Send Message
                </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-8 text-sm">
                <div>
                    <h4 className="font-bold text-slate-800 mb-1">Owner</h4>
                    <p className="text-slate-500">{CONTACT_INFO.name}</p>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 mb-1">Email</h4>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-blue-600 hover:underline">{CONTACT_INFO.email}</a>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
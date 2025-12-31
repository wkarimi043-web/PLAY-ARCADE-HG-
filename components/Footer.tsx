
import React from 'react';
import { CONTACT_INFO } from '../constants';

interface FooterProps {
    onNavigate: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-auto">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                P
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">PLAY ARCADE HQ</span>
                        </div>
                        <p className="max-w-md text-sm leading-relaxed">
                            Play Arcade HQ is your #1 source for free online games and unblocked arcade classics. We specialize in high-performance browser games that require no download. Enjoy safe, fun, and fast gaming on any device.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-left">
                            <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Free Games Home</button></li>
                            <li><button onClick={() => onNavigate('games')} className="hover:text-white transition-colors">Arcade Collection</button></li>
                            <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Our Hub</button></li>
                            <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Support</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Legal & Privacy</h4>
                        <ul className="space-y-2 text-sm text-left">
                            <li><button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
                            <li><button onClick={() => onNavigate('cookies')} className="hover:text-white transition-colors">Cookie Policy</button></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>© {new Date().getFullYear()} Play Arcade HQ. All Rights Reserved.</p>
                    <p>Powered by Wilson Karimi</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

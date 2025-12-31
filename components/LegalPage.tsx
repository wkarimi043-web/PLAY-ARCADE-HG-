
import React from 'react';

interface LegalPageProps {
    type: 'privacy' | 'terms' | 'cookies';
    onBack: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
    const renderContent = () => {
        switch (type) {
            case 'privacy':
                return (
                    <>
                        <h1 className="text-3xl font-black mb-6">Privacy Policy</h1>
                        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
                            <p>Play Arcade HQ does not require users to create an account to play our games. We may collect non-personal information such as browser type, device information, and high scores stored locally on your device (Local Storage).</p>
                        </section>
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-3">2. Children's Privacy</h2>
                            <p>Our arcade is family-friendly. We do not knowingly collect personal information from children under the age of 13. All gaming content at Play Arcade HQ is curated to be safe for all ages.</p>
                        </section>
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-3">3. Third-Party Services</h2>
                            <p>We may use third-party advertising partners (like Google AdSense) who may use cookies to serve ads based on a user's prior visits to Play Arcade HQ or other websites.</p>
                        </section>
                    </>
                );
            case 'terms':
                return (
                    <>
                        <h1 className="text-3xl font-black mb-6">Terms of Service</h1>
                        <p className="mb-4">Effective Date: {new Date().toLocaleDateString()}</p>
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing Play Arcade HQ, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our website.</p>
                        </section>
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-3">2. Use License</h2>
                            <p>Permission is granted to temporarily play the games on Play Arcade HQ for personal, non-commercial transitory viewing only.</p>
                        </section>
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-3">3. Disclaimer</h2>
                            <p>The games on Play Arcade HQ are provided 'as is'. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability.</p>
                        </section>
                    </>
                );
            case 'cookies':
                return (
                    <>
                        <h1 className="text-3xl font-black mb-6">Cookie Policy</h1>
                        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-3">1. What are Cookies?</h2>
                            <p>Cookies are small text files stored on your device that help Play Arcade HQ improve your experience. We use them primarily to save game progress, settings, and high scores.</p>
                        </section>
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-3">2. How We Use Cookies</h2>
                            <p>We use essential cookies to ensure the basic functionality of our games. We also use analytics and advertising cookies provided by third parties to understand how users interact with our hub.</p>
                        </section>
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-3">3. Managing Cookies</h2>
                            <p>You can choose to disable cookies through your browser options. However, please note that some game features at Play Arcade HQ may no longer function correctly.</p>
                        </section>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <button 
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-blue-600 font-bold hover:underline"
            >
                ← Back to Arcade Home
            </button>
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 text-slate-700 leading-relaxed">
                {renderContent()}
                <div className="mt-12 pt-8 border-t border-slate-100 text-sm text-slate-500">
                    If you have any questions regarding these documents, please contact the Play Arcade HQ support team.
                </div>
            </div>
        </div>
    );
};

export default LegalPage;

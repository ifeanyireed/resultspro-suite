export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose max-w-none text-gray-600 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p>At ResultsPRO, we collect information that you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you about updates, security alerts, and support messages.</p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at hello@resultspro.ng.</p>
      </div>
    </div>
  );
}

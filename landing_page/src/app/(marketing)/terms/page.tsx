export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose max-w-none text-gray-600 space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using ResultsPRO, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on ResultsPRO's website for personal, non-commercial transitory viewing only.</p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Contact Information</h2>
        <p>If you have any questions or concerns regarding these Terms, please contact us at hello@resultspro.ng.</p>
      </div>
    </div>
  );
}

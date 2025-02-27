export default function PrivacyPolicy() {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
        <p>Last updated: 27.02.2025</p>
  
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>We collect the following data:</p>
        <ul className="list-disc pl-6">
          <li>Pi Network Username (for authentication)</li>
          <li>Pi Payment Data (if transactions are made)</li>
          <li>Basic Profile Information (if granted by the user)</li>
        </ul>
  
        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <p>We use your data to authenticate users, process Pi transactions, and improve the app.</p>
  
        <h2 className="text-xl font-semibold">3. Data Protection</h2>
        <p>We do not store sensitive data. All authentication and transactions are handled by Pi Network.</p>
  
        <h2 className="text-xl font-semibold">4. Contact</h2>
        <p>If you have any questions, email us at <a href="stefan.gjorgjevski99@gmail.com" className="text-blue-500">snaptogetherm@gmail.com</a>.</p>
      </div>
    );
  }
  
import Header from '../components/Header';
import ReportsList from '../components/ReportsList';
import DonationsList from '../components/DonationsList';

export default function Home() {
  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crisis Response Network
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A decentralized platform for crisis reporting and humanitarian aid during national emergencies. 
            Submit reports, verify information, and contribute to relief efforts through secure blockchain technology.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-crisis-red mb-2">0</div>
            <div className="text-gray-600">Reports Submitted</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">0 ETH</div>
            <div className="text-gray-600">Total Donations</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-gray-600">Verified Reporters</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="w-12 h-12 bg-crisis-red rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Crisis Reporting</h3>
            <p className="text-gray-600">
              Submit verified crisis reports with images and location data stored securely on IPFS.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Donations</h3>
            <p className="text-gray-600">
              Make transparent donations in ETH with full blockchain traceability and accountability.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Verification System</h3>
            <p className="text-gray-600">
              Community-driven verification ensures accurate and reliable crisis information.
            </p>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Crisis Reports</h2>
          <ReportsList />
        </div>

        {/* Recent Donations Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h2>
          <DonationsList />
        </div>

        {/* Call to Action */}
        <div className="card bg-gradient-to-r from-crisis-red to-crisis-orange text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Help During Crisis</h2>
          <p className="text-lg mb-6">
            Your contribution can make a difference. Submit reports or make donations to support relief efforts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/reports" className="btn-primary bg-white text-crisis-red hover:bg-gray-100">
              Submit Report
            </a>
            <a href="/donate" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-crisis-red">
              Make Donation
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 
import Header from '../../components/Header';
import ReportForm from '../../components/ReportForm';

export default function ReportsPage() {
  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Submit Crisis Report
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Help coordinate relief efforts by submitting verified crisis reports. 
            Include images and detailed information to assist emergency responders.
          </p>
        </div>

        <ReportForm />
      </main>
    </div>
  );
} 
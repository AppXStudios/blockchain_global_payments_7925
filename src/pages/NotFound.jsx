import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * ▶ 5.3 — FRONTEND QA: Fixed NotFound page with proper navigation
 * Ensuring all href="#" are replaced with real navigation
 */

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <div className="text-2xl font-semibold text-gray-700 mb-2">
            Page Not Found
          </div>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history?.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              to="/dashboard"
              className="px-3 py-1 text-sm bg-white text-blue-600 rounded-full border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/payments"
              className="px-3 py-1 text-sm bg-white text-blue-600 rounded-full border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
            >
              Payments
            </Link>
            <Link
              to="/settings"
              className="px-3 py-1 text-sm bg-white text-blue-600 rounded-full border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
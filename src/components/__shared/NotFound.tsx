import { Link } from 'react-router';
import avengersLogo from '../../assets/avengers-logo.png';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-600 to-blue-700 p-4">
      <div className="text-center">
        <img 
          src={avengersLogo} 
          alt="Avengers Logo" 
          className="h-24 w-auto mx-auto mb-8 drop-shadow-lg"
        />
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">
          Page Not Found
        </h2>
        <div className="max-w-md mx-auto mb-8">
          <p className="text-white/90 text-lg mb-2">
            Looks like this page has been snapped out of existence.
          </p>
          <p className="text-white/80">
            Even with all our advanced technology and superhuman abilities, 
            we couldn't locate the page you're looking for.
          </p>
        </div>
        <div className="space-x-4">
          <Link 
            to="/"
            className="btn btn-primary"
          >
            Return Home
          </Link>
          <Link 
            to="/avengers"
            className="btn btn-ghost text-white hover:bg-white/10"
          >
            Contact Avengers
          </Link>
        </div>
      </div>

      {/* Fun Easter Egg */}
      <div className="mt-12 text-center text-white/60 text-sm">
        <p>
          "I know it feels like all hope is lost... Trust me, I know. But together, 
          we can find our way back."
        </p>
        <p className="mt-1 font-medium">- Captain America</p>
      </div>
    </div>
  );
};

export default NotFound;

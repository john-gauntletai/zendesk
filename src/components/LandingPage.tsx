import { Link } from 'react-router';
import { 
  RocketLaunchIcon, 
  SparklesIcon, 
  BoltIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="container px-4 py-6 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CommandLineIcon className="w-6 h-6 text-gray-400" />
            <span className="text-lg font-medium">
              Superhero
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/features" className="text-sm text-gray-400 hover:text-white">
              Features
            </Link>
            <Link to="/method" className="text-sm text-gray-400 hover:text-white">
              Method
            </Link>
            <Link to="/customers" className="text-sm text-gray-400 hover:text-white">
              Customers
            </Link>
            <Link to="/changelog" className="text-sm text-gray-400 hover:text-white">
              Changelog
            </Link>
            <Link to="/pricing" className="text-sm text-gray-400 hover:text-white">
              Pricing
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full border border-gray-800 hover:border-gray-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container px-4 mx-auto mt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-medium tracking-tight mb-8">
            Become your customer's
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Superhero
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl">
            Meet the system for modern customer service teams.
            Streamline communications, automate responses, and build better relationships.
          </p>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-6 py-3 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-100"
            >
              Sign In
            </Link>
            <Link 
              to="/features" 
              className="px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-full border border-gray-800 hover:border-gray-700"
            >
              View features →
            </Link>
          </div>
        </div>
      </div>

      {/* App Preview */}
      <div className="mt-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <div className="container px-4 mx-auto">
          <div className="relative rounded-xl overflow-hidden border border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-30" />
            <div className="aspect-video bg-gray-900 p-8">
              {/* App screenshot would go here */}
              <div className="h-full rounded-lg border border-gray-800 bg-black/50">
                <div className="p-4 border-b border-gray-800">
                  <div className="h-4 w-48 bg-gray-800 rounded" />
                </div>
                <div className="grid grid-cols-4 gap-4 p-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-800 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container px-4 mx-auto mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900 to-black"
            >
              <feature.icon className="w-8 h-8 mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="container px-4 mx-auto mt-32 py-8 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          Built with precision for modern teams
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: SparklesIcon,
    title: "AI-Powered Assistance",
    description: "Intelligent automation that learns and adapts to your team's workflow."
  },
  {
    icon: BoltIcon,
    title: "Real-Time Collaboration",
    description: "Work together seamlessly with integrated tools and instant updates."
  },
  {
    icon: RocketLaunchIcon,
    title: "Powerful Analytics",
    description: "Data-driven insights to optimize your customer relationships."
  }
];

export default LandingPage;

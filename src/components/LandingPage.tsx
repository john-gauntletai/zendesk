import { Link } from 'react-router';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="min-h-screen hero">
        <div className="text-center hero-content">
          <div className="max-w-3xl">
            <h1 className="inline-block mb-8 text-5xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
              Peaceful CRM, Powered by AI
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Experience a new generation of customer relationship management.
              Streamlined, intelligent, and designed for peace of mind.
            </p>

            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
              <div className="transition-all duration-300 shadow-xl card bg-base-100 hover:shadow-2xl">
                <div className="card-body">
                  <h2 className="text-indigo-600 card-title">
                    AI-Powered Insights
                  </h2>
                  <p>
                    Smart automation and intelligent predictions to help you
                    work smarter
                  </p>
                </div>
              </div>

              <div className="transition-all duration-300 shadow-xl card bg-base-100 hover:shadow-2xl">
                <div className="card-body">
                  <h2 className="text-indigo-600 card-title">
                    Intuitive Design
                  </h2>
                  <p>
                    Beautiful, calm interface that makes customer management a
                    breeze
                  </p>
                </div>
              </div>

              <div className="transition-all duration-300 shadow-xl card bg-base-100 hover:shadow-2xl">
                <div className="card-body">
                  <h2 className="text-indigo-600 card-title">
                    Seamless Integration
                  </h2>
                  <p>Works perfectly with your existing tools and workflows</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Link to="/login" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/demo" className="btn btn-ghost btn-lg">
                View Demo
              </Link>
            </div>

            <div className="mt-16">
              <div className="shadow stats">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-8 h-8 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="stat-title">Happy Customers</div>
                  <div className="stat-value text-primary">25.6K</div>
                  <div className="stat-desc">21% more than last month</div>
                </div>

                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-8 h-8 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <div className="stat-title">AI Interactions</div>
                  <div className="stat-value text-secondary">2.6M</div>
                  <div className="stat-desc">↗️ 14% more than last month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import { Link } from 'react-router';
import { useState } from 'react';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Animation and Quote */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary to-secondary lg:flex lg:flex-col lg:justify-center lg:items-center">
        {/* Animated shapes */}
        <div className="absolute inset-0">
          <div className="absolute w-64 h-64 rounded-full bg-white/10 animate-float top-1/4 left-1/4" />
          <div className="absolute w-48 h-48 rounded-full bg-white/10 animate-float-delayed top-1/2 right-1/4" />
          <div className="absolute w-32 h-32 rounded-full bg-white/10 animate-float-slow bottom-1/4 left-1/3" />
        </div>

        {/* Quote */}
        <div className="relative z-10 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            The CRM for 1 person unicorns
          </h2>
          <p className="text-lg text-white/80">
            Streamline your workflow, amplify your impact
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2 bg-base-100">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Your Logo
            </Link>
            <h2 className="mt-6 mb-2 text-2xl font-bold">
              {isSignIn ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-gray-500">
              {isSignIn
                ? "Let's get back to business"
                : 'Start your journey with us'}
            </p>
          </div>

          <form className="space-y-4">
            {!isSignIn && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 input input-bordered"
                  />
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 input input-bordered"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 input input-bordered"
                />
              </div>
            </div>

            <button className="w-full btn btn-primary">
              {isSignIn ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="ml-2 link link-primary"
              >
                {isSignIn ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

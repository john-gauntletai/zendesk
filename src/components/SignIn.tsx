import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  EnvelopeIcon,
  LockClosedIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import supabase from '../supabase';

const quotes = [
  {
    text: "The greatest power we have is the power to empower others.",
    author: "Director Nick Fury"
  },
  {
    text: "Every interaction is a chance to be someone's hero.",
    author: "Agent Maria Hill"
  },
  {
    text: "True strength lies in lifting others up.",
    author: "Dr. Bruce Banner"
  },
  {
    text: "The best technology is invisible, yet makes everyone feel extraordinary.",
    author: "Tony Stark"
  },
  {
    text: "Together, we can solve any challenge that comes our way.",
    author: "Steve Rogers"
  }
];

// Move quote selection outside component
const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

// Select one quote that will be used for the entire session
const staticQuote = getRandomQuote();

const SignIn = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignIn) {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        navigate('/inbox');
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
            data: {
              full_name: formData.full_name,
            }
          },
        });
        if (error) throw error;
        
        setIsVerificationSent(true);
        setVerificationEmail(formData.email);
        toast.success('Verification email sent');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const VerificationPanel = () => (
    <div className="text-center">
      <div className="mb-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <EnvelopeIcon className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-gray-500">
          We've sent a verification link to:
        </p>
        <p className="font-medium mt-1">{verificationEmail}</p>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Click the link in the email to verify your account. If you don't see the email, check your spam folder. You can close this tab now.
        </p>
      </div>
    </div>
  );

  if (isVerificationSent) {
    return (
      <div className="flex min-h-screen">
        {/* Left side - Quote and Gradient */}
        <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 lg:flex lg:flex-col lg:justify-center lg:items-center">
          {/* Static gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

          {/* Quote */}
          <div className="relative z-10 text-center px-8 max-w-lg">
            <h2 className="mb-4 text-3xl font-medium text-white/90 leading-relaxed">
              "{staticQuote.text}"
            </h2>
            <p className="text-white/70 text-sm font-medium">
              {staticQuote.author}
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-16 h-0.5 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right side - Verification Panel */}
        <div className="flex items-center justify-center w-full p-8 lg:w-1/2 bg-base-200">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                Your Logo
              </Link>
            </div>
            <VerificationPanel />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Quote and Gradient */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 lg:flex lg:flex-col lg:justify-center lg:items-center">
        {/* Static gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

        {/* Quote */}
        <div className="relative z-10 text-center px-8 max-w-lg">
          <h2 className="mb-4 text-3xl font-medium text-white/90 leading-relaxed">
            "{staticQuote.text}"
          </h2>
          <p className="text-white/70 text-sm font-medium">
            {staticQuote.author}
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-0.5 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2 bg-base-200">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="flex items-center justify-center gap-2 mb-6">
              <CommandLineIcon className="w-6 h-6 text-gray-400" />
              <span className="text-lg font-medium">
                Superhero
              </span>
            </Link>
            <h2 className="text-xl font-medium mb-2">
              {isSignIn ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-base-content/60">
              {isSignIn
                ? "Let's get back to business"
                : 'Start your journey with us'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isSignIn && (
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm">Full Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full input input-bordered input-sm h-9 text-sm"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm">Email</span>
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute w-4 h-4 text-base-content/40 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-9 input input-bordered input-sm h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm">Password</span>
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute w-4 h-4 text-base-content/40 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-9 input input-bordered input-sm h-9 text-sm"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full btn btn-primary btn-sm h-9 min-h-0"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                isSignIn ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-base-content/60">
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="ml-2 text-sm font-medium text-primary hover:text-primary/80"
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

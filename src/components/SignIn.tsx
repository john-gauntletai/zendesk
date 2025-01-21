import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import supabase from '../supabase';

const SignIn = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
        navigate('/');
        toast.success('Signed in successfully');
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${import.meta.env.VITE_SUPABASE_REDIRECT_URL}`,
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

        {/* Right side - Verification Panel */}
        <div className="flex items-center justify-center w-full p-8 lg:w-1/2 bg-base-100">
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 input input-bordered"
                  required
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 input input-bordered"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                isSignIn ? 'Sign In' : 'Create Account'
              )}
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

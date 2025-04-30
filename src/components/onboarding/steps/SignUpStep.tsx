
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Quote } from "lucide-react";

type SignUpStepProps = {
  onNext: () => void;
  updateUserData: (data: any) => void;
  userData: any;
};

const SignUpStep = ({ onNext, updateUserData, userData }: SignUpStepProps) => {
  const [email, setEmail] = useState(userData.email || "");
  const [password, setPassword] = useState(userData.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would make an API call to create the user
      // const response = await fetch('/api/merchants', { 
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      //   headers: { 'Content-Type': 'application/json' }
      // });

      // For now, we'll just update the user data and proceed
      updateUserData({
        email,
        password,
        merchantId: `merchant_${Math.random().toString(36).substring(2, 11)}`,
      });
      
      onNext();
    } catch (err) {
      console.error("Sign up error:", err);
      setError("An error occurred during sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Testimonial data
  const testimonials = [
    {
      quote: "Atlas helped us increase our revenue by 37% in just two months by optimizing our pricing strategy.",
      author: "Sarah J.",
      role: "CEO, Novapulse"
    },
    {
      quote: "The onboarding was so smooth. We went from zero to a fully functional monetization system in less than a day.",
      author: "Michael T.",
      role: "CTO, Wavelength"
    },
    {
      quote: "The level of customization Atlas offers has allowed us to create pricing that perfectly aligns with our business goals.",
      author: "Elena R.",
      role: "Product Manager, Skyline"
    }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[600px] -mx-6">
      {/* Left Column - Sign Up Form */}
      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Atlas</h1>
            <p className="text-gray-500 mt-2">Turn your app into a business</p>
          </div>

          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6">Create your account</h2>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                Log in
              </a>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Right Column - Testimonials */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary/10 to-blue-50 p-6 md:p-10 flex items-center">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Unlock your app's revenue potential</h2>
            <p className="text-xl mt-4 text-gray-700">
              Join thousands of successful businesses who've optimized their monetization strategy with Atlas.
            </p>
          </div>
          
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white bg-opacity-80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <div className="flex items-start mb-3">
                  <Quote className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 italic">{testimonial.quote}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpStep;

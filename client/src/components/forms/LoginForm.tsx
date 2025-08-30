import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext"; // Changed from useAuth to useAuthContext
import { usePWAInstall } from "@/hooks/usePWAInstall";

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export function LoginForm() {
  const quotes = [
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela",
    },
    {
      text: "The roots of education are bitter, but the fruit is sweet.",
      author: "Aristotle",
    },
    {
      text: "An investment in knowledge pays the best interest.",
      author: "Benjamin Franklin",
    },
    {
      text: "Education is not preparation for life; education is life itself.",
      author: "John Dewey",
    },
    {
      text: "The function of education is to teach one to think intensively and to think critically. Intelligence plus character - that is the goal of true education.",
      author: "Martin Luther King Jr.",
    },
    {
      text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
      author: "Malcolm X",
    },
    {
      text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
      author: "Mahatma Gandhi",
    },
    {
      text: "The whole purpose of education is to turn mirrors into windows.",
      author: "Sydney J. Harris",
    },
    {
      text: "Education's purpose is to replace an empty mind with an open one.",
      author: "Malcolm Forbes",
    },
    {
      text: "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
      author: "Aristotle",
    },
  ];

  const { isInstallable, installApp } = usePWAInstall();

  const [randomQuote, setRandomQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, []);

  const [credentials, setCredentials] = useState<LoginCredentials>({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { loginAsStaff, loginAsParent } = useAuthContext(); // Using the context hook
  const navigate = useNavigate();

  const isEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isPhoneNumber = (value: string): boolean => {
    const phoneRegex = /^[+]?[0-9\s\-]{10,}$/;
    return phoneRegex.test(value.replace(/\s/g, ""));
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { emailOrPhone, password } = credentials;

      if (!emailOrPhone || !password) {
        throw new Error("Please enter both email/phone and password");
      }

      if (isEmail(emailOrPhone)) {
        await loginAsStaff({
          email: emailOrPhone,
          password,
        });
      } else if (isPhoneNumber(emailOrPhone)) {
        await loginAsParent({
          phone: emailOrPhone,
          password,
        });
      } else {
        throw new Error("Please enter a valid email address or phone number");
      }

      const UserType = localStorage.getItem("userType"); // or read from context again
      if (UserType === "staff") {
        navigate("/admin");
      } else if (UserType === "parent") {
        navigate("/parent");
      } else {
        setError("Unknown user type");
      }
    } catch (err: unknown) {
      let errorMessage = "Login failed. Please check your credentials.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Branding Section - Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-[#2B0318] to-[#1a0210] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FECC00] rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#2B0318]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#FECC00]">DKTE Academy</h1>
              <p className="text-xs text-white/80">
                Learning Management System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Section - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2B0318] via-[#2B0318] to-[#1a0210] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FECC00]/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#FECC00] rounded-xl flex items-center justify-center mr-4">
                <GraduationCap className="w-7 h-7 text-[#2B0318]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#FECC00]">
                  DKTE Academy
                </h1>
                <p className="text-white/80 text-sm">
                  Learning Management System
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Transform Your Learning Journey
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Access world-class courses, connect with expert instructors, and
              advance your career with our comprehensive learning platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: BookOpen,
                title: "500+ Courses",
                desc: "Expert-led content",
              },
              { icon: Users, title: "50K+ Students", desc: "Active learners" },
              { icon: Award, title: "Certified", desc: "Industry recognized" },
              {
                icon: GraduationCap,
                title: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#FECC00]/20 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#FECC00]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#FECC00]">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-l-4 border-[#FECC00] pl-4">
            <p className="text-white/90 italic">"{randomQuote.text}"</p>
            <p className="text-[#FECC00] text-sm mt-2">
              - {randomQuote.author}
            </p>
          </div>
        </div>

        <div className="absolute top-20 right-20 w-32 h-32 bg-[#FECC00]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-[#FECC00]/10 rounded-full blur-xl"></div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-only quote (hidden on desktop) */}
          <div className="lg:hidden bg-[#FECC00]/10 p-4 rounded-lg border-l-4 border-[#FECC00]">
            <p className="text-sm italic text-gray-800">
              "Education is the most powerful weapon which you can use to change
              the world."
            </p>
            <p className="text-xs text-[#2B0318] font-medium mt-1">
              - Nelson Mandela
            </p>
          </div>

          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#2B0318]">
                Welcome Back
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Sign in to access your learning dashboard
              </p>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* email or phone number input  */}
                <div className="space-y-2">
                  <Label htmlFor="emailOrPhone" className="text-gray-700">
                    Email or Phone Number
                  </Label>
                  <Input
                    id="emailOrPhone"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={credentials.emailOrPhone}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="focus:ring-2 focus:ring-[#FECC00]/50 focus:border-[#FECC00]"
                  />
                  <p className="text-xs text-gray-500">
                    Staff: Use your email address • Parents: Use registered
                    phone number
                  </p>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="focus:ring-2 focus:ring-[#FECC00]/50 focus:border-[#FECC00]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#2B0318] hover:bg-[#3a0524] text-white transition-colors duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                {/* <a
                  href="#"
                  className="text-sm font-medium text-[#2B0318] hover:text-[#FECC00] transition-colors"
                >
                  Forgot password?
                </a> */}
                <p className="text-xs text-gray-500 mt-4">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-[#2B0318] hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#2B0318] hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
          {isInstallable && (
            <Button
              className="w-full bg-[#2B0318] hover:bg-[#3a0524] text-white transition-colors duration-300"
              onClick={installApp}
            >
              Download as App
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

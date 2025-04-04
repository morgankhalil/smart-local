import React from "react";
import Layout from "../components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { clearBrowserData } from "@/utils/clearBrowserData";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "signin";
  const from = location.state?.from || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  const createProfile = async (userId: string) => {
    try {
      console.log('Creating profile for user:', userId);
      
      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error("Error checking existing profile:", fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        console.log('Profile already exists:', existingProfile.id);
        return;
      }

      // Create new profile
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            credits: 100,
            is_verified: false
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }

      console.log('Profile created successfully:', data.id);
      return data;
    } catch (error) {
      console.error("Error in createProfile:", error);
      throw error;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?tab=signin`,
        },
      });

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        await createProfile(data.user.id);
        toast({
          title: "Success!",
          description: "Check your email for the confirmation link.",
        });
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "An error occurred",
        description: "Unable to sign up. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign in...');
      
      // First, check if we can connect to Supabase
      try {
        console.log('Testing Supabase connection...');
        const { data: { session: testSession }, error: testError } = await supabase.auth.getSession();
        if (testError) {
          console.error('Connection test failed:', testError);
          throw new Error(`Unable to connect to the authentication service: ${testError.message}`);
        }
        console.log('Connection test successful');
      } catch (healthError) {
        console.error('Connection test error:', healthError);
        toast({
          title: "Connection Error",
          description: "Unable to connect to the authentication service. Please check your internet connection and try again.",
          variant: "destructive",
        });
        return;
      }

      // Proceed with sign in
      console.log('Connection verified, attempting sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }

      if (!signInData?.user) {
        console.error('No user data received from sign in');
        throw new Error('No user data received');
      }

      console.log('Sign in successful, user:', signInData.user.id);

      // Get session to confirm authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to establish session');
      }

      console.log('Sign in successful, session established');
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      
      // Navigate to the originally requested page or dashboard
      setTimeout(() => {
        navigate(from);
      }, 100);

    } catch (error) {
      console.error("Error in sign in process:", error);
      toast({
        title: "Error signing in",
        description: error instanceof Error ? error.message : "Unable to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    clearBrowserData();
    toast({
      title: "Data Cleared",
      description: "Browser data has been cleared. Please try signing in again.",
    });
    window.location.reload();
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Don't render anything if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to SmartLocal</CardTitle>
            <CardDescription className="text-center">
              Sign in or create an account to start sharing resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input 
                      id="signin-email" 
                      type="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input 
                      id="signin-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be at least 8 characters
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Creating account...
                      </span>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearData}
              className="w-full"
              disabled={loading}
            >
              Clear Browser Data
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;

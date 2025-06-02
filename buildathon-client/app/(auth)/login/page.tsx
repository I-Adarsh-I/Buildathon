"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { CircleCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important for session cookies
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result);
      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }
      toast({
        title: "Login successful",
        description: `Welcome back, ${result.user?.name || "user"}!`,
      });
      // router.push("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true); // Indicate loading while checking session
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/auth/success`, {
          credentials: "include", // Essential for sending session cookie
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.user);
          toast({
            title: "Login successful",
            description: `Welcome back, ${data.user?.name || "user"}!`, // Use the imported icon
          });
          // Redirect to dashboard on successful login
          router.push("/dashboard");
        } else {
          // If not successful or no active session, clear user or handle failure
          setUser(null);
          // Only show toast if it's explicitly a failure from the backend,
          // not just no active session (which is normal if user just landed on login page)
          if (data.message && data.message !== 'No active session') {
             toast({
                title: "Authentication Failed",
                description: data.message,
                variant: "destructive",
             });
          }
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
        setUser(null);
        toast({
          title: "Network Error",
          description: "Could not connect to authentication service.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

  }, [router]); // Depend on router to ensure it's available

  // useEffect(() => {
  //   fetch("http://localhost:3000/api/v1/auth/success", {
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       if (data.success) {
  //         setUser(data.user);
  //       }
  //     });
  // }, []);

  function handleGoogleLogin() {
    console.log("Handeling redirection");
    setIsLoading(true);
    window.location.href = "http://localhost:3000/api/v1/auth/google";
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CircleCheck className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">InfluenceAI</CardTitle>
        <CardDescription className="text-center">
          Log in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="google">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Log in with your Google account
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleGoogleLogin()}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Continue with Google"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          <span>Don&apos;t have an account? </span>
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

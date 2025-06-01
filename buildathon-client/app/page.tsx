"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, CircleDashed, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Check authentication and redirect accordingly
  useEffect(() => {
    if (isAuthenticated()) {
      redirect("/dashboard");
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-8">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <CircleCheck className="h-5 w-5 text-primary" />
            <span>InfluenceAI</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Log in
            </Button>
            <Button onClick={() => router.push("/signup")}>Sign up</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-8">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tighter md:leading-none">
                Connect Brands with Creators Using{" "}
                <span className="text-primary">AI-Powered</span> Matching
              </h1>
              <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
                InfluenceAI helps brands find the perfect creators for their
                campaigns and empowers creators to monetize their audience.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" onClick={() => router.push("/login")}>
                  Start for free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/demo")}
                >
                  View demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Key Features
              </h2>
              <p className="mt-2 text-muted-foreground">
                Everything you need to run successful influencer marketing
                campaigns
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CircleCheck className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>AI-Powered Matching</CardTitle>
                  <CardDescription>
                    Our AI matches your brand with the perfect creators based on
                    your campaign goals
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CircleDashed className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Campaign Management</CardTitle>
                  <CardDescription>
                    Easily create, track and manage all your influencer
                    campaigns in one place
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CircleHelp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>
                    Measure campaign performance with detailed analytics and
                    reports
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to grow your brand with creators?
              </h2>
              <p className="max-w-[42rem] text-muted-foreground">
                Join thousands of brands and creators already using InfluenceAI
              </p>
              <Button size="lg" onClick={() => router.push("/signup")}>
                Get started
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-6 md:py-0 px-8">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <CircleCheck className="h-5 w-5 text-primary" />
                <span>InfluenceAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered influencer marketing platform connecting brands with
                creators
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t py-6 text-sm text-muted-foreground">
            <p>© 2025 InfluenceAI. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

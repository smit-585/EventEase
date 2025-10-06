import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Bell, Award, Shield, TrendingUp, CheckCircle } from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: Calendar,
      title: "Event Management",
      description: "Create, schedule, and manage academic, cultural, and technical events effortlessly",
    },
    {
      icon: Users,
      title: "Easy Registration",
      description: "Students can browse and register for events with real-time seat availability",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automated email alerts for approvals, registrations, and event reminders",
    },
    {
      icon: Award,
      title: "Digital Certificates",
      description: "Automatically generate and distribute participation certificates",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure authentication with different permissions for students, faculty, and admins",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reports",
      description: "Track participation metrics and generate insightful reports",
    },
  ];

  const benefits = [
    "Eliminate manual paperwork and delays",
    "Real-time seat tracking prevents overbooking",
    "Transparent approval workflow",
    "Improved student participation",
    "Centralized event calendar",
    "Mobile-friendly interface",
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EventEase
              </span>
            </div>
            <div className="flex gap-4">
              <Link to="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Streamline Your College Event Management
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            EventEase digitizes the entire event lifecycle - from creation and approval to registration and certificates.
            Save time, reduce paperwork, and boost engagement.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="shadow-hover">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Every User</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From students to administrators, EventEase provides tools tailored to each role
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card transition-smooth hover:shadow-hover">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose EventEase?</h2>
              <p className="text-muted-foreground mb-6">
                Traditional event management is time-consuming and error-prone. EventEase eliminates these challenges
                with automation and real-time updates.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Ready to Transform Your Event Management?</CardTitle>
                <CardDescription>
                  Join colleges already using EventEase to streamline their events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-muted-foreground">Events Managed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-muted-foreground">Registrations</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
                <Link to="/auth" className="block">
                  <Button className="w-full" size="lg">
                    Get Started Today
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 EventEase. Streamlining college events with innovation.</p>
        </div>
      </footer>
    </div>
  );
}
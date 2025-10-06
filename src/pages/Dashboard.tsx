import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile(data);
      loadEvents(data.role);
      if (data.role === "student") {
        loadRegistrations(userId);
      }
    }
    setLoading(false);
  };

  const loadEvents = async (role: string) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (data) {
      setEvents(data);
    }
  };

  const loadRegistrations = async (userId: string) => {
    const { data } = await supabase
      .from("registrations")
      .select("event_id")
      .eq("student_id", userId);

    if (data) {
      setRegistrations(data.map((r) => r.event_id));
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user || profile?.role !== "student") return;

    const { error } = await supabase
      .from("registrations")
      .insert({ event_id: eventId, student_id: user.id });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Registered successfully!",
      });
      loadEvents(profile.role);
      loadRegistrations(user.id);
    }
  };

  const handleUpdateStatus = async (eventId: string, status: "approved" | "rejected") => {
    if (profile?.role !== "admin") return;
    const { error } = await supabase
      .from("events")
      .update({ status })
      .eq("id", eventId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: `Event ${status}.` });
    // Refresh events list
    loadEvents(profile.role);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name}!
          </h1>
          <p className="text-muted-foreground">
            {profile?.role === "student" && "Discover and register for upcoming events"}
            {profile?.role === "faculty" && "Manage your events and view registrations"}
            {profile?.role === "admin" && "Review and approve event submissions"}
          </p>
        </div>

        {/* Action buttons */}
        {(profile?.role === "faculty" || profile?.role === "admin") && (
          <div className="mb-6">
            <Button onClick={() => navigate("/create-event")} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Event
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="space-y-3">
              <EventCard
                event={event}
                showStatus={profile?.role !== "student"}
                isRegistered={registrations.includes(event.id)}
                onRegister={
                  profile?.role === "student"
                    ? () => handleRegister(event.id)
                    : undefined
                }
              />
              {profile?.role === "admin" && event.status === "pending" && (
                <div className="flex gap-3">
                  <Button size="sm" onClick={() => handleUpdateStatus(event.id, "approved")}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(event.id, "rejected")}>
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found</p>
          </div>
        )}
      </main>
    </div>
  );
}
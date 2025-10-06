import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";

interface EventCardProps {
  event: any;
  onRegister?: () => void;
  showStatus?: boolean;
  isRegistered?: boolean;
}

export function EventCard({ event, onRegister, showStatus, isRegistered }: EventCardProps) {
  const categoryColors: Record<string, string> = {
    academic: "bg-primary/10 text-primary",
    cultural: "bg-accent/10 text-accent",
    technical: "bg-secondary/10 text-secondary",
    sports: "bg-success/10 text-success",
    workshop: "bg-warning/10 text-warning",
    seminar: "bg-primary/10 text-primary",
    other: "bg-muted text-muted-foreground",
  };

  const categoryColor = categoryColors[event.category] || categoryColors.other;

  return (
    <Card className="transition-smooth hover:shadow-hover overflow-hidden">
      {event.banner_image && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.banner_image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-semibold line-clamp-2">{event.title}</h3>
          {showStatus && <StatusBadge status={event.status} />}
        </div>
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
          {event.category}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">{event.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.event_date), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{event.start_time} - {event.end_time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {event.available_seats} / {event.max_seats} seats available
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {onRegister && (
          <Button
            onClick={onRegister}
            disabled={event.available_seats === 0 || isRegistered}
            className="w-full"
          >
            {isRegistered ? "Registered" : event.available_seats === 0 ? "Full" : "Register Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
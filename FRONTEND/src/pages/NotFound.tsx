import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl gradient-medical flex items-center justify-center mx-auto mb-8 shadow-medical">
          <Eye className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-6xl font-display font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Button asChild className="shadow-medical">
          <Link to="/"><Home className="w-4 h-4 mr-2" />Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

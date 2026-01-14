import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Activity, Brain, Shield, Sparkles } from "lucide-react";
import { predictRisk, type PatientData } from "@/lib/prediction-service";
import { useToast } from "@/hooks/use-toast";

const analysisPhrases = [
  "Initializing Deep Learning engine...",
  "Loading ANN model weights...",
  "Processing clinical data...",
  "Running neural network inference...",
  "Computing risk probability...",
  "Generating recommendations...",
  "Finalizing assessment...",
];

export default function Analyzing() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const storedData = sessionStorage.getItem("patientData");

    // 🔴 Safety check
    if (!storedData) {
      navigate("/assessment", { replace: true });
      return;
    }

    const patientData: PatientData = JSON.parse(storedData);

    // Phrase animation
    const phraseTimer = setInterval(() => {
      setCurrentPhrase((p) => (p + 1) % analysisPhrases.length);
    }, 1500);

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + 6));
    }, 300);

    const runPrediction = async () => {
      try {
        console.log("➡️ Sending data to backend:", patientData);

        const result = await predictRisk(patientData);

        console.log("✅ Prediction result received:", result);

        // Store result for Results page
        sessionStorage.setItem(
          "predictionResult",
          JSON.stringify(result)
        );

        // Complete progress animation
        setProgress(100);

        // Clear intervals before navigation
        clearInterval(phraseTimer);
        clearInterval(progressTimer);

        // Navigate AFTER everything succeeds
        setTimeout(() => {
          navigate("/results", { replace: true });
        }, 800);
      } catch (err: any) {
        console.error("❌ Prediction failed:", err);

        // Clear intervals on error
        clearInterval(phraseTimer);
        clearInterval(progressTimer);

        // Determine error message
        let errorMessage =
          err?.message ||
          "Backend did not respond correctly. Please try again.";

        // Check if it's a network error
        if (
          err?.message?.includes("fetch") ||
          err?.message?.includes("network") ||
          err?.message?.includes("Failed to fetch")
        ) {
          errorMessage =
            "Unable to connect to the prediction server. Please ensure the backend is running on http://localhost:8000";
        }

        toast({
          title: "Prediction Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });

        // Redirect only on actual failure
        setTimeout(() => {
          navigate("/assessment", { replace: true });
        }, 2000);
      }
    };

    runPrediction();

    return () => {
      clearInterval(phraseTimer);
      clearInterval(progressTimer);
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="text-center max-w-lg z-10 px-4">
        {/* Icon */}
        <Eye className="w-16 h-16 mx-auto mb-6 text-primary animate-pulse" />

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-4">
          Analyzing Your Data
        </h1>

        {/* Animated phrase */}
        <p className="mb-6 text-muted-foreground">
          {analysisPhrases[currentPhrase]}
        </p>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-medical transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {Math.round(progress)}% complete
        </p>

        {/* Icons */}
        <div className="flex justify-center gap-6 mt-10 text-muted-foreground">
          <Brain />
          <Activity />
          <Shield />
        </div>

        {/* Footer */}
        <p className="mt-10 text-xs flex items-center justify-center gap-2 text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          Powered by ANN Deep Learning
        </p>
      </div>
    </div>
  );
}

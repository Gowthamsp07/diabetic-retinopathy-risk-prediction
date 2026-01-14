import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Eye,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  History,
  LogOut,
  Info,
  TrendingUp,
  Activity,
  Heart,
  Shield,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import type { PredictionResult } from "@/lib/prediction-service";

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const navigationResult = location.state as PredictionResult | undefined;
  const [result, setResult] = useState<PredictionResult | null>(
    navigationResult ?? null,
  );

  useEffect(() => {
    if (navigationResult) {
      return;
    }

    try {
      const stored = sessionStorage.getItem("predictionResult");
      if (stored) {
        const parsed: PredictionResult = JSON.parse(stored);
        setResult(parsed);
        return;
      }
    } catch (error) {
      console.error("❌ Failed to read prediction result from storage:", error);
    }

    navigate("/assessment", { replace: true });
  }, [navigationResult, navigate]);

  if (!result) return null;

  const getRiskStyles = (level: PredictionResult["riskLevel"]) => {
    switch (level) {
      case "Low":
        return {
          text: "text-accent",
          bg: "bg-accent/10",
          border: "border-accent/30",
          icon: CheckCircle,
        };
      case "Moderate":
        return {
          text: "text-yellow-600",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          icon: AlertTriangle,
        };
      case "High":
        return {
          text: "text-destructive",
          bg: "bg-destructive/10",
          border: "border-destructive/30",
          icon: AlertTriangle,
        };
      default:
        return {
          text: "text-muted-foreground",
          bg: "bg-muted",
          border: "border-muted",
          icon: AlertTriangle,
        };
    }
  };

  const styles = getRiskStyles(result.riskLevel);
  const Icon = styles.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            <span className="font-bold">DR Risk Predict</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" /> Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">
                <History className="h-4 w-4 mr-2" /> History
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Success Animation */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span>Assessment completed successfully</span>
          </div>
        </div>

        <Card className={`border-2 ${styles.border} ${styles.bg} shadow-lg`}>
          <CardContent className="py-10 flex flex-col md:flex-row items-center gap-10">
            {/* Circular Progress */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-muted/30"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${Math.max(0, Math.min(440, (result.riskProbability / 100) * 440))} 440`}
                  strokeLinecap="round"
                  className={styles.text}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${styles.text}`}>
                  {typeof result.riskProbability === 'number' && !isNaN(result.riskProbability) 
                    ? result.riskProbability.toFixed(1) 
                    : "0.0"}%
                </span>
                <span className="text-sm text-muted-foreground">
                  Risk Probability
                </span>
              </div>
            </div>

            {/* Text Info */}
            <div className="flex-1 text-center md:text-left">
              <Badge
                variant="outline"
                className={`mb-4 ${styles.text} ${styles.bg} ${styles.border}`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {result.riskLevel} RISK
              </Badge>

              <h2 className="text-2xl font-bold mb-2">
                Diabetic Retinopathy Risk Assessment
              </h2>

              <p className="text-muted-foreground mb-4">
                {result.recommendations[0]}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Button variant="outline" asChild>
                  <Link to="/assessment">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    New Assessment
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/history">View History</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contributing Factors */}
        {result.contributingFactors.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Contributing Factors
              </CardTitle>
              <CardDescription>
                Key factors influencing your risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {result.contributingFactors.map((factor, idx) => {
                  const impactColors = {
                    high: "border-destructive/50 bg-destructive/5",
                    medium: "border-yellow-500/50 bg-yellow-500/5",
                    low: "border-accent/50 bg-accent/5",
                  };
                  const impactIcons = {
                    high: AlertTriangle,
                    medium: Activity,
                    low: Shield,
                  };
                  const Icon = impactIcons[factor.impact];

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${impactColors[factor.impact]}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`h-4 w-4 ${
                              factor.impact === "high"
                                ? "text-destructive"
                                : factor.impact === "medium"
                                  ? "text-yellow-600"
                                  : "text-accent"
                            }`}
                          />
                          <span className="font-semibold text-sm">
                            {factor.factor}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            factor.impact === "high"
                              ? "border-destructive text-destructive"
                              : factor.impact === "medium"
                                ? "border-yellow-600 text-yellow-600"
                                : "border-accent text-accent"
                          }
                        >
                          {factor.impact.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {factor.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Recommendations */}
        {result.recommendations.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Model Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
            <CardDescription>
              Technical details about the prediction model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Algorithm</span>
              <span className="font-medium">
                {result.modelInfo.algorithm}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="font-medium">
                {result.modelInfo.accuracy}%
              </span>
            </div>
            <Progress value={result.modelInfo.accuracy} className="h-1.5" />
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">ROC-AUC Score</span>
              <span className="font-medium">
                {result.modelInfo.rocAuc.toFixed(3)}
              </span>
            </div>
            <Progress
              value={result.modelInfo.rocAuc * 100}
              className="h-1.5"
            />
          </CardContent>
        </Card>

        {/* Per-Diagnosis Model Performance */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Model Performance by Diagnosis Class
            </CardTitle>
            <CardDescription>
              Detailed accuracy and ROC-AUC metrics for each risk classification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Low Risk Class (Class 0) */}
              <div className="p-4 rounded-lg border border-accent/30 bg-accent/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-lg">Low Risk (Class 0)</h3>
                  </div>
                  <Badge variant="outline" className="border-accent text-accent">
                    Low Risk
                  </Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Precision</p>
                    <p className="text-2xl font-bold text-accent">88.0%</p>
                    <Progress value={88.0} className="h-2 mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recall</p>
                    <p className="text-2xl font-bold text-accent">94.0%</p>
                    <Progress value={94.0} className="h-2 mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">F1-Score</p>
                    <p className="text-2xl font-bold text-accent">91.0%</p>
                    <Progress value={91.0} className="h-2 mt-2" />
                  </div>
                </div>
              </div>

              {/* High Risk Class (Class 1) */}
              <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-lg">High Risk (Class 1)</h3>
                  </div>
                  <Badge variant="outline" className="border-destructive text-destructive">
                    High Risk
                  </Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Precision</p>
                    <p className="text-2xl font-bold text-destructive">98.0%</p>
                    <Progress value={98.0} className="h-2 mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recall</p>
                    <p className="text-2xl font-bold text-destructive">95.0%</p>
                    <Progress value={95.0} className="h-2 mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">F1-Score</p>
                    <p className="text-2xl font-bold text-destructive">97.0%</p>
                    <Progress value={97.0} className="h-2 mt-2" />
                  </div>
                </div>
              </div>

              {/* Overall Metrics */}
              <div className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Overall Model Performance</h3>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
                    <p className="text-3xl font-bold text-primary">
                      {result.modelInfo.accuracy.toFixed(2)}%
                    </p>
                    <Progress 
                      value={result.modelInfo.accuracy} 
                      className="h-3 mt-3" 
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Overall classification accuracy across all test cases
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">ROC-AUC Score</p>
                    <p className="text-3xl font-bold text-primary">
                      {result.modelInfo.rocAuc.toFixed(3)}
                    </p>
                    <Progress 
                      value={result.modelInfo.rocAuc * 100} 
                      className="h-3 mt-3" 
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Area under the ROC curve (0.982 = excellent discrimination)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-6 border-amber-200 bg-amber-50/60">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-700">
                This prediction is for educational purposes only and does not
                replace professional medical advice. Consult a qualified
                healthcare provider.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

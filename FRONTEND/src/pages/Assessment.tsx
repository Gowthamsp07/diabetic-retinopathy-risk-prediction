import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  ArrowLeft,
  ArrowRight,
  User,
  Activity,
  Heart,
  Dumbbell,
  LogOut,
  History,
  AlertCircle,
  Info,
  Home,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PatientData } from "@/lib/prediction-service";

const sections = [
  { id: 'profile', title: 'Patient Profile', icon: User },
  { id: 'diabetes', title: 'Diabetes History', icon: Activity },
  { id: 'clinical', title: 'Clinical Measurements', icon: Heart },
  { id: 'lifestyle', title: 'Lifestyle Factors', icon: Dumbbell },
];

export default function Assessment() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<PatientData>({
    smoking: false,
    familyHistoryDR: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const progress = ((currentSection + 1) / sections.length) * 100;

  const updateField = (field: keyof PatientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateSection = (): boolean => {
    const e: Record<string, string> = {};

    if (currentSection === 0) {
      if (!formData.age) {
        e.age = "Age is required";
      } else if (formData.age < 1 || formData.age > 120) {
        e.age = "Age must be between 1 and 120";
      }
      if (!formData.gender) {
        e.gender = "Gender is required";
      }
    }

    if (currentSection === 1) {
      if (!formData.diabetesType) {
        e.diabetesType = "Diabetes type is required";
      }
      if (formData.yearsSinceDiagnosis === undefined) {
        e.yearsSinceDiagnosis = "Years since diagnosis is required";
      } else if (formData.yearsSinceDiagnosis < 0) {
        e.yearsSinceDiagnosis = "Cannot be negative";
      }
    }

    if (currentSection === 2) {
      if (formData.hba1c !== undefined) {
        if (formData.hba1c < 3 || formData.hba1c > 20) {
          e.hba1c = "HbA1c should be between 3% and 20%";
        }
      }
      if (formData.bmi !== undefined) {
        if (formData.bmi < 10 || formData.bmi > 60) {
          e.bmi = "BMI should be between 10 and 60";
        }
      }
    }

    if (currentSection === 3) {
      if (!formData.physicalActivityLevel) {
        e.physicalActivityLevel = "Physical activity level is required";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateSection()) {
      toast({
        title: 'Please complete required fields',
        description: 'Fill the form before continuing.',
        variant: 'destructive',
      });
      return;
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection(s => s + 1);
    } else {
      sessionStorage.setItem("patientData", JSON.stringify(formData));
      navigate("/analyzing");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="flex gap-2 items-center">
            <Eye />
            <span className="font-bold">DR Risk Predict</span>
          </Link>
          <div className="flex gap-2">
            <Link to="/"><Button variant="ghost"><Home /> Home</Button></Link>
            <Link to="/history"><Button variant="ghost"><History /> History</Button></Link>
            <Button variant="ghost" onClick={signOut}><LogOut /> Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Risk Assessment</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentSection + 1} of {sections.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Complete all required fields (*) to proceed
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {React.createElement(sections[currentSection].icon, {
                className: "h-6 w-6 text-primary",
              })}
              <div>
                <CardTitle>{sections[currentSection].title}</CardTitle>
                <CardDescription>
                  {currentSection === 0 &&
                    "Basic demographic information"}
                  {currentSection === 1 &&
                    "Diabetes history and duration"}
                  {currentSection === 2 &&
                    "Clinical measurements and vital signs"}
                  {currentSection === 3 &&
                    "Lifestyle and risk factors"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ===== SECTION 1: Patient Profile ===== */}
            {currentSection === 0 && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">
                      Age <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Enter age"
                      value={formData.age ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          updateField("age", undefined);
                        } else {
                          const numVal = parseInt(val, 10);
                          if (!isNaN(numVal)) {
                            updateField("age", numVal);
                          }
                        }
                      }}
                      className={errors.age ? "border-destructive" : ""}
                    />
                    {errors.age && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.age}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => updateField("gender", v)}
                    >
                      <SelectTrigger
                        id="gender"
                        className={errors.gender ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== SECTION 2: Diabetes History ===== */}
            {currentSection === 1 && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="diabetesType">
                      Diabetes Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.diabetesType}
                      onValueChange={(v) => updateField("diabetesType", v)}
                    >
                      <SelectTrigger
                        id="diabetesType"
                        className={
                          errors.diabetesType ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="type1">Type 1 Diabetes</SelectItem>
                        <SelectItem value="type2">Type 2 Diabetes</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.diabetesType && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.diabetesType}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsSinceDiagnosis">
                      Years Since Diagnosis{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="yearsSinceDiagnosis"
                      type="number"
                      min="0"
                      placeholder="e.g., 5"
                      value={formData.yearsSinceDiagnosis ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          updateField("yearsSinceDiagnosis", undefined);
                        } else {
                          const numVal = parseInt(val, 10);
                          if (!isNaN(numVal)) {
                            updateField("yearsSinceDiagnosis", numVal);
                          }
                        }
                      }}
                      className={
                        errors.yearsSinceDiagnosis ? "border-destructive" : ""
                      }
                    />
                    {errors.yearsSinceDiagnosis && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.yearsSinceDiagnosis}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== SECTION 3: Clinical Measurements ===== */}
            {currentSection === 2 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    These fields are optional but provide more accurate risk
                    assessment.
                  </AlertDescription>
                </Alert>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="hba1c">HbA1c (%)</Label>
                    <Input
                      id="hba1c"
                      type="number"
                      step="0.1"
                      min="3"
                      max="20"
                      placeholder="e.g., 7.2"
                      value={formData.hba1c ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          updateField("hba1c", undefined);
                        } else {
                          const numVal = parseFloat(val);
                          if (!isNaN(numVal)) {
                            updateField("hba1c", numVal);
                          }
                        }
                      }}
                      className={errors.hba1c ? "border-destructive" : ""}
                    />
                    {errors.hba1c && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.hba1c}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Normal: &lt;5.7%, Prediabetes: 5.7-6.4%, Diabetes: ≥6.5%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bmi">Body Mass Index (BMI)</Label>
                    <Input
                      id="bmi"
                      type="number"
                      step="0.1"
                      min="10"
                      max="60"
                      placeholder="e.g., 25.5"
                      value={formData.bmi ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          updateField("bmi", undefined);
                        } else {
                          const numVal = parseFloat(val);
                          if (!isNaN(numVal)) {
                            updateField("bmi", numVal);
                          }
                        }
                      }}
                      className={errors.bmi ? "border-destructive" : ""}
                    />
                    {errors.bmi && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.bmi}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Normal: 18.5-24.9, Overweight: 25-29.9, Obese: ≥30
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                    <Input
                      id="systolicBP"
                      type="number"
                      min="70"
                      max="200"
                      placeholder="e.g., 120"
                      value={formData.systolicBP ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          updateField("systolicBP", undefined);
                        } else {
                          const numVal = parseInt(val, 10);
                          if (!isNaN(numVal)) {
                            updateField("systolicBP", numVal);
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
                    <Input
                      id="diastolicBP"
                      type="number"
                      min="40"
                      max="130"
                      placeholder="e.g., 80"
                      value={formData.diastolicBP ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          updateField("diastolicBP", undefined);
                        } else {
                          const numVal = parseInt(val, 10);
                          if (!isNaN(numVal)) {
                            updateField("diastolicBP", numVal);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fastingBloodSugar">
                      Fasting Blood Sugar (mg/dL)
                    </Label>
                    <Input
                      id="fastingBloodSugar"
                      type="number"
                      min="50"
                      max="400"
                      placeholder="e.g., 100"
                      value={formData.fastingBloodSugar ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          updateField("fastingBloodSugar", undefined);
                        } else {
                          const numVal = parseInt(val, 10);
                          if (!isNaN(numVal)) {
                            updateField("fastingBloodSugar", numVal);
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postprandialBloodSugar">
                      Postprandial Blood Sugar (mg/dL)
                    </Label>
                    <Input
                      id="postprandialBloodSugar"
                      type="number"
                      min="50"
                      max="500"
                      placeholder="e.g., 140"
                      value={formData.postprandialBloodSugar ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          updateField("postprandialBloodSugar", undefined);
                        } else {
                          const numVal = parseInt(val, 10);
                          if (!isNaN(numVal)) {
                            updateField("postprandialBloodSugar", numVal);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ===== SECTION 4: Lifestyle Factors ===== */}
            {currentSection === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="physicalActivityLevel">
                    Physical Activity Level{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.physicalActivityLevel}
                    onValueChange={(v) =>
                      updateField("physicalActivityLevel", v)
                    }
                  >
                    <SelectTrigger
                      id="physicalActivityLevel"
                      className={
                        errors.physicalActivityLevel ? "border-destructive" : ""
                      }
                    >
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">
                        Sedentary (little to no exercise)
                      </SelectItem>
                      <SelectItem value="active">
                        Active (regular exercise)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.physicalActivityLevel && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.physicalActivityLevel}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Additional Risk Factors</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smoking"
                        checked={formData.smoking || false}
                        onCheckedChange={(checked) =>
                          updateField("smoking", checked === true)
                        }
                      />
                      <Label
                        htmlFor="smoking"
                        className="font-normal cursor-pointer"
                      >
                        Current smoker
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="familyHistory"
                        checked={formData.familyHistoryDR || false}
                        onCheckedChange={(checked) =>
                          updateField("familyHistoryDR", checked === true)
                        }
                      />
                      <Label
                        htmlFor="familyHistory"
                        className="font-normal cursor-pointer"
                      >
                        Family history of diabetic retinopathy
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button disabled={currentSection === 0} onClick={() => setCurrentSection(s => s - 1)}>
                <ArrowLeft /> Back
              </Button>
              <Button onClick={handleNext}>
                {currentSection === sections.length - 1 ? 'Analyze Risk' : 'Next'}
                <ArrowRight />
              </Button>
            </div>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}

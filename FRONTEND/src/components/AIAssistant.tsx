import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  X,
  Send,
  User,
  Sparkles,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant for Diabetic Retinopathy Risk Prediction. I can help you understand:\n\n• How to use the assessment form\n• What the results mean\n• Risk factors and prevention\n• General questions about diabetic retinopathy\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      // Scroll to bottom when messages change
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "nearest",
          inline: "nearest"
        });
      };
      // Use requestAnimationFrame and setTimeout to ensure DOM is updated
      requestAnimationFrame(() => {
        setTimeout(scrollToBottom, 50);
      });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in production, connect to actual AI API)
    setTimeout(() => {
      const response = generateAIResponse(userMessage.content);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Risk factors
    if (
      lowerInput.includes("risk factor") ||
      lowerInput.includes("what causes") ||
      lowerInput.includes("prevent")
    ) {
      return `Diabetic Retinopathy risk factors include:

🔴 **High Risk Factors:**
• Poor blood glucose control (high HbA1c)
• Long duration of diabetes (10+ years)
• High blood pressure
• High cholesterol
• Smoking

🟡 **Moderate Risk Factors:**
• Obesity (BMI > 30)
• Sedentary lifestyle
• Family history of diabetic retinopathy
• Type 1 diabetes

**Prevention Tips:**
• Maintain HbA1c below 7%
• Control blood pressure (<130/80 mmHg)
• Regular eye exams (annually or as recommended)
• Quit smoking
• Exercise regularly
• Healthy diet rich in vegetables and whole grains`;
    }

    // Understanding results
    if (
      lowerInput.includes("result") ||
      lowerInput.includes("what does") ||
      lowerInput.includes("mean")
    ) {
      return `Here's how to interpret your results:

📊 **Risk Levels:**
• **Low Risk (<30%)**: Continue regular eye exams and maintain good diabetes management
• **Moderate Risk (30-70%)**: Schedule comprehensive eye examination within 1 month
• **High Risk (>70%)**: Immediate consultation with an ophthalmologist recommended

💡 **Contributing Factors:**
The assessment shows which factors most impact your risk. Focus on improving high-impact factors first.

📋 **Recommendations:**
Follow the personalized recommendations provided. They're tailored to your specific risk profile.`;
    }

    // Assessment form help
    if (
      lowerInput.includes("form") ||
      lowerInput.includes("assessment") ||
      lowerInput.includes("how to fill") ||
      lowerInput.includes("what information")
    ) {
      return `Here's how to complete the assessment:

📝 **Step 1 - Patient Profile:**
• Age: Your current age
• Gender: Male or Female

📝 **Step 2 - Diabetes History:**
• Diabetes Type: Type 1 or Type 2
• Years Since Diagnosis: How long you've had diabetes

📝 **Step 3 - Clinical Measurements (Optional but recommended):**
• HbA1c: Your most recent HbA1c level (target: <7%)
• BMI: Body Mass Index (weight in kg / height in m²)
• Blood Pressure: Systolic and Diastolic readings
• Blood Sugar: Fasting and postprandial levels

📝 **Step 4 - Lifestyle Factors:**
• Physical Activity Level: Sedentary or Active
• Smoking Status: Check if you're a current smoker
• Family History: Check if family members have diabetic retinopathy

💡 **Tip:** More accurate data = more accurate predictions!`;
    }

    // General diabetes questions
    if (
      lowerInput.includes("diabetes") ||
      lowerInput.includes("what is") ||
      lowerInput.includes("explain")
    ) {
      return `**Diabetic Retinopathy** is a diabetes complication that affects the eyes. It's caused by damage to blood vessels in the retina.

**Key Facts:**
• Early stages often have no symptoms
• Can lead to vision loss if untreated
• Regular screening is crucial
• Early detection and treatment can prevent vision loss

**Symptoms (when present):**
• Blurred vision
• Floaters
• Dark spots in vision
• Difficulty seeing at night

**Treatment:**
• Laser treatment
• Injections
• Surgery (in advanced cases)
• Better diabetes control

Remember: This tool provides risk assessment, not diagnosis. Always consult healthcare professionals.`;
    }

    // Model/accuracy questions
    if (
      lowerInput.includes("accuracy") ||
      lowerInput.includes("model") ||
      lowerInput.includes("how accurate") ||
      lowerInput.includes("reliable")
    ) {
      return `Our prediction model uses:

🤖 **Technology:**
• Deep Learning Artificial Neural Network (ANN)
• Trained on hospital datasets
• 92% accuracy rate
• ROC-AUC score of 0.94

📊 **What this means:**
• The model is highly reliable for risk assessment
• Based on patterns from thousands of patient records
• Continuously validated against real-world data

⚠️ **Important:**
• This is a risk prediction tool, not a diagnostic tool
• Results should be discussed with healthcare providers
• Regular medical check-ups are still essential`;
    }

    // Default response
    return `I understand you're asking about "${userInput}". 

I can help with:
• Understanding your risk assessment results
• Explaining risk factors and prevention
• Guidance on filling out the assessment form
• General questions about diabetic retinopathy
• Information about the prediction model

Could you rephrase your question, or ask about one of these topics?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 transition-all hover:scale-110 md:bottom-6 md:right-6 sm:bottom-4 sm:right-4"
          size="icon"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[calc(100vw-2rem)] max-w-md h-[calc(100vh-8rem)] max-h-[600px] min-h-[400px] shadow-2xl z-[100] flex flex-col border-2 bg-card md:w-96 md:bottom-6 md:right-6 sm:bottom-4 sm:right-4 sm:w-[calc(100vw-2rem)]">
          <CardHeader className="pb-3 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Ask me anything about DR risk
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-lg px-4 py-3 max-w-[85%] shadow-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted border border-border/50 rounded-bl-sm"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">
                        {message.content}
                      </p>
                      <p className={cn(
                        "text-xs mt-2",
                        message.role === "user" ? "opacity-80" : "text-muted-foreground"
                      )}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start animate-in fade-in">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3 border border-border/50">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </ScrollArea>

            <div className="border-t bg-background/95 backdrop-blur-sm p-3 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>AI-powered assistance</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

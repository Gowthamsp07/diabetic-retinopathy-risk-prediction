import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Shield, Activity, Brain, ArrowRight, Heart, Users, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b border-border/50 glass-strong sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-medical flex items-center justify-center shadow-medical transition-transform group-hover:scale-105">
              <Eye className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              DR Risk<span className="text-primary">Predict</span>
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="shadow-medical gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-36">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Deep Learning ANN-Powered Analysis</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight animate-fade-in-up">
              Predict Diabetic Retinopathy Risk{' '}
              <span className="text-gradient">Before It's Too Late</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Our Deep Learning Artificial Neural Network analyzes your health data to predict your risk of developing diabetic retinopathy in the next 1-5 years. Take control of your eye health today.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/auth?mode=signup">
                <Button size="lg" className="h-14 px-8 text-base shadow-medical hover-glow gap-2">
                  Start Free Assessment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base">
                  Sign In to Continue
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>91.5% ANN Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Deep Learning Model</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Free to Use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Three simple steps to understand your risk and take preventive action
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Activity,
                title: 'Enter Your Data',
                description: 'Input your clinical measurements, diabetes history, and lifestyle factors through our secure, guided form.',
                step: '01',
                color: 'primary',
              },
              {
                icon: Brain,
                title: 'Deep Learning Analysis',
                description: 'Our trained Artificial Neural Network (ANN) analyzes your data to calculate a personalized risk score with 91.5% accuracy.',
                step: '02',
                color: 'accent',
              },
              {
                icon: Eye,
                title: 'Get Insights',
                description: 'Receive a detailed risk assessment with contributing factors and personalized preventive recommendations.',
                step: '03',
                color: 'primary',
              },
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="relative p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-medical transition-all duration-300 hover-lift group"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg gradient-medical flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {feature.step}
                </div>
                <div className={`w-14 h-14 rounded-xl ${feature.color === 'accent' ? 'bg-accent/10' : 'bg-primary/10'} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color === 'accent' ? 'text-accent' : 'text-primary'}`} />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '91.5%', label: 'ANN Accuracy', icon: CheckCircle2 },
              { value: '15K+', label: 'Training Samples', icon: Activity },
              { value: '1-5 yrs', label: 'Prediction Range', icon: Clock },
              { value: '0.942', label: 'ROC-AUC Score', icon: Brain },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Early Detection Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
                Why Early Detection Matters
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Diabetic retinopathy is a leading cause of blindness in adults. However, with early detection and proper management, vision loss can often be prevented.
              </p>
              
              <div className="space-y-5">
                {[
                  {
                    icon: Heart,
                    title: 'Preserve Your Vision',
                    description: 'Early intervention can prevent up to 95% of severe vision loss cases.',
                    color: 'accent',
                  },
                  {
                    icon: Users,
                    title: 'Personalized Care',
                    description: 'Get tailored recommendations based on your unique health profile.',
                    color: 'primary',
                  },
                  {
                    icon: Clock,
                    title: 'Proactive Approach',
                    description: 'Take action before symptoms appear with predictive risk assessment.',
                    color: 'accent',
                  },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div className={`w-12 h-12 rounded-xl ${benefit.color === 'accent' ? 'bg-accent/10' : 'bg-primary/10'} flex items-center justify-center flex-shrink-0`}>
                      <benefit.icon className={`w-6 h-6 ${benefit.color === 'accent' ? 'text-accent' : 'text-primary'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Decorative background */}
              <div className="absolute inset-0 gradient-medical rounded-3xl opacity-10 blur-2xl scale-110" />
              
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border p-1">
                <div className="w-full h-full rounded-3xl bg-card flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="relative inline-block mb-8">
                      <div className="absolute inset-0 gradient-medical rounded-full blur-xl opacity-30 animate-pulse-slow" />
                      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <Eye className="w-16 h-16 text-primary animate-float" />
                      </div>
                    </div>
                    <p className="text-2xl font-display font-bold text-foreground mb-2">
                      Protect Your Vision
                    </p>
                    <p className="text-muted-foreground mb-6">
                      Start your free risk assessment today
                    </p>
                    <Link to="/auth?mode=signup">
                      <Button className="shadow-medical">
                        Get Started Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Medical Disclaimer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This application provides risk estimation only and is intended for educational and informational purposes. It does not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for proper evaluation and management of diabetic retinopathy. If you experience vision changes, seek immediate medical attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-medical flex items-center justify-center">
                <Eye className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">DR RiskPredict</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Diabetic Retinopathy Risk Prediction. For educational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
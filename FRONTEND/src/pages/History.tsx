import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowLeft, Calendar, Activity, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface PredictionHistory {
  id: string;
  created_at: string;
  risk_probability: number;
  risk_level: string;
  age: number;
  diabetes_type: string;
  hba1c: number;
}

export default function History() {
  const { user, signOut } = useAuth();
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      const { data, error } = await supabase
        .from('predictions')
        .select('id, created_at, risk_probability, risk_level, age, diabetes_type, hba1c')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setPredictions(data || []);
      setLoading(false);
    }
    fetchHistory();
  }, [user]);

  const getRiskStyles = (level: string) => {
    const styles = {
      Low: { text: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', stroke: 'text-accent' },
      Moderate: { text: 'text-risk-moderate', bg: 'bg-risk-moderate/10', border: 'border-risk-moderate/20', stroke: 'text-risk-moderate' },
      High: { text: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20', stroke: 'text-destructive' },
    };
    return styles[level as keyof typeof styles] || styles.Low;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 glass-strong sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-medical flex items-center justify-center">
              <Eye className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">DR RiskPredict</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/assessment"><Plus className="h-4 w-4 mr-2" />New</Link></Button>
            <Button variant="ghost" size="sm" onClick={() => signOut()}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 -ml-2"><Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link></Button>
          <h1 className="text-3xl font-display font-bold">Prediction History</h1>
          <p className="text-muted-foreground mt-2">Track your risk assessments over time</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[1, 2, 3].map(i => <Card key={i}><CardContent className="pt-6"><div className="flex items-center gap-4"><Skeleton className="h-14 w-14 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/2" /></div></div></CardContent></Card>)}</div>
        ) : predictions.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Predictions Yet</h3>
              <p className="text-muted-foreground mb-6">Start your first assessment to see history here.</p>
              <Button asChild className="shadow-medical"><Link to="/assessment">Start Assessment</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {predictions.map((p, i) => {
              const styles = getRiskStyles(p.risk_level);
              return (
                <Card key={p.id} className="shadow-card hover:shadow-medical transition-shadow animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <CardContent className="py-5">
                    <div className="flex items-center gap-5">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5" fill="none" className="text-muted/30" />
                          <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray={`${(p.risk_probability / 100) * 150} 150`} strokeLinecap="round" className={styles.stroke} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold">{p.risk_probability}%</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="outline" className={`${styles.text} ${styles.bg} ${styles.border}`}>{p.risk_level} Risk</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(p.created_at), 'MMM d, yyyy')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Age: {p.age} • {p.diabetes_type} • HbA1c: {p.hba1c}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

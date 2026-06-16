import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mascot, ReactionType, ModeType } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [quizStep, setQuizStep] = useState<number>(0);
  const [reaction, setReaction] = useState<ReactionType>("running");
  const [mode, setMode] = useState<ModeType>("casual");
  const [speech, setSpeech] = useState<string>("");

  // Quiz state
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  // Entry sequence
  useEffect(() => {
    if (quizStep === 0) {
      const sequence = async () => {
        // Run in
        setReaction("running");
        await new Promise(r => setTimeout(r, 600));
        
        // Skid to stop
        setReaction("skidding");
        await new Promise(r => setTimeout(r, 600));
        
        // Look around, wave and say hi
        setReaction("wave");
        setSpeech("Merhaba 👋");
        await new Promise(r => setTimeout(r, 1500));
        
        // Start talking
        setReaction("idle");
        setSpeech("Size en uygun araç takip çözümünü birlikte bulalım.");
        await new Promise(r => setTimeout(r, 3000));
        
        // Move to quiz
        setSpeech("");
        setQuizStep(1);
      };
      sequence();
    }
  }, [quizStep]);

  const handleModeSelect = (selected: string, newMode: ModeType) => {
    setSelectedMode(selected);
    setMode(newMode);
    
    // Animate transform
    setReaction(newMode === "corporate" ? "thumbsUp" : "idle");
    setTimeout(() => {
      setReaction("idle");
      setQuizStep(2);
    }, 1200);
  };

  const handleVehicleSelect = (selected: string, react: ReactionType) => {
    setSelectedVehicles(selected);
    setReaction(react);
    setTimeout(() => {
      setReaction("idle");
      setQuizStep(3);
    }, 1500);
  };

  const handleGoalSelect = (selected: string) => {
    setSelectedGoal(selected);
    setReaction("thinking");
    setTimeout(() => {
      setReaction("celebrate");
      setQuizStep(4);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-12">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
        
        {/* Mascot Area */}
        <motion.div 
          layout
          className={`flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
            quizStep === 0 ? "w-full scale-125 md:scale-150 mt-12" : "w-full md:w-1/3"
          }`}
        >
          <Mascot mode={mode} reaction={reaction} speechText={speech} />
        </motion.div>

        {/* Quiz Area */}
        <AnimatePresence mode="wait">
          {quizStep > 0 && (
            <motion.div 
              key={`step-${quizStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full md:w-2/3 flex flex-col items-start justify-center max-w-lg"
            >
              
              {quizStep === 1 && (
                <div className="w-full space-y-6">
                  <div className="space-y-2">
                    <span className="text-primary font-bold tracking-wider text-sm uppercase">ADIM 1 / 3</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Hangi mod size uygun?</h2>
                    <p className="text-muted-foreground text-lg">ZTRAX size en iyi nasıl hizmet edebilir?</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card 
                      className={`p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all ${selectedMode === "Kurumsal" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => handleModeSelect("Kurumsal", "corporate")}
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>
                      </div>
                      <h3 className="font-bold text-xl mb-1">Kurumsal</h3>
                      <p className="text-muted-foreground text-sm">Şirket filom var</p>
                    </Card>
                    <Card 
                      className={`p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all ${selectedMode === "Bireysel" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => handleModeSelect("Bireysel", "casual")}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <h3 className="font-bold text-xl mb-1">Bireysel</h3>
                      <p className="text-muted-foreground text-sm">Kişisel aracım var</p>
                    </Card>
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="w-full space-y-6">
                  <div className="space-y-2">
                    <span className="text-primary font-bold tracking-wider text-sm uppercase">ADIM 2 / 3</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Kaç araç takip etmek istiyorsunuz?</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "1-10 araç", react: "thumbsUp" as ReactionType },
                      { label: "11-50 araç", react: "excited" as ReactionType },
                      { label: "50+ araç", react: "celebrate" as ReactionType }
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleVehicleSelect(opt.label, opt.react)}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 font-semibold text-lg hover:border-primary hover:bg-primary/5 ${selectedVehicles === opt.label ? "border-primary bg-primary/5 text-primary" : "border-border text-secondary"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 3 && (
                <div className="w-full space-y-6">
                  <div className="space-y-2">
                    <span className="text-primary font-bold tracking-wider text-sm uppercase">ADIM 3 / 3</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Ana hedefiniz ne?</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Güvenlik", "Yakıt tasarrufu", "Rota optimizasyonu", "Filo yönetimi"].map((goal) => (
                      <Card
                        key={goal}
                        onClick={() => handleGoalSelect(goal)}
                        className="p-5 cursor-pointer hover:border-primary hover:shadow-md transition-all flex items-center justify-between"
                      >
                        <span className="font-semibold text-secondary">{goal}</span>
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 4 && (
                <div className="w-full space-y-8 text-center md:text-left">
                  <div className="space-y-3">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-secondary">Size özel çözümünüz hazır!</h2>
                    <p className="text-xl text-muted-foreground">İhtiyaçlarınıza özel hazırladığımız paket ile tanışın.</p>
                  </div>
                  
                  <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white px-3 py-1 text-sm font-bold text-secondary rounded-full border border-border shadow-sm">{selectedMode}</span>
                        <span className="bg-white px-3 py-1 text-sm font-bold text-secondary rounded-full border border-border shadow-sm">{selectedVehicles}</span>
                        <span className="bg-primary/10 px-3 py-1 text-sm font-bold text-primary rounded-full">{selectedGoal} Odaklı</span>
                      </div>
                      
                      <div className="pt-2">
                        <h3 className="text-2xl font-bold text-secondary mb-2">ZTRAX Premium Paket</h3>
                        <p className="text-muted-foreground">Tüm donanım, montaj ve 1 yıllık yazılım aboneliği dahil.</p>
                      </div>

                      <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all rounded-xl">
                        Ücretsiz Deneyin
                      </Button>
                    </div>
                  </Card>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> Ücretsiz Kurulum</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    <span className="flex items-center gap-1.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> 7/24 Destek</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
}

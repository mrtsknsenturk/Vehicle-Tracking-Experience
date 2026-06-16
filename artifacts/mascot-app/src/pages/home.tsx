import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mascot, ReactionType, ModeType } from "@/components/Mascot";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [phase, setPhase] = useState<"hero"|"quiz"|"analysis"|"result"|"lead"|"success">("hero");
  const [quizStep, setQuizStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reaction, setReaction] = useState<ReactionType>("running");
  const [speech, setSpeech] = useState("");
  const [mascotMode, setMascotMode] = useState<ModeType>("casual");

  const [answers, setAnswers] = useState({
    mode: null as "corporate" | "casual" | null,
    fleetSize: null as string | null,
    sector: null as string | null,
    cities: null as string | null,
    fuelTracking: null as boolean | null,
    driverReports: null as boolean | null,
    liveTracking: null as boolean | null,
    vehicleType: null as string | null,
    vehicleCount: null as string | null,
    mobileApp: null as boolean | null,
    engineBlock: null as boolean | null,
    notifications: null as boolean | null,
  });

  const [heroShowButton, setHeroShowButton] = useState(false);

  // Helper to update speech safely for animation
  const updateSpeech = useCallback((newSpeech: string) => {
    setSpeech("");
    setTimeout(() => {
      setSpeech(newSpeech);
    }, 100);
  }, []);

  // Helper to update reaction and reset to idle
  const updateReaction = useCallback((newReaction: ReactionType) => {
    setReaction(newReaction);
    setTimeout(() => {
      setReaction("idle");
    }, 1200);
  }, []);

  // Hero Entry Sequence
  useEffect(() => {
    if (phase === "hero") {
      let isMounted = true;
      const sequence = async () => {
        setReaction("running");
        await new Promise((r) => setTimeout(r, 600));
        if (!isMounted) return;
        
        setReaction("skidding");
        await new Promise((r) => setTimeout(r, 600));
        if (!isMounted) return;

        setReaction("wave");
        updateSpeech("Merhaba 👋");
        await new Promise((r) => setTimeout(r, 1500));
        if (!isMounted) return;

        setReaction("idle");
        updateSpeech("Size en uygun araç takip çözümünü birlikte bulacağız.");
        
        await new Promise((r) => setTimeout(r, 1000));
        if (!isMounted) return;
        setHeroShowButton(true);
      };
      sequence();
      return () => { isMounted = false; };
    }
  }, [phase, updateSpeech]);

  const startQuiz = () => {
    setPhase("quiz");
    setQuizStep(0);
    setProgress(10);
    updateSpeech("Size nasıl yardımcı olabiliriz?");
  };

  const handleAnswer = (field: keyof typeof answers, value: any, nextStep: number | "analysis", newProgress: number, react: ReactionType, say?: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    updateReaction(react);
    if (say) updateSpeech(say);
    else setSpeech(""); // Clear speech if no specific thing to say
    
    setProgress(newProgress);

    setTimeout(() => {
      if (nextStep === "analysis") {
        setPhase("analysis");
      } else {
        setQuizStep(nextStep);
      }
    }, 800);
  };

  // Analysis Sequence
  useEffect(() => {
    if (phase === "analysis") {
      updateReaction("thinking");
      updateSpeech("Mükemmel. Şimdi sizin için en uygun çözümü hazırlıyorum.");
      
      const timer = setTimeout(() => {
        setPhase("result");
        updateReaction("celebrate");
        updateSpeech("İşte size özel çözümünüz! 🎉");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, updateReaction, updateSpeech]);

  const getRecommendation = () => {
    if (answers.mode === "corporate") {
      if (answers.fleetSize === "50+ araç") return { name: "ZTRAX Enterprise", price: "₺1.299/ay", features: ["Sınırsız araç kapasitesi", "Özel API entegrasyonu", "Canlı konum takibi", "Yakıt analizi", "Gelişmiş sürücü raporları", "7/24 Özel destek"] };
      if (answers.fleetSize === "21-50 araç") return { name: "ZTRAX Business Pro", price: "₺899/ay", features: ["50 araca kadar kapasite", "Canlı konum takibi", "Yakıt analizi", "Sürücü raporları", "Öncelikli destek"] };
      if (answers.fleetSize === "6-20 araç") return { name: "ZTRAX Business", price: "₺599/ay", features: ["20 araca kadar kapasite", "Canlı konum", "Temel yakıt analizi", "Mesai saatleri içi destek"] };
      return { name: "ZTRAX Starter", price: "₺399/ay", features: ["5 araca kadar kapasite", "Canlı konum takibi", "Mobil uygulama", "E-posta desteği"] };
    } else {
      if (answers.vehicleCount === "1 araç") return { name: "ZTRAX Personal", price: "₺299/ay", features: ["Canlı konum takibi", "Mobil uygulama", "Motor blokajı", "Anlık bildirimler"] };
      return { name: "ZTRAX Multi", price: "₺499/ay", features: ["Çoklu araç takibi", "Canlı konum takibi", "Mobil uygulama", "Ortak hesap yönetimi", "Anlık bildirimler"] };
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] };

  const containerVariants = {
    animate: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const renderQuizContent = () => {
    if (quizStep === 0) {
      return (
        <motion.div key="step0" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Sizi daha iyi tanıyalım.</h2>
          </div>
          <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div variants={itemVariants} onClick={() => { setMascotMode("corporate"); handleAnswer("mode", "corporate", 1, 20, "thumbsUp", "Harika. Filonuzu tanıyalım."); }} className="p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="font-bold text-xl mb-1 text-secondary">Kurumsal</h3>
              <p className="text-muted-foreground text-sm font-medium">Şirket filom var</p>
            </motion.div>
            <motion.div variants={itemVariants} onClick={() => { setMascotMode("casual"); handleAnswer("mode", "casual", 1, 20, "wave", "Mükemmel. Aracınız için en uygun çözümü bulalım."); }} className="p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="font-bold text-xl mb-1 text-secondary">Bireysel</h3>
              <p className="text-muted-foreground text-sm font-medium">Kişisel aracım var</p>
            </motion.div>
          </motion.div>
        </motion.div>
      );
    }

    if (answers.mode === "corporate") {
      switch (quizStep) {
        case 1:
          return (
            <motion.div key="c1" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 1 / 6</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Kaç aracınız var?</h2>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-3">
                {[
                  { label: "1-5 araç", react: "thumbsUp" as ReactionType },
                  { label: "6-20 araç", react: "excited" as ReactionType },
                  { label: "21-50 araç", react: "excited" as ReactionType },
                  { label: "50+ araç", react: "celebrate" as ReactionType, say: "Etkileyici! Büyük bir filo için harika özellikler sunuyoruz." }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("fleetSize", opt.label, 2, 40, opt.react, opt.say)} className="w-full text-left p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-lg text-secondary">
                    {opt.label}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
        case 2:
          return (
            <motion.div key="c2" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 2 / 6</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Hangi sektördesiniz?</h2>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🚚", label: "Lojistik & Taşımacılık", react: "excited" as ReactionType },
                  { icon: "🏗️", label: "İnşaat & Mühendislik", react: "thumbsUp" as ReactionType },
                  { icon: "🛒", label: "Perakende & Dağıtım", react: "thumbsUp" as ReactionType },
                  { icon: "⚕️", label: "Sağlık & Hizmet", react: "wave" as ReactionType },
                  { icon: "🔧", label: "Teknik Servis", react: "thumbsUp" as ReactionType },
                  { icon: "🏛️", label: "Diğer", react: "idle" as ReactionType }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("sector", opt.label, 3, 60, opt.react)} className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-center text-secondary">
                    <span className="text-3xl mb-2">{opt.icon}</span>
                    <span className="text-sm md:text-base">{opt.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
        case 3:
          return (
            <motion.div key="c3" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 3 / 6</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Araçlar hangi şehirlerde?</h2>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-3">
                {[
                  { label: "Tek şehir", react: "thumbsUp" as ReactionType },
                  { label: "2-5 şehir", react: "excited" as ReactionType },
                  { label: "6+ şehir / Türkiye geneli", react: "celebrate" as ReactionType, say: "Türkiye geneli! Harika — çok şehirli filo yönetimi tam size göre." }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("cities", opt.label, 4, 80, opt.react, opt.say)} className="w-full text-left p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-lg text-secondary">
                    {opt.label}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
        case 4:
          return (
            <motion.div key="c4" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 4 / 6</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Yakıt takibi ister misiniz?</h2>
                <p className="text-muted-foreground text-base">Araçlarınızın yakıt tüketimini anlık takip edin, tasarruf edin.</p>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-3">
                {[
                  { icon: "✅", label: "Evet, istiyorum", react: "celebrate" as ReactionType, val: true },
                  { icon: "➡️", label: "Şimdilik hayır", react: "thumbsUp" as ReactionType, val: false }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("fuelTracking", opt.val, 5, 90, opt.react)} className="w-full flex items-center gap-3 text-left p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-lg text-secondary">
                    <span>{opt.icon}</span> <span>{opt.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
        case 5:
          return (
            <motion.div key="c5" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 5 / 6</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Sürücü performans raporları?</h2>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-3">
                {[
                  { icon: "✅", label: "Evet, istiyorum", react: "celebrate" as ReactionType, val: true },
                  { icon: "➡️", label: "Şimdilik hayır", react: "thumbsUp" as ReactionType, val: false }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("driverReports", opt.val, 6, 95, opt.react)} className="w-full flex items-center gap-3 text-left p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-lg text-secondary">
                    <span>{opt.icon}</span> <span>{opt.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
        case 6:
          return (
            <motion.div key="c6" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 6 / 6</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Canlı konum takibi?</h2>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-3">
                {[
                  { icon: "✅", label: "Evet, istiyorum", react: "celebrate" as ReactionType, val: true },
                  { icon: "➡️", label: "Şimdilik hayır", react: "thumbsUp" as ReactionType, val: false }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("liveTracking", opt.val, "analysis", 100, opt.react)} className="w-full flex items-center gap-3 text-left p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-lg text-secondary">
                    <span>{opt.icon}</span> <span>{opt.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
      }
    } else {
      // INDIVIDUAL
      switch (quizStep) {
        case 1:
          return (
            <motion.div key="i1" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 1 / 5</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Araç tipi nedir?</h2>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🚗", label: "Otomobil", react: "thumbsUp" as ReactionType },
                  { icon: "🚐", label: "Minibüs / Van", react: "excited" as ReactionType },
                  { icon: "🏍️", label: "Motosiklet", react: "wave" as ReactionType },
                  { icon: "🚛", label: "Kamyon", react: "excited" as ReactionType }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("vehicleType", opt.label, 2, 40, opt.react)} className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-center text-secondary">
                    <span className="text-3xl mb-2">{opt.icon}</span>
                    <span className="text-sm md:text-base">{opt.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
        case 2:
          return (
            <motion.div key="i2" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 2 / 5</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Kaç araç için takip istiyorsunuz?</h2>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-3">
                {[
                  { label: "1 araç", react: "thumbsUp" as ReactionType, say: "Harika! Tek araç için özel paketimiz var." },
                  { label: "2-5 araç", react: "excited" as ReactionType },
                  { label: "5+ araç", react: "celebrate" as ReactionType }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("vehicleCount", opt.label, 3, 60, opt.react, opt.say)} className="w-full text-left p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-lg text-secondary">
                    {opt.label}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
        case 3:
          return (
            <motion.div key="i3" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 3 / 5</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Mobil uygulama kullanır mısınız?</h2>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-3">
                {[
                  { icon: "📱", label: "Evet, mobil öncelikli", react: "celebrate" as ReactionType, say: "Harika! Uygulamamız iOS ve Android'de çalışıyor.", val: true },
                  { icon: "💻", label: "Hayır, web yeterli", react: "thumbsUp" as ReactionType, val: false }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("mobileApp", opt.val, 4, 80, opt.react, opt.say)} className="w-full flex items-center gap-3 text-left p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-lg text-secondary">
                    <span>{opt.icon}</span> <span>{opt.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
        case 4:
          return (
            <motion.div key="i4" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 4 / 5</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Motor blokaj özelliği ister misiniz?</h2>
                <p className="text-muted-foreground text-base">Aracınızı uzaktan devre dışı bırakın.</p>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-3">
                {[
                  { icon: "✅", label: "Evet, güvenlik önemli", react: "celebrate" as ReactionType, val: true },
                  { icon: "➡️", label: "Gerek yok", react: "thumbsUp" as ReactionType, val: false }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("engineBlock", opt.val, 5, 90, opt.react)} className="w-full flex items-center gap-3 text-left p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-lg text-secondary">
                    <span>{opt.icon}</span> <span>{opt.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
        case 5:
          return (
            <motion.div key="i5" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="w-full space-y-6">
              <div className="space-y-2">
                <span className="text-primary/60 font-bold tracking-widest text-sm uppercase">ADIM 5 / 5</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary">Anlık bildirim almak ister misiniz?</h2>
              </div>
              <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex flex-col gap-3">
                {[
                  { icon: "🔔", label: "Evet, anında haberdar ol", react: "celebrate" as ReactionType, val: true },
                  { icon: "➡️", label: "Şimdilik hayır", react: "thumbsUp" as ReactionType, val: false }
                ].map(opt => (
                  <motion.button key={opt.label} variants={itemVariants} onClick={() => handleAnswer("notifications", opt.val, "analysis", 100, opt.react)} className="w-full flex items-center gap-3 text-left p-5 rounded-2xl border-2 border-border bg-white/60 backdrop-blur-sm cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold text-lg text-secondary">
                    <span>{opt.icon}</span> <span>{opt.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          );
      }
    }
  };

  return (
    <div className="min-h-[100dvh] w-full relative overflow-hidden flex flex-col">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      {/* Progress Bar (Only visible after hero, before analysis) */}
      <AnimatePresence>
        {phase === "quiz" && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md px-6 py-4 shadow-sm border-b border-border/50 flex flex-col items-center">
             <div className="w-full max-w-4xl flex items-center gap-4">
               <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                 <motion.div className="h-full bg-primary" initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
               </div>
               <span className="text-secondary font-bold text-sm min-w-[3rem] text-right">{progress}%</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative z-10 px-6 py-12 md:py-24">
        
        {/* Mascot Area */}
        <motion.div 
          layout
          initial={false}
          animate={{
            scale: phase === "hero" ? 1.5 : 1,
            y: phase === "hero" ? -40 : 0
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col items-center justify-center shrink-0 ${
            phase === "hero" ? "w-full" : "w-full md:w-1/3 max-w-[240px] md:max-w-none mb-8 md:mb-0"
          }`}
        >
          <Mascot mode={mascotMode} reaction={reaction} speechText={speech} />
          
          <AnimatePresence>
            {phase === "hero" && heroShowButton && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-12"
              >
                <Button size="lg" onClick={startQuiz} className="h-16 px-10 text-xl font-extrabold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-primary hover:bg-primary/90 text-primary-foreground">
                  Hadi Başlayalım →
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {phase === "quiz" && (
            <motion.div 
              key="quiz-area"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-2/3 flex flex-col items-start justify-center max-w-xl"
            >
              {renderQuizContent()}
            </motion.div>
          )}

          {phase === "analysis" && (
            <motion.div 
              key="analysis-area"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full md:w-2/3 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="flex gap-3 mb-4">
                {[0, 1, 2].map((i) => (
                  <motion.div 
                    key={i} 
                    className="w-5 h-5 rounded-full bg-primary"
                    animate={{ y: [0, -15, 0], scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <h2 className="text-3xl font-extrabold text-secondary">Analiz ediliyor...</h2>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div 
              key="result-area"
              variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}
              className="w-full md:w-2/3 flex flex-col items-start justify-center max-w-2xl"
            >
              <div className="w-full bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
                
                <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-2">Önerilen Paket</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-secondary tracking-tight">{getRecommendation().name}</h2>
                    <p className="text-xl font-medium text-muted-foreground pt-2">OBD-II Pro Tracker & Ücretsiz profesyonel montaj dahil.</p>
                  </div>
                  
                  <div className="py-4 border-y border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Aylık Ücret</p>
                      <p className="text-4xl font-extrabold text-secondary">{getRecommendation().price}</p>
                    </div>
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getRecommendation().features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-secondary font-medium">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Button size="lg" onClick={() => { setPhase("lead"); updateReaction("wave"); updateSpeech("Bu çözümü size göndermemi ister misiniz?"); }} className="w-full h-16 text-xl font-extrabold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    Bu Teklifi İstiyorum →
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {phase === "lead" && (
            <motion.div 
              key="lead-area"
              variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}
              className="w-full md:w-2/3 flex flex-col items-start justify-center max-w-md"
            >
              <div className="space-y-2 mb-8">
                <h2 className="text-4xl font-extrabold text-secondary">İletişim Bilgileri</h2>
                <p className="text-muted-foreground text-lg">Teklifinizi hazırlamak için detayları doldurun.</p>
              </div>
              
              <form 
                className="w-full space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setPhase("success");
                  updateReaction("celebrate");
                  updateSpeech("Harika!");
                }}
              >
                <div>
                  <input type="text" required placeholder="Ad Soyad" className="w-full px-5 py-4 rounded-xl border-2 border-border bg-white/60 backdrop-blur-sm focus:border-primary focus:outline-none text-lg font-medium transition-colors text-secondary placeholder:text-muted-foreground" />
                </div>
                <div>
                  <input type="tel" required placeholder="Telefon" className="w-full px-5 py-4 rounded-xl border-2 border-border bg-white/60 backdrop-blur-sm focus:border-primary focus:outline-none text-lg font-medium transition-colors text-secondary placeholder:text-muted-foreground" />
                </div>
                <div>
                  <input type="email" required placeholder="E-posta" className="w-full px-5 py-4 rounded-xl border-2 border-border bg-white/60 backdrop-blur-sm focus:border-primary focus:outline-none text-lg font-medium transition-colors text-secondary placeholder:text-muted-foreground" />
                </div>
                {answers.mode === "corporate" && (
                  <div>
                    <input type="text" required placeholder="Firma Adı" className="w-full px-5 py-4 rounded-xl border-2 border-border bg-white/60 backdrop-blur-sm focus:border-primary focus:outline-none text-lg font-medium transition-colors text-secondary placeholder:text-muted-foreground" />
                  </div>
                )}
                
                <Button type="submit" size="lg" className="w-full h-16 text-xl font-extrabold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all mt-4">
                  🚀 Teklifimi Oluştur
                </Button>
              </form>
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div 
              key="success-area"
              variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}
              className="w-full md:w-2/3 flex flex-col items-center justify-center text-center max-w-lg space-y-6"
            >
              <div className="w-24 h-24 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-secondary">Teklifiniz hazırlandı!</h2>
              <p className="text-xl text-muted-foreground">En kısa sürede uzman ekibimiz sizinle iletişime geçecek. Bizi tercih ettiğiniz için teşekkür ederiz.</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

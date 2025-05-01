import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/login/LoginForm";
import TypewriterTitle from "@/components/login/TypewriterTitle";
import GradientText, { GradientBackground, GradientCard, GradientDivider } from "@/components/login/RainbowText";
import Background from "@/components/3d/Background";
import Plant from "@/components/3d/Plant";
import Bear from "@/components/3d/Bear";
import Plant2D from "@/components/login/Plant2D";
import Bear2D from "@/components/login/Bear2D";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, BookOpen, BarChart, CalendarDays } from "lucide-react";

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isBearWatchingPassword, setIsBearWatchingPassword] = useState(false);
  const [use3D, setUse3D] = useState(true);
  const { toast } = useToast();
  
  // Handle 3D rendering errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('replit') || event.message.includes('Cannot read')) {
        console.warn('Disabling 3D components due to errors');
        setUse3D(false);
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  // Track scroll position for plant growth animation
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = position / maxScroll;
      setScrollPosition(Math.min(scrollPercentage, 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simple login handler
  const handleLogin = (email: string, password: string, role: string) => {
    // Simulate API call
    console.log(`Login attempt with ${email}, ${password}, role: ${role}`);
    
    // Simple validation for sample users
    const sampleUsers: Record<string, { password: string; role: string }> = {
      "professor@escola.com": { password: "123456", role: "professor" },
      "coordenador@escola.com": { password: "123456", role: "coordenador" },
      "diretor@escola.com": { password: "123456", role: "diretor" }
    };
    
    if (sampleUsers[email] && sampleUsers[email].password === password) {
      // Success toast
      toast({
        title: "Login bem-sucedido!",
        description: `Redirecionando para o dashboard de ${role}...`,
      });
      
      // Simulate redirect
      setTimeout(() => {
        alert(`Redirecionando para o dashboard de ${role}...`);
        /* 
         * INTEGRAÇÃO COM BACKEND
         * 
         * Aqui seria feito o redirecionamento com base no perfil do usuário:
         * - Professores: /dashboard/professor
         * - Coordenadores: /dashboard/coordenador
         * - Diretores: /dashboard/diretor
         */
      }, 2000);
    } else {
      // Error toast
      toast({
        title: "Erro de login",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const [_, navigate] = useLocation();
  
  // Redirecionar para página de cadastro
  const handleCriarConta = () => {
    navigate("/cadastro");
  };
  
  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden">
      {/* Modern gradient background */}
      <GradientBackground />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <div className="w-full max-w-7xl mx-auto grid md:grid-cols-5 gap-10 items-center pb-8">
          {/* Left Column - 3 columns wide */}
          <div className="md:col-span-3 flex flex-col space-y-8 py-8">
            <div className="space-y-2">
              <TypewriterTitle 
                text="Sistema de Gestão Escolar" 
                className="md:max-w-2xl"
              />
              
              <GradientText className="text-xl md:text-2xl font-medium md:max-w-2xl">
                Plataforma Educacional Integrada
              </GradientText>
              
              <GradientDivider />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <GradientCard className="card-3d perspective-card">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-3 rounded-lg text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Gestão Acadêmica Completa</h3>
                    <p className="text-gray-600 text-sm">Organize turmas, professores e alunos em uma plataforma integrada e intuitiva.</p>
                  </div>
                </div>
              </GradientCard>

              <GradientCard className="card-3d perspective-card">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-3 rounded-lg text-white">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Controle de Frequência</h3>
                    <p className="text-gray-600 text-sm">Monitore a presença dos alunos com registros em tempo real e notificações automáticas.</p>
                  </div>
                </div>
              </GradientCard>

              <GradientCard className="card-3d perspective-card">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-3 rounded-lg text-white">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Relatórios Avançados</h3>
                    <p className="text-gray-600 text-sm">Visualize dados de desempenho com gráficos interativos e relatórios personalizados.</p>
                  </div>
                </div>
              </GradientCard>

              <GradientCard className="card-3d perspective-card">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-3 rounded-lg text-white">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Comunicação Integrada</h3>
                    <p className="text-gray-600 text-sm">Conecte educadores, alunos e responsáveis com ferramentas de comunicação seguras.</p>
                  </div>
                </div>
              </GradientCard>
            </div>

            <div className="relative w-full h-64 md:h-72 overflow-hidden rounded-2xl shadow-lg">
              {use3D ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl">
                <Plant2D growthFactor={scrollPosition} />
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-indigo-700 font-medium bg-white/70 px-4 py-2 rounded-full">
                  Crescimento contínuo e monitorado
                </p>
              </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl">
                  <Plant2D growthFactor={scrollPosition} />
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-indigo-700 font-medium bg-white/70 px-4 py-2 rounded-full">
                    Crescimento contínuo e monitorado
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column with Login Form - 2 columns wide */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-8 md:p-10 glass-effect">
            {/* Bear Animation Container */}
            <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] mx-auto mb-8 float-animation">
              <Bear2D isWatchingPassword={isBearWatchingPassword} />
            </div>
            
            <h2 className="font-bold text-2xl text-center text-indigo-800 mb-6">Acesso ao Sistema</h2>
            
            <LoginForm 
              onLogin={handleLogin}
              onPasswordFocus={() => setIsBearWatchingPassword(true)}
              onPasswordBlur={() => setIsBearWatchingPassword(false)}
              onEmailFocus={() => setIsBearWatchingPassword(false)}
            />
            
            <div className="mt-5 flex justify-center">
              <Button 
                variant="outline" 
                className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all font-medium" 
                onClick={handleCriarConta}
              >
                Criar Nova Conta
              </Button>
            </div>
            
            {/* Support Contact */}
            <div className="mt-8 p-4 bg-indigo-50 rounded-xl text-center text-sm border border-indigo-100">
              <p className="text-gray-700 mb-1">Problemas para acessar?</p>
              <p className="font-medium text-indigo-700">suporte@sistemaescolar.com.br</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="w-full mt-8 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>&copy; {new Date().getFullYear()} Sistema de Gestão Escolar. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

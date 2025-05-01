import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/login/LoginForm";
import TypewriterTitle from "@/components/login/TypewriterTitle";
import RainbowText from "@/components/login/RainbowText";
import { RainbowArc } from "@/components/login/RainbowText";
import Background from "@/components/3d/Background";
import Plant from "@/components/3d/Plant";
import Bear from "@/components/3d/Bear";
import Plant2D from "@/components/login/Plant2D";
import Bear2D from "@/components/login/Bear2D";
import { useToast } from "@/hooks/use-toast";

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
    const sampleUsers = {
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

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-x-hidden">
      {/* Background Scene - conditional 3D rendering */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        {use3D ? (
          <Canvas>
            <Suspense fallback={null}>
              <Background />
            </Suspense>
          </Canvas>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-50">
            <div className="absolute inset-0 overflow-hidden opacity-20">
              {/* Decorative background elements */}
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-primary"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 50 + 20}px`,
                    height: `${Math.random() * 50 + 20}px`,
                    opacity: Math.random() * 0.5 + 0.1,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column with 3D Elements and Animations */}
          <div className="flex flex-col items-center md:items-start">
            <TypewriterTitle text="Sistema de Gestão Escolar" />
            
            <RainbowText className="font-medium text-xl md:text-2xl mb-8">
              Plataforma Educacional Integrada
            </RainbowText>
            
            <div className="relative w-full h-64 md:h-96 mb-8">
              {use3D ? (
                <Canvas className="w-full h-full">
                  <Suspense fallback={null}>
                    <Plant growthFactor={scrollPosition} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                  </Suspense>
                </Canvas>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-center">
                    <div className="mx-auto w-32 h-32 bg-gradient-to-tr from-green-300 to-emerald-400 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <p className="mt-4 text-emerald-800 font-medium">Crescimento contínuo e monitorado</p>
                  </div>
                </div>
              )}
            </div>
            
            <Card className="bg-white/80 backdrop-blur-sm p-6 w-full">
              <h2 className="font-semibold text-xl text-dark mb-4">Benefícios do Sistema</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Gestão completa de alunos, turmas e professores</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Controle de notas e frequência em tempo real</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Comunicação facilitada entre escola e família</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Relatórios personalizados para cada nível de acesso</span>
                </li>
              </ul>
            </Card>
          </div>
          
          {/* Right Column with Login Form */}
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-10">
            {/* Bear Animation Container */}
            <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] mx-auto mb-6">
              {use3D ? (
                <Canvas>
                  <Suspense fallback={null}>
                    <Bear isWatchingPassword={isBearWatchingPassword} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                  </Suspense>
                </Canvas>
              ) : (
                <div className="w-full h-full bg-amber-100 rounded-full flex items-center justify-center border-4 border-amber-200">
                  <div className="relative">
                    {/* Bear face */}
                    <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
                      {/* Eyes */}
                      {isBearWatchingPassword ? (
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-black rounded-full relative">
                            <div className="absolute w-6 h-2 bg-amber-500 top-0"></div>
                          </div>
                          <div className="w-3 h-3 bg-black rounded-full relative">
                            <div className="absolute w-6 h-2 bg-amber-500 top-0"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                        </div>
                      )}
                      {/* Nose */}
                      <div className="absolute w-4 h-4 bg-amber-700 rounded-full bottom-3"></div>
                    </div>
                    {/* Ears */}
                    <div className="absolute w-5 h-5 bg-amber-500 rounded-full -top-2 -left-2"></div>
                    <div className="absolute w-5 h-5 bg-amber-500 rounded-full -top-2 -right-2"></div>
                  </div>
                </div>
              )}
            </div>
            
            <h2 className="font-bold text-2xl text-center text-dark mb-6">Acesso ao Sistema</h2>
            
            <LoginForm 
              onLogin={handleLogin}
              onPasswordFocus={() => setIsBearWatchingPassword(true)}
              onPasswordBlur={() => setIsBearWatchingPassword(false)}
              onEmailFocus={() => setIsBearWatchingPassword(false)}
            />
            
            {/* Support Contact */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Problemas para acessar? Entre em contato com o suporte:</p>
              <p className="font-medium text-primary">suporte@sistemaescolar.com.br</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="w-full mt-12 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Sistema de Gestão Escolar. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

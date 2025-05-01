import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle, ArrowLeft, User, Mail, Lock, School, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GradientText, { GradientBackground, GradientCard, GradientDivider } from "@/components/login/RainbowText";
import AnimatedRegistrationForm from "@/components/login/AnimatedRegistrationForm";

// Criando um schema para validação de cadastro
const cadastroSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
  escola: z.string().min(3, { message: "Nome da escola deve ter pelo menos 3 caracteres" }),
  cargo: z.string().min(2, { message: "Cargo é obrigatório" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type CadastroFormData = z.infer<typeof cadastroSchema>;

export default function Cadastro() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      confirmPassword: "",
      escola: "",
      cargo: "",
    },
  });

  const onSubmit = async (data: CadastroFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simular uma chamada de API com timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Dados do cadastro:", data);
      
      // Simular sucesso do cadastro
      setIsSuccess(true);
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode acessar o sistema com suas credenciais.",
      });
    } catch (error) {
      toast({
        title: "Erro ao realizar cadastro",
        description: "Ocorreu um erro ao tentar realizar seu cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoltar = () => {
    navigate("/");
  };

  // Handle form submission from the animated form
  const handleAnimatedFormSubmit = (formData: any) => {
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden">
      <GradientBackground />
      
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <button 
          onClick={handleVoltar}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-8 self-start"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para o login
        </button>
        
        <div className="w-full max-w-3xl mx-auto">
          {isSuccess ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center glass-effect">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cadastro Concluído!</h2>
              
              <p className="text-gray-600 mb-8">Sua conta foi criada com sucesso. Agora você pode acessar o sistema utilizando seu email e senha.</p>
              
              <Button
                onClick={handleVoltar}
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-8 py-3 rounded-lg shadow-md"
              >
                Ir para o Login
              </Button>
            </div>
          ) : (
            <div className="glass-effect bg-white rounded-2xl shadow-xl p-8 md:p-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <UserPlus className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Criar Nova Conta</h1>
                  <p className="text-gray-600">Complete o formulário abaixo para se cadastrar</p>
                </div>
              </div>
              
              <GradientDivider className="mb-8" />
              
              {/* Use our new animated registration form here */}
              <AnimatedRegistrationForm onSubmit={handleAnimatedFormSubmit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
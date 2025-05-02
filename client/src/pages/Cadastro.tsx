import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { BookOpen, Users, UserCog, Mail, Lock, User } from "lucide-react";
import Bear2D from "@/components/login/Bear2D";

// Componente RadioGroup para o seletor de tipo de usuário
function RadioGroup({ 
  id, 
  name, 
  label, 
  options, 
  value, 
  onChange, 
  icon 
}: { 
  id: string;
  name: string;
  label: string;
  options: {value: string; label: string; icon: React.ReactNode}[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-3 mt-4">
      <label 
        className="text-sm font-medium text-indigo-700 flex items-center gap-2 ml-1" 
        htmlFor={id}
      >
        {icon && React.cloneElement(icon as React.ReactElement, {
          className: "h-5 w-5 text-indigo-500"
        })}
        {label}
      </label>
      
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <div key={option.value} className="relative">
            <input
              type="radio"
              id={`${id}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
            <label 
              htmlFor={`${id}-${option.value}`} 
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl border-2 
                transition-all duration-200 cursor-pointer h-full
                ${value === option.value 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-gray-200 hover:border-indigo-200'
                }
              `}
            >
              <div className={`
                p-2 rounded-lg mb-2
                ${value === option.value 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-100 text-gray-500'
                }
              `}>
                {React.cloneElement(option.icon as React.ReactElement, {
                  className: "h-6 w-6"
                })}
              </div>
              <span className={`text-sm font-medium ${value === option.value ? 'text-indigo-700' : 'text-gray-700'}`}>
                {option.label}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// Esquema de validação
const cadastroSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string(),
  tipoUsuario: z.enum(["aluno", "professor", "coordenador", "diretor"]),
  aceitaTermos: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e condições",
  })
}).refine(data => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"]
});

type CadastroForm = z.infer<typeof cadastroSchema>;

export default function Cadastro() {
  const [_, navigate] = useLocation();
  
  const [formData, setFormData] = useState<CadastroForm>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    tipoUsuario: "professor",
    aceitaTermos: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isBearWatchingPassword, setIsBearWatchingPassword] = useState(false);

  const roleOptions = [
    {
      value: 'professor',
      label: 'Professor',
      icon: <BookOpen />
    },
    {
      value: 'coordenador',
      label: 'Coordenador',
      icon: <Users />
    },
    {
      value: 'diretor',
      label: 'Diretor',
      icon: <UserCog />
    },
  ];

  const handleChange = (field: keyof CadastroForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando ele for editado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Limpar mensagem quando usuario edita formulário
    if (message) {
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // Validar o formulário
      const validatedData = cadastroSchema.parse(formData);
      
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Dados de cadastro:", validatedData);
      
      // Exibir mensagem de sucesso
      setMessage({
        type: 'success',
        text: 'Cadastro realizado com sucesso! Bem-vindo à Escola Digital 3D.'
      });
      
      // Redirecionar para página inicial
      setTimeout(() => navigate("/"), 1500);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Formatar erros de validação
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formattedErrors);
        
        setMessage({
          type: 'error',
          text: 'Por favor, corrija os erros e tente novamente.'
        });
      } else {
        // Erro genérico
        setMessage({
          type: 'error',
          text: 'Ocorreu um erro ao tentar realizar o cadastro. Tente novamente mais tarde.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-indigo-800">Crie sua conta</CardTitle>
          <CardDescription className="text-center">
            Preencha o formulário abaixo para se cadastrar na plataforma
          </CardDescription>
          
          {/* Urso animado */}
          <div className="w-[120px] h-[120px] mx-auto my-2 float-animation">
            <Bear2D isWatchingPassword={isBearWatchingPassword} />
          </div>
        </CardHeader>
        
        {message && (
          <div className={`mx-6 p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-500" />
                <Label htmlFor="nome">Nome completo</Label>
              </div>
              <Input 
                id="nome" 
                placeholder="Digite seu nome completo" 
                value={formData.nome}
                onChange={e => handleChange("nome", e.target.value)}
                className={errors.nome ? "border-red-500" : ""}
              />
              {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-500" />
                <Label htmlFor="email">Email</Label>
              </div>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu.email@exemplo.com" 
                value={formData.email}
                onChange={e => handleChange("email", e.target.value)}
                onFocus={() => setIsBearWatchingPassword(false)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-500" />
                  <Label htmlFor="senha">Senha</Label>
                </div>
                <Input 
                  id="senha" 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.senha}
                  onChange={e => handleChange("senha", e.target.value)}
                  onFocus={() => setIsBearWatchingPassword(true)}
                  onBlur={() => setIsBearWatchingPassword(false)}
                  className={errors.senha ? "border-red-500" : ""}
                />
                {errors.senha && <p className="text-sm text-red-500">{errors.senha}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-500" />
                  <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                </div>
                <Input 
                  id="confirmarSenha" 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.confirmarSenha}
                  onChange={e => handleChange("confirmarSenha", e.target.value)}
                  onFocus={() => setIsBearWatchingPassword(true)}
                  onBlur={() => setIsBearWatchingPassword(false)}
                  className={errors.confirmarSenha ? "border-red-500" : ""}
                />
                {errors.confirmarSenha && <p className="text-sm text-red-500">{errors.confirmarSenha}</p>}
              </div>
            </div>
            
            {/* Seletor com ícones */}
            <RadioGroup
              id="tipoUsuario"
              name="tipoUsuario"
              label="Selecione seu perfil"
              options={roleOptions}
              value={formData.tipoUsuario}
              onChange={(value) => handleChange("tipoUsuario", value)}
              icon={<Users />}
            />
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="aceitaTermos" 
                checked={formData.aceitaTermos}
                onCheckedChange={checked => handleChange("aceitaTermos", checked)}
              />
              <Label 
                htmlFor="aceitaTermos" 
                className={`text-sm ${errors.aceitaTermos ? "text-red-500" : ""}`}
              >
                Aceito os termos de uso e política de privacidade
              </Label>
            </div>
            {errors.aceitaTermos && <p className="text-sm text-red-500 mt-1">{errors.aceitaTermos}</p>}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white mt-6" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </span>
              ) : "Criar conta"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center text-gray-500">
            Já possui uma conta?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-indigo-600 hover:text-indigo-800"
              onClick={() => navigate("/")}
            >
              Fazer login
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/")}
          >
            Voltar para página inicial
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
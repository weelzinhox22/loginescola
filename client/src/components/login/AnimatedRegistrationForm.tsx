import React, { useState } from 'react';
import { User, Mail, Lock, School } from 'lucide-react';
import AnimatedInput from './AnimatedInput';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface AnimatedRegistrationFormProps {
  onSubmit: (formData: FormData) => void;
}

interface FormData {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
  escola: string;
  cargo: string;
}

export default function AnimatedRegistrationForm({ onSubmit }: AnimatedRegistrationFormProps) {
  const [_, navigate] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    escola: '',
    cargo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatedInput
        id="nome-form-item"
        name="nome"
        label="Nome completo"
        placeholder="Seu nome completo"
        value={formData.nome}
        onChange={handleInputChange}
        icon={<User />}
        animationType="name"
      />
      
      <AnimatedInput
        id="email-form-item"
        name="email"
        label="Email"
        placeholder="seu.email@escola.com.br"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        icon={<Mail />}
        animationType="email"
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <AnimatedInput
          id="password-form-item"
          name="password"
          label="Senha"
          placeholder="Crie uma senha segura"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          icon={<Lock />}
          animationType="password"
        />
        
        <AnimatedInput
          id="confirm-password-form-item"
          name="confirmPassword"
          label="Confirmar senha"
          placeholder="Confirme sua senha"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          icon={<Lock />}
          animationType="confirm-password"
        />
      </div>
      
      <AnimatedInput
        id="escola-form-item"
        name="escola"
        label="Instituição de ensino"
        placeholder="Nome da escola/instituição"
        value={formData.escola}
        onChange={handleInputChange}
        icon={<School />}
        animationType="school"
      />
      
      <AnimatedInput
        id="cargo-form-item"
        name="cargo"
        label="Cargo/Função"
        placeholder="Ex: Professor, Coordenador, Diretor"
        value={formData.cargo}
        onChange={handleInputChange}
        icon={<User />}
        animationType="role"
      />
      
      <div className="flex flex-col space-y-2 pt-4">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white py-2 rounded-lg transition-all"
        >
          Criar Conta
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all"
          onClick={handleLoginRedirect}
        >
          Já tenho uma conta
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-gray-600">
        <p className="font-medium text-indigo-700 mb-1">Importante:</p>
        <p>Ao criar uma conta, você concorda com os Termos de Uso e Política de Privacidade do Sistema de Gestão Escolar.</p>
      </div>
    </form>
  );
} 
import React, { useState } from 'react';
import { User, Mail, Lock, School, UserCog, Users, BookOpen } from 'lucide-react';
import FloatingLabelInput from './FloatingLabelInput';
import RadioGroup from './RadioGroup';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface RegistrationFormProps {
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

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [_, navigate] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    escola: '',
    cargo: 'professor'
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
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FloatingLabelInput
        id="nome"
        name="nome"
        label="Nome completo"
        value={formData.nome}
        onChange={handleInputChange}
        icon={<User />}
      />
      
      <FloatingLabelInput
        id="email"
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        icon={<Mail />}
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <FloatingLabelInput
          id="password"
          name="password"
          label="Senha"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          icon={<Lock />}
        />
        
        <FloatingLabelInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar senha"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          icon={<Lock />}
        />
      </div>
      
      <FloatingLabelInput
        id="escola"
        name="escola"
        label="Instituição de ensino"
        value={formData.escola}
        onChange={handleInputChange}
        icon={<School />}
      />
      
      <RadioGroup
        id="cargo"
        name="cargo"
        label="Cargo/Função"
        options={roleOptions}
        value={formData.cargo}
        onChange={handleInputChange}
        icon={<User />}
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
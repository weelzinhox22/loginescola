import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema } from "@shared/schema";
import { z } from "zod";
import { BookOpen, Users, UserCog, Mail, Lock } from "lucide-react";
import FloatingLabelInput from "./FloatingLabelInput";
import RadioGroup from "./RadioGroup";

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (email: string, password: string, role: string) => void;
  onPasswordFocus: () => void;
  onPasswordBlur: () => void;
  onEmailFocus: () => void;
}

export default function LoginForm({
  onLogin,
  onPasswordFocus,
  onPasswordBlur,
  onEmailFocus,
}: LoginFormProps) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "professor",
      remember: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    onLogin(data.email, data.password, data.role);
  };

  const handlePasswordFocus = () => {
    onPasswordFocus();
  };

  const handlePasswordBlur = () => {
    onPasswordBlur();
  };

  const handleEmailFocus = () => {
    onEmailFocus();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FloatingLabelInput
                      id="email"
                      name="email"
                      label="Email"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      onFocus={handleEmailFocus}
                      icon={<Mail />}
                    />
                  )}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FloatingLabelInput
                      id="password"
                      name="password"
                      label="Senha"
                      type="password"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      onFocus={handlePasswordFocus}
                      onBlur={handlePasswordBlur}
                      icon={<Lock />}
                    />
                  )}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    id="role"
                    name="role"
                    label="Selecione seu perfil de acesso"
                    options={roleOptions}
                    value={field.value}
                    onChange={field.onChange}
                    icon={<Users />}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <label className="text-gray-600 font-normal">Lembrar-me neste dispositivo</label>
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium py-5 rounded-lg transition-all shadow-md hover:shadow-lg" 
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
          ) : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}

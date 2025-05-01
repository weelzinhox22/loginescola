import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema } from "@shared/schema";
import { z } from "zod";
import { RoleOption } from "@/components/ui/form-elements";
import { BookOpen, Users, UserCog } from "lucide-react";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-indigo-700 font-medium">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="seu.email@escola.com.br"
                  {...field}
                  onFocus={handleEmailFocus}
                  className="bg-white/80 border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg py-5"
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
              <FormLabel className="text-indigo-700 font-medium">Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  {...field}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  className="bg-white/80 border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg py-5"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel className="block mb-2 text-indigo-700 font-medium">Selecione seu perfil de acesso</FormLabel>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RoleOption
                      id="role-professor"
                      value="professor"
                      label="Professor"
                      icon={<BookOpen className="w-5 h-5" />}
                      checked={field.value === "professor"}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RoleOption
                      id="role-coordenador"
                      value="coordenador"
                      label="Coordenador"
                      icon={<Users className="w-5 h-5" />}
                      checked={field.value === "coordenador"}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RoleOption
                      id="role-diretor"
                      value="diretor"
                      label="Diretor"
                      icon={<UserCog className="w-5 h-5" />}
                      checked={field.value === "diretor"}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
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
                <FormLabel className="text-gray-600 font-normal">Lembrar-me neste dispositivo</FormLabel>
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

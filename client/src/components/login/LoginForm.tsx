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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="seu.email@escola.com.br"
                  {...field}
                  onFocus={handleEmailFocus}
                  className="bg-white/50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  {...field}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  className="bg-white/50 focus:bg-white transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel className="block mb-2">Selecione seu perfil de acesso</FormLabel>
          
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
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Lembrar-me neste dispositivo</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}

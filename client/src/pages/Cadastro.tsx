import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Cadastro() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-indigo-800 mb-4 text-center">Página de Cadastro</h1>
        <p className="text-gray-600 mb-8 text-center">
          Esta página está em desenvolvimento.
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            Voltar para Login
          </Button>
        </div>
      </div>
    </div>
  );
}
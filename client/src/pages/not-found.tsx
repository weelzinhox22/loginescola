import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-indigo-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Página não encontrada</h2>
        <p className="text-gray-600 mb-10">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2"
        >
          Voltar para Home
        </Button>
      </div>
    </div>
  );
}

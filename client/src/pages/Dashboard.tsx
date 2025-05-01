import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { role } = useParams();
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
          Dashboard {role && role.charAt(0).toUpperCase() + role.slice(1)}
        </h1>
        
        <p className="text-gray-600 mb-8 text-center">
          Esta é uma versão de demonstração do dashboard. Em um ambiente de produção, este seria o painel de controle para {role}.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-indigo-800 mb-2">Alunos</h3>
            <p className="text-4xl font-bold text-indigo-600">145</p>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-indigo-800 mb-2">Turmas</h3>
            <p className="text-4xl font-bold text-indigo-600">12</p>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-indigo-800 mb-2">Professores</h3>
            <p className="text-4xl font-bold text-indigo-600">24</p>
          </div>
        </div>
        
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
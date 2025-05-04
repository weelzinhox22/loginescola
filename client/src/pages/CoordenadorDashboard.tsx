import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  Users, 
  BookOpen, 
  LogOut, 
  AlertTriangle, 
  FileWarning, 
  UserX, 
  BookOpenCheck, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  XCircle,
  MessageCircle,
  Plus,
  Search,
  Upload,
  Download,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { useLocation } from "wouter";

// Mock de dados para o painel do coordenador
const TURMAS = ["1A", "1B", "2A", "2B", "3A", "3B"];
const TURNOS = ["Manhã", "Tarde"];
const TURMA_COLORS = ["#6366f1", "#f59e42", "#10b981", "#f43f5e", "#eab308", "#3b82f6"];
const TURNO_COLORS = { "Manhã": "#6366f1", "Tarde": "#f59e42" };

const mockNotas = [
  { turma: "1A", turno: "Manhã", media: 7.8 },
  { turma: "1A", turno: "Tarde", media: 8.1 },
  { turma: "1B", turno: "Manhã", media: 6.5 },
  { turma: "1B", turno: "Tarde", media: 8.2 },
  { turma: "2A", turno: "Manhã", media: 6.9 },
  { turma: "2A", turno: "Tarde", media: 7.7 },
  { turma: "2B", turno: "Manhã", media: 7.2 },
  { turma: "2B", turno: "Tarde", media: 7.5 },
  { turma: "3A", turno: "Manhã", media: 8.4 },
  { turma: "3A", turno: "Tarde", media: 7.9 },
  { turma: "3B", turno: "Manhã", media: 7.1 },
  { turma: "3B", turno: "Tarde", media: 8.0 },
];

// Mock de alertas específicos para coordenadores
const mockAlertas = [
  {
    tipo: "nota_baixa",
    titulo: "Alunos com notas baixas",
    mensagem: "3 alunos da turma 2A estão com média abaixo de 6.0.",
    cor: "bg-red-100 text-red-700 border-red-200",
    icone: <AlertTriangle className="w-6 h-6 text-red-500" />,
  },
  {
    tipo: "faltas",
    titulo: "Faltas excessivas",
    mensagem: "2 alunos da turma 1B ultrapassaram o limite de faltas.",
    cor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icone: <UserX className="w-6 h-6 text-yellow-500" />,
  },
  {
    tipo: "professor_notas",
    titulo: "Notas não lançadas",
    mensagem: "1 professor ainda não lançou as notas da turma 3A.",
    cor: "bg-blue-100 text-blue-800 border-blue-200",
    icone: <BookOpenCheck className="w-6 h-6 text-blue-500" />,
  }
];

// Mock de professores para o coordenador gerenciar
const mockProfessores = [
  { id: 1, nome: "João Souza", disciplina: "Matemática", turmas: ["1A", "1B", "2A"], email: "joao@escola.com", status: "Ativo" },
  { id: 2, nome: "Ana Lima", disciplina: "Português", turmas: ["1A", "1B", "3A"], email: "ana@escola.com", status: "Ativo" },
  { id: 3, nome: "Carlos Oliveira", disciplina: "História", turmas: ["2A", "2B", "3B"], email: "carlos@escola.com", status: "Ativo" },
  { id: 4, nome: "Mariana Costa", disciplina: "Geografia", turmas: ["1A", "2B", "3A"], email: "mariana@escola.com", status: "Licença" },
  { id: 5, nome: "Roberto Santos", disciplina: "Ciências", turmas: ["1B", "2A", "3B"], email: "roberto@escola.com", status: "Ativo" },
];

// Mock de eventos acadêmicos
const mockEventosAcademicos = [
  { id: 1, titulo: "Reunião Pedagógica", data: "2024-06-10", tipo: "Reunião" },
  { id: 2, titulo: "Conselho de Classe", data: "2024-06-15", tipo: "Avaliação" },
  { id: 3, titulo: "Preparação para Olimpíada de Matemática", data: "2024-06-18", tipo: "Acadêmico" },
  { id: 4, titulo: "Entrega de Boletins", data: "2024-06-28", tipo: "Entrega" },
];

// Mock de alunos para acompanhamento
const mockAlunos = [
  { id: 1, nome: "Lucas Silva", turma: "1A", media: 7.5, frequencia: 90, status: "Regular" },
  { id: 2, nome: "Ana Souza", turma: "1A", media: 8.2, frequencia: 95, status: "Regular" },
  { id: 3, nome: "Pedro Lima", turma: "1B", media: 6.1, frequencia: 85, status: "Atenção" },
  { id: 4, nome: "Carla Mendes", turma: "2A", media: 5.8, frequencia: 82, status: "Recuperação" },
  { id: 5, nome: "Rafael Costa", turma: "2B", media: 7.2, frequencia: 88, status: "Regular" },
];

// Mock de ranking simplificado
const mockRankingTurmas = [
  { turma: "1A", media: 8.7, frequencia: 97 },
  { turma: "1B", media: 8.2, frequencia: 95 },
  { turma: "2A", media: 8.0, frequencia: 96 },
  { turma: "2B", media: 7.8, frequencia: 94 },
  { turma: "3A", media: 8.5, frequencia: 96 },
  { turma: "3B", media: 8.1, frequencia: 93 },
];

export default function CoordenadorDashboard() {
  const [section, setSection] = useState("visao");
  const [turmaSelecionada, setTurmaSelecionada] = useState("1A");
  const [turnoSelecionado, setTurnoSelecionado] = useState("Manhã");
  const [compareTurnos, setCompareTurnos] = useState(false);
  const [alertaSelecionado, setAlertaSelecionado] = useState(null as null | typeof mockAlertas[0]);
  const [mensagem, setMensagem] = useState("");
  const [filtroTurma, setFiltroTurma] = useState("");
  const [professorSelecionado, setProfessorSelecionado] = useState<null | {
    id: number;
    nome: string;
    disciplina?: string;
    turmas?: string[];
    email?: string;
    status?: string;
    horarios?: Record<string, any>;
  }>(null);
  const [, navigate] = useLocation();

  // Simulação de dados do usuário logado
  const user = {
    name: "Maria Silva",
    email: "coordenador@escola.com",
    role: "coordenador"
  };
  
  // Verificação de segurança - redirecionar se não for coordenador
  useEffect(() => {
    // Em uma aplicação real, isso seria verificado com um token JWT ou sessão
    // Aqui estamos simulando com os dados mockados
    if (user.role !== "coordenador") {
      toast.error("Acesso não autorizado. Redirecionando...");
      navigate("/dashboard/diretor");
    }
  }, [user.role, navigate]);

  // Dados para o gráfico
  let chartData: any[] = [];
  if (compareTurnos) {
    // Agrupar por turma, cada turma tem mediaManha e mediaTarde
    chartData = TURMAS.map((turma) => {
      const manha = mockNotas.find(n => n.turma === turma && n.turno === "Manhã");
      const tarde = mockNotas.find(n => n.turma === turma && n.turno === "Tarde");
      return {
        turma,
        Manhã: manha ? manha.media : null,
        Tarde: tarde ? tarde.media : null,
      };
    });
  } else {
    // Mostrar todas as turmas do turno selecionado
    chartData = TURMAS.map((turma, i) => {
      const nota = mockNotas.find(n => n.turma === turma && n.turno === turnoSelecionado);
      return {
        turma,
        media: nota ? nota.media : null,
        color: TURMA_COLORS[i % TURMA_COLORS.length],
      };
    });
  }

  // Animação de cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
  };

  // Função para enviar notificação
  function handleEnviarNotificacao(e: React.FormEvent) {
    e.preventDefault();
    setAlertaSelecionado(null);
    setMensagem("");
    toast.success("Notificação enviada com sucesso!");
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Sidebar animada - Com opções limitadas para coordenador */}
      <motion.aside 
        initial={{ x: -80, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 80 }} 
        className="w-64 bg-white shadow-xl flex flex-col py-8 px-4 min-h-screen"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Painel Coordenador</h2>
          <p className="text-sm text-gray-500">{user.name}</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'visao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('visao')}
          >
            <BarChart2 className="w-5 h-5" /> Visão Geral
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'professores' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('professores')}
          >
            <Users className="w-5 h-5" /> Professores
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'turmas' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('turmas')}
          >
            <BookOpen className="w-5 h-5" /> Turmas e Alunos
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'eventos' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('eventos')}
          >
            <Calendar className="w-5 h-5" /> Eventos Acadêmicos
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'relatorios' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('relatorios')}
          >
            <FileText className="w-5 h-5" /> Relatórios Acadêmicos
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'comunicacao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('comunicacao')}
          >
            <MessageCircle className="w-5 h-5" /> Comunicação
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'acompanhamento' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('acompanhamento')}
          >
            <TrendingUp className="w-5 h-5" /> Acompanhamento Pedagógico
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'orientacao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('orientacao')}
          >
            <BookOpenCheck className="w-5 h-5" /> Orientação Educacional
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'material' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('material')}
          >
            <FileText className="w-5 h-5" /> Material Didático
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'ranking' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('ranking')}
          >
            <Award className="w-5 h-5" /> Ranking Acadêmico
          </button>
        </nav>
        <div className="mt-auto pt-8">
          <Button className="w-full flex gap-2 bg-red-100 text-red-700 hover:bg-red-200" onClick={() => window.location.href = '/'}>
            <LogOut className="w-5 h-5" /> Sair
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Painel de Alertas Pedagógicos */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockAlertas.map((alerta, i) => (
              <motion.div
                key={alerta.tipo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm ${alerta.cor} hover:scale-[1.03] hover:shadow-lg transition-transform cursor-pointer`}
                onClick={() => setAlertaSelecionado(alerta)}
                title="Notificar responsável"
              >
                <div className="flex-shrink-0">{alerta.icone}</div>
                <div>
                  <div className="font-semibold text-base mb-1">{alerta.titulo}</div>
                  <div className="text-sm opacity-80 leading-tight">{alerta.mensagem}</div>
                  <div className="mt-1 text-xs text-indigo-600 underline cursor-pointer">Ver detalhes</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modal de notificação */}
        <AnimatePresence>
          {alertaSelecionado && (
            <motion.div 
              key="modal-alerta" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 30 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 30 }} 
                transition={{ type: "spring", stiffness: 120 }} 
                className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
              >
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">{alertaSelecionado.icone} {alertaSelecionado.titulo}</h3>
                <p className="text-gray-700 mb-4">{alertaSelecionado.mensagem}</p>
                <form onSubmit={handleEnviarNotificacao} className="flex flex-col gap-4">
                  <div>
                    <label className="font-medium text-sm mb-1 block">Enviar notificação para:</label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                        <input type="checkbox" /> Professor responsável
                      </label>
                      <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                        <input type="checkbox" /> Pais/Responsáveis
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-sm mb-1 block">Mensagem:</label>
                    <textarea 
                      className="border rounded px-3 py-2 w-full min-h-[60px]" 
                      value={mensagem} 
                      onChange={e => setMensagem(e.target.value)} 
                      placeholder="Digite uma mensagem personalizada..." 
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setAlertaSelecionado(null)}>Cancelar</Button>
                    <Button type="submit">Enviar</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-indigo-800">Bem-vindo, {user.name}!</h1>
            <p className="text-gray-600">Acesso: <span className="capitalize font-semibold">{user.role}</span></p>
          </div>
        </motion.header>

        {/* Conteúdo da seção selecionada */}
        <AnimatePresence mode="wait">
          {section === 'visao' && (
            <motion.div 
              key="visao" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 20 }} 
              transition={{ duration: 0.3 }}
            >
              {/* Visão geral será implementada aqui */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-indigo-100 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer"
                >
                  <Users className="w-8 h-8 text-indigo-600 mb-2" />
                  <span className="text-3xl font-bold text-indigo-700">320</span>
                  <span className="text-gray-600 mt-1">Alunos</span>
                </motion.div>
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-indigo-100 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer"
                >
                  <Users className="w-8 h-8 text-indigo-600 mb-2" />
                  <span className="text-3xl font-bold text-indigo-700">24</span>
                  <span className="text-gray-600 mt-1">Professores</span>
                </motion.div>
                <motion.div 
                  custom={2} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-indigo-100 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer"
                >
                  <BookOpen className="w-8 h-8 text-indigo-600 mb-2" />
                  <span className="text-3xl font-bold text-indigo-700">8</span>
                  <span className="text-gray-600 mt-1">Turmas</span>
                </motion.div>
              </div>
              
              {/* Gráfico de notas médias */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.2 }} 
                className="bg-white rounded-xl shadow p-6 mb-8"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                  <h2 className="text-xl font-bold text-indigo-700">Notas médias por turma/turno</h2>
                  <div className="flex gap-2 items-center">
                    <select 
                      className="border rounded px-2 py-1" 
                      value={turnoSelecionado} 
                      onChange={e => setTurnoSelecionado(e.target.value)} 
                      disabled={compareTurnos}
                    >
                      {TURNOS.map(turno => <option key={turno} value={turno}>{turno}</option>)}
                    </select>
                    <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={compareTurnos} 
                        onChange={e => setCompareTurnos(e.target.checked)} 
                        className="accent-indigo-500" 
                      />
                      Comparar turnos
                    </label>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="turma" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    {compareTurnos ? (
                      <>
                        <Bar dataKey="Manhã" fill={TURNO_COLORS["Manhã"]} radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Tarde" fill={TURNO_COLORS["Tarde"]} radius={[8, 8, 0, 0]} />
                      </>
                    ) : (
                      chartData.map((d, i) => (
                        d.media !== null && <Bar key={d.turma} dataKey="media" data={[d]} name={d.turma} fill={d.color} radius={[8, 8, 0, 0]} xAxisId={0} />
                      ))
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          )}

          {/* Seção de Professores */}
          {section === 'professores' && (
            <motion.div
              key="professores"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Equipe de Professores</h2>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex gap-2" onClick={() => setProfessorSelecionado({ nome: '', horarios: {}, id: 0 })}>
                    <Calendar className="w-5 h-5" /> Ver Horários
                  </Button>
                  <Button className="flex gap-2" onClick={() => toast.success("Enviar e-mail para todos os professores")}>
                    <MessageCircle className="w-5 h-5" /> Mensagem para Todos
                  </Button>
                </div>
              </div>
              
              {/* Modal de Horários dos Professores */}
              <AnimatePresence>
                {professorSelecionado !== null && (
                  <motion.div 
                    key="modal-horario" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                  >
                    <motion.div 
                      initial={{ scale: 0.95, y: 30 }} 
                      animate={{ scale: 1, y: 0 }} 
                      exit={{ scale: 0.95, y: 30 }} 
                      transition={{ type: "spring", stiffness: 120 }} 
                      className="bg-white rounded-xl shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-auto"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                          <Calendar className="w-6 h-6" /> 
                          {professorSelecionado.id ? `Horários de ${professorSelecionado.nome}` : 'Horários dos Professores'}
                        </h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setProfessorSelecionado(null)}
                          className="rounded-full h-8 w-8 p-0"
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>

                      {professorSelecionado.id ? (
                        // Visualização de um professor específico
                        <div className="space-y-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-indigo-100 p-3 rounded-full">
                              <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-medium">{professorSelecionado.nome}</h4>
                              <p className="text-gray-500">{professorSelecionado.disciplina || 'Professor'}</p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
                            <h5 className="font-semibold text-indigo-800 px-4 py-3 bg-gradient-to-r from-indigo-50 to-white border-b">Disponibilidade Semanal</h5>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-left font-medium border-b border-indigo-100"></th>
                                    <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Segunda</th>
                                    <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Terça</th>
                                    <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Quarta</th>
                                    <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Quinta</th>
                                    <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Sexta</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {['Manhã (7h-12h)', 'Tarde (13h-18h)', 'Noite (19h-22h)'].map((periodo, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="px-4 py-3 font-medium text-gray-700 border-r border-indigo-100">{periodo}</td>
                                      {['seg', 'ter', 'qua', 'qui', 'sex'].map((dia, j) => {
                                        // Simulando dados de disponibilidade
                                        const disponivel = Math.random() > 0.3;
                                        const aula = disponivel && Math.random() > 0.4;
                                        return (
                                          <td 
                                            key={j} 
                                            className="py-3 text-center relative"
                                          >
                                            <div className={`mx-2 rounded-lg py-2 px-1 ${
                                              !disponivel ? 'bg-red-50 border border-red-100' : 
                                              aula ? 'bg-green-50 border border-green-100' : 
                                              'bg-blue-50 border border-blue-100'
                                            }`}>
                                              {!disponivel ? (
                                                <div className="flex flex-col items-center">
                                                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center mb-1">
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                  </div>
                                                  <span className="text-xs font-medium text-red-700">Indisponível</span>
                                                </div>
                                              ) : aula ? (
                                                <div className="flex flex-col items-center">
                                                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center mb-1">
                                                    <BookOpen className="w-5 h-5 text-green-600" />
                                                  </div>
                                                  <span className="text-xs font-medium text-green-700">
                                                    Turma {['1A', '2B', '3A'][Math.floor(Math.random() * 3)]}
                                                  </span>
                                                </div>
                                              ) : (
                                                <div className="flex flex-col items-center">
                                                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                                                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                                  </div>
                                                  <span className="text-xs font-medium text-blue-700">Disponível</span>
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-700 mb-2">Restrições de Horário</h5>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span>Segunda-feira - Indisponível no período da manhã (Compromisso pessoal)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span>Quarta-feira - Indisponível após as 16h (Pós-graduação)</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-700 mb-2">Preferências</h5>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>Prefere lecionar no período da manhã</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>Disponível para aulas extras às sextas-feiras</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 mt-4">
                            <Button onClick={() => toast.success(`Horário de ${professorSelecionado.nome} atualizado`)}>
                              Editar Horários
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => toast.success(`E-mail enviado para ${professorSelecionado.nome}`)}
                            >
                              Enviar Mensagem
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Visualização de todos os professores
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-800">Disponibilidade Geral - Semana Atual</h4>
                            <div className="flex gap-3 items-center text-sm">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></div>
                                <span>Disponível</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
                                <span>Indisponível</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div>
                                <span>Em aula</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="overflow-hidden rounded-xl shadow-md bg-white">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr>
                                  <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-left font-medium border-b border-indigo-100">Professor</th>
                                  <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Segunda</th>
                                  <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Terça</th>
                                  <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Quarta</th>
                                  <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Quinta</th>
                                  <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Sexta</th>
                                  <th className="px-4 py-3 bg-indigo-50 text-indigo-800 text-center font-medium border-b border-indigo-100">Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {mockProfessores.map((prof, idx) => (
                                  <tr key={prof.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-3 border-r border-indigo-50">
                                      <div className="font-medium text-gray-800">{prof.nome}</div>
                                      <div className="text-xs text-gray-500">{prof.disciplina}</div>
                                    </td>
                                    {['seg', 'ter', 'qua', 'qui', 'sex'].map((dia, i) => {
                                      // Simulando dados de disponibilidade semanal
                                      const disponibilidade = ['disponível', 'indisponível', 'aula'][Math.floor(Math.random() * 3)];
                                      return (
                                        <td 
                                          key={i} 
                                          className="py-3 text-center"
                                        >
                                          <div className={`mx-2 rounded-lg py-1.5 ${
                                            disponibilidade === 'disponível' ? 'bg-green-50 border border-green-100' : 
                                            disponibilidade === 'indisponível' ? 'bg-red-50 border border-red-100' : 
                                            'bg-blue-50 border border-blue-100'
                                          }`}>
                                            <div className="flex items-center justify-center gap-1.5">
                                              <div className={`w-2.5 h-2.5 rounded-full ${
                                                disponibilidade === 'disponível' ? 'bg-green-400' : 
                                                disponibilidade === 'indisponível' ? 'bg-red-400' : 
                                                'bg-blue-400'
                                              }`}></div>
                                              <span className={`text-xs font-medium ${
                                                disponibilidade === 'disponível' ? 'text-green-700' : 
                                                disponibilidade === 'indisponível' ? 'text-red-700' : 
                                                'text-blue-700'
                                              }`}>
                                                {disponibilidade === 'disponível' ? 'Disponível' : 
                                                 disponibilidade === 'indisponível' ? 'Indisponível' : 
                                                 'Em aula'}
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                      );
                                    })}
                                    <td className="px-4 py-3 text-center">
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => setProfessorSelecionado(prof)}
                                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg"
                                      >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Detalhes
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="mt-6 flex justify-between items-center">
                            <Button 
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={() => toast.success("Planilha de horários exportada")}
                            >
                              <Download className="w-4 h-4" /> Exportar Planilha
                            </Button>
                            
                            <Button 
                              className="flex items-center gap-2"
                              onClick={() => toast.success("Enviando solicitação de atualização de disponibilidade para todos os professores")}
                            >
                              <MessageCircle className="w-4 h-4" /> Solicitar Atualização
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700">
                        <th className="py-2">Professor</th>
                        <th>Disciplina</th>
                        <th>Turmas</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProfessores.map(prof => (
                        <tr key={prof.id} className="border-b last:border-b-0">
                          <td className="py-2 font-medium">{prof.nome}</td>
                          <td>{prof.disciplina}</td>
                          <td>{prof.turmas.join(", ")}</td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              prof.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {prof.status}
                            </span>
                          </td>
                          <td className="space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                              onClick={() => toast.success(`Acompanhamento de ${prof.nome}`)}
                            >
                              Acompanhar
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => setProfessorSelecionado(prof)}
                            >
                              Horários
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => toast.success(`Mensagem enviada para ${prof.nome}`)}
                            >
                              Mensagem
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Estatísticas de professores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" /> Pendências dos Professores
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-red-100 p-1 rounded mr-2 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Notas não lançadas (3)</p>
                        <p className="text-xs text-gray-500">Prazo final: 15/06/2024</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Relatórios a entregar (2)</p>
                        <p className="text-xs text-gray-500">Conselho de classe: 10/06/2024</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded mr-2 mt-0.5">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Planos de aula (5)</p>
                        <p className="text-xs text-gray-500">Próximo semestre</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Notificação enviada a todos os professores")}
                    >
                      Notificar Todos
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" /> Próximos Eventos Acadêmicos
                  </h3>
                  <ul className="space-y-3">
                    {mockEventosAcademicos.slice(0, 3).map((evento, idx) => (
                      <li key={idx} className="bg-indigo-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium text-indigo-800">{evento.titulo}</div>
                            <div className="text-xs text-indigo-600 mt-1">{format(parseISO(evento.data), "dd/MM/yyyy")}</div>
                          </div>
                          <div className="bg-white p-1.5 rounded-full">
                            <Calendar className="h-4 w-4 text-indigo-600" />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Calendário acadêmico aberto")}
                    >
                      Ver Calendário Completo
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Seção de Turmas e Alunos */}
          {section === 'turmas' && (
            <motion.div
              key="turmas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Turmas e Alunos</h2>
                <div className="flex gap-2">
                  <select 
                    className="border rounded-lg px-3 py-2"
                    value={turmaSelecionada}
                    onChange={e => setTurmaSelecionada(e.target.value)}
                  >
                    <option value="">Todas as turmas</option>
                    {TURMAS.map(turma => (
                      <option key={turma} value={turma}>{turma}</option>
                    ))}
                  </select>
                  <Button className="flex gap-2" onClick={() => toast.success("Relatório de turmas gerado")}>
                    <FileText className="w-5 h-5" /> Gerar Relatório
                  </Button>
                </div>
              </div>
              
              {/* Painel da turma selecionada */}
              {turmaSelecionada && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow p-6 mb-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-600" /> Turma {turmaSelecionada}
                    </h3>
                    <div className="flex gap-2">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                        Manhã
                      </span>
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                        32 alunos
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-xs text-green-700 uppercase font-semibold mb-1">Média Geral</div>
                      <div className="text-2xl font-bold text-green-700">
                        {mockNotas.find(n => n.turma === turmaSelecionada && n.turno === "Manhã")?.media.toFixed(1) || "-"}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-xs text-blue-700 uppercase font-semibold mb-1">Frequência</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {mockRankingTurmas.find(t => t.turma === turmaSelecionada)?.frequencia || "-"}%
                      </div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 text-center">
                      <div className="text-xs text-amber-700 uppercase font-semibold mb-1">Posição</div>
                      <div className="text-2xl font-bold text-amber-700">
                        {mockRankingTurmas.findIndex(t => t.turma === turmaSelecionada) + 1}º
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Lista de alunos */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Alunos</h3>
                  <div className="relative">
                    <input
                      type="text"
                      className="pl-9 pr-4 py-2 border rounded-lg"
                      placeholder="Buscar aluno..."
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700">
                        <th className="py-2">Nome</th>
                        <th>Turma</th>
                        <th>Média</th>
                        <th>Frequência</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAlunos
                        .filter(aluno => !turmaSelecionada || aluno.turma === turmaSelecionada)
                        .map(aluno => (
                        <tr key={aluno.id} className="border-b last:border-b-0">
                          <td className="py-2 font-medium">{aluno.nome}</td>
                          <td>{aluno.turma}</td>
                          <td>
                            <span className={`font-medium ${
                              aluno.media < 6.0 ? 'text-red-600' : 
                              aluno.media < 7.0 ? 'text-amber-600' : 
                              'text-green-600'
                            }`}>
                              {aluno.media.toFixed(1)}
                            </span>
                          </td>
                          <td>{aluno.frequencia}%</td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              aluno.status === 'Regular' ? 'bg-green-100 text-green-700' : 
                              aluno.status === 'Atenção' ? 'bg-amber-100 text-amber-700' : 
                              'bg-red-100 text-red-700'
                            }`}>
                              {aluno.status}
                            </span>
                          </td>
                          <td className="space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                              onClick={() => toast.success(`Perfil de ${aluno.nome} aberto`)}
                            >
                              Perfil
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => toast.success(`Mensagem enviada para os responsáveis de ${aluno.nome}`)}
                            >
                              Contatar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Indicadores e estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-indigo-600" /> Alunos em Atenção
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-red-100 p-1 rounded mr-2 mt-0.5">
                        <BookOpen className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">3 alunos com notas abaixo da média</p>
                        <p className="text-xs text-gray-500">Reforço necessário: Matemática e Português</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5">
                        <UserX className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">2 alunos com excesso de faltas</p>
                        <p className="text-xs text-gray-500">Contato com responsáveis recomendado</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded mr-2 mt-0.5">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">5 alunos com pendências documentais</p>
                        <p className="text-xs text-gray-500">Prazo para regularização: 30/06/2024</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Relatório de alunos em atenção gerado")}
                    >
                      Gerar Relatório Detalhado
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" /> Evolução Acadêmica
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">Média Geral</span>
                        <span className="text-sm font-medium text-green-600">+5% em relação ao bimestre anterior</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "76%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">Frequência</span>
                        <span className="text-sm font-medium text-blue-600">+2% em relação ao bimestre anterior</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">Participação em Atividades</span>
                        <span className="text-sm font-medium text-amber-600">Estável</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Gráfico de evolução anual gerado")}
                    >
                      Ver Evolução Anual
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Seção de Eventos Acadêmicos */}
          {section === 'eventos' && (
            <motion.div
              key="eventos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Eventos Acadêmicos</h2>
                <Button className="flex gap-2" onClick={() => toast.success("Novo evento acadêmico adicionado")}>
                  <Plus className="w-5 h-5" /> Adicionar Evento
                </Button>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700">
                        <th className="py-2">Evento</th>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockEventosAcademicos.map(evento => (
                        <tr key={evento.id} className="border-b last:border-b-0">
                          <td className="py-2 font-medium">{evento.titulo}</td>
                          <td>{format(parseISO(evento.data), "dd/MM/yyyy")}</td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              evento.tipo === 'Reunião' ? 'bg-blue-100 text-blue-700' : 
                              evento.tipo === 'Avaliação' ? 'bg-purple-100 text-purple-700' : 
                              evento.tipo === 'Acadêmico' ? 'bg-green-100 text-green-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {evento.tipo}
                            </span>
                          </td>
                          <td className="space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                              onClick={() => toast.success(`Detalhes do evento: ${evento.titulo}`)}
                            >
                              Detalhes
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast.success(`Notificações enviadas para o evento: ${evento.titulo}`)}
                            >
                              Notificar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Calendário e detalhes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" /> Calendário Acadêmico
                  </h3>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center mb-4">
                    <h4 className="font-medium text-indigo-800">Junho 2024</h4>
                    <p className="text-sm text-indigo-600">Mês atual</p>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-indigo-700 mb-1">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                      const hasEvent = mockEventosAcademicos.some(e => 
                        parseInt(e.data.split('-')[2]) === day && 
                        parseInt(e.data.split('-')[1]) === 6
                      );
                      return (
                        <div 
                          key={day} 
                          className={`rounded-lg p-1 h-8 flex items-center justify-center border ${
                            hasEvent ? 'bg-indigo-100 border-indigo-300 font-medium' : 'bg-white border-gray-200'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Planejamento anual aberto")}
                    >
                      Ver Planejamento Anual
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" /> Próximos Passos
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-red-100 p-1 rounded mr-2 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Preparar materiais para reunião pedagógica</p>
                        <p className="text-xs text-gray-500">Prazo: 09/06/2024</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5">
                        <FileText className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Revisar resultados para conselho de classe</p>
                        <p className="text-xs text-gray-500">Prazo: 14/06/2024</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 p-1 rounded mr-2 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Organizar treinamento para Olimpíada</p>
                        <p className="text-xs text-gray-500">Em andamento</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Lista de tarefas aberta")}
                    >
                      Ver Todas as Tarefas
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Seção de Relatórios Acadêmicos */}
          {section === 'relatorios' && (
            <motion.div
              key="relatorios"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Relatórios Acadêmicos</h2>
                <div className="flex gap-2">
                  <Button className="flex gap-2" onClick={() => toast.success("Relatório exportado como PDF")}>
                    <Download className="w-5 h-5" /> PDF
                  </Button>
                  <Button className="flex gap-2" onClick={() => toast.success("Relatório exportado como CSV")}>
                    <FileText className="w-5 h-5" /> CSV
                  </Button>
                </div>
              </div>
              
              {/* Filtros de relatório */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-indigo-700 mb-4">Filtros do Relatório</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option value="">Todas as turmas</option>
                      {TURMAS.map(turma => (
                        <option key={turma} value={turma}>{turma}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option value="">Todas as disciplinas</option>
                      <option>Matemática</option>
                      <option>Português</option>
                      <option>História</option>
                      <option>Geografia</option>
                      <option>Ciências</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option value="">Todos os períodos</option>
                      <option>1º Bimestre</option>
                      <option>2º Bimestre</option>
                      <option>3º Bimestre</option>
                      <option>4º Bimestre</option>
                      <option>Ano Letivo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option>Notas e Frequência</option>
                      <option>Desempenho por Disciplina</option>
                      <option>Evolução do Aluno</option>
                      <option>Comparativo entre Turmas</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => toast.success("Relatório gerado com os filtros selecionados")}>
                    Gerar Relatório
                  </Button>
                </div>
              </div>
              
              {/* Tabela de dados */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-indigo-700 mb-4">Relatório de Notas e Frequência</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b">
                        <th className="py-3 px-2">Aluno</th>
                        <th className="py-3 px-2">Turma</th>
                        <th className="py-3 px-2">Disciplina</th>
                        <th className="py-3 px-2">Período</th>
                        <th className="py-3 px-2">Nota</th>
                        <th className="py-3 px-2">Faltas</th>
                        <th className="py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { aluno: "Lucas Silva", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.5, faltas: 2, status: "Regular" },
                        { aluno: "Ana Souza", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.2, faltas: 0, status: "Regular" },
                        { aluno: "Pedro Lima", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.1, faltas: 1, status: "Atenção" },
                        { aluno: "Carla Mendes", turma: "2A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 5.8, faltas: 3, status: "Recuperação" },
                        { aluno: "Rafael Costa", turma: "2B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.2, faltas: 1, status: "Regular" },
                        { aluno: "Julia Ferreira", turma: "3A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.5, faltas: 0, status: "Regular" },
                        { aluno: "Bruno Santos", turma: "3B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.8, faltas: 2, status: "Regular" },
                      ].map((item, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-indigo-50">
                          <td className="py-3 px-2 font-medium">{item.aluno}</td>
                          <td className="py-3 px-2">{item.turma}</td>
                          <td className="py-3 px-2">{item.disciplina}</td>
                          <td className="py-3 px-2">{item.periodo}</td>
                          <td className="py-3 px-2">
                            <span className={`font-medium ${
                              item.nota < 6.0 ? 'text-red-600' : 
                              item.nota < 7.0 ? 'text-amber-600' : 
                              'text-green-600'
                            }`}>
                              {item.nota.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-3 px-2">{item.faltas}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.status === 'Regular' ? 'bg-green-100 text-green-700' : 
                              item.status === 'Atenção' ? 'bg-amber-100 text-amber-700' : 
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">Mostrando 7 de 320 resultados</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Anterior</Button>
                    <Button variant="outline" size="sm" className="px-3 bg-indigo-50">1</Button>
                    <Button variant="outline" size="sm" className="px-3">2</Button>
                    <Button variant="outline" size="sm" className="px-3">3</Button>
                    <Button variant="outline" size="sm">Próximo</Button>
                  </div>
                </div>
              </div>
              
              {/* Gráficos e estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-indigo-600" /> Desempenho por Disciplina
                  </h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { disciplina: "Mat", media: 7.4 },
                        { disciplina: "Port", media: 7.9 },
                        { disciplina: "Hist", media: 7.6 },
                        { disciplina: "Geo", media: 8.1 },
                        { disciplina: "Ciên", media: 8.2 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="disciplina" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="media" fill="#6366f1" radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Relatório detalhado de desempenho por disciplina gerado")}
                    >
                      Ver Relatório Detalhado
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" /> Relatórios Pré-configurados
                  </h3>
                  
                  <div className="space-y-3">
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Relatório de alunos em recuperação gerado")}
                    >
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                        <span>Alunos em Recuperação</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Relatório de frequência baixa gerado")}
                    >
                      <div className="flex items-center">
                        <UserX className="w-5 h-5 text-amber-500 mr-3" />
                        <span>Frequência Baixa</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Boletim bimestral gerado")}
                    >
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-green-500 mr-3" />
                        <span>Boletim Bimestral</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Relatório comparativo entre turmas gerado")}
                    >
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-blue-500 mr-3" />
                        <span>Comparativo entre Turmas</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Estatísticas gerais geradas")}
                    >
                      <div className="flex items-center">
                        <BarChart2 className="w-5 h-5 text-purple-500 mr-3" />
                        <span>Estatísticas Gerais</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Seção de Comunicação */}
          {section === 'comunicacao' && (
            <motion.div
              key="comunicacao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Comunicação Escolar</h2>
                <Button className="flex gap-2" onClick={() => toast.success("Nova mensagem enviada")}>
                  <MessageCircle className="w-5 h-5" /> Nova Mensagem
                </Button>
              </div>
              
              {/* Painel de comunicação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-1 bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" /> Destinatários
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="font-medium text-sm text-gray-700 mb-2">Grupos</div>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Todos os professores
                      </label>
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Professores do 1º ano
                      </label>
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Professores do 2º ano
                      </label>
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Professores do 3º ano
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="font-medium text-sm text-gray-700 mb-2">Responsáveis</div>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Todos os responsáveis
                      </label>
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Responsáveis do 1º ano
                      </label>
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Responsáveis do 2º ano
                      </label>
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Responsáveis do 3º ano
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium text-sm text-gray-700 mb-2">Direção</div>
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Diretor(a)
                      </label>
                      <label className="flex items-center gap-2 hover:bg-indigo-50 p-2 rounded-lg cursor-pointer text-sm">
                        <input type="checkbox" className="rounded text-indigo-600" /> Secretaria
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-indigo-600" /> Composição da Mensagem
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                      <input 
                        type="text" 
                        className="w-full border rounded-lg px-3 py-2" 
                        placeholder="Digite o assunto da mensagem..." 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                      <textarea 
                        className="w-full border rounded-lg px-3 py-2 min-h-[150px]" 
                        placeholder="Digite sua mensagem aqui..." 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Anexos</label>
                      <div className="border border-dashed rounded-lg p-4 text-center">
                        <input 
                          type="file" 
                          className="hidden" 
                          id="file-upload" 
                        />
                        <label 
                          htmlFor="file-upload" 
                          className="cursor-pointer flex flex-col items-center justify-center text-gray-500"
                        >
                          <Upload className="h-8 w-8 mb-2 text-indigo-400" />
                          <span>Clique para enviar ou arraste arquivos aqui</span>
                          <span className="text-xs mt-1">PDF, DOC, JPEG, PNG (Máx 10MB)</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline">Salvar Rascunho</Button>
                      <Button onClick={() => toast.success("Mensagem enviada com sucesso!")}>Enviar Mensagem</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Histórico de comunicações */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Comunicações</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700">
                        <th className="py-2">Data/Hora</th>
                        <th>Assunto</th>
                        <th>Destinatários</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1, data: "05/06/2024 14:30", assunto: "Reunião Pedagógica", destinatarios: "Professores", status: "Enviada", leituras: 18 },
                        { id: 2, data: "02/06/2024 09:15", assunto: "Resultados do Bimestre", destinatarios: "Professores, Direção", status: "Enviada", leituras: 24 },
                        { id: 3, data: "01/06/2024 16:45", assunto: "Evento Cultural", destinatarios: "Todos", status: "Enviada", leituras: 156 },
                        { id: 4, data: "28/05/2024 11:20", assunto: "Orientações para Avaliações", destinatarios: "Professores", status: "Enviada", leituras: 20 },
                      ].map(msg => (
                        <tr key={msg.id} className="border-b last:border-b-0">
                          <td className="py-2">{msg.data}</td>
                          <td className="font-medium">{msg.assunto}</td>
                          <td>{msg.destinatarios}</td>
                          <td>
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                              {msg.status} • {msg.leituras} leituras
                            </span>
                          </td>
                          <td>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                              onClick={() => toast.success(`Visualizando mensagem: ${msg.assunto}`)}
                            >
                              Ver
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Seção de Acompanhamento Pedagógico */}
          {section === 'acompanhamento' && (
            <motion.div
              key="acompanhamento"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Acompanhamento Pedagógico</h2>
                <div className="flex gap-2">
                  <Button className="flex gap-2" onClick={() => toast.success("Planejamento pedagógico exportado")}>
                    <FileText className="w-5 h-5" /> Exportar Planejamento
                  </Button>
                </div>
              </div>
              
              {/* Planejamento pedagógico */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-indigo-700 mb-4">Planejamento de Aulas e Projetos</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-indigo-700 border-b">
                          <th className="py-3 px-2">Professor</th>
                          <th className="py-3 px-2">Disciplina</th>
                          <th className="py-3 px-2">Turma</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2">Data Limite</th>
                          <th className="py-3 px-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 1, professor: "João Souza", disciplina: "Matemática", turma: "1A", status: "Pendente", dataLimite: "15/06/2024" },
                          { id: 2, professor: "Ana Lima", disciplina: "Português", turma: "1A", status: "Aprovado", dataLimite: "10/06/2024" },
                          { id: 3, professor: "Carlos Oliveira", disciplina: "História", turma: "2A", status: "Em revisão", dataLimite: "12/06/2024" },
                          { id: 4, professor: "Mariana Costa", disciplina: "Geografia", turma: "2B", status: "Pendente", dataLimite: "18/06/2024" },
                          { id: 5, professor: "Roberto Santos", disciplina: "Ciências", turma: "3A", status: "Aprovado", dataLimite: "08/06/2024" },
                        ].map((plano, index) => (
                          <tr key={index} className="border-b last:border-b-0 hover:bg-indigo-50">
                            <td className="py-3 px-2 font-medium">{plano.professor}</td>
                            <td className="py-3 px-2">{plano.disciplina}</td>
                            <td className="py-3 px-2">{plano.turma}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                plano.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 
                                plano.status === 'Em revisão' ? 'bg-blue-100 text-blue-700' : 
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {plano.status}
                              </span>
                            </td>
                            <td className="py-3 px-2">{plano.dataLimite}</td>
                            <td className="py-3 px-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => toast.success(`Visualizando plano de ${plano.professor}`)}
                              >
                                Revisar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <h4 className="font-medium text-indigo-800 mb-3">Próximos passos</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">5 planos pendentes de revisão</p>
                          <p className="text-xs text-gray-500">Prazo final: 20/06/2024</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-blue-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Planejar reunião pedagógica</p>
                          <p className="text-xs text-gray-500">Data: 15/06/2024</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Feedback sobre projetos</p>
                          <p className="text-xs text-gray-500">Para: Equipe de professores</p>
                        </div>
                      </li>
                    </ul>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => toast.success("Criando novo plano de acompanhamento")}
                    >
                      Novo Plano
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Observações de aula */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" /> Observações de Aula
                  </h3>
                  <div className="overflow-y-auto max-h-80">
                    <ul className="space-y-3">
                      {[
                        { professor: "João Souza", turma: "1A", disciplina: "Matemática", data: "05/06/2024", status: "Realizada" },
                        { professor: "Ana Lima", turma: "1B", disciplina: "Português", data: "08/06/2024", status: "Agendada" },
                        { professor: "Carlos Oliveira", turma: "2A", disciplina: "História", data: "02/06/2024", status: "Realizada" },
                        { professor: "Mariana Costa", turma: "2B", disciplina: "Geografia", data: "10/06/2024", status: "Agendada" },
                      ].map((obs, idx) => (
                        <li key={idx} className="border rounded-lg p-3 hover:bg-indigo-50">
                          <div className="flex justify-between">
                            <div>
                              <span className="font-medium">{obs.professor}</span> - {obs.disciplina}
                              <div className="text-xs text-gray-500">Turma {obs.turma} • {obs.data}</div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs self-start ${
                              obs.status === 'Realizada' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {obs.status}
                            </span>
                          </div>
                          {obs.status === 'Realizada' && (
                            <div className="mt-2 flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs"
                                onClick={() => toast.success(`Visualizando relatório de ${obs.professor}`)}
                              >
                                Ver Relatório
                              </Button>
                              <Button 
                                size="sm" 
                                className="text-xs"
                                onClick={() => toast.success(`Enviando feedback para ${obs.professor}`)}
                              >
                                Enviar Feedback
                              </Button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Agendando nova observação de aula")}
                    >
                      Agendar Nova Observação
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" /> Desenvolvimento Docente
                  </h3>
                  <div className="overflow-y-auto max-h-80">
                    <ul className="space-y-3">
                      {[
                        { professor: "João Souza", tipo: "Capacitação", título: "Matemática para ENEM", status: "Em progresso", progresso: 60 },
                        { professor: "Ana Lima", tipo: "Projeto", título: "Oficinas de escrita criativa", status: "Concluído", progresso: 100 },
                        { professor: "Carlos Oliveira", tipo: "Capacitação", título: "História Contemporânea", status: "Não iniciado", progresso: 0 },
                        { professor: "Mariana Costa", tipo: "Projeto", título: "Mapeamento geográfico", status: "Em progresso", progresso: 40 },
                      ].map((dev, idx) => (
                        <li key={idx} className="border rounded-lg p-3 hover:bg-indigo-50">
                          <div className="flex justify-between mb-2">
                            <div>
                              <span className="font-medium">{dev.professor}</span>
                              <div className="text-xs text-gray-500">{dev.tipo}: {dev.título}</div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs self-start ${
                              dev.status === 'Concluído' ? 'bg-green-100 text-green-700' : 
                              dev.status === 'Em progresso' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {dev.status}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full ${
                                dev.status === 'Concluído' ? 'bg-green-500' : 
                                dev.status === 'Em progresso' ? 'bg-blue-500' : 
                                'bg-amber-500'
                              }`}
                              style={{ width: `${dev.progresso}%` }}
                            />
                          </div>
                          <div className="text-xs text-right text-gray-500">{dev.progresso}% concluído</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Criando novo plano de desenvolvimento")}
                    >
                      Novo Plano de Desenvolvimento
                    </Button>
                  </div>
                </motion.div>
              </div>
              
              {/* Projetos interdisciplinares */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" /> Projetos Interdisciplinares
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b">
                        <th className="py-3 px-2">Projeto</th>
                        <th className="py-3 px-2">Coordenador</th>
                        <th className="py-3 px-2">Disciplinas</th>
                        <th className="py-3 px-2">Turmas</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { nome: "Feira de Ciências", coordenador: "Roberto Santos", disciplinas: ["Ciências", "Matemática"], turmas: ["1A", "1B", "2A"], status: "Em andamento" },
                        { nome: "Clube de Leitura", coordenador: "Ana Lima", disciplinas: ["Português", "História"], turmas: ["2A", "2B", "3A"], status: "Planejamento" },
                        { nome: "Olimpíada de Matemática", coordenador: "João Souza", disciplinas: ["Matemática"], turmas: ["1A", "1B", "2A", "2B", "3A", "3B"], status: "Em andamento" },
                        { nome: "Projeto Sustentabilidade", coordenador: "Mariana Costa", disciplinas: ["Geografia", "Ciências"], turmas: ["3A", "3B"], status: "Concluído" },
                      ].map((projeto, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-indigo-50">
                          <td className="py-3 px-2 font-medium">{projeto.nome}</td>
                          <td className="py-3 px-2">{projeto.coordenador}</td>
                          <td className="py-3 px-2">{projeto.disciplinas.join(", ")}</td>
                          <td className="py-3 px-2">{projeto.turmas.join(", ")}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              projeto.status === 'Concluído' ? 'bg-green-100 text-green-700' : 
                              projeto.status === 'Em andamento' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {projeto.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast.success(`Visualizando projeto ${projeto.nome}`)}
                            >
                              Detalhes
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => toast.success(`Gerenciando projeto ${projeto.nome}`)}
                            >
                              Gerenciar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button 
                    className="flex gap-2"
                    onClick={() => toast.success("Criando novo projeto interdisciplinar")}
                  >
                    <Plus className="w-5 h-5" /> Novo Projeto
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Seção de Ranking Acadêmico */}
          {section === 'ranking' && (
            <motion.div
              key="ranking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Ranking Acadêmico</h2>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-3 py-2 text-sm"
                    defaultValue="atual"
                  >
                    <option value="atual">Bimestre Atual</option>
                    <option value="anterior">Bimestre Anterior</option>
                    <option value="anual">Anual</option>
                  </select>
                  <Button className="flex gap-2" onClick={() => toast.success("Relatório do ranking gerado")}>
                    <FileText className="w-5 h-5" /> Exportar
                  </Button>
                </div>
              </div>
              
              {/* Classificação das turmas */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Classificação das Turmas</h3>
                
                <div className="space-y-4">
                  {mockRankingTurmas
                    .sort((a, b) => b.media - a.media)
                    .map((turma, index) => (
                    <div 
                      key={turma.turma} 
                      className={`bg-gradient-to-r ${
                        index === 0 ? 'from-amber-50 to-amber-100 border-amber-200' : 
                        index === 1 ? 'from-gray-50 to-gray-100 border-gray-200' : 
                        index === 2 ? 'from-orange-50 to-orange-100 border-orange-200' : 
                        'from-white to-indigo-50 border-indigo-100'
                      } rounded-lg p-4 border`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-amber-500' : 
                          index === 1 ? 'bg-gray-500' : 
                          index === 2 ? 'bg-orange-600' : 
                          'bg-indigo-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Turma {turma.turma}</h4>
                            <div className="flex gap-4">
                              <div className="text-sm">
                                <span className="text-gray-500">Média:</span> <span className="font-bold text-green-600">{turma.media.toFixed(1)}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Frequência:</span> <span className="font-bold text-blue-600">{turma.frequencia}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full ${
                                index === 0 ? 'bg-amber-500' : 
                                index === 1 ? 'bg-gray-500' : 
                                index === 2 ? 'bg-orange-600' : 
                                'bg-indigo-500'
                              }`} 
                              style={{ width: `${(turma.media / 10) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Estatísticas e melhores alunos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-600" /> Melhores Alunos
                  </h3>
                  <div className="space-y-4">
                    {[
                      { nome: "Ana Souza", turma: "1A", media: 9.8, foto: "👧" },
                      { nome: "Pedro Santos", turma: "3A", media: 9.7, foto: "👦" },
                      { nome: "Carolina Lima", turma: "2B", media: 9.5, foto: "👧" },
                      { nome: "Rafael Gomes", turma: "3B", media: 9.4, foto: "👦" },
                      { nome: "Julia Costa", turma: "1B", media: 9.3, foto: "👧" },
                    ].map((aluno, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-indigo-50 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg">
                            {aluno.foto}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{aluno.nome}</div>
                            <div className="text-xs text-gray-500">Turma {aluno.turma}</div>
                          </div>
                        </div>
                        <div className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-sm font-semibold">
                          {aluno.media.toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Relatório de desempenho de alunos gerado")}
                    >
                      Ver Todos os Alunos
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" /> Estatísticas do Bimestre
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-indigo-600 uppercase font-semibold mb-1">Média Geral</div>
                      <div className="text-2xl font-bold text-indigo-700">7.8</div>
                      <div className="text-xs text-green-600 mt-1">↑ 0.3 pts</div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-green-600 uppercase font-semibold mb-1">Aprovação</div>
                      <div className="text-2xl font-bold text-green-700">92%</div>
                      <div className="text-xs text-green-600 mt-1">↑ 4%</div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-blue-600 uppercase font-semibold mb-1">Frequência</div>
                      <div className="text-2xl font-bold text-blue-700">95%</div>
                      <div className="text-xs text-green-600 mt-1">↑ 2%</div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-amber-600 uppercase font-semibold mb-1">Participação</div>
                      <div className="text-2xl font-bold text-amber-700">87%</div>
                      <div className="text-xs text-green-600 mt-1">↑ 5%</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Matemática</div>
                      <div className="text-sm font-medium text-green-600">7.4</div>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "74%" }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm font-medium">Português</div>
                      <div className="text-sm font-medium text-green-600">7.9</div>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "79%" }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm font-medium">Ciências</div>
                      <div className="text-sm font-medium text-green-600">8.2</div>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Seção de Orientação Educacional */}
          {section === 'orientacao' && (
            <motion.div
              key="orientacao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Orientação Educacional</h2>
                <div className="flex gap-2">
                  <Button className="flex gap-2" onClick={() => toast.success("Relatório de acompanhamento gerado")}>
                    <FileText className="w-5 h-5" /> Relatório de Acompanhamento
                  </Button>
                </div>
              </div>
              
              {/* Lista de estudantes em acompanhamento */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-indigo-700">Alunos em Acompanhamento Especial</h3>
                  <div className="flex items-center gap-2">
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todas as turmas</option>
                      {TURMAS.map(turma => (
                        <option key={turma} value={turma}>{turma}</option>
                      ))}
                    </select>
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todos os tipos</option>
                      <option value="aprendizagem">Dificuldade de Aprendizagem</option>
                      <option value="adaptacao">Adaptação Curricular</option>
                      <option value="comportamental">Acompanhamento Comportamental</option>
                      <option value="especial">Necessidades Especiais</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b">
                        <th className="py-3 px-2">Aluno</th>
                        <th className="py-3 px-2">Turma</th>
                        <th className="py-3 px-2">Tipo</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Última Atualização</th>
                        <th className="py-3 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { nome: "Rafael Souza", turma: "1A", tipo: "Dificuldade de Aprendizagem", status: "Em andamento", data: "05/06/2024" },
                        { nome: "Camila Pereira", turma: "2B", tipo: "Adaptação Curricular", status: "Em andamento", data: "02/06/2024" },
                        { nome: "Lucas Mendes", turma: "1B", tipo: "Acompanhamento Comportamental", status: "Finalizado", data: "20/05/2024" },
                        { nome: "Juliana Costa", turma: "3A", tipo: "Necessidades Especiais", status: "Em andamento", data: "01/06/2024" },
                        { nome: "Pedro Almeida", turma: "2A", tipo: "Dificuldade de Aprendizagem", status: "Aguardando", data: "07/06/2024" },
                      ].map((aluno, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-indigo-50">
                          <td className="py-3 px-2 font-medium">{aluno.nome}</td>
                          <td className="py-3 px-2">{aluno.turma}</td>
                          <td className="py-3 px-2">{aluno.tipo}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              aluno.status === 'Finalizado' ? 'bg-green-100 text-green-700' : 
                              aluno.status === 'Em andamento' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {aluno.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">{aluno.data}</td>
                          <td className="py-3 px-2 space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast.success(`Visualizando histórico de ${aluno.nome}`)}
                            >
                              Histórico
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => toast.success(`Agendando sessão com ${aluno.nome}`)}
                            >
                              Agendar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">Exibindo 5 de 12 alunos</div>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => toast.success("Adicionando novo aluno para acompanhamento")}
                  >
                    <Plus className="w-4 h-4" /> Adicionar Aluno
                  </Button>
                </div>
              </div>
              
              {/* Sessões agendadas e recursos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" /> Sessões Agendadas
                  </h3>
                  <div className="overflow-y-auto max-h-80">
                    <ul className="space-y-3">
                      {[
                        { aluno: "Rafael Souza", turma: "1A", tipo: "Individual", data: "08/06/2024", hora: "10:00", status: "Confirmada" },
                        { aluno: "Juliana Costa", turma: "3A", tipo: "Com Pais", data: "09/06/2024", hora: "14:30", status: "Pendente" },
                        { aluno: "Camila Pereira", turma: "2B", tipo: "Com Professor", data: "10/06/2024", hora: "11:15", status: "Confirmada" },
                        { aluno: "Pedro Almeida", turma: "2A", tipo: "Individual", data: "12/06/2024", hora: "09:00", status: "Confirmada" },
                      ].map((sessao, idx) => (
                        <li key={idx} className="border rounded-lg p-3 hover:bg-indigo-50">
                          <div className="flex justify-between">
                            <div>
                              <span className="font-medium">{sessao.aluno}</span> - {sessao.turma}
                              <div className="text-xs text-gray-500">
                                {sessao.data} às {sessao.hora} • Sessão {sessao.tipo}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs self-start ${
                              sessao.status === 'Confirmada' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {sessao.status}
                            </span>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => toast.success(`Visualizando detalhes da sessão com ${sessao.aluno}`)}
                            >
                              Detalhes
                            </Button>
                            <Button 
                              size="sm" 
                              className="text-xs"
                              onClick={() => toast.success(sessao.status === 'Confirmada' ? `Reagendando sessão com ${sessao.aluno}` : `Confirmando sessão com ${sessao.aluno}`)}
                            >
                              {sessao.status === 'Confirmada' ? 'Reagendar' : 'Confirmar'}
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Agendando nova sessão de orientação")}
                    >
                      Agendar Nova Sessão
                    </Button>
                  </div>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" /> Recursos e Materiais
                  </h3>
                  <div className="overflow-y-auto max-h-80">
                    <ul className="space-y-3">
                      {[
                        { tipo: "Documento", titulo: "Guia de Adaptação Curricular", categoria: "Adaptação", data: "01/05/2024" },
                        { tipo: "Planilha", titulo: "Modelo de Acompanhamento Individual", categoria: "Monitoramento", data: "10/05/2024" },
                        { tipo: "Apresentação", titulo: "Técnicas de Intervenção Comportamental", categoria: "Comportamento", data: "15/05/2024" },
                        { tipo: "PDF", titulo: "Manual de Atendimento Educacional Especializado", categoria: "AEE", data: "20/05/2024" },
                        { tipo: "Vídeo", titulo: "Treinamento: Estratégias de Ensino Inclusivo", categoria: "Inclusão", data: "25/05/2024" },
                      ].map((recurso, idx) => (
                        <li key={idx} className="border rounded-lg p-3 hover:bg-indigo-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{recurso.titulo}</span>
                              <div className="text-xs text-gray-500">
                                {recurso.categoria} • Adicionado em {recurso.data}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              recurso.tipo === 'Documento' ? 'bg-blue-100 text-blue-700' : 
                              recurso.tipo === 'Planilha' ? 'bg-green-100 text-green-700' : 
                              recurso.tipo === 'Apresentação' ? 'bg-amber-100 text-amber-700' : 
                              recurso.tipo === 'PDF' ? 'bg-red-100 text-red-700' : 
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {recurso.tipo}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => toast.success(`Visualizando recurso: ${recurso.titulo}`)}
                            >
                              Visualizar
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full"
                      onClick={() => toast.success("Adicionando novo recurso")}
                    >
                      Adicionar Novo Recurso
                    </Button>
                  </div>
                </motion.div>
              </div>
              
              {/* Estatísticas de acompanhamento */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" /> Estatísticas de Acompanhamento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-indigo-600 uppercase font-semibold mb-1">Total de Alunos</div>
                    <div className="text-2xl font-bold text-indigo-700">12</div>
                    <div className="text-xs text-green-600 mt-1">+2 este mês</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-green-600 uppercase font-semibold mb-1">Intervenções Bem-sucedidas</div>
                    <div className="text-2xl font-bold text-green-700">75%</div>
                    <div className="text-xs text-green-600 mt-1">+5% vs. bimestre anterior</div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-amber-600 uppercase font-semibold mb-1">Acompanhamentos Ativos</div>
                    <div className="text-2xl font-bold text-amber-700">8</div>
                    <div className="text-xs text-amber-600 mt-1">3 novos este mês</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Distribuição por Tipo</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Dificuldade de Aprendizagem</span>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Adaptação Curricular</span>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Acompanhamento Comportamental</span>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Necessidades Especiais</span>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Próximos Passos</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="bg-indigo-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                          <FileText className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Preparar relatório bimestral</p>
                          <p className="text-xs text-gray-500">Prazo: 30/06/2024</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                          <Users className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Reunião com equipe de apoio</p>
                          <p className="text-xs text-gray-500">Data: 15/06/2024</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-100 p-1 rounded mr-2 mt-0.5 flex-shrink-0">
                          <BookOpen className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Revisar planos de intervenção</p>
                          <p className="text-xs text-gray-500">5 planos pendentes</p>
                        </div>
                      </li>
                    </ul>
                    <Button className="w-full mt-4" onClick={() => toast.success("Criando novo plano de ação")}>
                      Novo Plano de Ação
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Seção de Material Didático */}
          {section === 'material' && (
            <motion.div
              key="material"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-700">Materiais Didáticos</h2>
                <div className="flex gap-2">
                  <Button className="flex gap-2" onClick={() => toast.success("Repositório de materiais aberto")}>
                    <BookOpen className="w-5 h-5" /> Repositório
                  </Button>
                  <Button className="flex gap-2" onClick={() => toast.success("Guia de padronização aberto")}>
                    <FileText className="w-5 h-5" /> Guia de Padronização
                  </Button>
                </div>
              </div>
              
              {/* Materiais pendentes de revisão */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-indigo-700 mb-4">Materiais Pendentes de Revisão</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todos os professores</option>
                      {["João Souza", "Ana Lima", "Carlos Oliveira", "Mariana Costa", "Roberto Santos"].map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todas as disciplinas</option>
                      {["Matemática", "Português", "História", "Geografia", "Ciências"].map(disc => (
                        <option key={disc} value={disc}>{disc}</option>
                      ))}
                    </select>
                    <select className="border rounded px-2 py-1 text-sm">
                      <option value="">Todos os tipos</option>
                      <option value="avaliacao">Avaliação</option>
                      <option value="apostila">Apostila</option>
                      <option value="slides">Slides</option>
                      <option value="exercicios">Exercícios</option>
                      <option value="projeto">Projeto</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">12</span> materiais pendentes
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b">
                        <th className="py-3 px-2">Material</th>
                        <th className="py-3 px-2">Professor</th>
                        <th className="py-3 px-2">Disciplina</th>
                        <th className="py-3 px-2">Turma</th>
                        <th className="py-3 px-2">Data</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1, titulo: "Avaliação Bimestral", tipo: "Avaliação", professor: "João Souza", disciplina: "Matemática", turma: "1A", data: "05/06/2024", status: "Pendente" },
                        { id: 2, titulo: "Apostila de Interpretação", tipo: "Apostila", professor: "Ana Lima", disciplina: "Português", turma: "1B", data: "04/06/2024", status: "Pendente" },
                        { id: 3, titulo: "Slides Revolução Francesa", tipo: "Slides", professor: "Carlos Oliveira", disciplina: "História", turma: "2A", data: "03/06/2024", status: "Em revisão" },
                        { id: 4, titulo: "Exercícios de Frações", tipo: "Exercícios", professor: "João Souza", disciplina: "Matemática", turma: "1B", data: "02/06/2024", status: "Em revisão" },
                        { id: 5, titulo: "Projeto Ecossistemas", tipo: "Projeto", professor: "Roberto Santos", disciplina: "Ciências", turma: "3A", data: "01/06/2024", status: "Pendente" },
                      ].map((material, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-indigo-50">
                          <td className="py-3 px-2">
                            <div className="font-medium">{material.titulo}</div>
                            <div className="text-xs text-gray-500">{material.tipo}</div>
                          </td>
                          <td className="py-3 px-2">{material.professor}</td>
                          <td className="py-3 px-2">{material.disciplina}</td>
                          <td className="py-3 px-2">{material.turma}</td>
                          <td className="py-3 px-2">{material.data}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              material.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 
                              material.status === 'Em revisão' ? 'bg-blue-100 text-blue-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {material.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast.success(`Visualizando material: ${material.titulo}`)}
                            >
                              Ver
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => toast.success(`Revisando material: ${material.titulo}`)}
                            >
                              Revisar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">Mostrando 5 de 12 materiais</div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Anterior
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-indigo-50"
                    >
                      1
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      2
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      3
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Estatísticas e ações rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-indigo-600" /> Estatísticas
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Aprovados</span>
                        <span className="text-sm font-medium text-green-600">45 (65%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Em revisão</span>
                        <span className="text-sm font-medium text-blue-600">12 (17%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "17%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Pendentes</span>
                        <span className="text-sm font-medium text-amber-600">12 (17%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "17%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Rejeitados</span>
                        <span className="text-sm font-medium text-red-600">1 (1%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: "1%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6"
                    onClick={() => toast.success("Gerando relatório detalhado de materiais")}
                  >
                    Gerar Relatório
                  </Button>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" /> Atividade Recente
                  </h3>
                  
                  <ul className="space-y-3">
                    {[
                      { acao: "Apostila aprovada", usuario: "Maria Silva", material: "Leitura avançada - Português", tempo: "15 minutos atrás" },
                      { acao: "Avaliação revisada", usuario: "Maria Silva", material: "Avaliação Bimestral - Matemática", tempo: "1 hora atrás" },
                      { acao: "Projeto aprovado", usuario: "Maria Silva", material: "Projeto Biomas - Ciências", tempo: "3 horas atrás" },
                      { acao: "Exercícios rejeitados", usuario: "Maria Silva", material: "Lista de Verbos - Português", tempo: "Ontem às 15:30" },
                    ].map((atividade, idx) => (
                      <li key={idx} className="text-sm border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="font-medium">{atividade.acao}</div>
                        <div className="text-gray-500">{atividade.material}</div>
                        <div className="text-xs text-indigo-600 mt-1">{atividade.tempo}</div>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => toast.success("Visualizando histórico completo de atividades")}
                  >
                    Ver Histórico Completo
                  </Button>
                </motion.div>
                
                <motion.div 
                  custom={2} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" /> Ações Rápidas
                  </h3>
                  
                  <div className="space-y-3">
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Criando modelo de avaliação")}
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-indigo-500 mr-3" />
                        <span>Criar Modelo</span>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Enviando alertas de pendências")}
                    >
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-3" />
                        <span>Notificar Pendências</span>
                      </div>
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Visualizando biblioteca de recursos")}
                    >
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-green-500 mr-3" />
                        <span>Biblioteca de Recursos</span>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50 transition-colors"
                      onClick={() => toast.success("Programando revisões em lote")}
                    >
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                        <span>Programar Revisões</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              </div>
              
              {/* Biblioteca de modelos */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-indigo-700 mb-4">Biblioteca de Modelos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { titulo: "Modelo de Avaliação", tipo: "Avaliação", disciplina: "Geral", downloads: 45 },
                    { titulo: "Template de Apostila", tipo: "Apostila", disciplina: "Geral", downloads: 38 },
                    { titulo: "Apresentação Padrão", tipo: "Slides", disciplina: "Geral", downloads: 52 },
                    { titulo: "Projeto Interdisciplinar", tipo: "Projeto", disciplina: "Múltiplas", downloads: 27 },
                    { titulo: "Ficha de Exercícios", tipo: "Exercícios", disciplina: "Geral", downloads: 63 },
                    { titulo: "Roteiro de Aula Prática", tipo: "Roteiro", disciplina: "Ciências", downloads: 31 },
                    { titulo: "Guia de Redação", tipo: "Guia", disciplina: "Português", downloads: 42 },
                    { titulo: "Kit Matemática Básica", tipo: "Kit", disciplina: "Matemática", downloads: 36 },
                  ].map((modelo, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 hover:bg-indigo-50 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => toast.success(`Abrindo modelo: ${modelo.titulo}`)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          modelo.tipo === 'Avaliação' ? 'bg-red-100 text-red-700' : 
                          modelo.tipo === 'Apostila' ? 'bg-blue-100 text-blue-700' : 
                          modelo.tipo === 'Slides' ? 'bg-amber-100 text-amber-700' : 
                          modelo.tipo === 'Projeto' ? 'bg-green-100 text-green-700' : 
                          modelo.tipo === 'Exercícios' ? 'bg-purple-100 text-purple-700' : 
                          modelo.tipo === 'Roteiro' ? 'bg-indigo-100 text-indigo-700' : 
                          modelo.tipo === 'Guia' ? 'bg-cyan-100 text-cyan-700' : 
                          'bg-pink-100 text-pink-700'
                        }`}>
                          {modelo.tipo}
                        </span>
                        <FileText className="h-5 w-5 text-indigo-400" />
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">{modelo.titulo}</h4>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{modelo.disciplina}</span>
                        <span className="text-indigo-600">{modelo.downloads} downloads</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => toast.success("Adicionando novo modelo")}
                  >
                    <Plus className="w-5 h-5" /> Adicionar Novo Modelo
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 
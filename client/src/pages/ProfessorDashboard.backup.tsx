import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, Users, BookOpen, Calendar, FileText, MessageCircle, BookOpenCheck, Edit3, 
  CheckSquare, User, ClipboardList, BarChart, Clock, TrendingUp, Info, Download, Save, 
  MessageSquare, Filter, ListChecks, PlusCircle, X, CheckCircle, Edit2, Upload, Calculator, 
  PieChart, AlertCircle, Bookmark, RefreshCw, Check, Edit, FilePlus 
} from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { toast } from "react-hot-toast";
import { format, parseISO, addDays } from "date-fns";
import { useLocation } from "wouter";

// Mock de turmas do professor
const mockTurmas = [
  { id: 1, nome: "1A", turno: "Manhã", alunos: 28, disciplina: "Matemática" },
  { id: 2, nome: "1B", turno: "Tarde", alunos: 26, disciplina: "Matemática" },
  { id: 3, nome: "2A", turno: "Manhã", alunos: 30, disciplina: "Matemática" },
];

// Mock de alunos por turma
const mockAlunos = {
  "1A": [
    { id: 1, nome: "Ana Silva", media: 8.5, faltas: 2, ultimaNota: 9.0 },
    { id: 2, nome: "Bruno Costa", media: 6.8, faltas: 4, ultimaNota: 7.0 },
    { id: 3, nome: "Carla Mendes", media: 9.2, faltas: 0, ultimaNota: 9.5 },
    { id: 4, nome: "Diego Santos", media: 7.5, faltas: 3, ultimaNota: 8.0 },
    { id: 5, nome: "Elena Oliveira", media: 5.8, faltas: 6, ultimaNota: 6.0 },
  ],
  "1B": [
    { id: 6, nome: "Fábio Lima", media: 7.0, faltas: 3, ultimaNota: 7.5 },
    { id: 7, nome: "Gabriela Rocha", media: 8.7, faltas: 1, ultimaNota: 9.0 },
    { id: 8, nome: "Henrique Alves", media: 6.5, faltas: 5, ultimaNota: 7.0 },
  ],
  "2A": [
    { id: 9, nome: "Isabela Martins", media: 9.0, faltas: 1, ultimaNota: 9.5 },
    { id: 10, nome: "João Pereira", media: 7.8, faltas: 2, ultimaNota: 8.0 },
  ]
};

// Mock de atividades e avaliações
const mockAtividades = [
  { id: 1, turma: "1A", tipo: "Prova", titulo: "Avaliação Bimestral", dataEntrega: "2024-06-20", status: "Pendente" },
  { id: 2, turma: "1B", tipo: "Trabalho", titulo: "Projeto de Pesquisa", dataEntrega: "2024-06-25", status: "Publicado" },
  { id: 3, turma: "2A", tipo: "Exercício", titulo: "Lista de Exercícios", dataEntrega: "2024-06-15", status: "Corrigido" },
  { id: 4, turma: "1A", tipo: "Prova", titulo: "Recuperação", dataEntrega: "2024-06-30", status: "Rascunho" },
];

// Mock de progresso dos alunos
const mockProgressoAlunos = [
  { mes: "Jan", media1A: 7.2, media1B: 7.0, media2A: 8.1 },
  { mes: "Fev", media1A: 7.5, media1B: 7.3, media2A: 8.0 },
  { mes: "Mar", media1A: 7.8, media1B: 7.6, media2A: 8.2 },
  { mes: "Abr", media1A: 8.0, media1B: 7.8, media2A: 8.4 },
  { mes: "Mai", media1A: 8.2, media1B: 7.9, media2A: 8.5 },
  { mes: "Jun", media1A: 8.3, media1B: 8.0, media2A: 8.7 },
];

// Mock de mensagens
const mockMensagens = [
  { id: 1, remetente: "Maria Silva (Coordenadora)", assunto: "Reunião Pedagógica", data: "2024-06-05", lida: true },
  { id: 2, remetente: "Sistema", assunto: "Prazo para lançamento de notas", data: "2024-06-10", lida: false },
  { id: 3, remetente: "Pai do aluno Bruno Costa", assunto: "Dúvida sobre nota", data: "2024-06-12", lida: false },
];

// Mock de horários do professor
const mockHorarios = [
  { dia: "Segunda", aulas: [
    { turma: "1A", horario: "07:30 - 08:20" },
    { turma: "1B", horario: "10:20 - 11:10" },
    { turma: "2A", horario: "13:30 - 14:20" }
  ]},
  { dia: "Terça", aulas: [
    { turma: "1A", horario: "08:20 - 09:10" },
    { turma: "2A", horario: "14:20 - 15:10" }
  ]},
  { dia: "Quarta", aulas: [
    { turma: "1B", horario: "10:20 - 11:10" }
  ]},
  { dia: "Quinta", aulas: [
    { turma: "1A", horario: "07:30 - 08:20" },
    { turma: "2A", horario: "13:30 - 14:20" }
  ]},
  { dia: "Sexta", aulas: [
    { turma: "1B", horario: "09:10 - 10:00" }
  ]}
];

// Mock de conteúdos programáticos
const mockConteudos = [
  { id: 1, turma: "1A", unidade: "Unidade 1", titulo: "Números Inteiros", status: "Concluído" },
  { id: 2, turma: "1A", unidade: "Unidade 2", titulo: "Frações", status: "Em andamento" },
  { id: 3, turma: "1A", unidade: "Unidade 3", titulo: "Equações de 1º grau", status: "Não iniciado" },
  { id: 4, turma: "1B", unidade: "Unidade 1", titulo: "Números Inteiros", status: "Concluído" },
  { id: 5, turma: "1B", unidade: "Unidade 2", titulo: "Frações", status: "Em andamento" },
  { id: 6, turma: "2A", unidade: "Unidade 1", titulo: "Geometria", status: "Concluído" },
  { id: 7, turma: "2A", unidade: "Unidade 2", titulo: "Álgebra", status: "Concluído" },
  { id: 8, turma: "2A", unidade: "Unidade 3", titulo: "Estatística", status: "Em andamento" },
];

// Cores para o gráfico de turmas
const TURMA_COLORS = { "1A": "#6366f1", "1B": "#f59e42", "2A": "#10b981" };

export default function ProfessorDashboard() {
  const [section, setSection] = useState("visao");
  const [turmaSelecionada, setTurmaSelecionada] = useState("1A");
  const [alunoSelecionado, setAlunoSelecionado] = useState<null | { 
    id: number;
    nome: string;
    media: number;
    faltas: number;
    ultimaNota: number;
  }>(null);
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null as null | typeof mockMensagens[0]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null as null | typeof mockAtividades[0]);
  const [, navigate] = useLocation();

  // Simulação de dados do usuário logado
  const user = {
    name: "João Souza",
    email: "professor@escola.com",
    role: "professor",
    disciplina: "Matemática"
  };
  
  // Verificação de segurança - redirecionar se não for professor
  useEffect(() => {
    // Em uma aplicação real, isso seria verificado com um token JWT ou sessão
    if (user.role !== "professor") {
      toast.error("Acesso não autorizado. Redirecionando...");
      navigate("/dashboard/coordenador");
    }
  }, [user.role, navigate]);

  // Animação de cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Sidebar animada - Com opções limitadas para professor */}
      <motion.aside 
        initial={{ x: -80, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 80 }} 
        className="w-64 bg-white shadow-xl flex flex-col py-8 px-4 min-h-screen"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Painel Professor</h2>
          <p className="text-sm text-gray-500">{user.name}</p>
          <p className="text-xs text-gray-400">{user.disciplina}</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'visao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('visao')}
          >
            <BarChart2 className="w-5 h-5" /> Visão Geral
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'turmas' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('turmas')}
          >
            <Users className="w-5 h-5" /> Minhas Turmas
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'atividades' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('atividades')}
          >
            <ClipboardList className="w-5 h-5" /> Atividades e Avaliações
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'notas' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('notas')}
          >
            <Edit3 className="w-5 h-5" /> Lançamento de Notas
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'frequencia' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('frequencia')}
          >
            <CheckSquare className="w-5 h-5" /> Controle de Frequência
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'conteudos' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('conteudos')}
          >
            <BookOpen className="w-5 h-5" /> Conteúdo Programático
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'horarios' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('horarios')}
          >
            <Clock className="w-5 h-5" /> Meus Horários
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'mensagens' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('mensagens')}
          >
            <MessageCircle className="w-5 h-5" /> Comunicações
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'relatorios' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('relatorios')}
          >
            <FileText className="w-5 h-5" /> Relatórios
          </button>
        </nav>
        <div className="mt-auto">
          <button 
            className="w-full flex items-center justify-center gap-2 mt-6 border border-gray-200 rounded-lg py-2 hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={() => {
              toast.success("Logout realizado com sucesso!");
              navigate("/login");
            }}
          >
            <User className="w-4 h-4" /> Meu Perfil
          </button>
        </div>
      </motion.aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 max-w-screen-2xl mx-auto">
        {/* Visão Geral */}
        {section === 'visao' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral</h1>
            
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div 
                initial="hidden"
                animate="visible"
                custom={0}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Total de Alunos</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {Object.values(mockAlunos).reduce((acc, curr) => acc + curr.length, 0)}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Em {mockTurmas.length} turmas sob sua responsabilidade
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                animate="visible"
                custom={1}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <BarChart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Média Geral</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {(Object.values(mockAlunos).reduce((acc, curr) => {
                        return acc + curr.reduce((sum, aluno) => sum + aluno.media, 0);
                      }, 0) / Object.values(mockAlunos).reduce((acc, curr) => acc + curr.length, 0)).toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Considerando todos os alunos
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                animate="visible"
                custom={2}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Atividades</h3>
                    <p className="text-2xl font-bold text-gray-800">{mockAtividades.length}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {mockAtividades.filter(a => a.status === "Pendente").length} atividades pendentes
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                animate="visible"
                custom={3}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Mensagens</h3>
                    <p className="text-2xl font-bold text-gray-800">{mockMensagens.length}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {mockMensagens.filter(m => !m.lida).length} não lidas
                </div>
              </motion.div>
            </div>

            {/* Gráfico de Progresso */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> Progresso por Turma
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockProgressoAlunos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="mes" stroke="#6b7280" />
                    <YAxis domain={[0, 10]} stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    {Object.keys(TURMA_COLORS).map((turma) => (
                      <Line 
                        key={turma}
                        type="monotone" 
                        dataKey={`media${turma}`} 
                        stroke={TURMA_COLORS[turma as keyof typeof TURMA_COLORS]}
                        name={`Turma ${turma}`}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Próximas Atividades e Mensagens recentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-600" /> Próximas Atividades
                </h3>

                <div className="space-y-4">
                  {mockAtividades.slice(0, 3).map((atividade) => (
                    <div key={atividade.id} className="p-3 rounded-lg border border-gray-100 hover:bg-indigo-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{atividade.titulo}</h4>
                          <p className="text-xs text-gray-500">Turma {atividade.turma} • {atividade.tipo}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          atividade.status === 'Pendente' ? 'bg-amber-100 text-amber-700' :
                          atividade.status === 'Publicado' ? 'bg-green-100 text-green-700' :
                          atividade.status === 'Corrigido' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {atividade.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Entrega: </span>
                        <span className="font-medium">{format(parseISO(atividade.dataEntrega), "dd/MM/yyyy")}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setSection('atividades')}
                >
                  Ver todas as atividades
                </Button>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-indigo-600" /> Mensagens Recentes
                </h3>

                <div className="space-y-4">
                  {mockMensagens.map((mensagem) => (
                    <div key={mensagem.id} className={`p-3 rounded-lg border ${mensagem.lida ? 'border-gray-100' : 'border-indigo-100 bg-indigo-50'} hover:bg-indigo-50 transition-colors`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{mensagem.assunto}</h4>
                          <p className="text-xs text-gray-500">De: {mensagem.remetente}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(parseISO(mensagem.data), "dd/MM")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setSection('mensagens')}
                >
                  Ver todas as mensagens
                </Button>
              </motion.div>
            </div>
          </div>
        )}

        {/* Outras seções seriam implementadas aqui */}
        {section === 'turmas' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Minhas Turmas</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {mockTurmas.map((turma, index) => (
                <motion.div 
                  key={turma.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
                    turma.nome === turmaSelecionada 
                      ? 'border-l-indigo-500 ring-1 ring-indigo-100' 
                      : 'border-l-gray-200'
                  } cursor-pointer`}
                  onClick={() => setTurmaSelecionada(turma.nome)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{turma.nome}</h3>
                      <p className="text-sm text-gray-500">{turma.turno} • {turma.disciplina}</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                      {turma.alunos} alunos
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Média da Turma</p>
                      <p className="text-lg font-bold text-gray-800">
                        {(mockAlunos[turma.nome as keyof typeof mockAlunos].reduce((acc, curr) => acc + curr.media, 0) / 
                          mockAlunos[turma.nome as keyof typeof mockAlunos].length).toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Última Aula</p>
                      <p className="text-sm font-medium text-gray-800">Ontem</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTurmaSelecionada(turma.nome);
                        setSection('notas');
                      }}
                    >
                      Notas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTurmaSelecionada(turma.nome);
                        setSection('frequencia');
                      }}
                    >
                      Frequência
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Detalhes da turma selecionada */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Turma {turmaSelecionada} - Alunos
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar aluno..."
                      className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  </div>
                  <select className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="todos">Todos os status</option>
                    <option value="aprovados">Aprovados</option>
                    <option value="recuperacao">Em recuperação</option>
                    <option value="reprovados">Reprovados</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-indigo-700 border-b">
                      <th className="py-3 px-4 font-medium">Nome</th>
                      <th className="py-3 px-4 font-medium">Média</th>
                      <th className="py-3 px-4 font-medium">Faltas</th>
                      <th className="py-3 px-4 font-medium">Última Nota</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].map((aluno) => (
                      <tr key={aluno.id} 
                        className={`border-b last:border-b-0 hover:bg-indigo-50 transition-colors ${alunoSelecionado?.id === aluno.id ? 'bg-indigo-50' : ''}`}
                        onClick={() => setAlunoSelecionado(aluno)}
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium">{aluno.nome}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block text-sm font-medium ${
                            aluno.media >= 7 ? 'text-green-600' : 
                            aluno.media >= 5 ? 'text-amber-600' : 
                            'text-red-600'
                          }`}>
                            {aluno.media.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block text-sm font-medium ${
                            aluno.faltas <= 3 ? 'text-gray-600' : 
                            aluno.faltas <= 5 ? 'text-amber-600' : 
                            'text-red-600'
                          }`}>
                            {aluno.faltas}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block text-sm font-medium text-gray-600">
                            {aluno.ultimaNota.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            aluno.media >= 7 ? 'bg-green-100 text-green-800' : 
                            aluno.media >= 5 ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {aluno.media >= 7 ? 'Aprovado' : 
                             aluno.media >= 5 ? 'Recuperação' : 
                             'Reprovado'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success(`Detalhes do aluno: ${aluno.nome}`);
                              }}
                            >
                              Detalhes
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSection('mensagens');
                                toast.success(`Mensagem para: ${aluno.nome}`);
                              }}
                            >
                              Mensagem
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Detalhes do aluno selecionado */}
            {alunoSelecionado && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{alunoSelecionado.nome}</h3>
                      <p className="text-sm text-gray-500">Turma {turmaSelecionada}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAlunoSelecionado(null)}
                  >
                    Fechar
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-700 mb-2">Média Geral</h4>
                    <p className="text-3xl font-bold text-blue-700">{alunoSelecionado.media.toFixed(1)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-700 mb-2">Faltas</h4>
                    <p className="text-3xl font-bold text-blue-700">{alunoSelecionado.faltas}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-700 mb-2">Última Nota</h4>
                    <p className="text-3xl font-bold text-blue-700">{alunoSelecionado.ultimaNota.toFixed(1)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Histórico de Notas</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-600">
                            <th className="text-left pb-2">Avaliação</th>
                            <th className="text-right pb-2">Nota</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1">Prova Bimestral (1º Bim)</td>
                            <td className="text-right font-medium">{(Math.random() * 3 + 7).toFixed(1)}</td>
                          </tr>
                          <tr>
                            <td className="py-1">Trabalho em Grupo (1º Bim)</td>
                            <td className="text-right font-medium">{(Math.random() * 3 + 7).toFixed(1)}</td>
                          </tr>
                          <tr>
                            <td className="py-1">Atividades em Sala (1º Bim)</td>
                            <td className="text-right font-medium">{(Math.random() * 3 + 7).toFixed(1)}</td>
                          </tr>
                          <tr>
                            <td className="py-1">Participação (1º Bim)</td>
                            <td className="text-right font-medium">{(Math.random() * 3 + 7).toFixed(1)}</td>
                          </tr>
                          <tr className="border-t">
                            <td className="py-1 font-medium">Média 1º Bimestre</td>
                            <td className="text-right font-medium">{alunoSelecionado.media.toFixed(1)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Observações e Comentários</h4>
                    <div className="bg-gray-50 rounded-lg p-4 h-[200px] overflow-y-auto">
                      <div className="space-y-3">
                        <div className="p-2 border-l-2 border-blue-400">
                          <p className="text-sm text-gray-700">
                            Aluno participativo nas aulas, mas precisa melhorar a organização dos trabalhos.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            03/04/2024 - Prova Bimestral
                          </p>
                        </div>
                        <div className="p-2 border-l-2 border-green-400">
                          <p className="text-sm text-gray-700">
                            Excelente trabalho em grupo, assumiu liderança e ajudou os colegas.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            15/04/2024 - Trabalho em Grupo
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <textarea 
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          placeholder="Adicionar comentário..."
                          rows={2}
                        ></textarea>
                        <div className="mt-2 flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => toast.success("Comentário adicionado!")}
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
        
        {/* Seção de Atividades e Avaliações */}
        {section === 'atividades' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-indigo-600" /> Atividades e Avaliações
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-indigo-500 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-indigo-500" /> 
                  <span>Filtros</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={turmaSelecionada}
                      onChange={(e) => setTurmaSelecionada(e.target.value)}
                    >
                      <option value="todas">Todas as turmas</option>
                      {mockTurmas.map((turma) => (
                        <option key={turma.id} value={turma.nome}>{turma.nome}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Tipo</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="todos">Todos os tipos</option>
                      <option value="prova">Prova</option>
                      <option value="trabalho">Trabalho</option>
                      <option value="exercicio">Exercício</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="todos">Todos os status</option>
                      <option value="pendente">Pendente</option>
                      <option value="publicado">Publicado</option>
                      <option value="corrigido">Corrigido</option>
                      <option value="rascunho">Rascunho</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Período</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="todos">Todo o período</option>
                      <option value="proximos">Próximos 7 dias</option>
                      <option value="mes">Próximo mês</option>
                      <option value="bimestre">Bimestre atual</option>
                    </select>
                  </div>
                  
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Aplicar Filtros
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-3 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-indigo-600" /> Lista de Atividades
                  </h3>
                  <Button onClick={() => setAtividadeSelecionada(null)} className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Nova Atividade
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b bg-indigo-50/50">
                        <th className="py-3 px-4 font-medium">Título</th>
                        <th className="py-3 px-4 font-medium">Turma</th>
                        <th className="py-3 px-4 font-medium">Tipo</th>
                        <th className="py-3 px-4 font-medium">Data de Entrega</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAtividades
                        .filter(a => turmaSelecionada === "todas" || a.turma === turmaSelecionada)
                        .map((atividade) => (
                        <motion.tr 
                          key={atividade.id} 
                          className={`border-b last:border-b-0 hover:bg-indigo-50/30 cursor-pointer transition-colors ${atividadeSelecionada?.id === atividade.id ? 'bg-indigo-50/70' : ''}`}
                          onClick={() => setAtividadeSelecionada(atividade)}
                          whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium">{atividade.titulo}</div>
                          </td>
                          <td className="py-4 px-4">{atividade.turma}</td>
                          <td className="py-4 px-4">{atividade.tipo}</td>
                          <td className="py-4 px-4">
                            {format(parseISO(atividade.dataEntrega), "dd/MM/yyyy")}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              atividade.status === 'Pendente' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                              atividade.status === 'Publicado' ? 'bg-green-100 text-green-800 border border-green-200' : 
                              atividade.status === 'Corrigido' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 
                              'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {atividade.status === 'Pendente' && <Clock className="w-3 h-3 inline mr-1" />}
                              {atividade.status === 'Publicado' && <Check className="w-3 h-3 inline mr-1" />}
                              {atividade.status === 'Corrigido' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                              {atividade.status === 'Rascunho' && <Edit className="w-3 h-3 inline mr-1" />}
                              {atividade.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAtividadeSelecionada(atividade);
                                }}
                              >
                                <Edit2 className="w-3 h-3 mr-1" /> Editar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-green-200 text-green-700 hover:bg-green-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(`Publicando: ${atividade.titulo}`);
                                }}
                              >
                                <Upload className="w-3 h-3 mr-1" /> Publicar
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Detalhes da atividade selecionada */}
            {atividadeSelecionada && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                      {atividadeSelecionada ? (
                        <>
                          <FileText className="w-5 h-5 text-indigo-600" />
                          Editar: {atividadeSelecionada.titulo}
                        </>
                      ) : (
                        <>
                          <FilePlus className="w-5 h-5 text-indigo-600" />
                          Nova Atividade
                        </>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {atividadeSelecionada ? `Turma ${atividadeSelecionada.turma} • ${atividadeSelecionada.tipo}` : 'Formulário para nova atividade'}
                    </p>
                    {atividadeSelecionada && (
                      <div className="mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          atividadeSelecionada.status === 'Pendente' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                          atividadeSelecionada.status === 'Publicado' ? 'bg-green-100 text-green-800 border border-green-200' : 
                          atividadeSelecionada.status === 'Corrigido' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {atividadeSelecionada.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-200 hover:bg-gray-50"
                    onClick={() => setAtividadeSelecionada(null)}
                  >
                    <X className="w-4 h-4 mr-1" /> Fechar
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Título</label>
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={atividadeSelecionada.titulo}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={atividadeSelecionada.turma}
                        >
                          {mockTurmas.map((turma) => (
                            <option key={turma.id} value={turma.nome}>{turma.nome}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Tipo</label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={atividadeSelecionada.tipo}
                        >
                          <option value="Prova">Prova</option>
                          <option value="Trabalho">Trabalho</option>
                          <option value="Exercício">Exercício</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Data de Entrega</label>
                        <input 
                          type="date" 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={atividadeSelecionada.dataEntrega}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                        <select 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={atividadeSelecionada.status}
                        >
                          <option value="Rascunho">Rascunho</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Publicado">Publicado</option>
                          <option value="Corrigido">Corrigido</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Descrição</label>
                        <textarea 
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          rows={5}
                          placeholder="Descreva a atividade em detalhes..."
                          defaultValue={`Descrição detalhada para ${atividadeSelecionada.titulo}.\nInstruções para os alunos e informações importantes.`}
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Peso na nota</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Anexos</label>
                        <div className="border border-gray-300 border-dashed rounded-lg p-4 text-center">
                          <p className="text-gray-500 mb-2">Arraste arquivos aqui ou</p>
                          <Button variant="outline" size="sm">Selecionar arquivos</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => setAtividadeSelecionada(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success("Atividade salva com sucesso!");
                      setAtividadeSelecionada(null);
                    }}
                  >
                    Salvar Atividade
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
        
        {/* Seção de Lançamento de Notas */}
        {section === 'notas' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-indigo-600" /> Lançamento de Notas
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-indigo-500 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" /> 
                  <span>Selecionar Turma</span>
                </h3>
                
                <div className="space-y-4">
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={turmaSelecionada}
                    onChange={(e) => setTurmaSelecionada(e.target.value)}
                  >
                    {mockTurmas.map((turma) => (
                      <option key={turma.id} value={turma.nome}>{turma.nome} - {turma.disciplina}</option>
                    ))}
                  </select>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Bimestre</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="1">1º Bimestre</option>
                      <option value="2">2º Bimestre</option>
                      <option value="3">3º Bimestre</option>
                      <option value="4">4º Bimestre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Avaliação</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="nova">Nova Avaliação</option>
                      <option value="prova1">Prova Bimestral</option>
                      <option value="trabalho">Trabalho em Grupo</option>
                      <option value="atividades">Atividades em Sala</option>
                      <option value="participacao">Participação</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Info className="w-4 h-4 text-indigo-500" /> Informações da Turma
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantidade de alunos:</span>
                        <span className="font-medium">{mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Média da turma:</span>
                        <span className="font-medium">
                          {(mockAlunos[turmaSelecionada as keyof typeof mockAlunos].reduce((acc, curr) => acc + curr.media, 0) / 
                            mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Última avaliação:</span>
                        <span className="font-medium">05/05/2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                    Notas - Turma {turmaSelecionada}
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => toast.success("Exportando notas para Excel...")}
                    >
                      <Download className="w-4 h-4 mr-2" /> Exportar
                    </Button>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => toast.success("Notas salvas com sucesso!")}
                    >
                      <Save className="w-4 h-4 mr-2" /> Salvar Notas
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-indigo-700 border-b bg-indigo-50/50">
                        <th className="py-3 px-4 font-medium">Aluno</th>
                        <th className="py-3 px-4 font-medium">Prova Bimestral</th>
                        <th className="py-3 px-4 font-medium">Trabalho em Grupo</th>
                        <th className="py-3 px-4 font-medium">Atividades em Sala</th>
                        <th className="py-3 px-4 font-medium">Participação</th>
                        <th className="py-3 px-4 font-medium">Média Final</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].map((aluno) => {
                        // Gerar notas de exemplo
                        const notaProva = (Math.random() * 3 + 7).toFixed(1);
                        const notaTrabalho = (Math.random() * 3 + 7).toFixed(1);
                        const notaAtividades = (Math.random() * 3 + 7).toFixed(1);
                        const notaParticipacao = (Math.random() * 3 + 7).toFixed(1);
                        
                        return (
                          <tr key={aluno.id} className="border-b last:border-b-0 hover:bg-indigo-50/30 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium">{aluno.nome}</div>
                            </td>
                            <td className="py-4 px-4">
                              <input 
                                type="number" 
                                min="0"
                                max="10"
                                step="0.1"
                                className="w-16 border border-gray-300 rounded-lg p-1 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                defaultValue={notaProva}
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input 
                                type="number" 
                                min="0"
                                max="10"
                                step="0.1"
                                className="w-16 border border-gray-300 rounded-lg p-1 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                defaultValue={notaTrabalho}
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input 
                                type="number" 
                                min="0"
                                max="10"
                                step="0.1"
                                className="w-16 border border-gray-300 rounded-lg p-1 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                defaultValue={notaAtividades}
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input 
                                type="number" 
                                min="0"
                                max="10"
                                step="0.1"
                                className="w-16 border border-gray-300 rounded-lg p-1 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                defaultValue={notaParticipacao}
                              />
                            </td>
                            <td className="py-4 px-4">
                              <div className={`font-bold ${
                                aluno.media >= 7 ? 'text-green-600' : 
                                aluno.media >= 5 ? 'text-amber-600' : 
                                'text-red-600'
                              }`}>
                                {aluno.media.toFixed(1)}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mostrando {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length} alunos da turma {turmaSelecionada}
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Aprovado (≥ a 7,0)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Recuperação (5,0 a 6,9)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Reprovado (&lt; 5,0)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gráficos e estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-600" /> Distribuição de Notas
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { nota: '0-2', quantidade: 0 },
                      { nota: '2-4', quantidade: 1 },
                      { nota: '4-6', quantidade: 2 },
                      { nota: '6-8', quantidade: 10 },
                      { nota: '8-10', quantidade: 7 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="nota" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip contentStyle={{ borderRadius: '8px', borderColor: '#e5e7eb' }} />
                      <Area 
                        type="monotone" 
                        dataKey="quantidade" 
                        name="Alunos" 
                        stroke="#6366f1" 
                        fill="#818cf8" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}  
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Estatísticas da Turma
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <h4 className="text-sm font-medium text-indigo-700 mb-1">Média da Turma</h4>
                    <p className="text-2xl font-bold text-indigo-700">{(mockAlunos[turmaSelecionada as keyof typeof mockAlunos].reduce((acc, curr) => acc + curr.media, 0) / 
                        mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length).toFixed(1)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <h4 className="text-sm font-medium text-green-700 mb-1">Aprovados</h4>
                    <p className="text-2xl font-bold text-green-700">
                      {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].filter(a => a.media >= 7).length}
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <h4 className="text-sm font-medium text-amber-700 mb-1">Em Recuperação</h4>
                    <p className="text-2xl font-bold text-amber-700">
                      {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].filter(a => a.media >= 5 && a.media < 7).length}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <h4 className="text-sm font-medium text-red-700 mb-1">Reprovados</h4>
                    <p className="text-2xl font-bold text-red-700">
                      {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].filter(a => a.media < 5).length}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-indigo-500" /> Observações para o Boletim
                  </h4>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={5}
                    placeholder="Adicione observações gerais sobre o desempenho da turma..."
                    defaultValue="A turma apresentou um bom desempenho no bimestre, com a maioria dos alunos demonstrando domínio do conteúdo. Alguns alunos precisam de atenção especial para melhorar o aproveitamento."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Seção de Controle de Frequência */}
        {section === 'frequencia' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Controle de Frequência</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Registro de Presença</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={turmaSelecionada}
                      onChange={(e) => setTurmaSelecionada(e.target.value)}
                    >
                      {mockTurmas.map((turma) => (
                        <option key={turma.id} value={turma.nome}>{turma.nome} - {turma.disciplina}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Data</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      defaultValue={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Horário</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2">
                      {mockHorarios.find(h => h.dia === "Segunda")?.aulas.map((aula, index) => (
                        <option key={index} value={aula.horario}>{aula.horario}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resumo</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aulas ministradas:</span>
                        <span className="font-medium">32</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alunos da turma:</span>
                        <span className="font-medium">{mockAlunos[turmaSelecionada as keyof typeof mockAlunos].length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Última chamada:</span>
                        <span className="font-medium">14/06/2024</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => toast.success("Relatório de frequência gerado com sucesso!")}
                  >
                    Gerar Relatório
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-3 bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Lista de Presença - Turma {turmaSelecionada}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => toast.success("Lista de presença exportada com sucesso!")}
                    >
                      Exportar
                    </Button>
                    <Button
                      onClick={() => toast.success("Presença registrada com sucesso!")}
                    >
                      Salvar Registro
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-blue-700 border-b">
                        <th className="py-3 px-4 font-medium">Aluno</th>
                        <th className="py-3 px-4 font-medium">Total de Faltas</th>
                        <th className="py-3 px-4 font-medium">Presença Hoje</th>
                        <th className="py-3 px-4 font-medium">Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].map((aluno) => (
                        <tr key={aluno.id} className="border-b last:border-b-0 hover:bg-blue-50">
                          <td className="py-4 px-4">
                            <div className="font-medium">{aluno.nome}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-medium ${
                              aluno.faltas > 5 ? 'text-red-600' : 
                              aluno.faltas > 3 ? 'text-amber-600' : 
                              'text-gray-600'
                            }`}>
                              {aluno.faltas}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-4">
                              <label className="inline-flex items-center">
                                <input 
                                  type="radio" 
                                  name={`presenca-${aluno.id}`} 
                                  className="form-radio h-4 w-4 text-blue-600" 
                                  defaultChecked={true}
                                />
                                <span className="ml-2 text-gray-700">Presente</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input 
                                  type="radio" 
                                  name={`presenca-${aluno.id}`} 
                                  className="form-radio h-4 w-4 text-red-600" 
                                />
                                <span className="ml-2 text-gray-700">Ausente</span>
                              </label>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <input 
                              type="text" 
                              className="w-full border border-gray-300 rounded p-1 text-sm"
                              placeholder="Adicionar observação..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Visualização de frequência por aluno */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Frequência - Turma {turmaSelecionada}</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-blue-700 border-b">
                      <th className="py-2 px-2 font-medium">Nome do Aluno</th>
                      {Array.from({ length: 10 }, (_, i) => (
                        <th key={i} className="py-2 px-2 font-medium text-center">{format(new Date(2024, 5, i + 1), "dd/MM")}</th>
                      ))}
                      <th className="py-2 px-2 font-medium text-center">Faltas</th>
                      <th className="py-2 px-2 font-medium text-center">Frequência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAlunos[turmaSelecionada as keyof typeof mockAlunos].map((aluno) => {
                      // Gerar presença aleatória para exemplo
                      const presencas = Array.from({ length: 10 }, () => Math.random() > 0.2);
                      const faltas = presencas.filter(p => !p).length;
                      const frequencia = ((presencas.length - faltas) / presencas.length * 100).toFixed(0);
                      
                      return (
                        <tr key={aluno.id} className="border-b last:border-b-0 hover:bg-blue-50">
                          <td className="py-2 px-2">
                            <div className="font-medium">{aluno.nome}</div>
                          </td>
                          {presencas.map((presente, idx) => (
                            <td key={idx} className="py-2 px-2 text-center">
                              <span className={`inline-block w-6 h-6 rounded-full ${
                                presente ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              } flex items-center justify-center font-medium text-xs`}>
                                {presente ? 'P' : 'F'}
                              </span>
                            </td>
                          ))}
                          <td className="py-2 px-2 text-center font-medium">
                            {faltas}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className={`font-medium ${
                              Number(frequencia) < 75 ? 'text-red-600' : 
                              Number(frequencia) < 85 ? 'text-amber-600' : 
                              'text-green-600'
                            }`}>
                              {frequencia}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-4 h-4 bg-green-100 rounded-full"></span>
                    <span>Presente</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-4 h-4 bg-red-100 rounded-full"></span>
                    <span>Ausente</span>
                  </div>
                </div>
                <div>
                  Limite de faltas: 25% (8 aulas)
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Seção de Conteúdo Programático */}
        {section === 'conteudos' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Conteúdo Programático</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Conteúdos</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Turma</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={turmaSelecionada}
                      onChange={(e) => setTurmaSelecionada(e.target.value)}
                    >
                      {mockTurmas.map((turma) => (
                        <option key={turma.id} value={turma.nome}>{turma.nome} - {turma.disciplina}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Período</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2">
                      <option value="1">1º Bimestre</option>
                      <option value="2">2º Bimestre</option>
                      <option value="3">3º Bimestre</option>
                      <option value="4">4º Bimestre</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Progresso</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Conteúdo ministrado</span>
                          <span>75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                          <span className="block font-bold">{mockConteudos.filter(c => c.turma === turmaSelecionada && c.status === "Concluído").length}</span>
                          <span>Concluídos</span>
                        </div>
                        <div className="bg-amber-100 text-amber-800 p-2 rounded-lg">
                          <span className="block font-bold">{mockConteudos.filter(c => c.turma === turmaSelecionada && c.status === "Em andamento").length}</span>
                          <span>Em andamento</span>
                        </div>
                        <div className="bg-gray-100 text-gray-800 p-2 rounded-lg">
                          <span className="block font-bold">{mockConteudos.filter(c => c.turma === turmaSelecionada && c.status === "Não iniciado").length}</span>
                          <span>Não iniciados</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => toast.success("Cadastrando novo conteúdo...")}
                  >
                    Novo Conteúdo
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-3 bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Conteúdos da Turma {turmaSelecionada}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => toast.success("Exportando plano de ensino...")}
                    >
                      Exportar Plano
                    </Button>
                    <Button
                      onClick={() => toast.success("Plano de ensino atualizado!")}
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-blue-700 border-b">
                        <th className="py-3 px-4 font-medium">Unidade</th>
                        <th className="py-3 px-4 font-medium">Conteúdo</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Data Prevista</th>
                        <th className="py-3 px-4 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockConteudos.filter(c => c.turma === turmaSelecionada).map((conteudo) => (
                        <tr key={conteudo.id} className="border-b last:border-b-0 hover:bg-blue-50">
                          <td className="py-4 px-4">
                            <div className="font-medium">{conteudo.unidade}</div>
                          </td>
                          <td className="py-4 px-4">{conteudo.titulo}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              conteudo.status === 'Concluído' ? 'bg-green-100 text-green-800' : 
                              conteudo.status === 'Em andamento' ? 'bg-amber-100 text-amber-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {conteudo.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {/* Gerar datas aleatórias para exemplo */}
                            {format(new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 30) + 1), "dd/MM/yyyy")}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.success(`Editando: ${conteudo.titulo}`)}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.success(`Materiais: ${conteudo.titulo}`)}
                              >
                                Materiais
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Detalhes de conteúdo */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Plano de Aula Detalhado</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Título da Aula</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="Ex: Introdução à Álgebra"
                      defaultValue="Frações - Operações Básicas"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Unidade do Conteúdo</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2">
                      <option value="1">Unidade 1</option>
                      <option value="2" selected>Unidade 2</option>
                      <option value="3">Unidade 3</option>
                      <option value="4">Unidade 4</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Objetivos</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows={3}
                    defaultValue="Compreender o conceito de frações; Resolver problemas envolvendo adição, subtração, multiplicação e divisão de frações; Converter frações em números decimais e vice-versa."
                  ></textarea>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Metodologia</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows={3}
                    defaultValue="Aula expositiva com uso de recursos visuais; Resolução de problemas em grupos; Discussão coletiva sobre estratégias de resolução; Exercícios práticos individuais."
                  ></textarea>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Recursos Necessários</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows={2}
                    defaultValue="Quadro, projetor, material impresso com exercícios, calculadoras, jogo de frações."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Avaliação</label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      rows={2}
                      defaultValue="Participação nas atividades em grupo; Resolução de exercícios em sala; Lista de exercícios para casa."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Bibliografia</label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      rows={2}
                      defaultValue="Livro Didático (páginas 45-58); Material complementar disponibilizado no ambiente virtual."
                    ></textarea>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end gap-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={() => toast.success("Plano de aula salvo com sucesso!")}>Salvar Plano</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Seção de Meus Horários */}
        {section === 'horarios' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" /> Meus Horários
            </h1>
            
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Quadro de Horários Semanal
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 flex items-center gap-1"
                    onClick={() => toast.success("Exportando horários...")}
                  >
                    <FileText className="w-4 h-4" /> Exportar PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 flex items-center gap-1"
                    onClick={() => toast.success("Sincronizando com Google Calendar...")}
                  >
                    Sincronizar Calendário
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-4 px-2 font-medium text-blue-700 border border-gray-200 bg-blue-50">Horário</th>
                      {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map((dia) => (
                        <th key={dia} className="py-4 px-2 font-medium text-blue-700 border border-gray-200 bg-blue-50">
                          {dia}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "07:30 - 08:20",
                      "08:20 - 09:10",
                      "09:10 - 10:00",
                      "10:20 - 11:10",
                      "11:10 - 12:00",
                      "13:30 - 14:20",
                      "14:20 - 15:10",
                      "15:10 - 16:00"
                    ].map((horario) => (
                      <tr key={horario}>
                        <td className="py-3 px-2 font-medium border border-gray-200 bg-gray-50">{horario}</td>
                        {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map((dia) => {
                          const aula = mockHorarios.find(h => h.dia === dia)?.aulas.find(a => a.horario === horario);
                          
                          return (
                            <td 
                              key={`${dia}-${horario}`} 
                              className={`py-3 px-2 border border-gray-200 ${aula ? 'bg-blue-50' : ''}`}
                            >
                              {aula ? (
                                <div>
                                  <div className="font-medium text-blue-700">{aula.turma}</div>
                                  <div className="text-xs text-gray-500">Matemática</div>
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Lista de aulas da semana */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Próximas Aulas</h3>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-lg border border-blue-100 bg-blue-50">
                    <div className="flex gap-2 items-start">
                      <div className="h-10 w-10 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold">
                        {format(new Date(), "dd")}
                      </div>
                      <div>
                        <h4 className="font-medium">Turma 1A • Matemática</h4>
                        <p className="text-sm text-gray-600">Hoje, 07:30 - 08:20</p>
                        <div className="mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">
                          Conteúdo: Frações
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-200">
                    <div className="flex gap-2 items-start">
                      <div className="h-10 w-10 bg-gray-500 text-white rounded-lg flex items-center justify-center font-bold">
                        {format(new Date(), "dd")}
                      </div>
                      <div>
                        <h4 className="font-medium">Turma 2A • Matemática</h4>
                        <p className="text-sm text-gray-600">Hoje, 13:30 - 14:20</p>
                        <div className="mt-1 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded inline-block">
                          Conteúdo: Estatística
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-200">
                    <div className="flex gap-2 items-start">
                      <div className="h-10 w-10 bg-gray-500 text-white rounded-lg flex items-center justify-center font-bold">
                        {format(addDays(new Date(), 1), "dd")}
                      </div>
                      <div>
                        <h4 className="font-medium">Turma 1A • Matemática</h4>
                        <p className="text-sm text-gray-600">Amanhã, 08:20 - 09:10</p>
                        <div className="mt-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded inline-block">
                          Avaliação: Prova Bimestral
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo de Carga Horária</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="block text-2xl font-bold text-blue-700">18</span>
                      <span className="text-sm text-gray-700">Aulas por semana</span>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <span className="block text-2xl font-bold text-green-700">72</span>
                      <span className="text-sm text-gray-700">Horas mensais</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <span className="block text-2xl font-bold text-amber-700">3</span>
                      <span className="text-sm text-gray-700">Turmas</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Distribuição por Turma</h4>
                    
                    {mockTurmas.map((turma) => {
                      const aulasTurma = mockHorarios.reduce((acc, dia) => {
                        return acc + dia.aulas.filter(a => a.turma === turma.nome).length;
                      }, 0);
                      const porcentagem = (aulasTurma / 18) * 100;
                      
                      return (
                        <div key={turma.id} className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Turma {turma.nome}</span>
                            <span>{aulasTurma} aulas ({porcentagem.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${turma.nome === '1A' ? 'bg-blue-600' : turma.nome === '1B' ? 'bg-amber-500' : 'bg-green-500'}`} 
                              style={{ width: `${porcentagem}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Observações</h4>
                    <div className="text-sm text-gray-600">
                      <p>• Monitorias às quintas-feiras, das 16:10 às 17:00.</p>
                      <p>• Reunião de departamento na última sexta-feira do mês.</p>
                      <p>• Plantão de dúvidas para o 3º ano: segundas 16:10 às 17:00.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Adicionar todas as seções implementadas na condição e remover duplicação */}
        {section !== 'visao' && section !== 'turmas' && section !== 'mensagens' && section !== 'atividades' && section !== 'notas' && section !== 'frequencia' && section !== 'conteudos' && section !== 'horarios' && (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
              <BookOpenCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Em construção</h2>
              <p className="text-gray-600 mb-6">
                A seção "{section.charAt(0).toUpperCase() + section.slice(1)}" está em desenvolvimento.
                Novas funcionalidades serão disponibilizadas em breve!
              </p>
              <Button onClick={() => setSection('visao')}>
                Voltar para Visão Geral
              </Button>
            </div>
          </div>
        )}

        {/* Seção de Comunicações */}
        {section === 'mensagens' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Comunicações</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Coluna da esquerda - Navegação de mensagens */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                    <span>Caixa de Entrada</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {mockMensagens.filter(m => !m.lida).length}
                    </span>
                  </h3>
                  
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar mensagens..."
                        className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all bg-indigo-100 text-indigo-700 font-semibold">
                      <MessageCircle className="w-4 h-4" /> Recebidas
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all hover:bg-indigo-50 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg> Enviadas
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all hover:bg-indigo-50 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg> Favoritas
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all hover:bg-indigo-50 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg> Arquivadas
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all hover:bg-indigo-50 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg> Lixeira
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Categorias</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                        <span className="text-sm text-gray-700">Coordenação</span>
                      </div>
                      <span className="text-xs text-gray-500">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                        <span className="text-sm text-gray-700">Sistema</span>
                      </div>
                      <span className="text-xs text-gray-500">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-gray-700">Pais e Responsáveis</span>
                      </div>
                      <span className="text-xs text-gray-500">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="text-sm text-gray-700">Direção</span>
                      </div>
                      <span className="text-xs text-gray-500">1</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => toast.success("Gerenciando categorias")}
                  >
                    Gerenciar Categorias
                  </Button>
                </div>
                
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => toast.success("Nova mensagem")}
                >
                  Nova Mensagem
                </Button>
              </div>
              
              {/* Coluna do meio - Lista de mensagens */}
              <div className="md:col-span-1 bg-white rounded-xl shadow-md p-6 overflow-hidden border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Mensagens</h3>
                
                <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                  {mockMensagens.map((mensagem) => (
                    <div 
                      key={mensagem.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        mensagemSelecionada?.id === mensagem.id 
                          ? 'bg-indigo-50 border border-indigo-100' 
                          : mensagem.lida 
                            ? 'hover:bg-gray-50 border border-gray-100' 
                            : 'bg-indigo-50 hover:bg-indigo-100 border border-indigo-100'
                      }`}
                      onClick={() => setMensagemSelecionada(mensagem)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-800">{mensagem.assunto}</div>
                        <span className="text-xs text-gray-500">{format(parseISO(mensagem.data), "dd/MM")}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">De: {mensagem.remetente}</p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {mensagem.id === 1 ? 'Prezado(a) Professor(a), informamos que haverá reunião pedagógica na próxima sexta-feira às 14h na sala de reuniões.' : 
                         mensagem.id === 2 ? 'Lembramos que o prazo para lançamento de notas do 2º bimestre se encerra no dia 30/06. Por favor, não deixe para última hora.' :
                         'Gostaria de agendar uma reunião para discutir o desempenho do meu filho nas últimas avaliações. Quando seria possível?'}
                      </p>
                      
                      {!mensagem.lida && (
                        <div className="flex justify-end mt-2">
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                            Nova
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Coluna da direita - Visualização da mensagem selecionada */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                {mensagemSelecionada ? (
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-medium text-gray-900">{mensagemSelecionada.assunto}</h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toast.success("Mensagem arquivada")}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive">
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toast.success("Mensagem favoritada")}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toast.success("Mensagem excluída")}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-sm text-gray-500">De: {mensagemSelecionada.remetente}</p>
                          <p className="text-sm text-gray-500">Para: João Souza (Professor de Matemática)</p>
                        </div>
                        <p className="text-sm text-gray-500">{format(parseISO(mensagemSelecionada.data), "dd/MM/yyyy 'às' HH:mm")}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow overflow-y-auto">
                      <div className="prose prose-indigo max-w-none">
                        {mensagemSelecionada.id === 1 ? (
                          <>
                            <p>Prezado(a) Professor(a),</p>
                            <p>Informamos que haverá reunião pedagógica na próxima sexta-feira às 14h na sala de reuniões. A pauta inclui os seguintes tópicos:</p>
                            <ul>
                              <li>Avaliação do desempenho das turmas no 1º bimestre</li>
                              <li>Planejamento de atividades para o 2º bimestre</li>
                              <li>Estratégias para alunos com dificuldades de aprendizagem</li>
                              <li>Projeto interdisciplinar</li>
                            </ul>
                            <p>Solicitamos que cada professor prepare um breve relato sobre o desempenho de suas turmas para compartilhar na reunião.</p>
                            <p>Contamos com sua presença!</p>
                            <p>Atenciosamente,</p>
                            <p>Maria Silva<br />Coordenadora Pedagógica</p>
                          </>
                        ) : mensagemSelecionada.id === 2 ? (
                          <>
                            <p>Prezado(a) Professor(a),</p>
                            <p>Lembramos que o prazo para lançamento de notas do 2º bimestre se encerra no dia 30/06. Por favor, não deixe para última hora para evitar problemas técnicos ou sobrecarga no sistema.</p>
                            <p>Todas as notas devem ser lançadas no sistema até as 23:59 do dia 30/06. Após esta data, o sistema será bloqueado para lançamentos.</p>
                            <p>Em caso de dúvidas ou dificuldades, entre em contato com o suporte técnico.</p>
                            <p>Atenciosamente,</p>
                            <p>Sistema de Gestão Escolar</p>
                          </>
                        ) : (
                          <>
                            <p>Prezado Professor João,</p>
                            <p>Espero que esteja bem. Sou o pai do aluno Bruno Costa da turma 1A.</p>
                            <p>Gostaria de agendar uma reunião para discutir o desempenho do meu filho nas últimas avaliações. Percebi que ele está tendo dificuldades em alguns conteúdos e gostaria de entender melhor como posso ajudá-lo em casa.</p>
                            <p>Estou disponível nas terças e quintas-feiras após as 18h, ou aos sábados pela manhã. Por favor, me informe qual o melhor horário para você.</p>
                            <p>Agradeço desde já pela atenção.</p>
                            <p>Atenciosamente,</p>
                            <p>Carlos Costa<br />Pai do aluno Bruno Costa</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 border-t border-gray-200">
                      <div className="flex gap-4">
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => toast.success("Respondendo mensagem")}
                        >
                          Responder
                        </Button>
                        <Button 
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                          onClick={() => toast.success("Encaminhando mensagem")}
                        >
                          Encaminhar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-10">
                    <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma mensagem selecionada</h3>
                    <p className="text-gray-500 text-center">
                      Selecione uma mensagem da lista para visualizar seu conteúdo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 
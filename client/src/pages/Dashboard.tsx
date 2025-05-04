import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart2, Users, UserCog, BookOpen, LogOut, Plus, Trash2, AlertTriangle, FileWarning, UserX, BookOpenCheck, Calendar, CalendarDays, PlusCircle, Clock, Award, TrendingUp, Inbox, CheckCircle2, XCircle, FileText, DollarSign, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { toast } from "react-hot-toast";
import { Switch } from "@headlessui/react";
import jsPDF from "jspdf";
import Papa from "papaparse";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from "date-fns";
import { useLocation } from "wouter";

const mockColaboradores = [
  { id: 1, nome: "Maria Silva", email: "maria@escola.com", tipo: "Coordenador" },
  { id: 2, nome: "João Souza", email: "joao@escola.com", tipo: "Professor" },
  { id: 3, nome: "Ana Lima", email: "ana@escola.com", tipo: "Professor" },
];

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

// Mock de alertas inteligentes
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
  },
  {
    tipo: "documentacao",
    titulo: "Documentação pendente",
    mensagem: "5 alunos precisam entregar documentação.",
    cor: "bg-amber-100 text-amber-800 border-amber-200",
    icone: <FileWarning className="w-6 h-6 text-amber-500" />,
  },
];

const mockPermissoes = [
  { id: 1, nome: "Maria Silva", tipo: "Coordenador", permissoes: { verTurmas: true, editarNotas: true, relatorios: true, gerenciarAlunos: false, eventos: true } },
  { id: 2, nome: "João Souza", tipo: "Professor", permissoes: { verTurmas: true, editarNotas: true, relatorios: false, gerenciarAlunos: false, eventos: false } },
  { id: 3, nome: "Ana Lima", tipo: "Professor", permissoes: { verTurmas: true, editarNotas: false, relatorios: false, gerenciarAlunos: false, eventos: false } },
];

type PermKey = 'verTurmas' | 'editarNotas' | 'relatorios' | 'gerenciarAlunos' | 'eventos';
const PERMISSOES_LABELS: Record<PermKey, string> = {
  verTurmas: "Visualizar turmas",
  editarNotas: "Editar notas",
  relatorios: "Acessar relatórios",
  gerenciarAlunos: "Gerenciar alunos",
  eventos: "Gerenciar eventos"
};

const DISCIPLINAS = ["Matemática", "Português", "História", "Geografia", "Ciências"];
const PERIODOS = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre", "Ano Letivo"];
const mockRelatorio = [
  { aluno: "Lucas Silva", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.5, faltas: 2 },
  { aluno: "Ana Souza", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.2, faltas: 0 },
  { aluno: "Pedro Lima", turma: "1A", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.1, faltas: 1 },
  { aluno: "Lucas Silva", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 7.9, faltas: 0 },
  { aluno: "Ana Souza", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 8.7, faltas: 0 },
  { aluno: "Pedro Lima", turma: "1A", disciplina: "Português", periodo: "1º Bimestre", nota: 5.8, faltas: 2 },
  { aluno: "Lucas Silva", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 6.8, faltas: 3 },
  { aluno: "Ana Souza", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 7.2, faltas: 1 },
  { aluno: "Pedro Lima", turma: "1B", disciplina: "Matemática", periodo: "1º Bimestre", nota: 8.0, faltas: 0 },
];

const mockEventos = [
  { id: 1, titulo: "Reunião Pedagógica", data: "2024-06-10", tipo: "Reunião" },
  { id: 2, titulo: "Prova de Matemática", data: "2024-06-14", tipo: "Prova" },
  { id: 3, titulo: "Festa Junina", data: "2024-06-21", tipo: "Comemorativo" },
  { id: 4, titulo: "Entrega de Boletins", data: "2024-06-28", tipo: "Entrega" },
];
const TIPO_EVENTO = ["Reunião", "Prova", "Comemorativo", "Entrega", "Outro"];

// Simulação de log de auditoria (futuro: integrar com backend)
const mockLog = [
  { id: 1, usuario: "Diretor Teste", acao: "Adicionou evento", detalhe: "Festa Junina", data: "2024-06-01 10:12" },
  { id: 2, usuario: "Diretor Teste", acao: "Editou permissões", detalhe: "Maria Silva - Editar notas", data: "2024-06-02 14:30" },
  { id: 3, usuario: "Diretor Teste", acao: "Exportou relatório", detalhe: "Turma 1A - Matemática", data: "2024-06-03 09:05" },
  { id: 4, usuario: "Diretor Teste", acao: "Removeu colaborador", detalhe: "João Souza", data: "2024-06-04 16:20" },
  { id: 5, usuario: "Diretor Teste", acao: "Enviou alerta", detalhe: "Notas baixas para coordenador", data: "2024-06-05 11:45" },
];

// Mock de rankings
const mockRankingAlunos = [
  { nome: "Ana Souza", turma: "1A", nota: 9.2, frequencia: 98, participacao: 95 },
  { nome: "Lucas Silva", turma: "1A", nota: 8.8, frequencia: 97, participacao: 92 },
  { nome: "Pedro Lima", turma: "1B", nota: 8.5, frequencia: 95, participacao: 90 },
  { nome: "Carla Mendes", turma: "2A", nota: 8.1, frequencia: 96, participacao: 93 },
  { nome: "Rafael Costa", turma: "2B", nota: 7.9, frequencia: 94, participacao: 88 },
];
const mockRankingTurmas = [
  { turma: "1A", media: 8.7, frequencia: 97 },
  { turma: "1B", media: 8.2, frequencia: 95 },
  { turma: "2A", media: 8.0, frequencia: 96 },
  { turma: "2B", media: 7.8, frequencia: 94 },
];
const mockRankingProfs = [
  { nome: "Maria Silva", disciplina: "Matemática", media: 8.9, participacao: 97 },
  { nome: "João Souza", disciplina: "Português", media: 8.5, participacao: 95 },
  { nome: "Ana Lima", disciplina: "História", media: 8.2, participacao: 93 },
];

// Mock de solicitações administrativas
const mockSolicitacoes = [
  { id: 1, tipo: "Matrícula", solicitante: "Carlos Nunes", status: "Pendente", data: "2024-06-10" },
  { id: 2, tipo: "Transferência", solicitante: "Julia Ramos", status: "Pendente", data: "2024-06-11" },
  { id: 3, tipo: "2ª via de boletim", solicitante: "Lucas Silva", status: "Aprovada", data: "2024-06-09" },
  { id: 4, tipo: "Matrícula", solicitante: "Ana Souza", status: "Rejeitada", data: "2024-06-08" },
];

export default function Dashboard() {
  const [section, setSection] = useState("visao");
  const [colaboradores, setColaboradores] = useState(mockColaboradores);
  const [showAdd, setShowAdd] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState("1A");
  const [turnoSelecionado, setTurnoSelecionado] = useState("Manhã");
  const [novoColab, setNovoColab] = useState({ nome: "", email: "", tipo: "Coordenador", senha: "" });
  const [compareTurnos, setCompareTurnos] = useState(false);
  const [alertaSelecionado, setAlertaSelecionado] = useState(null as null | typeof mockAlertas[0]);
  const [destinatario, setDestinatario] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [permissoes, setPermissoes] = useState(mockPermissoes);
  const [colabPerm, setColabPerm] = useState<null | typeof mockPermissoes[0]>(null);
  const [filtroTurma, setFiltroTurma] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [eventos, setEventos] = useState(mockEventos);
  const [mesAtual, setMesAtual] = useState(new Date());
  const [showAddEvento, setShowAddEvento] = useState(false);
  const [novoEvento, setNovoEvento] = useState({ titulo: "", data: format(new Date(), "yyyy-MM-dd"), tipo: "Reunião" });
  const [solicitacoes, setSolicitacoes] = useState(mockSolicitacoes);
  const [, navigate] = useLocation();

  // Simulação de dados do usuário logado
  const user = {
    name: "Diretor Teste",
    email: "adminviniwel@exemplo.com",
    role: "diretor"
  };
  
  // Verificação de segurança - redirecionar se não for diretor
  useEffect(() => {
    // Em uma aplicação real, isso seria verificado com um token JWT ou sessão
    // Aqui estamos simulando com os dados mockados
    if (user.role !== "diretor") {
      toast.error("Acesso não autorizado. Redirecionando...");
      navigate("/dashboard/coordenador");
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

  // Eventos do mês atual
  const eventosMes = eventos.filter(e => isSameMonth(parseISO(e.data), mesAtual));

  // Adicionar colaborador
  function handleAddColab(e: React.FormEvent) {
    e.preventDefault();
    setColaboradores([...colaboradores, { ...novoColab, id: Date.now() }]);
    setShowAdd(false);
    setNovoColab({ nome: "", email: "", tipo: "Coordenador", senha: "" });
    toast.success("Colaborador adicionado com sucesso!");
  }

  // Remover colaborador
  function handleRemoveColab(id: number) {
    setColaboradores(colaboradores.filter(c => c.id !== id));
    toast.success("Colaborador removido!");
  }

  function handleEnviarNotificacao(e: React.FormEvent) {
    e.preventDefault();
    setAlertaSelecionado(null);
    setDestinatario([]);
    setMensagem("");
    toast.success("Notificação enviada com sucesso!");
  }

  function handleSalvarPermissoes() {
    setPermissoes(permissoes.map(c => c.id === colabPerm?.id ? colabPerm : c));
    setColabPerm(null);
    toast.success("Permissões atualizadas!");
  }

  // Filtrar dados do relatório
  const dadosRelatorio = mockRelatorio.filter(r =>
    (!filtroTurma || r.turma === filtroTurma) &&
    (!filtroDisciplina || r.disciplina === filtroDisciplina) &&
    (!filtroPeriodo || r.periodo === filtroPeriodo)
  );

  // Exportar CSV
  function exportarCSV() {
    const csv = Papa.unparse(dadosRelatorio);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "relatorio.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório exportado em CSV!");
  }

  // Exportar PDF
  function exportarPDF() {
    const doc = new jsPDF();
    doc.text("Relatório Escolar", 10, 10);
    let y = 20;
    dadosRelatorio.forEach((r, i) => {
      doc.text(`${i + 1}. ${r.aluno} | ${r.turma} | ${r.disciplina} | ${r.periodo} | Nota: ${r.nota} | Faltas: ${r.faltas}`, 10, y);
      y += 8;
    });
    doc.save("relatorio.pdf");
    toast.success("Relatório exportado em PDF!");
  }

  // Adicionar evento
  function handleAddEvento(e: React.FormEvent) {
    e.preventDefault();
    setEventos([...eventos, { ...novoEvento, id: Date.now() }]);
    setShowAddEvento(false);
    setNovoEvento({ titulo: "", data: format(new Date(), "yyyy-MM-dd"), tipo: "Reunião" });
    toast.success("Evento adicionado!");
  }

  // Remover evento
  function handleRemoveEvento(id: number) {
    setEventos(eventos.filter(e => e.id !== id));
    toast.success("Evento removido!");
  }

  // Aprovar solicitação
  function aprovarSolicitacao(id: number) {
    setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: "Aprovada" } : s));
    toast.success("Solicitação aprovada!");
  }

  // Rejeitar solicitação
  function rejeitarSolicitacao(id: number) {
    setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: "Rejeitada" } : s));
    toast.success("Solicitação rejeitada!");
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Sidebar animada */}
      <motion.aside initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 80 }} className="w-64 bg-white shadow-xl flex flex-col py-8 px-4 min-h-screen">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Painel Diretor</h2>
          <p className="text-sm text-gray-500">{user.name}</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'visao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('visao')}><BarChart2 className="w-5 h-5" /> Visão Geral</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'colaboradores' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('colaboradores')}><Users className="w-5 h-5" /> Colaboradores</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'turmas' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('turmas')}><BookOpen className="w-5 h-5" /> Turmas</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'permissoes' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('permissoes')}><UserCog className="w-5 h-5" /> Permissões</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'relatorios' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('relatorios')}><BookOpen className="w-5 h-5" /> Relatórios</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'eventos' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('eventos')}><Calendar className="w-5 h-5" /> Eventos</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'ranking' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('ranking')}><Award className="w-5 h-5" /> Ranking</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'historico' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('historico')}><Clock className="w-5 h-5" /> Histórico</button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'solicitacoes' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} onClick={() => setSection('solicitacoes')}><Inbox className="w-5 h-5" /> Solicitações</button>
          <a href="/financeiro" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-indigo-50 text-gray-700"><DollarSign className="w-5 h-5" /> Financeiro</a>
          <a href="/documentacao" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-indigo-50 text-gray-700"><FileText className="w-5 h-5" /> Documentação</a>
          <a href="/alimentacao" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-indigo-50 text-gray-700"><UtensilsCrossed className="w-5 h-5" /> Gestão de Alimentação</a>
        </nav>
        <div className="mt-auto pt-8">
          <Button className="w-full flex gap-2 bg-red-100 text-red-700 hover:bg-red-200" onClick={() => window.location.href = '/'}><LogOut className="w-5 h-5" /> Sair</Button>
        </div>
      </motion.aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Painel de Alertas Inteligentes */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div className="mt-1 text-xs text-indigo-600 underline cursor-pointer">Notificar responsável</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Modal de notificação */}
        <AnimatePresence>
          {alertaSelecionado && (
            <motion.div key="modal-alerta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }} transition={{ type: "spring", stiffness: 120 }} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">{alertaSelecionado.icone} {alertaSelecionado.titulo}</h3>
                <p className="text-gray-700 mb-4">{alertaSelecionado.mensagem}</p>
                <form onSubmit={handleEnviarNotificacao} className="flex flex-col gap-4">
                  <div>
                    <label className="font-medium text-sm mb-1 block">Destinatário:</label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                        <input type="checkbox" checked={destinatario.includes('coordenador')} onChange={e => setDestinatario(d => e.target.checked ? [...d, 'coordenador'] : d.filter(x => x !== 'coordenador'))} /> Coordenador
                      </label>
                      <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                        <input type="checkbox" checked={destinatario.includes('professor')} onChange={e => setDestinatario(d => e.target.checked ? [...d, 'professor'] : d.filter(x => x !== 'professor'))} /> Professor
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-sm mb-1 block">Mensagem (opcional):</label>
                    <textarea className="border rounded px-3 py-2 w-full min-h-[60px]" value={mensagem} onChange={e => setMensagem(e.target.value)} placeholder="Digite uma mensagem personalizada..." />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setAlertaSelecionado(null)}>Cancelar</Button>
                    <Button type="submit" disabled={destinatario.length === 0}>Enviar</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-800">Bem-vindo, {user.name}!</h1>
            <p className="text-gray-600">Acesso: <span className="capitalize font-semibold">{user.role}</span></p>
          </div>
        </motion.header>
        {/* Section Content */}
        <AnimatePresence mode="wait">
        {section === 'visao' && (
          <motion.div key="visao" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            {/* Cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[320, 3, 8, 24].map((val, i) => (
                <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible" className="bg-indigo-100 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer">
                  {i === 0 && <Users className="w-8 h-8 text-indigo-600 mb-2" />}
                  {i === 1 && <UserCog className="w-8 h-8 text-indigo-600 mb-2" />}
                  {i === 2 && <BookOpen className="w-8 h-8 text-indigo-600 mb-2" />}
                  {i === 3 && <Users className="w-8 h-8 text-indigo-600 mb-2" />}
                  <span className="text-3xl font-bold text-indigo-700">{val}</span>
                  <span className="text-gray-600 mt-1">{["Alunos", "Coordenadores", "Turmas", "Professores"][i]}</span>
                </motion.div>
              ))}
            </div>
            {/* Gráfico de notas médias */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <h2 className="text-xl font-bold text-indigo-700">Notas médias por turma/turno</h2>
                <div className="flex gap-2 items-center">
                  <select className="border rounded px-2 py-1" value={turnoSelecionado} onChange={e => setTurnoSelecionado(e.target.value)} disabled={compareTurnos}>
                    {TURNOS.map(turno => <option key={turno} value={turno}>{turno}</option>)}
                  </select>
                  <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={compareTurnos} onChange={e => setCompareTurnos(e.target.checked)} className="accent-indigo-500" />
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
        {section === 'colaboradores' && (
          <motion.div key="colaboradores" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-indigo-700">Colaboradores</h2>
              <Button className="flex gap-2" onClick={() => setShowAdd(true)}><Plus className="w-5 h-5" />Adicionar</Button>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-indigo-700">
                    <th className="py-2">Nome</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {colaboradores.map(colab => (
                    <tr key={colab.id} className="border-b last:border-b-0">
                      <td className="py-2 font-medium cursor-pointer hover:underline" title="Ver detalhes">{colab.nome}</td>
                      <td>{colab.email}</td>
                      <td>{colab.tipo}</td>
                      <td>
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveColab(colab.id)}><Trash2 className="w-4 h-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modal de adicionar colaborador (com senha) */}
            <AnimatePresence>
            {showAdd && (
              <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }} transition={{ type: "spring", stiffness: 120 }} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">Adicionar Colaborador</h3>
                  <form onSubmit={handleAddColab} className="flex flex-col gap-4">
                    <input className="border rounded px-3 py-2" placeholder="Nome" required value={novoColab.nome} onChange={e => setNovoColab({ ...novoColab, nome: e.target.value })} />
                    <input className="border rounded px-3 py-2" placeholder="Email" required value={novoColab.email} onChange={e => setNovoColab({ ...novoColab, email: e.target.value })} />
                    <select className="border rounded px-3 py-2" value={novoColab.tipo} onChange={e => setNovoColab({ ...novoColab, tipo: e.target.value })}>
                      <option>Coordenador</option>
                      <option>Professor</option>
                    </select>
                    <input className="border rounded px-3 py-2" placeholder="Senha de acesso" type="password" required value={novoColab.senha} onChange={e => setNovoColab({ ...novoColab, senha: e.target.value })} />
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancelar</Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        )}
        {section === 'turmas' && (
          <motion.div key="turmas" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4 }}>
            <h2 className="text-xl font-bold text-indigo-700 mb-6">Gestão de Turmas</h2>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600">Funcionalidade de gestão de turmas e alunos pode ser expandida aqui.</p>
            </div>
          </motion.div>
        )}
        {section === 'permissoes' && (
          <motion.div key="permissoes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold text-indigo-700 mb-6">Gestão de Permissões</h2>
            <div className="bg-white rounded-xl shadow p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-indigo-700">
                    <th className="py-2">Nome</th>
                    <th>Tipo</th>
                    <th>Permissões</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {permissoes.map(colab => (
                    <tr key={colab.id} className="border-b last:border-b-0">
                      <td className="py-2 font-medium">{colab.nome}</td>
                      <td>{colab.tipo}</td>
                      <td className="text-xs">
                        {Object.entries(PERMISSOES_LABELS).map(([key, label]) => (
                          colab.permissoes[key as PermKey] && <span key={key} className="inline-block bg-indigo-100 text-indigo-700 rounded px-2 py-1 mr-1 mb-1">{label}</span>
                        ))}
                      </td>
                      <td>
                        <Button size="sm" variant="outline" onClick={() => setColabPerm({ ...colab, permissoes: { ...colab.permissoes } })}>Editar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modal editar permissões */}
            <AnimatePresence>
              {colabPerm && (
                <motion.div key="modal-perm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }} transition={{ type: "spring", stiffness: 120 }} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                    <h3 className="text-lg font-bold mb-4">Permissões de {colabPerm.nome}</h3>
                    <div className="flex flex-col gap-3 mb-6">
                      {Object.entries(PERMISSOES_LABELS).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span>{label}</span>
                          <Switch
                            checked={colabPerm.permissoes[key as PermKey]}
                            onChange={(v: boolean) => setColabPerm(c => c ? { ...c, permissoes: { ...c.permissoes, [key]: v } } : c)}
                            className={`${colabPerm.permissoes[key as PermKey] ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                          >
                            <span className="sr-only">Toggle {label}</span>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${colabPerm.permissoes[key as PermKey] ? 'translate-x-6' : 'translate-x-1'}`}/>
                          </Switch>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setColabPerm(null)}>Cancelar</Button>
                      <Button type="button" onClick={handleSalvarPermissoes}>Salvar</Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        {section === 'relatorios' && (
          <motion.div key="relatorios" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold text-indigo-700 mb-6">Relatórios Personalizados</h2>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <select className="border rounded px-3 py-2" value={filtroTurma} onChange={e => setFiltroTurma(e.target.value)}>
                  <option value="">Todas as turmas</option>
                  {TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className="border rounded px-3 py-2" value={filtroDisciplina} onChange={e => setFiltroDisciplina(e.target.value)}>
                  <option value="">Todas as disciplinas</option>
                  {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="border rounded px-3 py-2" value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)}>
                  <option value="">Todos os períodos</option>
                  {PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <Button onClick={exportarCSV} variant="outline">Exportar CSV</Button>
                <Button onClick={exportarPDF} variant="outline">Exportar PDF</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-t">
                  <thead>
                    <tr className="text-indigo-700">
                      <th className="py-2">Aluno</th>
                      <th>Turma</th>
                      <th>Disciplina</th>
                      <th>Período</th>
                      <th>Nota</th>
                      <th>Faltas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosRelatorio.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-4 text-gray-400">Nenhum dado encontrado.</td></tr>
                    ) : dadosRelatorio.map((r, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-2 font-medium">{r.aluno}</td>
                        <td>{r.turma}</td>
                        <td>{r.disciplina}</td>
                        <td>{r.periodo}</td>
                        <td>{r.nota}</td>
                        <td>{r.faltas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        {section === 'eventos' && (
          <motion.div key="eventos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold text-indigo-700 mb-6 flex items-center gap-2"><CalendarDays className="w-6 h-6" /> Gestão de Eventos e Calendário Escolar</h2>
            <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col md:flex-row gap-8">
              {/* Calendário visual */}
              <div className="w-full md:w-2/3">
                <div className="flex items-center justify-between mb-2">
                  <button onClick={() => setMesAtual(subMonths(mesAtual, 1))} className="text-indigo-600 hover:underline">{format(subMonths(mesAtual, 1), "MMM yyyy")}</button>
                  <span className="font-semibold text-lg">{format(mesAtual, "MMMM yyyy")}</span>
                  <button onClick={() => setMesAtual(addMonths(mesAtual, 1))} className="text-indigo-600 hover:underline">{format(addMonths(mesAtual, 1), "MMM yyyy")}</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-indigo-700 mb-1">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => <div key={d}>{d}</div>)}
                </div>
                {/* Dias do mês */}
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const start = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 0 });
                    const end = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 0 });
                    const days = [];
                    let day = start;
                    while (day <= end) {
                      const isCurrentMonth = isSameMonth(day, mesAtual);
                      const isToday = isSameDay(day, new Date());
                      const eventosDia = eventos.filter(e => isSameDay(parseISO(e.data), day));
                      days.push(
                        <div key={day.toString()} className={`rounded-lg p-1 h-10 flex flex-col items-center justify-center border ${isCurrentMonth ? 'bg-indigo-50' : 'bg-gray-50'} ${isToday ? 'border-indigo-400' : 'border-gray-200'} ${eventosDia.length ? 'ring-2 ring-indigo-400' : ''}`}> 
                          <span className={`text-xs ${isCurrentMonth ? 'text-indigo-900' : 'text-gray-400'} ${isToday ? 'font-bold' : ''}`}>{format(day, "d")}</span>
                          {eventosDia.length > 0 && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1"></span>}
                        </div>
                      );
                      day = addDays(day, 1);
                    }
                    return days;
                  })()}
                </div>
              </div>
              {/* Lista de eventos do mês */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-indigo-700">Eventos do mês</span>
                  <button className="flex items-center gap-1 text-indigo-600 hover:underline" onClick={() => setShowAddEvento(true)}><PlusCircle className="w-5 h-5" />Adicionar</button>
                </div>
                <div className="flex flex-col gap-2">
                  {eventosMes.length === 0 ? (
                    <span className="text-gray-400 text-sm">Nenhum evento neste mês.</span>
                  ) : eventosMes.map(ev => (
                    <div key={ev.id} className="flex items-center justify-between bg-indigo-50 rounded-lg px-3 py-2">
                      <div>
                        <div className="font-medium text-indigo-800 text-sm">{ev.titulo}</div>
                        <div className="text-xs text-gray-500">{format(parseISO(ev.data), "dd/MM/yyyy")} • {ev.tipo}</div>
                      </div>
                      <button onClick={() => handleRemoveEvento(ev.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Modal adicionar evento */}
            <AnimatePresence>
              {showAddEvento && (
                <motion.div key="modal-evento" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }} transition={{ type: "spring", stiffness: 120 }} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" />Novo Evento</h3>
                    <form onSubmit={handleAddEvento} className="flex flex-col gap-4">
                      <input className="border rounded px-3 py-2" placeholder="Título do evento" required value={novoEvento.titulo} onChange={e => setNovoEvento({ ...novoEvento, titulo: e.target.value })} />
                      <input className="border rounded px-3 py-2" type="date" required value={novoEvento.data} onChange={e => setNovoEvento({ ...novoEvento, data: e.target.value })} />
                      <select className="border rounded px-3 py-2" value={novoEvento.tipo} onChange={e => setNovoEvento({ ...novoEvento, tipo: e.target.value })}>
                        {TIPO_EVENTO.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowAddEvento(false)}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        {section === 'ranking' && (
          <motion.div key="ranking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold text-indigo-700 mb-6 flex items-center gap-2"><Award className="w-6 h-6" /> Ranking e Métricas de Desempenho</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ranking de alunos */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-indigo-500" /><span className="font-semibold text-indigo-700">Top Alunos</span></div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-indigo-700 text-xs">
                      <th className="py-1">Nome</th>
                      <th>Turma</th>
                      <th>Nota</th>
                      <th>Freq.</th>
                      <th>Part.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRankingAlunos.map((a, i) => (
                      <tr key={a.nome} className={`border-b last:border-b-0 ${i === 0 ? 'bg-yellow-50 font-bold' : ''}`}>
                        <td className="py-1">{a.nome}</td>
                        <td>{a.turma}</td>
                        <td>{a.nota}</td>
                        <td>{a.frequencia}%</td>
                        <td>{a.participacao}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Ranking de turmas */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-indigo-500" /><span className="font-semibold text-indigo-700">Top Turmas</span></div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-indigo-700 text-xs">
                      <th className="py-1">Turma</th>
                      <th>Média</th>
                      <th>Freq.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRankingTurmas.map((t, i) => (
                      <tr key={t.turma} className={`border-b last:border-b-0 ${i === 0 ? 'bg-yellow-50 font-bold' : ''}`}>
                        <td className="py-1">{t.turma}</td>
                        <td>{t.media}</td>
                        <td>{t.frequencia}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Ranking de professores */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4"><UserCog className="w-5 h-5 text-indigo-500" /><span className="font-semibold text-indigo-700">Top Professores</span></div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-indigo-700 text-xs">
                      <th className="py-1">Nome</th>
                      <th>Disciplina</th>
                      <th>Média</th>
                      <th>Part.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRankingProfs.map((p, i) => (
                      <tr key={p.nome} className={`border-b last:border-b-0 ${i === 0 ? 'bg-yellow-50 font-bold' : ''}`}>
                        <td className="py-1">{p.nome}</td>
                        <td>{p.disciplina}</td>
                        <td>{p.media}</td>
                        <td>{p.participacao}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
        </div>
      </div>
          </motion.div>
        )}
        {section === 'historico' && (
          <motion.div key="historico" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold text-indigo-700 mb-6 flex items-center gap-2"><Clock className="w-6 h-6" /> Histórico de Ações (Log de Auditoria)</h2>
            {/*
              // FUTURO: Buscar logs do backend
              // Exemplo:
              // useEffect(() => {
              //   fetch('/api/logs').then(res => res.json()).then(setLogs);
              // }, []);
            */}
            <div className="bg-white rounded-xl shadow p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-indigo-700">
                    <th className="py-2">Usuário</th>
                    <th>Ação</th>
                    <th>Detalhe</th>
                    <th>Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLog.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-4 text-gray-400">Nenhuma ação registrada.</td></tr>
                  ) : mockLog.map(log => (
                    <tr key={log.id} className="border-b last:border-b-0">
                      <td className="py-2 font-medium">{log.usuario}</td>
                      <td>{log.acao}</td>
                      <td>{log.detalhe}</td>
                      <td>{log.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        {section === 'solicitacoes' && (
          <motion.div key="solicitacoes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold text-indigo-700 mb-6 flex items-center gap-2"><Inbox className="w-6 h-6" /> Painel de Solicitações</h2>
            <div className="bg-white rounded-xl shadow p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-indigo-700">
                    <th className="py-2">Tipo</th>
                    <th>Solicitante</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoes.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-4 text-gray-400">Nenhuma solicitação encontrada.</td></tr>
                  ) : solicitacoes.map(s => (
                    <tr key={s.id} className="border-b last:border-b-0">
                      <td className="py-2 font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-400" />{s.tipo}</td>
                      <td>{s.solicitante}</td>
                      <td>
                        {s.status === "Aprovada" && <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 rounded px-2 py-1 text-xs"><CheckCircle2 className="w-4 h-4" />Aprovada</span>}
                        {s.status === "Rejeitada" && <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 rounded px-2 py-1 text-xs"><XCircle className="w-4 h-4" />Rejeitada</span>}
                        {s.status === "Pendente" && <span className="inline-flex items-center gap-1 text-yellow-800 bg-yellow-100 rounded px-2 py-1 text-xs">Pendente</span>}
                      </td>
                      <td>{s.data}</td>
                      <td>
                        {s.status === "Pendente" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => aprovarSolicitacao(s.id)}>Aprovar</Button>
                            <Button size="sm" variant="destructive" onClick={() => rejeitarSolicitacao(s.id)}>Rejeitar</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
} 
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocation } from "wouter";
import { 
  File,
  FileText,
  FolderOpen,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  BookOpen,
  Users,
  FileCheck,
  ArrowLeft,
  LogOut,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileWarning,
  Building,
  Handshake,
  GraduationCap,
  Link,
  Bell,
  DollarSign,
  Share2,
  ExternalLink,
  BookOpenCheck
} from "lucide-react";

// Dados mock para documentos institucionais
const mockDocumentosInstitucionais = [
  { id: 1, nome: "Projeto Político Pedagógico", tipo: "PDF", tamanho: "2.4 MB", dataCriacao: "2023-12-10", ultimaAtualizacao: "2024-02-15", autor: "Diretoria" },
  { id: 2, nome: "Regimento Escolar", tipo: "PDF", tamanho: "1.8 MB", dataCriacao: "2023-11-05", ultimaAtualizacao: "2024-01-20", autor: "Conselho Escolar" },
  { id: 3, nome: "Plano de Desenvolvimento Institucional", tipo: "DOCX", tamanho: "3.2 MB", dataCriacao: "2024-01-15", ultimaAtualizacao: "2024-03-10", autor: "Coordenação Pedagógica" },
  { id: 4, nome: "Manual do Professor", tipo: "PDF", tamanho: "5.1 MB", dataCriacao: "2023-12-20", ultimaAtualizacao: "2024-02-05", autor: "Coordenação Pedagógica" },
  { id: 5, nome: "Plano de Contingência", tipo: "PDF", tamanho: "1.5 MB", dataCriacao: "2024-02-10", ultimaAtualizacao: "2024-02-10", autor: "Diretoria" },
];

// Dados mock para atas de reuniões
const mockAtas = [
  { id: 1, titulo: "Reunião Conselho Escolar", data: "2024-06-02", participantes: 12, responsavel: "Maria Silva", status: "Aprovada" },
  { id: 2, titulo: "Reunião Pais e Mestres", data: "2024-05-25", participantes: 45, responsavel: "João Souza", status: "Pendente" },
  { id: 3, titulo: "Planejamento Pedagógico", data: "2024-05-18", participantes: 8, responsavel: "Ana Lima", status: "Aprovada" },
  { id: 4, titulo: "Conselho de Classe", data: "2024-05-10", participantes: 15, responsavel: "Carlos Mendes", status: "Aprovada" },
  { id: 5, titulo: "Reunião Diretoria", data: "2024-04-28", participantes: 5, responsavel: "Maria Silva", status: "Aprovada" },
];

// Dados mock para contratos e convênios
const mockContratos = [
  { id: 1, titulo: "Fornecimento Material Didático", parceiro: "Editora Moderna", inicio: "2024-01-15", fim: "2024-12-31", valor: 85000, status: "Ativo" },
  { id: 2, titulo: "Manutenção Laboratórios", parceiro: "TechLab Serviços", inicio: "2024-02-01", fim: "2024-12-31", valor: 36000, status: "Ativo" },
  { id: 3, titulo: "Transporte Escolar", parceiro: "TransEscolar", inicio: "2024-01-01", fim: "2024-12-31", valor: 120000, status: "Ativo" },
  { id: 4, titulo: "Fornecimento Merenda", parceiro: "Nutri Alimentação", inicio: "2024-03-01", fim: "2024-11-30", valor: 76000, status: "Em análise" },
  { id: 5, titulo: "Serviços de Limpeza", parceiro: "Clean Serviços", inicio: "2023-11-01", fim: "2024-10-31", valor: 48000, status: "Ativo" },
];

// Dados mock para legislação educacional
const mockLegislacao = [
  { id: 1, titulo: "LDB - Lei de Diretrizes e Bases", numero: "Lei nº 9.394/96", dataPublicacao: "1996-12-20", ambito: "Federal", categoria: "Lei" },
  { id: 2, titulo: "Plano Nacional de Educação", numero: "Lei nº 13.005/14", dataPublicacao: "2014-06-25", ambito: "Federal", categoria: "Lei" },
  { id: 3, titulo: "Base Nacional Comum Curricular", numero: "Resolução CNE/CP nº 2", dataPublicacao: "2017-12-22", ambito: "Federal", categoria: "Resolução" },
  { id: 4, titulo: "Calendário Escolar", numero: "Portaria SME nº 32/24", dataPublicacao: "2024-01-10", ambito: "Municipal", categoria: "Portaria" },
  { id: 5, titulo: "Diretrizes Curriculares Estaduais", numero: "Resolução SEE nº 458", dataPublicacao: "2023-11-15", ambito: "Estadual", categoria: "Resolução" },
];

// Dados mock para documentos dos alunos
const mockDocumentosAlunos = [
  { id: 1, aluno: "Lucas Silva", turma: "9º Ano A", tipo: "Histórico Escolar", dataEnvio: "2024-03-15", status: "Completo" },
  { id: 2, aluno: "Ana Souza", turma: "8º Ano B", tipo: "Transferência", dataEnvio: "2024-04-10", status: "Pendente" },
  { id: 3, aluno: "Pedro Lima", turma: "7º Ano A", tipo: "Certidão de Nascimento", dataEnvio: "2024-02-20", status: "Completo" },
  { id: 4, aluno: "Carla Mendes", turma: "9º Ano B", tipo: "Atestado Médico", dataEnvio: "2024-05-05", status: "Completo" },
  { id: 5, aluno: "Rafael Costa", turma: "6º Ano C", tipo: "RG/CPF", dataEnvio: "2024-05-12", status: "Pendente" },
];

// Constantes para filtros
const TIPOS_DOCUMENTO = ["PDF", "DOCX", "XLSX", "JPG", "PNG"];
const STATUS_OPTIONS = ["Todos", "Pendente", "Completo", "Aprovada", "Em análise", "Ativo", "Inativo"];
const AMBITOS = ["Federal", "Estadual", "Municipal"];
const CATEGORIAS_LEGISLACAO = ["Lei", "Decreto", "Resolução", "Portaria", "Parecer"];

export default function Documentacao() {
  const [section, setSection] = useState("institucionais");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroAmbito, setFiltroAmbito] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [location, setLocation] = useLocation();

  // Função para navegar para o dashboard
  const navegarParaDashboard = () => {
    setLocation("/dashboard/diretor");
  };

  // Animação de cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Sidebar animada */}
      <motion.aside 
        initial={{ x: -80, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 80 }} 
        className="w-64 bg-white shadow-xl flex flex-col py-8 px-4 min-h-screen"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Gestão de Documentação</h2>
          <p className="text-sm text-gray-500">Escola Digital 3D</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'institucionais' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('institucionais')}
          >
            <Building className="w-5 h-5" /> 
            <span className="text-left">Documentos Institucionais</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'atas' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('atas')}
          >
            <FileCheck className="w-5 h-5" /> Atas de Reuniões
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'contratos' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('contratos')}
          >
            <Handshake className="w-5 h-5" /> Contratos e Convênios
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'legislacao' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('legislacao')}
          >
            <BookOpen className="w-5 h-5" /> Legislação Educacional
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'alunos' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('alunos')}
          >
            <GraduationCap className="w-5 h-5" /> 
            <span className="text-left">Documentos dos Alunos</span>
          </button>
        </nav>
        <div className="mt-auto pt-8">
          <button 
            onClick={navegarParaDashboard}
            className="w-full flex gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2 mb-3"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar ao Dashboard
          </button>
          <button className="w-full flex gap-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg px-3 py-2">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </motion.aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Cabeçalho */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-indigo-800">
            {section === 'institucionais' && 'Documentos Institucionais'}
            {section === 'atas' && 'Registro de Atas de Reuniões'}
            {section === 'contratos' && 'Contratos e Convênios'}
            {section === 'legislacao' && 'Legislação Educacional'}
            {section === 'alunos' && 'Documentos dos Alunos'}
          </h1>
        </motion.header>

        {/* Conteúdo de cada seção */}
        <AnimatePresence mode="wait">
          {/* SEÇÃO: DOCUMENTOS INSTITUCIONAIS */}
          {section === 'institucionais' && (
            <motion.div
              key="institucionais"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Barra de ferramentas e filtros */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-4 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Pesquisar documento..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      className="border rounded px-3 py-2"
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                      <option value="">Todos os tipos</option>
                      {TIPOS_DOCUMENTO.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    
                    <button 
                      onClick={() => toast.success("Novo documento pode ser adicionado aqui")}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar
                    </button>
                    
                    <button 
                      onClick={() => toast.success("Documentos selecionados em lote")}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-3 py-2"
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Lista de documentos institucionais */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Building className="h-5 w-5 text-indigo-600" /> Documentos Institucionais
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Documentos exportados!")}
                      className="px-3 py-1.5 text-sm rounded-md bg-green-100 text-green-700 flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" /> Exportar
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tamanho
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Última Atualização
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Autor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockDocumentosInstitucionais
                        .filter(doc => 
                          (!filtroTipo || doc.tipo === filtroTipo) &&
                          (!filtroTexto || doc.nome.toLowerCase().includes(filtroTexto.toLowerCase()))
                        )
                        .map((documento) => (
                        <tr key={documento.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{documento.nome}</div>
                                <div className="text-sm text-gray-500">Criado em: {format(new Date(documento.dataCriacao), "dd/MM/yyyy")}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {documento.tipo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {documento.tamanho}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(documento.ultimaAtualizacao), "dd/MM/yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {documento.autor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toast.success(`Visualizando: ${documento.nome}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Editando: ${documento.nome}`)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Compartilhado: ${documento.nome}`)}
                                className="text-green-600 hover:text-green-900"
                                title="Compartilhar"
                              >
                                <Link className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Documento excluído: ${documento.nome}`)}
                                className="text-red-600 hover:text-red-900"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Estatísticas e informações adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <File className="h-5 w-5 text-indigo-600" /> Estatísticas
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total de documentos:</span>
                      <span className="font-semibold">{mockDocumentosInstitucionais.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Documentos PDF:</span>
                      <span className="font-semibold">{mockDocumentosInstitucionais.filter(d => d.tipo === "PDF").length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Documentos DOCX:</span>
                      <span className="font-semibold">{mockDocumentosInstitucionais.filter(d => d.tipo === "DOCX").length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Atualizados (último mês):</span>
                      <span className="font-semibold">3</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" /> Pendências
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Plano Anual precisa ser atualizado em 15 dias</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Regimento Escolar precisa de aprovação do conselho</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-100 p-1 rounded mr-2 mt-0.5">
                        <FileWarning className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Plano de Contingência vencido - precisa atualizar</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  custom={2} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-indigo-600" /> Ações Rápidas
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => toast.success("Upload iniciado!")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <Upload className="h-4 w-4" /> Fazer Upload
                    </button>
                    <button
                      onClick={() => toast.success("Verificação iniciada!")}
                      className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-lg px-3 py-2 hover:bg-green-200"
                    >
                      <CheckCircle className="h-4 w-4" /> Verificar Pendências
                    </button>
                    <button
                      onClick={() => toast.success("Permissões podem ser ajustadas aqui")}
                      className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-200"
                    >
                      <Users className="h-4 w-4" /> Ajustar Permissões
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SEÇÃO: ATAS DE REUNIÕES */}
          {section === 'atas' && (
            <motion.div
              key="atas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Barra de ferramentas e filtros */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-4 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Pesquisar ata..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      className="border rounded px-3 py-2"
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                      <option value="">Todos os status</option>
                      <option value="Aprovada">Aprovada</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                    
                    <button 
                      onClick={() => toast.success("Nova ata pode ser registrada aqui")}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                    >
                      <Plus className="w-4 h-4" /> Nova Ata
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Lista de atas de reuniões */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-indigo-600" /> Atas de Reuniões
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Relatório de atas exportado!")}
                      className="px-3 py-1.5 text-sm rounded-md bg-green-100 text-green-700 flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" /> Exportar
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participantes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Responsável
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockAtas
                        .filter(ata => 
                          (!filtroStatus || ata.status === filtroStatus) &&
                          (!filtroTexto || ata.titulo.toLowerCase().includes(filtroTexto.toLowerCase()))
                        )
                        .map((ata) => (
                        <tr key={ata.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{ata.titulo}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(ata.data), "dd/MM/yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ata.participantes} pessoas
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ata.responsavel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${ata.status === 'Aprovada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {ata.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toast.success(`Visualizando: ${ata.titulo}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Editando: ${ata.titulo}`)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {ata.status === 'Pendente' && (
                                <button
                                  onClick={() => toast.success(`Ata aprovada: ${ata.titulo}`)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Aprovar"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => toast.success(`Ata excluída: ${ata.titulo}`)}
                                className="text-red-600 hover:text-red-900"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Calendário de reuniões */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" /> Próximas Reuniões Agendadas
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-indigo-800">Reunião Conselho Escolar</h4>
                      <span className="text-sm text-indigo-600">15/06/2024 - 14:00</span>
                    </div>
                    <p className="text-sm text-indigo-700 mb-2">Pauta: Aprovação de novos projetos pedagógicos</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-indigo-600">8 participantes confirmados</span>
                      <button
                        onClick={() => toast.success("Detalhes da reunião")}
                        className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-blue-800">Reunião de Pais e Mestres</h4>
                      <span className="text-sm text-blue-600">20/06/2024 - 19:00</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">Pauta: Resultados do 1º semestre e planejamento</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-600">45 participantes esperados</span>
                      <button
                        onClick={() => toast.success("Detalhes da reunião")}
                        className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-green-800">Conselho de Classe</h4>
                      <span className="text-sm text-green-600">25/06/2024 - 13:30</span>
                    </div>
                    <p className="text-sm text-green-700 mb-2">Pauta: Avaliação do desempenho dos alunos do 9º ano</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-green-600">12 professores + coordenação</span>
                      <button
                        onClick={() => toast.success("Detalhes da reunião")}
                        className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => toast.success("Nova reunião pode ser agendada aqui")}
                      className="flex items-center gap-1 bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
                    >
                      <Plus className="w-4 h-4" /> Agendar Nova Reunião
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SEÇÃO: CONTRATOS E CONVÊNIOS */}
          {section === 'contratos' && (
            <motion.div
              key="contratos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Barra de ferramentas e filtros */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-4 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Pesquisar contrato..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      className="border rounded px-3 py-2"
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                      <option value="">Todos os status</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Em análise">Em análise</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                    
                    <button 
                      onClick={() => toast.success("Novo contrato pode ser adicionado aqui")}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                    >
                      <Plus className="w-4 h-4" /> Novo Contrato
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Lista de contratos */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Handshake className="h-5 w-5 text-indigo-600" /> Contratos e Convênios
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Contratos exportados!")}
                      className="px-3 py-1.5 text-sm rounded-md bg-green-100 text-green-700 flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" /> Exportar
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parceiro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Período
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor (R$)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockContratos
                        .filter(contrato => 
                          (!filtroStatus || contrato.status === filtroStatus) &&
                          (!filtroTexto || contrato.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                                          contrato.parceiro.toLowerCase().includes(filtroTexto.toLowerCase()))
                        )
                        .map((contrato) => (
                        <tr key={contrato.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{contrato.titulo}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contrato.parceiro}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(contrato.inicio), "dd/MM/yyyy")} a {format(new Date(contrato.fim), "dd/MM/yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contrato.valor.toLocaleString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${contrato.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                                contrato.status === 'Em análise' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {contrato.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toast.success(`Visualizando: ${contrato.titulo}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Editando: ${contrato.titulo}`)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Contrato excluído: ${contrato.titulo}`)}
                                className="text-red-600 hover:text-red-900"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Resumo de valores */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-indigo-600" /> Resumo Financeiro de Contratos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-xs text-green-700 uppercase font-semibold mb-1">Total Contratos Ativos</div>
                    <div className="text-2xl font-bold text-green-700">
                      R$ {mockContratos
                        .filter(c => c.status === 'Ativo')
                        .reduce((sum, c) => sum + c.valor, 0)
                        .toLocaleString('pt-BR')}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xs text-blue-700 uppercase font-semibold mb-1">Maior Contrato</div>
                    <div className="text-2xl font-bold text-blue-700">
                      R$ {Math.max(...mockContratos.map(c => c.valor)).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="text-xs text-amber-700 uppercase font-semibold mb-1">Em Análise</div>
                    <div className="text-2xl font-bold text-amber-700">
                      R$ {mockContratos
                        .filter(c => c.status === 'Em análise')
                        .reduce((sum, c) => sum + c.valor, 0)
                        .toLocaleString('pt-BR')}
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="text-xs text-indigo-700 uppercase font-semibold mb-1">Quantidade</div>
                    <div className="text-2xl font-bold text-indigo-700">
                      {mockContratos.length} contratos
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Alertas de Vencimento</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-red-100 p-1 rounded mr-2 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-sm text-gray-600">
                        O contrato de <span className="font-medium">Serviços de Limpeza</span> vencerá em 3 meses
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-sm text-gray-600">
                        Parcela do contrato de <span className="font-medium">Material Didático</span> vence em 15 dias
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SEÇÃO: LEGISLAÇÃO EDUCACIONAL */}
          {section === 'legislacao' && (
            <motion.div
              key="legislacao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Barra de ferramentas e filtros */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-4 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Pesquisar legislação..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <select 
                      className="border rounded px-3 py-2"
                      value={filtroAmbito}
                      onChange={(e) => setFiltroAmbito(e.target.value)}
                    >
                      <option value="">Todos os âmbitos</option>
                      {AMBITOS.map(ambito => (
                        <option key={ambito} value={ambito}>{ambito}</option>
                      ))}
                    </select>
                    
                    <select 
                      className="border rounded px-3 py-2"
                      value={filtroCategoria}
                      onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      {CATEGORIAS_LEGISLACAO.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                    
                    <button 
                      onClick={() => toast.success("Nova legislação pode ser cadastrada aqui")}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Lista de legislação */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" /> Legislação Educacional
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Legislação exportada!")}
                      className="px-3 py-1.5 text-sm rounded-md bg-green-100 text-green-700 flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" /> Exportar
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Número/Referência
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Publicação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Âmbito
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockLegislacao
                        .filter(leg => 
                          (!filtroAmbito || leg.ambito === filtroAmbito) &&
                          (!filtroCategoria || leg.categoria === filtroCategoria) &&
                          (!filtroTexto || leg.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                                          leg.numero.toLowerCase().includes(filtroTexto.toLowerCase()))
                        )
                        .map((legislacao) => (
                        <tr key={legislacao.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{legislacao.titulo}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                            {legislacao.numero}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(legislacao.dataPublicacao), "dd/MM/yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${legislacao.ambito === 'Federal' ? 'bg-blue-100 text-blue-800' : 
                                legislacao.ambito === 'Estadual' ? 'bg-purple-100 text-purple-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {legislacao.ambito}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${legislacao.categoria === 'Lei' ? 'bg-indigo-100 text-indigo-800' : 
                                legislacao.categoria === 'Resolução' ? 'bg-amber-100 text-amber-800' : 
                                legislacao.categoria === 'Portaria' ? 'bg-teal-100 text-teal-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {legislacao.categoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toast.success(`Visualizando: ${legislacao.titulo}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Link externo para: ${legislacao.titulo}`)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Link Externo"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Compartilhado: ${legislacao.titulo}`)}
                                className="text-green-600 hover:text-green-900"
                                title="Compartilhar"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Download da legislação: ${legislacao.titulo}`)}
                                className="text-amber-600 hover:text-amber-900"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Informações complementares */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <File className="h-5 w-5 text-indigo-600" /> Estatísticas
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total de legislação:</span>
                      <span className="font-semibold">{mockLegislacao.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Leis federais:</span>
                      <span className="font-semibold">{mockLegislacao.filter(d => d.ambito === "Federal" && d.categoria === "Lei").length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Resoluções:</span>
                      <span className="font-semibold">{mockLegislacao.filter(d => d.categoria === "Resolução").length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Portarias:</span>
                      <span className="font-semibold">{mockLegislacao.filter(d => d.categoria === "Portaria").length}</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" /> Atualizações Recentes
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded mr-2 mt-0.5">
                        <BookOpenCheck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Nova resolução sobre avaliação escolar</p>
                        <p className="text-xs text-gray-500">Publicada em 20/05/2024</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Alteração na Lei de Diretrizes e Bases</p>
                        <p className="text-xs text-gray-500">Atualização em 10/04/2024</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-100 p-1 rounded mr-2 mt-0.5">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Novo plano estadual de educação</p>
                        <p className="text-xs text-gray-500">Publicado em 05/03/2024</p>
                      </div>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  custom={2} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-indigo-600" /> Ações Rápidas
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => toast.success("Iniciando busca avançada de legislação")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <Search className="h-4 w-4" /> Busca Avançada
                    </button>
                    <button
                      onClick={() => toast.success("Acessando informativo de legislação")}
                      className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-lg px-3 py-2 hover:bg-green-200"
                    >
                      <ExternalLink className="h-4 w-4" /> Acessar Portal MEC
                    </button>
                    <button
                      onClick={() => toast.success("Verificando atualizações pendentes")}
                      className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-200"
                    >
                      <Clock className="h-4 w-4" /> Verificar Atualizações
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Lembrete:</h4>
                    <p className="text-xs text-gray-600">É importante manter-se atualizado sobre as mudanças na legislação educacional para garantir que a escola esteja em conformidade com as normas vigentes.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SEÇÃO: DOCUMENTOS DOS ALUNOS */}
          {section === 'alunos' && (
            <motion.div
              key="alunos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Barra de ferramentas e filtros */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-4 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Pesquisar por aluno ou documento..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      className="border rounded px-3 py-2"
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                      <option value="">Todos os status</option>
                      <option value="Completo">Completo</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                    
                    <button 
                      onClick={() => toast.success("Upload de novo documento")}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                    >
                      <Upload className="w-4 h-4" /> Upload
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Lista de documentos dos alunos */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-indigo-600" /> Documentação dos Alunos
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Relatório de documentação exportado!")}
                      className="px-3 py-1.5 text-sm rounded-md bg-green-100 text-green-700 flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" /> Exportar
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aluno
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Turma
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de Documento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Envio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockDocumentosAlunos
                        .filter(doc => 
                          (!filtroStatus || doc.status === filtroStatus) &&
                          (!filtroTexto || doc.aluno.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                                          doc.tipo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                                          doc.turma.toLowerCase().includes(filtroTexto.toLowerCase()))
                        )
                        .map((doc, index) => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{doc.aluno}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.turma}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="ml-3 text-sm text-gray-900">{doc.tipo}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(doc.dataEnvio), "dd/MM/yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${doc.status === 'Completo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toast.success(`Visualizando documento de ${doc.aluno}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Download do documento de ${doc.aluno}`)}
                                className="text-green-600 hover:text-green-900"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              {doc.status === 'Pendente' && (
                                <button
                                  onClick={() => toast.success(`Aprovado: ${doc.tipo} de ${doc.aluno}`)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Marcar como Completo"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Estatísticas e pendências */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6 md:col-span-2"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" /> Pendências por Turma
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-amber-50 rounded-lg p-4">
                        <div className="font-medium text-amber-800 mb-1">9º Ano A</div>
                        <div className="text-2xl font-bold text-amber-700">4 <span className="text-sm font-normal">pendências</span></div>
                        <div className="text-xs text-amber-600 mt-1">2 alunos com documentos atrasados</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="font-medium text-red-800 mb-1">8º Ano B</div>
                        <div className="text-2xl font-bold text-red-700">7 <span className="text-sm font-normal">pendências</span></div>
                        <div className="text-xs text-red-600 mt-1">5 alunos com documentos atrasados</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="font-medium text-green-800 mb-1">7º Ano A</div>
                        <div className="text-2xl font-bold text-green-700">1 <span className="text-sm font-normal">pendência</span></div>
                        <div className="text-xs text-green-600 mt-1">1 aluno com documento atrasado</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-3">Documentos mais pendentes:</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-2 h-6 bg-red-500 rounded-sm mr-3"></div>
                            <span className="text-gray-700">Histórico Escolar</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-900">5</span>
                            <button 
                              onClick={() => toast.success("Notificação enviada aos responsáveis")}
                              className="ml-3 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded"
                            >
                              Notificar
                            </button>
                          </div>
                        </li>
                        <li className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-2 h-6 bg-amber-500 rounded-sm mr-3"></div>
                            <span className="text-gray-700">Certidão de Nascimento</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-900">3</span>
                            <button 
                              onClick={() => toast.success("Notificação enviada aos responsáveis")}
                              className="ml-3 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded"
                            >
                              Notificar
                            </button>
                          </div>
                        </li>
                        <li className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-2 h-6 bg-blue-500 rounded-sm mr-3"></div>
                            <span className="text-gray-700">RG/CPF</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-900">2</span>
                            <button 
                              onClick={() => toast.success("Notificação enviada aos responsáveis")}
                              className="ml-3 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded"
                            >
                              Notificar
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
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
                    <FolderOpen className="h-5 w-5 text-indigo-600" /> Ações Rápidas
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => toast.success("Gerenciando solicitações de documentos")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <Plus className="h-4 w-4" /> Solicitar Documentos
                    </button>
                    <button
                      onClick={() => toast.success("Notificações enviadas aos responsáveis")}
                      className="w-full flex items-center justify-center gap-2 bg-amber-100 text-amber-700 rounded-lg px-3 py-2 hover:bg-amber-200"
                    >
                      <Bell className="h-4 w-4" /> Notificar Pendências
                    </button>
                    <button
                      onClick={() => toast.success("Gerando relatório de documentação")}
                      className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-200"
                    >
                      <FileText className="h-4 w-4" /> Gerar Relatório
                    </button>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Documentação completa:</h4>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-600">Alunos com docs completos:</div>
                      <div className="text-sm font-semibold text-green-600">87%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "87%" }}></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 
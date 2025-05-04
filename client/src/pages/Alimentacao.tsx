import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { useLocation } from "wouter";
import { 
  UtensilsCrossed,
  FileText,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  ArrowLeft,
  LogOut,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Database,
  Package,
  Users,
  BarChart,
  Download,
  Upload,
  FileCheck,
  Truck,
  DollarSign
} from "lucide-react";

// Dados mock para cardápio
const mockCardapio = [
  { id: 1, dia: "2024-06-03", categoria: "Almoço", refeicao: "Arroz, feijão, filé de frango, salada de alface e tomate, suco de laranja", restricao: "Sem restrições" },
  { id: 2, dia: "2024-06-03", categoria: "Lanche", refeicao: "Sanduíche natural e suco de uva", restricao: "Sem restrições" },
  { id: 3, dia: "2024-06-04", categoria: "Almoço", refeicao: "Arroz, feijão, carne moída, purê de batata, salada de cenoura, suco de maracujá", restricao: "Sem lactose" },
  { id: 4, dia: "2024-06-04", categoria: "Lanche", refeicao: "Bolo de chocolate e leite com achocolatado", restricao: "Sem glúten" },
  { id: 5, dia: "2024-06-05", categoria: "Almoço", refeicao: "Macarrão à bolonhesa, salada mista, suco de abacaxi", restricao: "Vegetariano disponível" },
];

// Dados mock para estoque
const mockEstoque = [
  { id: 1, produto: "Arroz", quantidade: 120, unidade: "kg", validade: "2024-12-10", categoria: "Grãos", status: "Normal" },
  { id: 2, produto: "Feijão", quantidade: 80, unidade: "kg", validade: "2024-11-25", categoria: "Grãos", status: "Normal" },
  { id: 3, produto: "Óleo de Soja", quantidade: 35, unidade: "litros", validade: "2024-10-15", categoria: "Óleos", status: "Baixo" },
  { id: 4, produto: "Leite", quantidade: 50, unidade: "litros", validade: "2024-06-20", categoria: "Lácteos", status: "Atenção" },
  { id: 5, produto: "Frango", quantidade: 45, unidade: "kg", validade: "2024-07-08", categoria: "Proteínas", status: "Normal" },
];

// Dados mock para fornecedores
const mockFornecedores = [
  { id: 1, nome: "Alimentos Naturais Ltda", tipo: "Hortifrutigranjeiros", contato: "Marcos Silva", telefone: "(11) 98765-4321", ultimaEntrega: "2024-05-28", proximaEntrega: "2024-06-05" },
  { id: 2, nome: "Laticínios Puro Leite", tipo: "Lácteos", contato: "Ana Paula", telefone: "(11) 91234-5678", ultimaEntrega: "2024-05-25", proximaEntrega: "2024-06-08" },
  { id: 3, nome: "Grãos & Cia", tipo: "Grãos e Cereais", contato: "João Mendes", telefone: "(11) 94567-8901", ultimaEntrega: "2024-05-30", proximaEntrega: "2024-06-15" },
  { id: 4, nome: "Frigorífico Bom Corte", tipo: "Carnes", contato: "Ricardo Gomes", telefone: "(11) 92345-6789", ultimaEntrega: "2024-05-26", proximaEntrega: "2024-06-02" },
  { id: 5, nome: "Distribuidora Sabor Total", tipo: "Diversos", contato: "Carla Santos", telefone: "(11) 99876-5432", ultimaEntrega: "2024-05-20", proximaEntrega: "2024-06-10" },
];

// Dados mock para nutricionista
const mockNutricionista = {
  nome: "Dra. Juliana Costa",
  crn: "CRN-3 12345",
  email: "juliana.costa@escola.com",
  telefone: "(11) 98765-4321",
  horarios: [
    { dia: "Segunda-feira", horario: "08:00 - 12:00" },
    { dia: "Quarta-feira", horario: "13:00 - 17:00" },
    { dia: "Sexta-feira", horario: "08:00 - 12:00" }
  ],
  proximasVisitas: [
    { data: "2024-06-05", atividade: "Supervisão do preparo do almoço" },
    { data: "2024-06-12", atividade: "Avaliação nutricional de alunos" },
    { data: "2024-06-19", atividade: "Treinamento com equipe da cozinha" }
  ]
};

// Dados mock para relatórios de consumo
const mockRelatoriosConsumo = [
  { id: 1, mes: "Janeiro", alunosAtendidos: 320, mediaRefeicoesDia: 290, custoTotal: 28500, custoAluno: 89.06 },
  { id: 2, mes: "Fevereiro", alunosAtendidos: 318, mediaRefeicoesDia: 285, custoTotal: 27800, custoAluno: 87.42 },
  { id: 3, mes: "Março", alunosAtendidos: 325, mediaRefeicoesDia: 295, custoTotal: 29200, custoAluno: 89.85 },
  { id: 4, mes: "Abril", alunosAtendidos: 322, mediaRefeicoesDia: 290, custoTotal: 28900, custoAluno: 89.75 },
  { id: 5, mes: "Maio", alunosAtendidos: 324, mediaRefeicoesDia: 292, custoTotal: 29100, custoAluno: 89.81 },
];

export default function Alimentacao() {
  const [section, setSection] = useState("cardapio");
  const [filtroTexto, setFiltroTexto] = useState("");
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
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Gestão de Alimentação</h2>
          <p className="text-sm text-gray-500">Escola Digital 3D</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'cardapio' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('cardapio')}
          >
            <Calendar className="w-5 h-5" /> 
            <span className="text-left">Cardápio Escolar</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'estoque' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('estoque')}
          >
            <Database className="w-5 h-5" /> Controle de Estoque
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'fornecedores' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('fornecedores')}
          >
            <Truck className="w-5 h-5" /> Fornecedores
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'nutricionista' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('nutricionista')}
          >
            <Users className="w-5 h-5" /> Nutricionista
          </button>
          <button 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${section === 'relatorios' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`} 
            onClick={() => setSection('relatorios')}
          >
            <BarChart className="w-5 h-5" /> 
            <span className="text-left">Relatórios de Consumo</span>
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
            {section === 'cardapio' && 'Cardápio Escolar'}
            {section === 'estoque' && 'Controle de Estoque'}
            {section === 'fornecedores' && 'Gestão de Fornecedores'}
            {section === 'nutricionista' && 'Acompanhamento Nutricional'}
            {section === 'relatorios' && 'Relatórios de Consumo'}
          </h1>
        </motion.header>

        {/* Conteúdo das seções */}
        <AnimatePresence mode="wait">
          {/* SEÇÃO: CARDÁPIO ESCOLAR */}
          {section === 'cardapio' && (
            <motion.div
              key="cardapio"
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
                        placeholder="Pesquisar no cardápio..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Nova refeição adicionada ao cardápio")}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar
                    </button>
                    
                    <button 
                      onClick={() => toast.success("Cardápio semanal exportado!")}
                      className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg px-3 py-2"
                    >
                      <Download className="w-4 h-4" /> Exportar
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Cardápio Semanal */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" /> Cardápio Semanal
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Refeição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Restrições
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockCardapio
                        .filter(item => 
                          !filtroTexto || 
                          item.refeicao.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                          item.categoria.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                          item.restricao.toLowerCase().includes(filtroTexto.toLowerCase())
                        )
                        .map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                            {format(parseISO(item.dia), "dd/MM/yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${item.categoria === 'Almoço' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                              {item.categoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-md">
                            <div className="line-clamp-2">{item.refeicao}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.restricao !== "Sem restrições" ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                {item.restricao}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">Nenhuma</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toast.success(`Visualizando detalhes: ${item.categoria} de ${format(parseISO(item.dia), "dd/MM")}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Editando: ${item.categoria} de ${format(parseISO(item.dia), "dd/MM")}`)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Item removido do cardápio: ${item.categoria} de ${format(parseISO(item.dia), "dd/MM")}`)}
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

              {/* Informações e estatísticas sobre o cardápio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card de estatísticas */}
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-indigo-600" /> Estatísticas da Semana
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total de refeições:</span>
                      <span className="font-semibold">{mockCardapio.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Almoços:</span>
                      <span className="font-semibold">{mockCardapio.filter(item => item.categoria === "Almoço").length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Lanches:</span>
                      <span className="font-semibold">{mockCardapio.filter(item => item.categoria === "Lanche").length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Com restrições alimentares:</span>
                      <span className="font-semibold">{mockCardapio.filter(item => item.restricao !== "Sem restrições").length}</span>
                    </li>
                  </ul>
                </motion.div>
                
                {/* Card de restrições alimentares */}
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" /> Alunos com Restrições
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="flex items-center">
                        <div className="w-2 h-4 bg-red-500 rounded-sm mr-2"></div>
                        <span className="text-gray-600">Alergia a glúten</span>
                      </span>
                      <span className="font-semibold">8 alunos</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="flex items-center">
                        <div className="w-2 h-4 bg-amber-500 rounded-sm mr-2"></div>
                        <span className="text-gray-600">Intolerância à lactose</span>
                      </span>
                      <span className="font-semibold">12 alunos</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="flex items-center">
                        <div className="w-2 h-4 bg-green-500 rounded-sm mr-2"></div>
                        <span className="text-gray-600">Vegetarianos/Veganos</span>
                      </span>
                      <span className="font-semibold">5 alunos</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="flex items-center">
                        <div className="w-2 h-4 bg-purple-500 rounded-sm mr-2"></div>
                        <span className="text-gray-600">Diabetes</span>
                      </span>
                      <span className="font-semibold">3 alunos</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toast.success("Relatório de restrições alimentares gerado")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <FileText className="h-4 w-4" /> Ver Relatório Completo
                    </button>
                  </div>
                </motion.div>
                
                {/* Card de ações rápidas */}
                <motion.div 
                  custom={2} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" /> Ações Rápidas
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => toast.success("Planejamento do cardápio mensal iniciado")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <Calendar className="h-4 w-4" /> Planejar Cardápio Mensal
                    </button>
                    <button
                      onClick={() => toast.success("Cardápio publicado para os pais")}
                      className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-lg px-3 py-2 hover:bg-green-200"
                    >
                      <CheckCircle className="h-4 w-4" /> Publicar para Pais/Alunos
                    </button>
                    <button
                      onClick={() => toast.success("Notificação sobre alterações enviada")}
                      className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-200"
                    >
                      <AlertTriangle className="h-4 w-4" /> Notificar Alterações
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Próxima revisão com nutricionista:</div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-amber-800">10/06/2024 - 14:00</div>
                      <div className="text-xs text-amber-600 mt-1">Planejamento para cardápio de julho</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SEÇÃO: CONTROLE DE ESTOQUE */}
          {section === 'estoque' && (
            <motion.div
              key="estoque"
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
                        placeholder="Pesquisar produto..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Novo produto adicionado ao estoque")}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Produto
                    </button>
                    
                    <button 
                      onClick={() => toast.success("Estoque atualizado com sucesso!")}
                      className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg px-3 py-2"
                    >
                      <Upload className="w-4 h-4" /> Atualizar Estoque
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Lista de produtos em estoque */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-600" /> Controle de Estoque
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Relatório de estoque exportado!")}
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
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Validade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
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
                      {mockEstoque
                        .filter(item => 
                          !filtroTexto || 
                          item.produto.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                          item.categoria.toLowerCase().includes(filtroTexto.toLowerCase())
                        )
                        .map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                                <Package className="h-4 w-4" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.produto}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {item.quantidade} {item.unidade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(parseISO(item.validade), "dd/MM/yyyy")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {item.categoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${item.status === 'Normal' ? 'bg-green-100 text-green-800' : 
                                item.status === 'Baixo' ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toast.success(`Visualizando detalhes: ${item.produto}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Editando: ${item.produto}`)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toast.success(`Item removido do estoque: ${item.produto}`)}
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

              {/* Alertas e estatísticas de estoque */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Alertas de estoque */}
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" /> Alertas de Estoque
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-red-100 p-1 rounded mr-2 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Leite - Validade próxima</p>
                        <p className="text-xs text-gray-500">Vence em 20/06/2024 (15 dias)</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Óleo de Soja - Estoque baixo</p>
                        <p className="text-xs text-gray-500">Apenas 35 litros restantes</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded mr-2 mt-0.5">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Pedido pendente - Carne</p>
                        <p className="text-xs text-gray-500">Chegada prevista: 10/06/2024</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toast.success("Gerando relatório de itens críticos")}
                      className="w-full flex items-center justify-center gap-2 bg-amber-100 text-amber-700 rounded-lg px-3 py-2 hover:bg-amber-200"
                    >
                      <FileText className="h-4 w-4" /> Ver Todos os Alertas
                    </button>
                  </div>
                </motion.div>
                
                {/* Estatísticas de estoque */}
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-indigo-600" /> Estatísticas
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="text-xs text-indigo-700 uppercase font-semibold mb-1">Total de Itens</div>
                      <div className="text-2xl font-bold text-indigo-700">
                        {mockEstoque.length}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-xs text-green-700 uppercase font-semibold mb-1">Status Normal</div>
                      <div className="text-2xl font-bold text-green-700">
                        {mockEstoque.filter(item => item.status === "Normal").length}
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="text-xs text-amber-700 uppercase font-semibold mb-1">Estoque Baixo</div>
                      <div className="text-2xl font-bold text-amber-700">
                        {mockEstoque.filter(item => item.status === "Baixo").length}
                      </div>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-xs text-red-700 uppercase font-semibold mb-1">Atenção</div>
                      <div className="text-2xl font-bold text-red-700">
                        {mockEstoque.filter(item => item.status === "Atenção").length}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Últimas movimentações:</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Entrada de Arroz</span>
                        <span className="font-medium">+50kg (ontem)</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Saída de Leite</span>
                        <span className="font-medium">-12L (hoje)</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Entrada de Frutas</span>
                        <span className="font-medium">+30kg (hoje)</span>
                      </li>
                    </ul>
                    <button
                      onClick={() => toast.success("Registrando nova movimentação")}
                      className="w-full mt-3 flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <Plus className="h-4 w-4" /> Registrar Movimentação
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SEÇÃO: FORNECEDORES */}
          {section === 'fornecedores' && (
            <motion.div
              key="fornecedores"
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
                        placeholder="Pesquisar fornecedor..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Novo fornecedor cadastrado com sucesso!")}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Fornecedor
                    </button>
                    
                    <button 
                      onClick={() => toast.success("Relatório de fornecedores exportado!")}
                      className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg px-3 py-2"
                    >
                      <Download className="w-4 h-4" /> Exportar
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Lista de Fornecedores */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-indigo-600" /> Fornecedores Cadastrados
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fornecedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Última Entrega
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Próxima Entrega
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockFornecedores
                        .filter(item => 
                          !filtroTexto || 
                          item.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                          item.tipo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                          item.contato.toLowerCase().includes(filtroTexto.toLowerCase())
                        )
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                                  <Truck className="h-4 w-4" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.nome}</div>
                                  <div className="text-xs text-gray-500">Tel: {item.telefone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {item.tipo}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.contato}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(parseISO(item.ultimaEntrega), "dd/MM/yyyy")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${new Date(item.proximaEntrega) < new Date() ? 'bg-red-100 text-red-800' : 
                                  new Date(item.proximaEntrega) < new Date(new Date().setDate(new Date().getDate() + 3)) ? 
                                  'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                {format(parseISO(item.proximaEntrega), "dd/MM/yyyy")}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => toast.success(`Visualizando detalhes: ${item.nome}`)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Visualizar"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toast.success(`Editando: ${item.nome}`)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toast.success(`Agendando entrega com ${item.nome}`)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Agendar entrega"
                                >
                                  <Calendar className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Cards informativos para fornecedores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Próximas entregas */}
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" /> Próximas Entregas
                  </h3>
                  <ul className="space-y-3">
                    {mockFornecedores
                      .sort((a, b) => new Date(a.proximaEntrega).getTime() - new Date(b.proximaEntrega).getTime())
                      .slice(0, 3)
                      .map((item, idx) => (
                        <li key={idx} className="bg-indigo-50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-indigo-800">{item.nome}</div>
                              <div className="text-xs text-indigo-600 mt-1">{format(parseISO(item.proximaEntrega), "dd/MM/yyyy")}</div>
                            </div>
                            <div className="bg-white p-1.5 rounded-full">
                              <Truck className="h-4 w-4 text-indigo-600" />
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toast.success("Abrindo tela de agendamento")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <Plus className="h-4 w-4" /> Agendar Nova Entrega
                    </button>
                  </div>
                </motion.div>
                
                {/* Avaliação de fornecedores */}
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-indigo-600" /> Avaliação de Fornecedores
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Alimentos Naturais Ltda</span>
                      <div className="flex">
                        {[1, 2, 3, 4].map(star => (
                          <div key={star} className="text-amber-500">★</div>
                        ))}
                        <div className="text-gray-300">★</div>
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Laticínios Puro Leite</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <div key={star} className="text-amber-500">★</div>
                        ))}
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Grãos & Cia</span>
                      <div className="flex">
                        {[1, 2, 3, 4].map(star => (
                          <div key={star} className="text-amber-500">★</div>
                        ))}
                        <div className="text-gray-300">★</div>
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Frigorífico Bom Corte</span>
                      <div className="flex">
                        {[1, 2, 3].map(star => (
                          <div key={star} className="text-amber-500">★</div>
                        ))}
                        {[1, 2].map(star => (
                          <div key={star} className="text-gray-300">★</div>
                        ))}
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toast.success("Abrindo tela de avaliação")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <FileText className="h-4 w-4" /> Ver Todas as Avaliações
                    </button>
                  </div>
                </motion.div>
                
                {/* Ações rápidas */}
                <motion.div 
                  custom={2} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" /> Ações Rápidas
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => toast.success("Solicitação enviada para Alimentos Naturais Ltda")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <FileText className="h-4 w-4" /> Solicitar Cotação
                    </button>
                    <button
                      onClick={() => toast.success("Abrindo pedido de compra")}
                      className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-lg px-3 py-2 hover:bg-green-200"
                    >
                      <Plus className="h-4 w-4" /> Criar Pedido de Compra
                    </button>
                    <button
                      onClick={() => toast.success("Relatório de fornecedores gerado")}
                      className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-200"
                    >
                      <Download className="h-4 w-4" /> Relatório de Fornecedores
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Pendências:</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Avaliações pendentes</span>
                        <span className="font-medium text-amber-600">2</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Contratos para renovar</span>
                        <span className="font-medium text-red-600">1</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SEÇÃO: NUTRICIONISTA */}
          {section === 'nutricionista' && (
            <motion.div
              key="nutricionista"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Informações da nutricionista */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Perfil da nutricionista */}
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6 md:col-span-1"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full mb-4 flex items-center justify-center">
                      <Users className="h-12 w-12 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {mockNutricionista.nome}
                    </h3>
                    <p className="text-indigo-600 font-medium text-sm mt-1">
                      {mockNutricionista.crn}
                    </p>
                    <div className="mt-4 w-full">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {mockNutricionista.email}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {mockNutricionista.telefone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-base font-medium text-gray-700 mb-3">Horários na Escola</h4>
                    <ul className="space-y-2">
                      {mockNutricionista.horarios.map((horario, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{horario.dia}</span>
                          <span className="font-medium text-gray-800">{horario.horario}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => toast.success("Enviando mensagem para a nutricionista")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <FileText className="h-4 w-4" /> Enviar Mensagem
                    </button>
                  </div>
                </motion.div>
                
                {/* Próximas visitas e atividades */}
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6 md:col-span-2"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" /> Próximas Visitas e Atividades
                  </h3>
                  
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Atividade
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockNutricionista.proximasVisitas.map((visita, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                              {format(parseISO(visita.data), "dd/MM/yyyy")}
                            </td>
                            <td className="px-4 py-3 whitespace-normal text-sm text-gray-500 max-w-md">
                              {visita.atividade}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => toast.success(`Detalhes da visita de ${format(parseISO(visita.data), "dd/MM")}`)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Visualizar"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toast.success(`Editando visita de ${format(parseISO(visita.data), "dd/MM")}`)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between">
                      <button
                        onClick={() => toast.success("Agendando nova visita com a nutricionista")}
                        className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                      >
                        <Plus className="w-4 h-4" /> Agendar Nova Visita
                      </button>
                      
                      <button
                        onClick={() => toast.success("Calendário completo aberto")}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg px-3 py-2"
                      >
                        <Calendar className="w-4 h-4" /> Ver Calendário Completo
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Relatórios e Avaliações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Relatórios e pareceres */}
                <motion.div 
                  custom={2} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-indigo-600" /> Relatórios e Pareceres
                  </h3>
                  
                  <ul className="space-y-3">
                    <li className="border-l-4 border-green-400 bg-green-50 px-3 py-2 rounded-r-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-800">Análise do Cardápio de Maio</div>
                          <div className="text-xs text-gray-500 mt-0.5">Emitido em 30/05/2024</div>
                        </div>
                        <button
                          onClick={() => toast.success("Visualizando relatório de Maio")}
                          className="text-green-700 hover:text-green-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                    
                    <li className="border-l-4 border-blue-400 bg-blue-50 px-3 py-2 rounded-r-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-800">Avaliação Nutricional Trimestral</div>
                          <div className="text-xs text-gray-500 mt-0.5">Emitido em 15/04/2024</div>
                        </div>
                        <button
                          onClick={() => toast.success("Visualizando avaliação trimestral")}
                          className="text-blue-700 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                    
                    <li className="border-l-4 border-purple-400 bg-purple-50 px-3 py-2 rounded-r-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-800">Análise de Restrições Alimentares</div>
                          <div className="text-xs text-gray-500 mt-0.5">Emitido em 10/03/2024</div>
                        </div>
                        <button
                          onClick={() => toast.success("Visualizando análise de restrições")}
                          className="text-purple-700 hover:text-purple-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toast.success("Abrindo biblioteca de relatórios")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <FileText className="h-4 w-4" /> Ver Todos os Relatórios
                    </button>
                  </div>
                </motion.div>
                
                {/* Indicadores de saúde */}
                <motion.div 
                  custom={3} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-indigo-600" /> Indicadores de Saúde
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">Adequação Nutricional</span>
                        <span className="text-sm font-medium text-green-600">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">Alunos com Peso Adequado</span>
                        <span className="text-sm font-medium text-blue-600">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">Diversidade Alimentar</span>
                        <span className="text-sm font-medium text-amber-600">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">Atendimento a Restrições</span>
                        <span className="text-sm font-medium text-purple-600">95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between gap-2">
                      <button
                        onClick={() => toast.success("Visualizando dados detalhados")}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                      >
                        <Eye className="h-4 w-4" /> Ver Detalhes
                      </button>
                      
                      <button
                        onClick={() => toast.success("Gerando relatório de indicadores")}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-lg px-3 py-2 hover:bg-green-200"
                      >
                        <Download className="h-4 w-4" /> Relatório
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SEÇÃO: RELATÓRIOS DE CONSUMO */}
          {section === 'relatorios' && (
            <motion.div
              key="relatorios"
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
                        placeholder="Pesquisar por mês ou ano..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Gerando novo relatório")}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg px-3 py-2"
                    >
                      <Plus className="w-4 h-4" /> Novo Relatório
                    </button>
                    
                    <button 
                      onClick={() => toast.success("Dados exportados com sucesso!")}
                      className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg px-3 py-2"
                    >
                      <Download className="w-4 h-4" /> Exportar Dados
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Tabela de relatórios de consumo */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-indigo-600" /> Relatórios Mensais
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Período
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alunos Atendidos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Média Refeições/Dia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Custo Total (R$)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Custo por Aluno (R$)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockRelatoriosConsumo
                        .filter(item => 
                          !filtroTexto || 
                          item.mes.toLowerCase().includes(filtroTexto.toLowerCase())
                        )
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                              {item.mes} 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {item.alunosAtendidos}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {item.mediaRefeicoesDia}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              R$ {item.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              R$ {item.custoAluno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => toast.success(`Visualizando relatório: ${item.mes}`)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Visualizar"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toast.success(`Baixando relatório de ${item.mes}`)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Baixar"
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

              {/* Cards de análise e estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Estatísticas gerais */}
                <motion.div 
                  custom={0} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-indigo-600" /> Estatísticas Gerais
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <div className="text-xs text-indigo-700 uppercase font-semibold mb-1">Média Alunos/Mês</div>
                      <div className="text-2xl font-bold text-indigo-700">
                        {Math.round(mockRelatoriosConsumo.reduce((sum, item) => sum + item.alunosAtendidos, 0) / mockRelatoriosConsumo.length)}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-xs text-green-700 uppercase font-semibold mb-1">Refeições/Mês</div>
                      <div className="text-2xl font-bold text-green-700">
                        {(mockRelatoriosConsumo[0].mediaRefeicoesDia * 22).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-medium text-gray-700 mb-3">Tendências</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Consumo estável nos últimos 3 meses
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                          <div className="h-2 w-2 bg-amber-600 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Pequeno aumento de custo em Maio (+1.2%)
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Rejeição de cardápio em queda (-5%)
                        </div>
                      </li>
                    </ul>
                  </div>
                </motion.div>
                
                {/* Custos e orçamento */}
                <motion.div 
                  custom={1} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-indigo-600" /> Custos e Orçamento
                  </h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">Execução do orçamento anual</span>
                      <span className="text-sm font-medium text-blue-600">42.3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "42.3%" }}></div>
                    </div>
                  </div>
                  
                  <h4 className="text-base font-medium text-gray-700 mb-3">Distribuição de gastos</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-indigo-500 rounded-sm mr-2"></div>
                        <span className="text-sm text-gray-600">Alimentos</span>
                      </div>
                      <span className="text-sm font-medium">72%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                        <span className="text-sm text-gray-600">Mão de obra</span>
                      </div>
                      <span className="text-sm font-medium">18%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                        <span className="text-sm text-gray-600">Equipamentos</span>
                      </div>
                      <span className="text-sm font-medium">6%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-amber-500 rounded-sm mr-2"></div>
                        <span className="text-sm text-gray-600">Outros</span>
                      </div>
                      <span className="text-sm font-medium">4%</span>
                    </li>
                  </ul>
                </motion.div>
                
                {/* Ações e análises */}
                <motion.div 
                  custom={2} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" /> Análises e Ações
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md">
                      <h4 className="text-sm font-medium text-blue-800">Ótimo desempenho</h4>
                      <p className="text-xs text-blue-600 mt-1">O custo por aluno se manteve dentro do planejado nos últimos 3 meses.</p>
                    </div>
                    
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md">
                      <h4 className="text-sm font-medium text-amber-800">Ponto de atenção</h4>
                      <p className="text-xs text-amber-600 mt-1">Produtos lácteos registraram alta de 8% em maio. Considerar alternativas.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => toast.success("Gerando relatório comparativo")}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-200"
                    >
                      <BarChart className="h-4 w-4" /> Análise Comparativa
                    </button>
                    <button
                      onClick={() => toast.success("Exportando para apresentação")}
                      className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-lg px-3 py-2 hover:bg-green-200"
                    >
                      <Download className="h-4 w-4" /> Exportar para Apresentação
                    </button>
                    <button
                      onClick={() => toast.success("Enviando para comitê de alimentação")}
                      className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-200"
                    >
                      <FileText className="h-4 w-4" /> Enviar para Comitê
                    </button>
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
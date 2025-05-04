import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Student } from '@/lib/types';
import { mockStudents } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocation } from 'wouter';
import { eventBus } from '@/lib/eventBus';

/**
 * Página de gerenciamento de alunos
 * @returns {JSX.Element} Componente da página
 */
const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  
  // Novo aluno
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: '',
    shift: 'Manhã',
    subjects: [] as string[]
  });
  
  // Lista de disciplinas disponíveis
  const availableSubjects = [
    'Matemática', 'Português', 'História', 'Geografia', 
    'Ciências', 'Inglês', 'Educação Física', 'Artes'
  ];
  
  // Navegação
  const [, navigate] = useLocation();
  
  // Filtro e organização
  const [classFilter, setClassFilter] = useState<string>('');
  
  // Carregar dados dos alunos
  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);
  
  // Organiza os alunos por turma, ordem alfabética e turno
  const organizedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      // Primeiro por turma
      if (a.class !== b.class) {
        return a.class.localeCompare(b.class);
      }
      // Depois por turno
      if (a.shift !== b.shift) {
        return a.shift.localeCompare(b.shift);
      }
      // Por último, ordem alfabética do nome
      return a.name.localeCompare(b.name);
    });
  }, [students]);
  
  // Filtra os alunos pela turma selecionada
  const filteredStudents = useMemo(() => {
    if (!classFilter) return organizedStudents;
    return organizedStudents.filter(student => student.class === classFilter);
  }, [organizedStudents, classFilter]);
  
  // Lista de turmas disponíveis
  const availableClasses = useMemo(() => {
    const classes = new Set<string>();
    students.forEach(student => classes.add(student.class));
    return Array.from(classes).sort();
  }, [students]);
  
  // Navegar para a página de boletim com este aluno selecionado
  const handleViewGrades = (student: Student) => {
    // Salvar o aluno no localStorage para persistir durante a navegação
    localStorage.setItem('selected-student', JSON.stringify(student));
    console.log('Aluno salvo no localStorage:', student);
    
    // Emite evento para selecionar o aluno
    eventBus.emit('student-selected', student);
    
    // Navega para a página principal
    navigate('/');
  };
  
  // Manipulador para adição de novo aluno
  const handleAddStudent = () => {
    // Validação básica
    if (!newStudent.name || !newStudent.class) {
      alert('Por favor, preencha o nome e a turma do aluno.');
      return;
    }
    
    if (newStudent.subjects.length === 0) {
      alert('Por favor, selecione pelo menos uma disciplina.');
      return;
    }
    
    // Adiciona o novo aluno à lista
    const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const student: Student = {
      id,
      name: newStudent.name,
      class: newStudent.class,
      shift: newStudent.shift
    };
    
    setStudents([...students, student]);
    
    // Limpa o formulário
    setNewStudent({
      name: '',
      class: '',
      shift: 'Manhã',
      subjects: []
    });
    
    // Fecha o formulário de adição
    setIsAddingStudent(false);
  };
  
  // Manipulador para exclusão de aluno
  const handleDeleteStudent = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };
  
  // Manipulador para seleção de disciplinas
  const handleSubjectToggle = (subject: string) => {
    if (newStudent.subjects.includes(subject)) {
      setNewStudent({
        ...newStudent,
        subjects: newStudent.subjects.filter(s => s !== subject)
      });
    } else {
      setNewStudent({
        ...newStudent,
        subjects: [...newStudent.subjects, subject]
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        teacherName="Prof. Ana Silva" 
        teacherSubject="Matemática" 
      />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <span className="material-icons text-indigo-600 text-3xl mr-3">people</span>
              <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Alunos</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Filtro de Turma */}
              <div className="flex-grow sm:flex-grow-0 sm:min-w-[180px]">
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 bg-white text-sm"
                >
                  <option value="">Todas as Turmas</option>
                  {availableClasses.map(className => (
                    <option key={className} value={className}>
                      Turma {className}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Botão Adicionar */}
              <Button 
                onClick={() => setIsAddingStudent(!isAddingStudent)}
                className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
              >
                {isAddingStudent ? (
                  <>
                    <span className="material-icons mr-2">close</span>
                    Cancelar
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2">add</span>
                    Novo Aluno
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Formulário de adição de aluno */}
          {isAddingStudent && (
            <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-100">
              <h2 className="text-lg font-semibold text-indigo-800 mb-4">Adicionar Novo Aluno</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Aluno
                  </label>
                  <Input
                    id="name"
                    placeholder="Digite o nome completo"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                    Turma
                  </label>
                  <Input
                    id="class"
                    placeholder="Ex: 9º Ano B"
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="shift" className="block text-sm font-medium text-gray-700 mb-1">
                    Turno
                  </label>
                  <select
                    id="shift"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={newStudent.shift}
                    onChange={(e) => setNewStudent({...newStudent, shift: e.target.value})}
                  >
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disciplinas
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableSubjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subject-${subject}`}
                        checked={newStudent.subjects.includes(subject)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                      />
                      <label
                        htmlFor={`subject-${subject}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 mr-2"
                  onClick={() => setIsAddingStudent(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleAddStudent}
                >
                  <span className="material-icons mr-1">save</span>
                  Salvar Aluno
                </Button>
              </div>
            </div>
          )}
          
          {/* Lista de alunos */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Carregando lista de alunos...</p>
            </div>
          ) : (
            <>
              {students.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <span className="material-icons text-gray-300 text-6xl mb-4">school</span>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhum aluno cadastrado</h3>
                  <p className="text-gray-500 mb-4">Adicione alunos para começar a gerenciar suas turmas.</p>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setIsAddingStudent(true)}
                  >
                    <span className="material-icons mr-2">add</span>
                    Adicionar Aluno
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turma</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                        <th className="border-b border-gray-200 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center text-indigo-700 font-bold mr-3">
                                {student.name.charAt(0)}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">
                              {student.class}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{student.shift}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline"
                                className="h-8 px-2 text-blue-600 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                title="Ver notas do aluno"
                                onClick={() => handleViewGrades(student)}
                              >
                                <span className="material-icons text-sm mr-1">grade</span>
                                Ver Notas
                              </Button>
                              <button 
                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                title="Editar aluno"
                              >
                                <span className="material-icons text-sm">edit</span>
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Excluir aluno"
                                onClick={() => handleDeleteStudent(student.id)}
                              >
                                <span className="material-icons text-sm">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentsPage;
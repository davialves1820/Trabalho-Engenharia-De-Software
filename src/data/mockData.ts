export interface Employee {
  id: string;
  name: string;
  email: string;
  document: string;
  role: string;
  department: string;
  status: 'ativo' | 'inativo';
  consentStatus: 'válido' | 'expira_em_30_dias' | 'expirado';
  consentDate: string;
  consentExpiry: string;
  dataTypes: string[];
}

export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface Alert {
  id: string;
  type: 'consentimento_expirando' | 'acesso_suspeito' | 'dados_nao_utilizados';
  title: string;
  description: string;
  employeeId: string;
  employeeName: string;
  created: string;
  status: 'pendente' | 'resolvido';
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    document: '123.456.789-10',
    role: 'Desenvolvedor',
    department: 'TI',
    status: 'ativo',
    consentStatus: 'válido',
    consentDate: '2025-01-15',
    consentExpiry: '2026-01-15',
    dataTypes: ['dados_pessoais', 'dados_profissionais', 'dados_bancarios']
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    document: '987.654.321-00',
    role: 'Analista RH',
    department: 'Recursos Humanos',
    status: 'ativo',
    consentStatus: 'expira_em_30_dias',
    consentDate: '2024-10-01',
    consentExpiry: '2025-10-27',
    dataTypes: ['dados_pessoais', 'dados_profissionais']
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    document: '456.789.123-45',
    role: 'Candidato',
    department: 'Processo Seletivo',
    status: 'inativo',
    consentStatus: 'expirado',
    consentDate: '2024-06-01',
    consentExpiry: '2025-06-01',
    dataTypes: ['dados_pessoais', 'curriculo']
  },
];

export const mockAccessLogs: AccessLog[] = [
  {
    id: '1',
    userId: '2',
    userName: 'RH Manager',
    action: 'visualizou',
    resource: 'dados_funcionario_joao_silva',
    timestamp: '2025-09-25 14:30:00',
    ipAddress: '192.168.1.100',
    details: 'Acesso aos dados pessoais para atualização cadastral'
  },
  {
    id: '2',
    userId: '1',
    userName: 'Admin Sistema',
    action: 'exportou',
    resource: 'relatorio_consentimentos',
    timestamp: '2025-09-24 09:15:00',
    ipAddress: '192.168.1.50',
    details: 'Exportação de relatório mensal de consentimentos'
  },
  {
    id: '3',
    userId: '2',
    userName: 'RH Manager',
    action: 'cadastrou',
    resource: 'novo_funcionario_ana_costa',
    timestamp: '2025-09-23 16:45:00',
    ipAddress: '192.168.1.100',
    details: 'Cadastro de novo funcionário com coleta de consentimento'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'consentimento_expirando',
    title: 'Consentimento expirando em 30 dias',
    description: 'O consentimento para tratamento de dados está próximo do vencimento',
    employeeId: '2',
    employeeName: 'Maria Santos',
    created: '2025-09-25',
    status: 'pendente'
  },
  {
    id: '2',
    type: 'acesso_suspeito',
    title: 'Múltiplos acessos fora do horário',
    description: 'Detectados acessos aos dados após 22h nos últimos 3 dias',
    employeeId: '1',
    employeeName: 'João Silva',
    created: '2025-09-24',
    status: 'pendente'
  },
  {
    id: '3',
    type: 'dados_nao_utilizados',
    title: 'Dados não acessados há mais de 6 meses',
    description: 'Alguns dados podem ser elegíveis para exclusão conforme política de retenção',
    employeeId: '3',
    employeeName: 'Pedro Oliveira',
    created: '2025-09-23',
    status: 'resolvido'
  }
];

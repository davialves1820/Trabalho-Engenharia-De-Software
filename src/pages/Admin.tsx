import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Settings, 
  Download,
  Trash2,
  UserPlus,
  Key,
  Database,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'rh' | 'user';
  status: 'ativo' | 'inativo';
  lastLogin: string;
  permissions: string[];
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'rh' | 'user',
    password: ''
  });

  // Mock system users
  const [systemUsers] = useState<SystemUser[]>([
    {
      id: '1',
      name: 'Admin Sistema',
      email: 'admin@empresa.com',
      role: 'admin',
      status: 'ativo',
      lastLogin: '2024-12-26 14:30:00',
      permissions: ['read', 'write', 'delete', 'admin']
    },
    {
      id: '2',
      name: 'RH Manager',
      email: 'rh@empresa.com',
      role: 'rh',
      status: 'ativo',
      lastLogin: '2024-12-26 09:15:00',
      permissions: ['read', 'write']
    },
    {
      id: '3',
      name: 'Usuário Teste',
      email: 'user@empresa.com',
      role: 'user',
      status: 'inativo',
      lastLogin: '2024-12-20 16:45:00',
      permissions: ['read']
    }
  ]);

  // System statistics
  const systemStats = {
    totalUsers: systemUsers.length,
    activeUsers: systemUsers.filter(u => u.status === 'ativo').length,
    totalEmployees: 15,
    dataRetentionDays: 365,
    lastBackup: '2024-12-26 02:00:00'
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Erro no cadastro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Usuário criado com sucesso!",
      description: `${newUser.name} foi adicionado ao sistema com perfil ${newUser.role.toUpperCase()}.`,
    });

    setNewUser({ name: '', email: '', role: 'user', password: '' });
  };

  const handleExportData = (type: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Relatório de ${type} será gerado e enviado por email.`,
    });
  };

  const handleDataCleanup = () => {
    toast({
      title: "Limpeza de dados agendada",
      description: "Dados expirados serão removidos conforme política de retenção.",
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Apenas administradores podem acessar esta área.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary rounded-lg">
              <Settings className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Administração do Sistema</h1>
              <p className="text-sm text-muted-foreground">
                Gerenciamento de usuários, permissões e configurações do sistema
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Usuários do Sistema</p>
                  <p className="text-2xl font-bold">{systemStats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{systemStats.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Total de Funcionários</p>
                  <p className="text-2xl font-bold text-blue-600">{systemStats.totalEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Retenção (dias)</p>
                  <p className="text-2xl font-bold text-purple-600">{systemStats.dataRetentionDays}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Download className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Último Backup</p>
                  <p className="text-xs font-bold text-orange-600">26/12/2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="data">Dados</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Usuários do Sistema</CardTitle>
                  <CardDescription>
                    Gerenciar usuários com acesso ao sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemUsers.map((systemUser) => (
                      <div key={systemUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{systemUser.name}</h3>
                          <p className="text-sm text-muted-foreground">{systemUser.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Último login: {systemUser.lastLogin}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={systemUser.role === 'admin' ? 'default' : 'secondary'}>
                            {systemUser.role.toUpperCase()}
                          </Badge>
                          <Badge variant={systemUser.status === 'ativo' ? 'default' : 'outline'}>
                            {systemUser.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Key className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add New User */}
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Usuário</CardTitle>
                  <CardDescription>
                    Criar novo usuário do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newUserName">Nome</Label>
                      <Input
                        id="newUserName"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUserEmail">Email</Label>
                      <Input
                        id="newUserEmail"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUserRole">Perfil</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value: 'admin' | 'rh' | 'user') => 
                          setNewUser(prev => ({ ...prev, role: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="rh">RH</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUserPassword">Senha</Label>
                      <Input
                        id="newUserPassword"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Criar Usuário
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Permissões</CardTitle>
                <CardDescription>
                  Configurar permissões por perfil de usuário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Administrador</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>✓ Acesso total ao sistema</li>
                          <li>✓ Gerenciar usuários</li>
                          <li>✓ Configurações do sistema</li>
                          <li>✓ Relatórios completos</li>
                          <li>✓ Logs de auditoria</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">RH</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>✓ Cadastrar funcionários</li>
                          <li>✓ Gerenciar consentimentos</li>
                          <li>✓ Visualizar relatórios</li>
                          <li>✓ Acessar dados pessoais</li>
                          <li>✗ Configurações do sistema</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Usuário</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>✓ Visualizar próprios dados</li>
                          <li>✓ Atualizar informações pessoais</li>
                          <li>✓ Gerenciar consentimentos</li>
                          <li>✗ Acessar dados de outros</li>
                          <li>✗ Relatórios administrativos</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios e Exportação</CardTitle>
                  <CardDescription>
                    Gerar relatórios de conformidade LGPD
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExportData('consentimentos')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Relatório de Consentimentos
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExportData('logs_acesso')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Logs de Acesso
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExportData('dados_funcionarios')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Dados dos Funcionários
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExportData('conformidade_lgpd')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Relatório de Conformidade LGPD
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Dados</CardTitle>
                  <CardDescription>
                    Limpeza e manutenção dos dados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleDataCleanup}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpeza de Dados Expirados
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Manual
                  </Button>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Política de Retenção</p>
                    <p className="text-xs text-muted-foreground">
                      Dados são mantidos por {systemStats.dataRetentionDays} dias após expiração do consentimento
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configurações gerais e parâmetros LGPD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Configurações LGPD</h3>
                      <div className="space-y-2">
                        <Label>Período de validade do consentimento (meses)</Label>
                        <Input type="number" value="12" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Dias para notificação de expiração</Label>
                        <Input type="number" value="30" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Tempo de retenção após expiração (dias)</Label>
                        <Input type="number" value="365" readOnly />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Configurações de Segurança</h3>
                      <div className="space-y-2">
                        <Label>Tempo de sessão (minutos)</Label>
                        <Input type="number" value="480" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Máximo de tentativas de login</Label>
                        <Input type="number" value="3" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Backup automático</Label>
                        <Select value="diario" disabled>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diario">Diário</SelectItem>
                            <SelectItem value="semanal">Semanal</SelectItem>
                            <SelectItem value="mensal">Mensal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Alert>
                    <Settings className="h-4 w-4" />
                    <AlertDescription>
                      As configurações estão definidas para máxima conformidade com a LGPD.
                      Entre em contato com o suporte técnico para alterações.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
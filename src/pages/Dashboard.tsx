import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { mockEmployees, mockAccessLogs, mockAlerts } from '@/data/mockData';
import UserPermissionSettings from '../components/UserPermissionSettings';
import UserConsentSettings from '../components/UserConsentSettings';
import NotificationCenter from '../components/NotificationCenter';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Search,
  Calendar,
  Clock,
  FileText,
  UserPlus,
  Settings,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeForPermissions, setSelectedEmployeeForPermissions] = useState<{id: string, name: string} | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserConsent, setShowUserConsent] = useState(false);

  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const consentStats = {
    total: mockEmployees.length,
    valid: mockEmployees.filter(e => e.consentStatus === 'válido').length,
    expiring: mockEmployees.filter(e => e.consentStatus === 'expira_em_30_dias').length,
    expired: mockEmployees.filter(e => e.consentStatus === 'expirado').length,
  };

  const getConsentBadgeVariant = (status: string) => {
    switch (status) {
      case 'válido': return 'default';
      case 'expira_em_30_dias': return 'secondary';
      case 'expirado': return 'destructive';
      default: return 'outline';
    }
  };

  const pendingAlerts = mockAlerts.filter(alert => alert.status === 'pendente');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema RH-LGPD</h1>
              <p className="text-sm text-muted-foreground">
                Bem-vindo, {user?.name} ({user?.role?.toUpperCase()})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowUserConsent(true)}
              className="mr-2"
            >
              <Shield className="h-4 w-4 mr-2" />
              Minhas Permissões
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowNotifications(true)}
              className="mr-2"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
            {(user?.role === 'admin' || user?.role === 'rh') && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/register')}
                className="mr-2"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar
              </Button>
            )}
            {user?.role === 'admin' && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="mr-2"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            <Button variant="ghost" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Total de Pessoas</p>
                  <p className="text-2xl font-bold">{consentStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Consentimentos Válidos</p>
                  <p className="text-2xl font-bold text-green-600">{consentStats.valid}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Expirando</p>
                  <p className="text-2xl font-bold text-yellow-600">{consentStats.expiring}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Expirados</p>
                  <p className="text-2xl font-bold text-red-600">{consentStats.expired}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {pendingAlerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Alertas Pendentes</h2>
            <div className="space-y-3">
              {pendingAlerts.slice(0, 3).map((alert) => (
                <Alert key={alert.id}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>
                    {alert.description} - {alert.employeeName}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employees">Funcionários</TabsTrigger>
            <TabsTrigger value="logs">Logs de Acesso</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Funcionários e Candidatos</CardTitle>
                <CardDescription>
                  Gerencie dados e consentimentos dos funcionários
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, email ou cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {employee.email} • {employee.role} • {employee.department}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getConsentBadgeVariant(employee.consentStatus)}>
                          {employee.consentStatus.replace('_', ' ')}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          <p>Expira: {new Date(employee.consentExpiry).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedEmployeeForPermissions({id: employee.id, name: employee.name})}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Permissões
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Acesso</CardTitle>
                <CardDescription>
                  Histórico detalhado de acessos aos dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAccessLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium">{log.userName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {log.action} {log.resource}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {log.details}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        <p>{log.timestamp}</p>
                        <p>IP: {log.ipAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sistema de Alertas</CardTitle>
                <CardDescription>
                  Notificações e alertas de conformidade LGPD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className={`h-5 w-5 ${
                            alert.status === 'pendente' ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                          <div>
                            <h3 className="font-medium">{alert.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {alert.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Funcionário: {alert.employeeName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={alert.status === 'pendente' ? 'secondary' : 'default'}>
                          {alert.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          <p>{new Date(alert.created).toLocaleDateString('pt-BR')}</p>
                        </div>
                        {alert.status === 'pendente' && (
                          <Button variant="outline" size="sm">
                            Resolver
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modais */}
      {selectedEmployeeForPermissions && (
        <UserPermissionSettings
          isOpen={!!selectedEmployeeForPermissions}
          onClose={() => setSelectedEmployeeForPermissions(null)}
          employeeId={selectedEmployeeForPermissions.id}
          employeeName={selectedEmployeeForPermissions.name}
        />
      )}

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <UserConsentSettings
        isOpen={showUserConsent}
        onClose={() => setShowUserConsent(false)}
        userId={user?.id || ''}
        userName={user?.name || ''}
      />
    </div>
  );
};

export default Dashboard;
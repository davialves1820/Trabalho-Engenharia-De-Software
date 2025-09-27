import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Clock, AlertTriangle, CheckCircle, Settings, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
    id: string;
    type: 'permission_expiring' | 'data_access' | 'compliance_alert' | 'system_update';
    title: string;
    description: string;
    employeeName?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    created: string;
    read: boolean;
    daysUntilExpiry?: number;
}

interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    permissionExpiry: boolean;
    dataAccess: boolean;
    complianceAlerts: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly';
}

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'permission_expiring',
        title: 'Permissão expirando em 5 dias',
        description: 'Acesso aos dados bancários de Maria Santos expira em 5 dias',
        employeeName: 'Maria Santos',
        priority: 'high',
        created: '2024-12-26T10:30:00',
        read: false,
        daysUntilExpiry: 5
    },
    {
        id: '2',
        type: 'data_access',
        title: 'Acesso incomum detectado',
        description: 'Múltiplos acessos aos dados pessoais fora do horário comercial',
        employeeName: 'João Silva',
        priority: 'critical',
        created: '2024-12-26T08:15:00',
        read: false
    },
    {
        id: '3',
        type: 'compliance_alert',
        title: 'Revisão de conformidade necessária',
        description: 'Dados de Pedro Oliveira não foram acessados há 180 dias',
        employeeName: 'Pedro Oliveira',
        priority: 'medium',
        created: '2024-12-25T16:45:00',
        read: true
    },
    {
        id: '4',
        type: 'permission_expiring',
        title: 'Permissão expirando em 15 dias',
        description: 'Acesso aos dados profissionais de Ana Costa expira em 15 dias',
        employeeName: 'Ana Costa',
        priority: 'medium',
        created: '2024-12-25T14:20:00',
        read: false,
        daysUntilExpiry: 15
    }
    ];

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    permissionExpiry: true,
    dataAccess: true,
    complianceAlerts: true,
    reminderFrequency: 'weekly'
});
const [showSettings, setShowSettings] = useState(false);
const { toast } = useToast();

const unreadCount = notifications.filter(n => !n.read).length;

const getPriorityBadge = (priority: string) => {
    switch (priority) {
    case 'low': return <Badge variant="secondary">Baixa</Badge>;
    case 'medium': return <Badge variant="default">Média</Badge>;
    case 'high': return <Badge variant="destructive">Alta</Badge>;
    case 'critical': return <Badge className="bg-red-600 text-white">Crítica</Badge>;
    default: return <Badge variant="outline">Normal</Badge>;
    }
};

const getTypeIcon = (type: string) => {
    switch (type) {
    case 'permission_expiring': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'data_access': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'compliance_alert': return <Bell className="h-4 w-4 text-blue-600" />;
    case 'system_update': return <CheckCircle className="h-4 w-4 text-green-600" />;
    default: return <Bell className="h-4 w-4" />;
    }
};

const markAsRead = (id: string) => {
    setNotifications(prev => 
    prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
    )
    );
};

const markAllAsRead = () => {
    setNotifications(prev => 
    prev.map(notification => ({ ...notification, read: true }))
    );
};

const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
};

const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
};

const saveSettings = () => {
    toast({
    title: "Configurações salvas",
    description: "Suas preferências de notificação foram atualizadas.",
    });
    setShowSettings(false);
};

useEffect(() => {
    // Simular chegada de novas notificações
    const interval = setInterval(() => {
    // Lógica para verificar novas notificações seria implementada aqui
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
}, []);

return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
            {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                {unreadCount}
                </Badge>
            )}
            </div>
            <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4 mr-1" />
                Configurar
            </Button>
            {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Marcar todas como lidas
                </Button>
            )}
            </div>
        </DialogTitle>
        <DialogDescription>
            Gerencie notificações sobre permissões, acessos e conformidade LGPD
        </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
        {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma notificação no momento</p>
            </div>
        ) : (
            notifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                    {getTypeIcon(notification.type)}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                        </h4>
                        {getPriorityBadge(notification.priority)}
                        {!notification.read && (
                            <Badge variant="outline" className="text-xs">Nova</Badge>
                        )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                        {notification.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                            {new Date(notification.created).toLocaleString('pt-BR')}
                        </span>
                        {notification.employeeName && (
                            <span>Funcionário: {notification.employeeName}</span>
                        )}
                        {notification.daysUntilExpiry && (
                            <span className="text-yellow-600 font-medium">
                            {notification.daysUntilExpiry} dias restantes
                            </span>
                        )}
                        </div>
                    </div>
                    </div>
                    <div className="flex items-center gap-1">
                    {!notification.read && (
                        <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsRead(notification.id)}
                        >
                        <CheckCircle className="h-4 w-4" />
                        </Button>
                    )}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteNotification(notification.id)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
                </CardContent>
            </Card>
            ))
        )}
        </div>

        {/* Modal de Configurações */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Configurações de Notificação</DialogTitle>
            <DialogDescription>
                Personalize como e quando você recebe notificações
            </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
            <div className="space-y-3">
                <h4 className="text-sm font-medium">Métodos de Notificação</h4>
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email</Label>
                    <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Notificações Push</Label>
                    <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    />
                </div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-medium">Tipos de Alerta</h4>
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="permission-expiry">Expiração de Permissões</Label>
                    <Switch
                    id="permission-expiry"
                    checked={settings.permissionExpiry}
                    onCheckedChange={(checked) => handleSettingChange('permissionExpiry', checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="data-access">Alertas de Acesso</Label>
                    <Switch
                    id="data-access"
                    checked={settings.dataAccess}
                    onCheckedChange={(checked) => handleSettingChange('dataAccess', checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="compliance-alerts">Alertas de Conformidade</Label>
                    <Switch
                    id="compliance-alerts"
                    checked={settings.complianceAlerts}
                    onCheckedChange={(checked) => handleSettingChange('complianceAlerts', checked)}
                    />
                </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Frequência de Lembretes</Label>
                <Select 
                value={settings.reminderFrequency} 
                onValueChange={(value) => handleSettingChange('reminderFrequency', value)}
                >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </div>

            <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancelar
            </Button>
            <Button onClick={saveSettings}>
                Salvar
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    </DialogContent>
    </Dialog>
    );
};

export default NotificationCenter;
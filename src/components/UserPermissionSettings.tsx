import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Shield, Clock, AlertTriangle, Save, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PermissionSettings {
  id: string;
  dataType: string;
  canAccess: boolean;
  canEdit: boolean;
  canExport: boolean;
  accessLevel: 'read' | 'write' | 'admin';
  expiryDays: number;
  notifyBefore: number; // dias antes da expiração para notificar
}

interface UserPermissionSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
}

const defaultPermissions: PermissionSettings[] = [
  {
    id: '1',
    dataType: 'Dados Pessoais',
    canAccess: true,
    canEdit: false,
    canExport: false,
    accessLevel: 'read',
    expiryDays: 365,
    notifyBefore: 30
  },
  {
    id: '2',
    dataType: 'Dados Profissionais',
    canAccess: true,
    canEdit: true,
    canExport: false,
    accessLevel: 'write',
    expiryDays: 365,
    notifyBefore: 30
  },
  {
    id: '3',
    dataType: 'Dados Bancários',
    canAccess: false,
    canEdit: false,
    canExport: false,
    accessLevel: 'read',
    expiryDays: 180,
    notifyBefore: 15
  },
  {
    id: '4',
    dataType: 'Histórico de Performance',
    canAccess: true,
    canEdit: false,
    canExport: true,
    accessLevel: 'read',
    expiryDays: 730,
    notifyBefore: 60
  }
];

const UserPermissionSettings = ({ isOpen, onClose, employeeId, employeeName }: UserPermissionSettingsProps) => {
  const [permissions, setPermissions] = useState<PermissionSettings[]>(defaultPermissions);
  const { toast } = useToast();

  const handlePermissionChange = (id: string, field: keyof PermissionSettings, value: any) => {
    setPermissions(prev => 
      prev.map(perm => 
        perm.id === id ? { ...perm, [field]: value } : perm
      )
    );
  };

  const handleSave = () => {
    // Aqui salvaria as configurações de permissão
    toast({
      title: "Permissões atualizadas",
      description: `Configurações de permissão para ${employeeName} foram salvas com sucesso.`,
    });
    onClose();
  };

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'read': return <Badge variant="secondary">Leitura</Badge>;
      case 'write': return <Badge variant="default">Escrita</Badge>;
      case 'admin': return <Badge variant="destructive">Admin</Badge>;
      default: return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Permissão - {employeeName}
          </DialogTitle>
          <DialogDescription>
            Gerencie as permissões de acesso aos dados e configure notificações personalizadas para este usuário.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configurações de Permissão por Tipo de Dado */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissões por Tipo de Dado
            </h3>
            
            {permissions.map((permission) => (
              <div key={permission.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{permission.dataType}</h4>
                    {getAccessLevelBadge(permission.accessLevel)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`access-${permission.id}`} className="text-sm">Ativo</Label>
                    <Switch
                      id={`access-${permission.id}`}
                      checked={permission.canAccess}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(permission.id, 'canAccess', checked)
                      }
                    />
                  </div>
                </div>

                {permission.canAccess && (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Controles de Permissão */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`edit-${permission.id}`} className="text-sm">Pode Editar</Label>
                        <Switch
                          id={`edit-${permission.id}`}
                          checked={permission.canEdit}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, 'canEdit', checked)
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`export-${permission.id}`} className="text-sm">Pode Exportar</Label>
                        <Switch
                          id={`export-${permission.id}`}
                          checked={permission.canExport}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, 'canExport', checked)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Nível de Acesso</Label>
                        <Select 
                          value={permission.accessLevel} 
                          onValueChange={(value) => 
                            handlePermissionChange(permission.id, 'accessLevel', value as 'read' | 'write' | 'admin')
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="read">Somente Leitura</SelectItem>
                            <SelectItem value="write">Leitura e Escrita</SelectItem>
                            <SelectItem value="admin">Acesso Total</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Configurações de Tempo e Notificação */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Validade (dias)
                        </Label>
                        <Select 
                          value={permission.expiryDays.toString()} 
                          onValueChange={(value) => 
                            handlePermissionChange(permission.id, 'expiryDays', parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="90">90 dias</SelectItem>
                            <SelectItem value="180">180 dias</SelectItem>
                            <SelectItem value="365">1 ano</SelectItem>
                            <SelectItem value="730">2 anos</SelectItem>
                            <SelectItem value="1095">3 anos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Notificar antes (dias)
                        </Label>
                        <Select 
                          value={permission.notifyBefore.toString()} 
                          onValueChange={(value) => 
                            handlePermissionChange(permission.id, 'notifyBefore', parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 dias</SelectItem>
                            <SelectItem value="15">15 dias</SelectItem>
                            <SelectItem value="30">30 dias</SelectItem>
                            <SelectItem value="60">60 dias</SelectItem>
                            <SelectItem value="90">90 dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded flex items-start gap-1">
                        <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        Expira em: {new Date(Date.now() + permission.expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionSettings;
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Save, Info, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConsentItem {
  id: string;
  category: string;
  description: string;
  purpose: string;
  dataTypes: string[];
  isEssential: boolean;
  isGranted: boolean;
  grantedDate?: string;
  expiryDate?: string;
}

interface UserConsentSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const defaultConsents: ConsentItem[] = [
  {
    id: '1',
    category: 'Dados Pessoais Básicos',
    description: 'Nome, email, telefone e documento de identificação',
    purpose: 'Identificação e contato para finalidades trabalhistas',
    dataTypes: ['Nome completo', 'E-mail', 'Telefone', 'CPF'],
    isEssential: true,
    isGranted: true,
    grantedDate: '2024-01-15',
    expiryDate: '2025-01-15'
  },
  {
    id: '2',
    category: 'Dados Profissionais',
    description: 'Cargo, salário, histórico de performance e avaliações',
    purpose: 'Gestão de recursos humanos e desenvolvimento profissional',
    dataTypes: ['Cargo atual', 'Histórico salarial', 'Avaliações de performance', 'Certificações'],
    isEssential: true,
    isGranted: true,
    grantedDate: '2024-01-15',
    expiryDate: '2025-01-15'
  },
  {
    id: '3',
    category: 'Dados Bancários',
    description: 'Informações bancárias para pagamento de salário',
    purpose: 'Processamento de folha de pagamento',
    dataTypes: ['Banco', 'Agência', 'Conta corrente', 'PIX'],
    isEssential: true,
    isGranted: true,
    grantedDate: '2024-01-15',
    expiryDate: '2025-01-15'
  },
  {
    id: '4',
    category: 'Dados de Saúde',
    description: 'Informações médicas e de saúde ocupacional',
    purpose: 'Cuidados de saúde e segurança no trabalho',
    dataTypes: ['Exames admissionais', 'Atestados médicos', 'Vacinas', 'Alergias'],
    isEssential: false,
    isGranted: true,
    grantedDate: '2024-01-15',
    expiryDate: '2025-01-15'
  },
  {
    id: '5',
    category: 'Dados Familiares',
    description: 'Informações sobre dependentes e beneficiários',
    purpose: 'Gestão de benefícios e plano de saúde',
    dataTypes: ['Estado civil', 'Dependentes', 'Beneficiários', 'Contatos de emergência'],
    isEssential: false,
    isGranted: false
  },
  {
    id: '6',
    category: 'Dados Biométricos',
    description: 'Impressão digital e reconhecimento facial',
    purpose: 'Controle de acesso e ponto eletrônico',
    dataTypes: ['Impressão digital', 'Foto facial', 'Dados de acesso'],
    isEssential: false,
    isGranted: false
  },
  {
    id: '7',
    category: 'Dados de Comportamento',
    description: 'Padrões de uso de sistemas e produtividade',
    purpose: 'Análise de performance e otimização de processos',
    dataTypes: ['Logs de acesso', 'Tempo de sistema', 'Produtividade', 'Navegação'],
    isEssential: false,
    isGranted: false
  }
];

const UserConsentSettings = ({ isOpen, onClose, userId, userName }: UserConsentSettingsProps) => {
  const [consents, setConsents] = useState<ConsentItem[]>(defaultConsents);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleConsentChange = (id: string, granted: boolean) => {
    setConsents(prev => 
      prev.map(consent => {
        if (consent.id === id) {
          const updatedConsent = { 
            ...consent, 
            isGranted: granted,
            grantedDate: granted ? new Date().toISOString().split('T')[0] : undefined,
            expiryDate: granted ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
          };
          return updatedConsent;
        }
        return consent;
      })
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // Aqui salvaria as configurações de consentimento
    const grantedConsents = consents.filter(c => c.isGranted).length;
    const totalConsents = consents.length;
    
    toast({
      title: "Consentimentos atualizados",
      description: `${grantedConsents} de ${totalConsents} consentimentos foram configurados.`,
    });
    
    setHasChanges(false);
    onClose();
  };

  const getStatusBadge = (consent: ConsentItem) => {
    if (consent.isEssential) {
      return <Badge variant="secondary">Obrigatório</Badge>;
    }
    if (consent.isGranted) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Autorizado</Badge>;
    }
    return <Badge variant="outline">Não autorizado</Badge>;
  };

  const grantedCount = consents.filter(c => c.isGranted).length;
  const optionalGrantedCount = consents.filter(c => c.isGranted && !c.isEssential).length;
  const optionalTotalCount = consents.filter(c => !c.isEssential).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Minhas Permissões de Dados - {userName}
          </DialogTitle>
          <DialogDescription>
            Gerencie quais dados você autoriza que a empresa colete e processe. 
            Você pode revogar ou conceder permissões a qualquer momento.
          </DialogDescription>
        </DialogHeader>

        {/* Resumo das Permissões */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resumo das Suas Permissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{grantedCount}</div>
                <div className="text-sm text-muted-foreground">Total Autorizados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{optionalGrantedCount}</div>
                <div className="text-sm text-muted-foreground">Opcionais Autorizados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">{optionalTotalCount - optionalGrantedCount}</div>
                <div className="text-sm text-muted-foreground">Opcionais Negados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {consents.map((consent) => (
            <Card key={consent.id} className={`${consent.isGranted ? 'border-green-200' : 'border-gray-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">{consent.category}</CardTitle>
                    {getStatusBadge(consent)}
                  </div>
                  <div className="flex items-center gap-2">
                    {consent.isEssential ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="h-4 w-4" />
                        <span>Obrigatório por lei</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`consent-${consent.id}`} className="text-sm font-normal">
                          {consent.isGranted ? 'Autorizado' : 'Não autorizado'}
                        </Label>
                        <Switch
                          id={`consent-${consent.id}`}
                          checked={consent.isGranted}
                          onCheckedChange={(checked) => handleConsentChange(consent.id, checked)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Descrição:</strong> {consent.description}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Finalidade:</strong> {consent.purpose}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Tipos de dados inclusos:</p>
                    <div className="flex flex-wrap gap-2">
                      {consent.dataTypes.map((dataType, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {dataType}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {consent.isGranted && consent.grantedDate && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted p-2 rounded">
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-600" />
                        Autorizado em: {new Date(consent.grantedDate).toLocaleDateString('pt-BR')}
                      </span>
                      {consent.expiryDate && (
                        <span>
                          Expira em: {new Date(consent.expiryDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  )}

                  {!consent.isGranted && !consent.isEssential && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-yellow-50 p-2 rounded">
                      <X className="h-3 w-3 text-yellow-600" />
                      <span>Você optou por não autorizar o uso destes dados</span>
                    </div>
                  )}

                  {consent.isEssential && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Este consentimento é obrigatório para manter seu vínculo empregatício</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Seus Direitos Segundo a LGPD
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li> Você pode revogar consentimentos opcionais a qualquer momento</li>
            <li> Pode solicitar acesso aos seus dados pessoais</li>
            <li> Pode solicitar correção de dados incorretos</li>
            <li> Pode solicitar exclusão de dados desnecessários</li>
            <li> Pode solicitar portabilidade dos seus dados</li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserConsentSettings;
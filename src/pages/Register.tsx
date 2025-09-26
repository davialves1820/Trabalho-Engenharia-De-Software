import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, UserPlus, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    role: '',
    department: '',
    type: 'funcionario' // funcionario ou candidato
  });

  const [consents, setConsents] = useState({
    dadosPessoais: false,
    dadosProfissionais: false,
    dadosBancarios: false,
    curriculo: false,
    fotos: false,
    comunicacoes: false
  });

  const [digitalSignature, setDigitalSignature] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConsentChange = (field: string, checked: boolean) => {
    setConsents(prev => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required consents
    const hasRequiredConsents = consents.dadosPessoais && (
      formData.type === 'candidato' ? consents.curriculo : consents.dadosProfissionais
    );

    if (!hasRequiredConsents) {
      toast({
        title: "Consentimento obrigatório",
        description: "É necessário consentir com o tratamento de dados pessoais e profissionais/currículo.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!digitalSignature.trim()) {
      toast({
        title: "Assinatura digital obrigatória",
        description: "Por favor, digite seu nome completo como assinatura digital.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: `${formData.type === 'funcionario' ? 'Funcionário' : 'Candidato'} ${formData.name} foi cadastrado com os consentimentos registrados.`,
      });
      navigate('/dashboard');
    }, 1500);
  };

  if (user?.role !== 'admin' && user?.role !== 'rh') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Apenas administradores e RH podem cadastrar funcionários.
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
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Cadastro de Funcionário/Candidato</h1>
              <p className="text-sm text-muted-foreground">
                Cadastre novos funcionários ou candidatos com coleta de consentimento LGPD
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Básicos</CardTitle>
              <CardDescription>
                Informações básicas da pessoa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funcionario">Funcionário</SelectItem>
                      <SelectItem value="candidato">Candidato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document">CPF</Label>
                  <Input
                    id="document"
                    value={formData.document}
                    onChange={(e) => handleInputChange('document', e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rh">Recursos Humanos</SelectItem>
                      <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="processo_seletivo">Processo Seletivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consentimentos LGPD */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Consentimentos LGPD
              </CardTitle>
              <CardDescription>
                Selecione os tipos de dados que a pessoa consente em compartilhar.
                O consentimento é válido por 12 meses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dadosPessoais"
                    checked={consents.dadosPessoais}
                    onCheckedChange={(checked) => handleConsentChange('dadosPessoais', checked as boolean)}
                  />
                  <Label htmlFor="dadosPessoais" className="text-sm">
                    <strong>Dados Pessoais*</strong>
                    <br />
                    <span className="text-muted-foreground">Nome, CPF, email, telefone</span>
                  </Label>
                </div>

                {formData.type === 'funcionario' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dadosProfissionais"
                        checked={consents.dadosProfissionais}
                        onCheckedChange={(checked) => handleConsentChange('dadosProfissionais', checked as boolean)}
                      />
                      <Label htmlFor="dadosProfissionais" className="text-sm">
                        <strong>Dados Profissionais*</strong>
                        <br />
                        <span className="text-muted-foreground">Cargo, salário, avaliações</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dadosBancarios"
                        checked={consents.dadosBancarios}
                        onCheckedChange={(checked) => handleConsentChange('dadosBancarios', checked as boolean)}
                      />
                      <Label htmlFor="dadosBancarios" className="text-sm">
                        <strong>Dados Bancários</strong>
                        <br />
                        <span className="text-muted-foreground">Conta, agência para pagamento</span>
                      </Label>
                    </div>
                  </>
                )}

                {formData.type === 'candidato' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="curriculo"
                      checked={consents.curriculo}
                      onCheckedChange={(checked) => handleConsentChange('curriculo', checked as boolean)}
                    />
                    <Label htmlFor="curriculo" className="text-sm">
                      <strong>Currículo e Histórico*</strong>
                      <br />
                      <span className="text-muted-foreground">Experiências, formação, certificados</span>
                    </Label>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fotos"
                    checked={consents.fotos}
                    onCheckedChange={(checked) => handleConsentChange('fotos', checked as boolean)}
                  />
                  <Label htmlFor="fotos" className="text-sm">
                    <strong>Fotos e Imagens</strong>
                    <br />
                    <span className="text-muted-foreground">Fotos corporativas, crachá</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="comunicacoes"
                    checked={consents.comunicacoes}
                    onCheckedChange={(checked) => handleConsentChange('comunicacoes', checked as boolean)}
                  />
                  <Label htmlFor="comunicacoes" className="text-sm">
                    <strong>Comunicações</strong>
                    <br />
                    <span className="text-muted-foreground">Emails corporativos, newsletters</span>
                  </Label>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  * Campos obrigatórios para o funcionamento do sistema.
                  Todos os consentimentos podem ser revogados a qualquer momento.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Assinatura Digital */}
          <Card>
            <CardHeader>
              <CardTitle>Assinatura Digital</CardTitle>
              <CardDescription>
                Confirme o consentimento digitando o nome completo da pessoa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signature">Assinatura Digital</Label>
                  <Textarea
                    id="signature"
                    placeholder="Digite o nome completo da pessoa para confirmar o consentimento..."
                    value={digitalSignature}
                    onChange={(e) => setDigitalSignature(e.target.value)}
                    required
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Ao assinar digitalmente, a pessoa confirma que:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Está ciente dos dados que serão coletados e tratados</li>
                    <li>Concorda com a finalidade do tratamento dos dados</li>
                    <li>Sabe que pode revogar o consentimento a qualquer momento</li>
                    <li>Está ciente de seus direitos conforme a LGPD</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar com Consentimento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
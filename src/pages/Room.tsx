import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { wsService } from '@/services/websocket';
import { ArrowLeft, Play, LogOut, Users, PlayCircle } from 'lucide-react';

interface Sala {
  id: number;
  nome: string;
  codigo: string;
  criador_id: number;
}

interface Participante {
  id: number;
  nome: string;
}

interface Rodada {
  id: number;
  sala_id: number;
  status: string;
}

export default function Room() {
  const { idSala } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sala, setSala] = useState<Sala | null>(null);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [rodadaAtiva, setRodadaAtiva] = useState<Rodada | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSala();
    loadParticipantes();
    checkRodadaAtiva();
    
    wsService.connect();
    wsService.on('participante_entrou', handleParticipanteEntrou);
    wsService.on('participante_saiu', handleParticipanteSaiu);
    wsService.on('rodada_iniciada', handleRodadaIniciada);

    return () => {
      wsService.off('participante_entrou', handleParticipanteEntrou);
      wsService.off('participante_saiu', handleParticipanteSaiu);
      wsService.off('rodada_iniciada', handleRodadaIniciada);
    };
  }, [idSala]);

  const handleParticipanteEntrou = () => {
    loadParticipantes();
  };

  const handleParticipanteSaiu = () => {
    loadParticipantes();
  };

  const handleRodadaIniciada = (data: any) => {
    setRodadaAtiva(data.rodada);
  };

  const loadSala = async () => {
    try {
      const response = await api.get(`/sala/${idSala}`);
      setSala(response.data);
    } catch (error) {
      console.error('Erro ao carregar sala:', error);
    }
  };

  const loadParticipantes = async () => {
    try {
      const response = await api.get(`/sala/${idSala}/participantes`);
      setParticipantes(response.data);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
    }
  };

  const checkRodadaAtiva = async () => {
    try {
      const response = await api.get(`/rodada/sala/${idSala}/ativa`);
      setRodadaAtiva(response.data);
    } catch (error) {
      console.error('Erro ao verificar rodada ativa:', error);
    }
  };

  const handleIniciarRodada = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`/rodada/sala/${idSala}/iniciar`);
      setRodadaAtiva(response.data);
      toast({
        title: 'Rodada iniciada!',
        description: 'A nova rodada foi criada com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao iniciar rodada',
        description: error.response?.data?.message || 'Não foi possível iniciar a rodada.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSairSala = async () => {
    try {
      await api.post(`/sala/${idSala}/sair`);
      toast({
        title: 'Você saiu da sala',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro ao sair da sala',
        description: error.response?.data?.message || 'Não foi possível sair da sala.',
        variant: 'destructive',
      });
    }
  };

  if (!sala) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-muted-foreground">Carregando sala...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            className="gap-2 text-foreground hover:text-primary"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-accent">{sala.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Código da sala: <span className="font-mono font-semibold text-foreground">{sala.codigo || sala.id}</span>
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleSairSala}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair da Sala
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                Participantes ({participantes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participantes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum participante na sala</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {participantes.map((participante) => (
                    <div
                      key={participante.id}
                      className="p-3 bg-background border border-border rounded-lg text-center"
                    >
                      <p className="font-semibold text-foreground">{participante.nome}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-primary">Controle da Sala</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rodadaAtiva ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary rounded-lg">
                    <p className="text-foreground font-semibold">Rodada Ativa</p>
                    <p className="text-sm text-muted-foreground">ID: {rodadaAtiva.id}</p>
                  </div>
                  <Link to={`/salas/${idSala}/rodadas/${rodadaAtiva.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
                      <PlayCircle className="h-5 w-5" />
                      Ir para a Mesa de Jogo
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={handleIniciarRodada}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 gap-2"
                >
                  <Play className="h-5 w-5" />
                  {isLoading ? 'Iniciando...' : 'Iniciar Nova Rodada'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

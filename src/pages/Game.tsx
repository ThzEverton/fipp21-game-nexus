import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { wsService } from '@/services/websocket';
import { ArrowLeft, Plus, Hand, DollarSign } from 'lucide-react';

interface Carta {
  id: number;
  naipe: string;
  valor: string;
}

interface EstadoJogo {
  cartasJogador: Carta[];
  cartasDealer: Carta[];
  totalJogador: number;
  totalDealer: number;
  status: string;
  mensagem?: string;
}

interface Aposta {
  id: number;
  valor: number;
  participante_nome: string;
}

export default function Game() {
  const { idSala, idRodada } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [valorAposta, setValorAposta] = useState('');
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [estado, setEstado] = useState<EstadoJogo | null>(null);
  const [turnoIniciado, setTurnoIniciado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jogadorParou, setJogadorParou] = useState(false);

  useEffect(() => {
    loadApostas();
    loadEstado();
    
    wsService.connect();
    wsService.on('estado_atualizado', handleEstadoAtualizado);
    wsService.on('aposta_realizada', handleApostaRealizada);

    return () => {
      wsService.off('estado_atualizado', handleEstadoAtualizado);
      wsService.off('aposta_realizada', handleApostaRealizada);
    };
  }, [idRodada]);

  const handleEstadoAtualizado = (data: any) => {
    loadEstado();
  };

  const handleApostaRealizada = () => {
    loadApostas();
  };

  const loadApostas = async () => {
    try {
      const response = await api.get(`/aposta/rodada/${idRodada}`);
      setApostas(response.data);
    } catch (error) {
      console.error('Erro ao carregar apostas:', error);
    }
  };

 const loadEstado = async () => {
  try {
    const response = await api.get(`/jogo/rodada/${idRodada}/estado`);
    console.log('Estado do jogo:', response.data); // Verifique aqui o que está retornando
    setEstado(response.data);

    if (response.data.cartasJogador?.length > 0) {
      setTurnoIniciado(true);
    }
  } catch (error) {
    console.error('Erro ao carregar estado:', error);
  }
};

  const handleApostar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valorAposta || parseFloat(valorAposta) <= 0) return;

    setIsLoading(true);
    try {
      await api.post(`/aposta/rodada/${idRodada}`, {
        valor: parseFloat(valorAposta),
      });
      toast({
        title: 'Aposta realizada!',
        description: `Você apostou ${valorAposta} créditos.`,
      });
      setValorAposta('');
      loadApostas();
    } catch (error: any) {
      toast({
        title: 'Erro ao apostar',
        description: error.response?.data?.message || 'Não foi possível realizar a aposta.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIniciarTurnos = async () => {
    setIsLoading(true);
    try {
      await api.post(`/turno/rodada/${idRodada}/iniciar`);
      setTurnoIniciado(true);
      toast({
        title: 'Turnos iniciados!',
        description: 'As cartas foram distribuídas.',
      });
      loadEstado();
    } catch (error: any) {
      toast({
        title: 'Erro ao iniciar turnos',
        description: error.response?.data?.message || 'Não foi possível iniciar os turnos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHit = async () => {
    setIsLoading(true);
    try {
      await api.post(`/jogo/rodada/${idRodada}/hit`);
      loadEstado();
    } catch (error: any) {
      toast({
        title: 'Erro ao pedir carta',
        description: error.response?.data?.message || 'Não foi possível pedir carta.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStand = () => {
    setJogadorParou(true);
    toast({
      title: 'Você parou!',
      description: 'Aguardando o dealer...',
    });
  };

  const handleDealerHit = async () => {
    setIsLoading(true);
    try {
      await api.post(`/jogo/rodada/${idRodada}/dealer/hit`);
      loadEstado();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao processar turno do dealer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCarta = (carta: Carta, oculta = false) => {
    const naipeEmoji: Record<string, string> = {
      'copas': '♥️',
      'ouros': '♦️',
      'espadas': '♠️',
      'paus': '♣️',
    };

    if (oculta) {
      return (
        <div className="w-20 h-28 bg-destructive border-2 border-accent rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-3xl">🂠</span>
        </div>
      );
    }

    return (
      <div className="w-20 h-28 bg-card border-2 border-accent rounded-lg flex flex-col items-center justify-center shadow-lg">
        <span className="text-2xl font-bold text-foreground">{carta.valor}</span>
        <span className="text-2xl">{naipeEmoji[carta.naipe.toLowerCase()] || carta.naipe}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-casino-felt">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button
            variant="ghost"
            className="gap-2 text-foreground hover:text-primary bg-card/80"
            onClick={() => navigate(`/salas/${idSala}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Sala
          </Button>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-card/90 border-accent/50">
                <CardHeader>
                  <CardTitle className="text-accent">Mesa de Blackjack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Dealer */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Dealer</h3>
                      {estado && turnoIniciado && (
                        <span className="text-2xl font-bold text-accent">
                          {jogadorParou ? estado.totalDealer : '?'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {estado?.cartasDealer.map((carta, index) => (
                        <div key={index}>
                          {renderCarta(carta, !jogadorParou && index === 1)}
                        </div>
                      ))}
                      {!turnoIniciado && (
                        <div className="text-muted-foreground italic">Aguardando início...</div>
                      )}
                    </div>
                  </div>

                  <div className="border-t-2 border-accent/30"></div>

                  {/* Jogador */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Suas Cartas</h3>
                      {estado && turnoIniciado && (
                        <span className="text-2xl font-bold text-primary">
                          {estado.totalJogador}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {estado?.cartasJogador.map((carta, index) => (
                        <div key={index}>{renderCarta(carta)}</div>
                      ))}
                      {!turnoIniciado && (
                        <div className="text-muted-foreground italic">Aguardando início...</div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  {turnoIniciado && !jogadorParou && estado?.status !== 'finalizada' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleHit}
                        disabled={isLoading}
                        className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Pedir Carta (HIT)
                      </Button>
                      <Button
                        onClick={handleStand}
                        variant="outline"
                        className="flex-1 border-accent text-accent hover:bg-accent/10 gap-2"
                      >
                        <Hand className="h-4 w-4" />
                        Parar (STAND)
                      </Button>
                    </div>
                  )}

                  {jogadorParou && estado?.status !== 'finalizada' && (
                    <Button
                      onClick={handleDealerHit}
                      disabled={isLoading}
                      className="w-full bg-destructive hover:bg-destructive/90"
                    >
                      Turno do Dealer
                    </Button>
                  )}

                  {estado?.mensagem && (
                    <div className="p-4 bg-accent/20 border border-accent rounded-lg">
                      <p className="text-center text-lg font-semibold text-accent">
                        {estado.mensagem}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {!turnoIniciado && (
                <Card className="bg-card/90 border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <DollarSign className="h-5 w-5" />
                      Fazer Aposta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleApostar} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="valor">Valor (créditos)</Label>
                        <Input
                          id="valor"
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="100"
                          value={valorAposta}
                          onChange={(e) => setValorAposta(e.target.value)}
                          className="bg-background border-border"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Apostando...' : 'Apostar'}
                      </Button>
                    </form>

                    {apostas.length > 0 && !turnoIniciado && (
                      <div className="mt-4">
                        <Button
                          onClick={handleIniciarTurnos}
                          disabled={isLoading}
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          {isLoading ? 'Iniciando...' : 'Iniciar Jogo'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="bg-card/90 border-border">
                <CardHeader>
                  <CardTitle className="text-primary">Apostas da Rodada</CardTitle>
                </CardHeader>
                <CardContent>
                  {apostas.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4 text-sm">
                      Nenhuma aposta ainda
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {apostas.map((aposta) => (
                        <div
                          key={aposta.id}
                          className="p-3 bg-background border border-border rounded-lg flex justify-between items-center"
                        >
                          <span className="text-sm text-foreground">{aposta.participante_nome}</span>
                          <span className="font-semibold text-accent">{aposta.valor} ₡</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Plus, LogIn, Users } from 'lucide-react';

interface Sala {
  id: number;
  nome: string;
  codigo: string;
  criador_id: number;
}

export default function Dashboard() {
  const [minhasSalas, setMinhasSalas] = useState<Sala[]>([]);
  const [salasParticipando, setSalasParticipando] = useState<Sala[]>([]);
  const [codigoSala, setCodigoSala] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSalas();
  }, []);

  const loadSalas = async () => {
    try {
      const [minhas, participando] = await Promise.all([
        api.get('/sala/minhas'),
        api.get('/sala/participando'),
      ]);
      setMinhasSalas(minhas.data);
      setSalasParticipando(participando.data);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    }
  };

  const handleEntrarSala = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoSala.trim()) return;

    setIsLoading(true);
    try {
      await api.post(`/sala/${codigoSala}/entrar`);
      toast({
        title: 'Sucesso!',
        description: 'Você entrou na sala.',
      });
      setCodigoSala('');
      loadSalas();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Não foi possível entrar na sala.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <Link to="/salas/nova">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="h-4 w-4" />
                Criar Sala
              </Button>
            </Link>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <LogIn className="h-5 w-5" />
                Entrar em Sala por Código
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEntrarSala} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="codigo" className="sr-only">Código da Sala</Label>
                  <Input
                    id="codigo"
                    placeholder="Digite o código da sala"
                    value={codigoSala}
                    onChange={(e) => setCodigoSala(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary">Minhas Salas</CardTitle>
              </CardHeader>
              <CardContent>
                {minhasSalas.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Você ainda não criou nenhuma sala
                  </p>
                ) : (
                  <div className="space-y-3">
                    {minhasSalas.map((sala) => (
                      <Link key={sala.id} to={`/salas/${sala.id}`}>
                        <div className="p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{sala.nome}</h3>
                              <p className="text-sm text-muted-foreground">Código: {sala.codigo || sala.id}</p>
                            </div>
                            <Users className="h-5 w-5 text-accent" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary">Salas Participando</CardTitle>
              </CardHeader>
              <CardContent>
                {salasParticipando.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Você não está participando de nenhuma sala
                  </p>
                ) : (
                  <div className="space-y-3">
                    {salasParticipando.map((sala) => (
                      <Link key={sala.id} to={`/salas/${sala.id}`}>
                        <div className="p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{sala.nome}</h3>
                              <p className="text-sm text-muted-foreground">Código: {sala.codigo || sala.id}</p>
                            </div>
                            <Users className="h-5 w-5 text-accent" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

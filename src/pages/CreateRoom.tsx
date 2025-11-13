import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { ArrowLeft } from 'lucide-react';

export default function CreateRoom() {
  const [nome, setNome] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/sala', { nome });
      toast({
        title: 'Sala criada com sucesso!',
        description: 'Você será redirecionado para a sala.',
      });
      navigate(`/salas/${response.data.id}`);
    } catch (error: any) {
      toast({
        title: 'Erro ao criar sala',
        description: error.response?.data?.message || 'Ocorreu um erro ao criar a sala.',
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
        <div className="max-w-2xl mx-auto space-y-4">
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
              <CardTitle className="text-2xl text-accent">Criar Nova Sala</CardTitle>
              <CardDescription className="text-muted-foreground">
                Crie uma sala privada para jogar com seus amigos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Sala</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Ex: Sala dos Amigos"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando...' : 'Criar Sala'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

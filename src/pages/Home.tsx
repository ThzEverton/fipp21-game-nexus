import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spade, Club, Heart, Diamond } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-accent flex items-center gap-3">
            <span className="text-4xl">🃏</span>
            API FIPP21 (Blackjack)
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center space-y-6">
            <h2 className="text-5xl font-bold text-foreground">
              Bem-vindo ao <span className="text-primary">FIPP21</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plataforma multiplayer de Blackjack. Crie salas, convide amigos e teste sua sorte nas cartas!
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 px-8">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-accent">
                  <Spade className="h-8 w-8" />
                  <h3 className="text-xl font-bold text-foreground">Jogo Clássico</h3>
                </div>
                <p className="text-muted-foreground">
                  Experimente o autêntico Blackjack com regras tradicionais de cassino.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-accent">
                  <Club className="h-8 w-8" />
                  <h3 className="text-xl font-bold text-foreground">Multiplayer</h3>
                </div>
                <p className="text-muted-foreground">
                  Crie salas privadas e jogue com seus amigos em tempo real.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-accent">
                  <Heart className="h-8 w-8" />
                  <h3 className="text-xl font-bold text-foreground">Sistema de Créditos</h3>
                </div>
                <p className="text-muted-foreground">
                  Comece com 1000 créditos e aprimore suas estratégias de apostas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-accent">
                  <Diamond className="h-8 w-8" />
                  <h3 className="text-xl font-bold text-foreground">Tempo Real</h3>
                </div>
                <p className="text-muted-foreground">
                  Atualizações instantâneas via WebSocket para uma experiência fluida.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="text-center">
            <Link to="/sobre">
              <Button variant="link" className="text-primary hover:text-primary/80">
                Saiba mais sobre a plataforma →
              </Button>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

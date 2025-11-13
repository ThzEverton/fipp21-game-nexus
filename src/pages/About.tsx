import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-accent text-center">Sobre a Plataforma FIPP21</h1>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">O que é o FIPP21?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                FIPP21 é uma plataforma multiplayer de Blackjack (21) desenvolvida para proporcionar uma experiência
                autêntica de cassino online. Jogue com amigos, crie salas privadas e teste suas estratégias!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Regras do Jogo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Objetivo</h3>
                <p>
                  O objetivo é obter cartas cujo valor total seja o mais próximo possível de 21, sem ultrapassar.
                  Você joga contra o dealer (casa).
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Valores das Cartas</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cartas de 2 a 10: valor nominal</li>
                  <li>Valete (J), Dama (Q) e Rei (K): valem 10</li>
                  <li>Ás (A): vale 1 ou 11 (o que for mais vantajoso)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Como Jogar</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Cada jogador começa com 1000 créditos</li>
                  <li>Faça sua aposta antes do início da rodada</li>
                  <li>Receba duas cartas iniciais (ambas viradas para cima)</li>
                  <li>O dealer também recebe duas cartas (uma virada para cima, uma para baixo)</li>
                  <li>Escolha: pedir mais cartas (HIT) ou parar (STAND)</li>
                  <li>Se ultrapassar 21, você perde automaticamente (BUST)</li>
                  <li>Após todos os jogadores, o dealer revela sua carta oculta e joga</li>
                  <li>O dealer deve pedir carta até ter 17 ou mais</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Blackjack Natural</h3>
                <p>
                  Se suas duas primeiras cartas somarem 21 (Ás + carta de valor 10), você tem um Blackjack!
                  Isso paga 3:2, ou seja, você ganha 1.5x sua aposta.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Resultados</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-primary">Vitória:</strong> Sua mão está mais próxima de 21 que a do dealer</li>
                  <li><strong className="text-destructive">Derrota:</strong> O dealer está mais próximo de 21 ou você estourou</li>
                  <li><strong className="text-accent">Empate:</strong> Mesma pontuação que o dealer (aposta devolvida)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Funcionalidades da Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li>Criação de salas de jogo privadas</li>
                <li>Sistema de convites por código de sala</li>
                <li>Atualização em tempo real via WebSocket</li>
                <li>Histórico de rodadas e apostas</li>
                <li>Gestão de créditos e apostas</li>
                <li>Interface moderna e responsiva</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Link to="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Começar a Jogar
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

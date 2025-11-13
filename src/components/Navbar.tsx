import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-accent hover:text-accent/80 transition-colors">
          <span className="text-2xl">🃏</span>
          <span>FIPP21</span>
        </Link>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-foreground">Olá, <span className="text-primary font-semibold">{user.nome}</span></span>
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

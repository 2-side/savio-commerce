import ApplicationLogo from '@/Components/ApplicationLogo';
import { ModeToggle } from '@/Components/mode-toggle';
import { Link } from '@inertiajs/react';
import { ShoppingBasket } from 'lucide-react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export default function Header() {
    return (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3">
                    <ApplicationLogo className="h-10 w-10" />
                    <span className="font-heading text-xl font-bold tracking-tight">
                        {appName}
                    </span>
                </Link>

                <nav className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href={route('shop')}
                        className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground sm:block"
                    >
                        Prodotti
                    </Link>
                    <Link
                        href="/#chi-siamo"
                        className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground sm:block"
                    >
                        Chi siamo
                    </Link>
                    <Link
                        href="/#contatti"
                        className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground sm:block"
                    >
                        Contatti
                    </Link>

                    <Link
                        href={route('cart')}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-accent"
                    >
                        <ShoppingBasket className="h-5 w-5" />
                        <span className="sr-only">Carrello</span>
                    </Link>

                    <ModeToggle />
                </nav>
            </div>
        </header>
    );
}

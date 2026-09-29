import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export default function Footer() {
    return (
        <footer className="border-t border-black/10 bg-[#241c14] text-[#f3ecdc]">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <ApplicationLogo className="h-8 w-8" />
                    <span className="font-heading text-lg font-bold">
                        {appName}
                    </span>
                </Link>

                <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#f3ecdc]/70">
                    <Link href={route('shop')} className="hover:text-[#f3ecdc]">
                        Prodotti
                    </Link>
                    <Link href="/#chi-siamo" className="hover:text-[#f3ecdc]">
                        Chi siamo
                    </Link>
                    <Link href="/#contatti" className="hover:text-[#f3ecdc]">
                        Contatti
                    </Link>
                </nav>

                <p className="text-xs text-[#f3ecdc]/50">
                    &copy; {new Date().getFullYear()} {appName}. Tutti i diritti riservati.
                </p>
            </div>
        </footer>
    );
}

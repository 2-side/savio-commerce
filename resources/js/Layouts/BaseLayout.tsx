import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import { PropsWithChildren } from 'react';

export default function BaseLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}

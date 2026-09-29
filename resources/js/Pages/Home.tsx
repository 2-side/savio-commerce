import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import ProductImage from '@/Components/ProductImage';

interface ShopProduct {
    id: number;
    name: string;
    description: string | null;
    thumbnail: string;
    price: string | null;
    stock: number | null;
}

export default function Home({ products }: { products: ShopProduct[] }) {
    const appName = import.meta.env.VITE_APP_NAME || 'Negozio';

    return (
        <>
            <Head title="Benvenuti" />

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(circle at 15% 20%, #d7e9a8 0%, transparent 45%), radial-gradient(circle at 85% 15%, #f7c98f 0%, transparent 40%), radial-gradient(circle at 50% 100%, #f2ddb0 0%, transparent 55%)',
                    }}
                />
                <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center sm:py-32">
                    <span className="mb-4 inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/70">
                        Frutta e succhi genuini
                    </span>
                    <h1 className="max-w-3xl text-4xl font-bold sm:text-6xl">
                        {appName}
                    </h1>
                    <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                        Succhi e frutta di stagione, lavorati con cura per
                        portare in tavola il sapore autentico del raccolto.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <a href="#prodotti">
                            <Button
                                size="lg"
                                className="h-12 rounded-full bg-primary px-8 text-base text-primary-foreground hover:bg-primary/90"
                            >
                                Scopri i prodotti
                            </Button>
                        </a>
                        <Link href={route('shop')}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 rounded-full border-foreground/20 bg-transparent px-8 text-base hover:bg-secondary"
                            >
                                Vai al negozio
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Prodotti */}
            <section id="prodotti" className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold sm:text-4xl">
                        I nostri prodotti
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Coltivati e lavorati con cura, seguendo la stagionalità
                        e le ricette di una volta.
                    </p>
                </div>

                {products.length === 0 ? (
                    <p className="mt-12 text-center text-muted-foreground">
                        Nessun prodotto disponibile al momento.
                    </p>
                ) : (
                    <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={route('shop.product', product.id)}
                                className="group flex flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10 transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                {product.thumbnail ? (
                                    <img
                                        src={product.thumbnail}
                                        alt={product.name}
                                        className="aspect-square w-full object-cover"
                                    />
                                ) : (
                                    <ProductImage name={product.name} />
                                )}

                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="font-heading text-lg font-semibold">
                                        {product.name}
                                    </h3>
                                    {product.description && (
                                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                            {product.description}
                                        </p>
                                    )}
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="font-heading text-lg font-bold text-foreground">
                                            {product.price ?? '—'}
                                        </span>
                                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground opacity-0 transition group-hover:opacity-100">
                                            Aggiungi
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Chi siamo */}
            <section id="chi-siamo" className="border-t border-border/70 bg-secondary/40">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2">
                    <div
                        className="aspect-[4/3] w-full rounded-3xl"
                        style={{
                            background:
                                'radial-gradient(circle at 25% 25%, #c6e06a, #8fb52b 55%, #33421a 100%)',
                        }}
                    />
                    <div>
                        <h2 className="text-3xl font-bold sm:text-4xl">Chi siamo</h2>
                        <p className="mt-5 text-muted-foreground">
                            Nasciamo dalla passione per la terra e per un
                            lavoro fatto con calma, nel rispetto dei tempi
                            della natura. Selezioniamo frutta di stagione e la
                            trasformiamo in succhi genuini, senza scorciatoie.
                        </p>
                        <p className="mt-4 text-muted-foreground">
                            Crediamo in un'agricoltura rispettosa e in
                            prodotti semplici, buoni e riconoscibili.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contatti */}
            <section id="contatti" className="bg-primary text-primary-foreground">
                <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-24">
                    <h2 className="text-3xl font-bold sm:text-4xl">Contatti</h2>
                    <p className="mt-4 text-primary-foreground/80">
                        Vuoi ordinare o avere informazioni sui nostri
                        prodotti? Scrivici!
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link href={route('shop')}>
                            <Button
                                size="lg"
                                className="h-12 rounded-full bg-[#241c14] px-8 text-base text-[#f3ecdc] hover:bg-[#241c14]/90"
                            >
                                Sfoglia il negozio
                            </Button>
                        </Link>
                        <a href="mailto:info@example.com">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 rounded-full border-primary-foreground/40 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10"
                            >
                                Scrivici una email
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}

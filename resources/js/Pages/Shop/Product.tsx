import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import ProductImage from '@/Components/ProductImage'
import { ArrowLeft } from 'lucide-react'

interface ShopProduct {
    id: number
    variantId: number | null
    name: string
    description: string | null
    thumbnail: string
    price: string | null
    stock: number | null
}

export default function Product({ product }: { product: ShopProduct }) {
    const addToCart = () => {
        if (!product.variantId) return

        router.post(
            route('cart.store'),
            {
                product_variant_id: product.variantId,
                quantity: 1,
            },
            { preserveScroll: true }
        )
    }

    return (
        <>
            <Head title={product.name} />

            <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
                <Link
                    href={route('shop')}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Torna ai prodotti
                </Link>

                <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2">
                    {product.thumbnail ? (
                        <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="aspect-square w-full rounded-3xl object-cover"
                        />
                    ) : (
                        <ProductImage name={product.name} className="rounded-3xl" />
                    )}

                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-bold">
                            {product.name}
                        </h1>

                        {product.description && (
                            <p className="mt-4 text-muted-foreground">
                                {product.description}
                            </p>
                        )}

                        <div className="mt-8 flex items-center justify-between rounded-2xl bg-secondary px-5 py-4">
                            <span className="font-heading text-2xl font-bold">
                                {product.price ?? '—'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {product.stock && product.stock > 0
                                    ? `${product.stock} disponibili`
                                    : 'Esaurito'}
                            </span>
                        </div>

                        <Button
                            className="mt-6 h-12 w-full rounded-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
                            disabled={!product.variantId || !product.stock}
                            onClick={addToCart}
                        >
                            Aggiungi al carrello
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

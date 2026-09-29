import { Head, Link } from '@inertiajs/react'
import ProductImage from '@/Components/ProductImage'

interface ShopProduct {
    id: number
    name: string
    description: string | null
    thumbnail: string
    price: string | null
    stock: number | null
}

interface ShopCollection {
    id: number
    name: string
    description: string | null
}

export default function Collection({
    collection,
    products,
}: {
    collection: ShopCollection
    products: ShopProduct[]
}) {
    return (
        <>
            <Head title={collection.name} />

            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold sm:text-4xl">
                        {collection.name}
                    </h1>

                    {collection.description && (
                        <p className="mt-4 text-muted-foreground">
                            {collection.description}
                        </p>
                    )}
                </div>

                {products.length === 0 ? (
                    <p className="mt-12 text-center text-muted-foreground">
                        Nessun prodotto disponibile in questa collezione.
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
                                    <h2 className="font-heading text-lg font-semibold">
                                        {product.name}
                                    </h2>
                                    {product.description && (
                                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                            {product.description}
                                        </p>
                                    )}

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="font-heading text-lg font-bold">
                                            {product.price ?? '—'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {product.stock && product.stock > 0
                                                ? `${product.stock} disponibili`
                                                : 'Esaurito'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import ProductImage from '@/Components/ProductImage'
import { Minus, Plus, X } from 'lucide-react'

interface CartLine {
    id: number
    quantity: number
    subTotal: string | null
    product: {
        name: string
        thumbnail: string
    }
}

interface CartData {
    id: number
    lines: CartLine[]
    subTotal: string | null
    total: string | null
}

export default function Cart({ cart }: { cart: CartData | null }) {
    const updateQuantity = (lineId: number, quantity: number) => {
        if (quantity < 1) return

        router.patch(
            route('cart.update', lineId),
            { quantity },
            { preserveScroll: true }
        )
    }

    const removeLine = (lineId: number) => {
        router.delete(route('cart.destroy', lineId), { preserveScroll: true })
    }

    const isEmpty = !cart || cart.lines.length === 0

    return (
        <>
            <Head title="Carrello" />

            <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
                <h1 className="mb-8 text-3xl font-bold">Il tuo carrello</h1>

                {isEmpty ? (
                    <div className="rounded-3xl bg-secondary/50 px-6 py-16 text-center text-muted-foreground">
                        Il carrello è vuoto.{' '}
                        <Link href={route('shop')} className="font-medium text-primary hover:underline">
                            Continua lo shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cart.lines.map((line) => (
                                <div
                                    key={line.id}
                                    className="flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
                                >
                                    {line.product.thumbnail ? (
                                        <img
                                            src={line.product.thumbnail}
                                            alt={line.product.name}
                                            className="h-16 w-16 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <ProductImage
                                            name={line.product.name}
                                            className="h-16 w-16 rounded-xl"
                                        />
                                    )}

                                    <div className="flex-1">
                                        <p className="font-heading font-semibold">
                                            {line.product.name}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon-sm"
                                                className="rounded-full"
                                                onClick={() =>
                                                    updateQuantity(line.id, line.quantity - 1)
                                                }
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </Button>
                                            <span className="w-6 text-center text-sm">
                                                {line.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon-sm"
                                                className="rounded-full"
                                                onClick={() =>
                                                    updateQuantity(line.id, line.quantity + 1)
                                                }
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-heading font-semibold">
                                            {line.subTotal ?? '—'}
                                        </p>
                                        <button
                                            onClick={() => removeLine(line.id)}
                                            className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                            Rimuovi
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-between rounded-2xl bg-secondary px-5 py-4">
                            <span className="font-heading text-lg font-bold">
                                Totale
                            </span>
                            <span className="font-heading text-lg font-bold">
                                {cart.total ?? cart.subTotal ?? '—'}
                            </span>
                        </div>

                        <Link href={route('checkout')} className="mt-6 block">
                            <Button className="h-12 w-full rounded-full bg-primary text-base text-primary-foreground hover:bg-primary/90">
                                Procedi al checkout
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </>
    )
}

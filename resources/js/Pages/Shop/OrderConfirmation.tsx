import { Head, Link } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'

export default function OrderConfirmation({ orderId }: { orderId: number }) {
    return (
        <>
            <Head title="Order confirmed" />

            <div className="mx-auto max-w-lg px-6 py-24 text-center">
                <h1 className="font-heading text-2xl font-semibold">
                    Thank you for your order!
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Your order #{orderId} has been placed and paid via PayPal.
                </p>

                <Link href={route('shop')} className="mt-8 inline-block">
                    <Button>Continue shopping</Button>
                </Link>
            </div>
        </>
    )
}

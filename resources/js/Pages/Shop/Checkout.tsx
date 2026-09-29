import { useForm, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Button } from '@/Components/ui/button'
import { csrfHeaders } from '@/lib/csrf'

interface CartLine {
    id: number
    quantity: number
    subTotal: string | null
    product: {
        name: string
        thumbnail: string
    }
}

interface BillingAddress {
    first_name: string
    last_name: string
    line_one: string
    line_two: string | null
    city: string
    state: string | null
    postcode: string
    country_id: number | null
    contact_email: string
    contact_phone: string | null
}

interface CheckoutCart {
    id: number
    lines: CartLine[]
    subTotal: string | null
    shippingTotal: string | null
    taxTotal: string | null
    total: string | null
    billingAddress: BillingAddress | null
    shippingOptionIdentifier: string | null
}

interface ShippingOption {
    identifier: string
    name: string
    price: string
}

interface Country {
    id: number
    name: string
}

export default function Checkout({
    cart,
    shippingOptions,
    countries,
    paypalClientId,
    currencyCode,
}: {
    cart: CheckoutCart
    shippingOptions: ShippingOption[]
    countries: Country[]
    paypalClientId: string
    currencyCode: string
}) {
    const { data, setData, post, processing } = useForm({
        first_name: cart.billingAddress?.first_name ?? '',
        last_name: cart.billingAddress?.last_name ?? '',
        line_one: cart.billingAddress?.line_one ?? '',
        line_two: cart.billingAddress?.line_two ?? '',
        city: cart.billingAddress?.city ?? '',
        state: cart.billingAddress?.state ?? '',
        postcode: cart.billingAddress?.postcode ?? '',
        country_id: cart.billingAddress?.country_id ?? '',
        contact_email: cart.billingAddress?.contact_email ?? '',
        contact_phone: cart.billingAddress?.contact_phone ?? '',
        same_as_billing: true,
    })

    const submitAddress = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('checkout.address'), { preserveScroll: true })
    }

    const selectShipping = (identifier: string) => {
        router.post(
            route('checkout.shipping'),
            { identifier },
            { preserveScroll: true }
        )
    }

    const canPay = !!cart.billingAddress && !!cart.shippingOptionIdentifier

    return (
        <>
            <Head title="Checkout" />

            <div className="mx-auto grid max-w-4xl gap-8 px-6 py-12 sm:grid-cols-2">
                <div className="space-y-8">
                    <section>
                        <h2 className="mb-4 font-heading text-lg font-semibold">
                            1. Address
                        </h2>

                        <form onSubmit={submitAddress} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="First name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                />
                                <input
                                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Last name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                            </div>

                            <input
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Address line 1"
                                value={data.line_one}
                                onChange={(e) => setData('line_one', e.target.value)}
                            />

                            <input
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Address line 2 (optional)"
                                value={data.line_two ?? ''}
                                onChange={(e) => setData('line_two', e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="City"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                />
                                <input
                                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Postcode"
                                    value={data.postcode}
                                    onChange={(e) => setData('postcode', e.target.value)}
                                />
                            </div>

                            <select
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                value={data.country_id}
                                onChange={(e) => setData('country_id', Number(e.target.value))}
                            >
                                <option value="">Select country</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="email"
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                            />

                            <input
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Phone (optional)"
                                value={data.contact_phone ?? ''}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                            />

                            <Button type="submit" disabled={processing} className="w-full">
                                Save address
                            </Button>
                        </form>
                    </section>

                    <section>
                        <h2 className="mb-4 font-heading text-lg font-semibold">
                            2. Shipping
                        </h2>

                        <div className="space-y-2">
                            {shippingOptions.map((option) => (
                                <button
                                    key={option.identifier}
                                    onClick={() => selectShipping(option.identifier)}
                                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm ${
                                        cart.shippingOptionIdentifier === option.identifier
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border'
                                    }`}
                                >
                                    <span>{option.name}</span>
                                    <span>{option.price}</span>
                                </button>
                            ))}

                            {shippingOptions.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No shipping options available yet — configure a
                                    shipping zone/method in the Lunar admin panel.
                                </p>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 font-heading text-lg font-semibold">
                            3. Pay
                        </h2>

                        {canPay ? (
                            <PayPalScriptProvider
                                options={{ clientId: paypalClientId, currency: currencyCode }}
                            >
                                <PayPalButtons
                                    style={{ layout: 'vertical' }}
                                    createOrder={async () => {
                                        // Turns the cart into a (draft) Lunar order and runs
                                        // stock/discount validation before we bother PayPal.
                                        const draft = await fetch(route('checkout.order.create'), {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                ...csrfHeaders(),
                                            },
                                        })
                                        const draftResult = await draft.json()

                                        if (!draftResult.success) {
                                            throw new Error(
                                                draftResult.message ?? 'Could not create order.'
                                            )
                                        }

                                        const res = await fetch(route('post.paypal.order'), {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                ...csrfHeaders(),
                                            },
                                        })
                                        const order = await res.json()
                                        return order.id
                                    }}
                                    onApprove={async (data) => {
                                        const res = await fetch(
                                            route('checkout.paypal.capture'),
                                            {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                    ...csrfHeaders(),
                                                },
                                                body: JSON.stringify({
                                                    paypal_order_id: data.orderID,
                                                }),
                                            }
                                        )
                                        const result = await res.json()

                                        if (result.success) {
                                            router.visit(
                                                route('checkout.success', {
                                                    order: result.orderId,
                                                })
                                            )
                                        } else {
                                            alert(
                                                result.message ??
                                                    'Payment could not be completed.'
                                            )
                                        }
                                    }}
                                    onError={(err) => {
                                        console.error(err)
                                        alert('PayPal encountered an error.')
                                    }}
                                />
                            </PayPalScriptProvider>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Save your address and pick a shipping option to pay.
                            </p>
                        )}
                    </section>
                </div>

                <div>
                    <h2 className="mb-4 font-heading text-lg font-semibold">
                        Order summary
                    </h2>

                    <div className="divide-y divide-border rounded-xl border border-border">
                        {cart.lines.map((line) => (
                            <div key={line.id} className="flex items-center justify-between p-4 text-sm">
                                <span>
                                    {line.product.name} &times; {line.quantity}
                                </span>
                                <span>{line.subTotal ?? '—'}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{cart.subTotal ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>{cart.shippingTotal ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span>{cart.taxTotal ?? '—'}</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 font-medium">
                            <span>Total</span>
                            <span>{cart.total ?? '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

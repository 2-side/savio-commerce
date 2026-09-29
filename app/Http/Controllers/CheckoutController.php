<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Lunar\Base\DataTransferObjects\PaymentAuthorize;
use Lunar\Facades\CartSession;
use Lunar\Facades\Payments;
use Lunar\Models\Cart;
use Lunar\Models\CartLine;
use Lunar\Models\Country;

class CheckoutController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $cart = CartSession::current(calculate: true);

        if (! $cart || $cart->lines->isEmpty()) {
            return redirect()->route('cart');
        }

        return Inertia::render('Shop/Checkout', [
            'cart' => $this->transform($cart),
            'shippingOptions' => CartSession::getShippingOptions()->map(fn ($option) => [
                'identifier' => $option->getIdentifier(),
                'name' => $option->getName(),
                'price' => $option->getPrice()->formatted(),
            ]),
            'countries' => Country::orderBy('name')->get(['id', 'name']),
            'paypalClientId' => config('services.paypal.client_id'),
            'currencyCode' => $cart->currency->code,
        ]);
    }

    public function address(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'line_one' => ['required', 'string'],
            'line_two' => ['nullable', 'string'],
            'city' => ['required', 'string'],
            'state' => ['nullable', 'string'],
            'postcode' => ['required', 'string'],
            'country_id' => ['required', 'integer', 'exists:'.(new Country)->getTable().',id'],
            'contact_email' => ['required', 'email'],
            'contact_phone' => ['nullable', 'string'],
            'same_as_billing' => ['sometimes', 'boolean'],
        ]);

        $cart = CartSession::current();

        $cart->setBillingAddress($data);

        if ($data['same_as_billing'] ?? true) {
            $cart->setShippingAddress($data);
        }

        return redirect()->route('checkout');
    }

    public function shipping(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string'],
        ]);

        $cart = CartSession::current();

        $option = CartSession::getShippingOptions()
            ->first(fn ($option) => $option->getIdentifier() === $data['identifier']);

        abort_unless($option, 422, 'Invalid shipping option selected.');

        $cart->setShippingOption($option);

        return redirect()->route('checkout');
    }

    /**
     * Called client-side by the PayPal JS SDK's onApprove callback once the
     * buyer approves the payment in the popup. This is the normal path.
     */
    public function capturePaypal(Request $request): JsonResponse
    {
        $data = $request->validate([
            'paypal_order_id' => ['required', 'string'],
        ]);

        $result = $this->authorizePaypalOrder($data['paypal_order_id']);

        return response()->json([
            'success' => $result->success,
            'orderId' => $result->orderId,
            'message' => $result->message,
        ]);
    }

    /**
     * PayPal's own return_url/cancel_url target (set in Paypal::buildInitialOrder()).
     * Used as a fallback if the buyer's flow does a full-page redirect instead of
     * staying in the JS SDK popup. PayPal appends either:
     * - ?token={paypal_order_id}&PayerID=... after approval, or
     * - nothing at all if cancelled (fingerprint arrives as a route param instead).
     *
     * When the JS SDK flow already captured the payment, it sends us here with
     * ?order={id} instead, so we just show the confirmation without re-capturing.
     */
    public function success(Request $request, ?string $fingerprint = null): Response|RedirectResponse
    {
        if ($orderId = $request->query('order')) {
            return Inertia::render('Shop/OrderConfirmation', [
                'orderId' => (int) $orderId,
            ]);
        }

        $token = $request->query('token');

        if (! $token) {
            return redirect()->route('checkout')->with('error', 'Payment was cancelled.');
        }

        $result = $this->authorizePaypalOrder($token);

        if (! $result->success) {
            return redirect()->route('checkout')->with('error', $result->message ?? 'Payment could not be completed.');
        }

        return Inertia::render('Shop/OrderConfirmation', [
            'orderId' => $result->orderId,
        ]);
    }

    private function authorizePaypalOrder(string $paypalOrderId): PaymentAuthorize
    {
        $cart = CartSession::current();

        $result = Payments::driver('paypal')
            ->cart($cart)
            ->withData(['paypal_order_id' => $paypalOrderId])
            ->authorize();

        if ($result->success) {
            CartSession::forget();
        }

        return $result;
    }

    private function transform(Cart $cart): array
    {
        return [
            'id' => $cart->id,
            'fingerprint' => $cart->fingerprint(),
            'lines' => $cart->lines->map(fn (CartLine $line) => [
                'id' => $line->id,
                'quantity' => $line->quantity,
                'subTotal' => $line->subTotal?->formatted(),
                'product' => [
                    'name' => $line->purchasable->product->translateAttribute('name'),
                    'thumbnail' => $line->purchasable->product->getThumbnailImage(),
                ],
            ]),
            'subTotal' => $cart->subTotal?->formatted(),
            'shippingTotal' => $cart->shippingTotal?->formatted(),
            'taxTotal' => $cart->taxTotal?->formatted(),
            'total' => $cart->total?->formatted(),
            'billingAddress' => $cart->billingAddress ? [
                'first_name' => $cart->billingAddress->first_name,
                'last_name' => $cart->billingAddress->last_name,
                'line_one' => $cart->billingAddress->line_one,
                'line_two' => $cart->billingAddress->line_two,
                'city' => $cart->billingAddress->city,
                'state' => $cart->billingAddress->state,
                'postcode' => $cart->billingAddress->postcode,
                'country_id' => $cart->billingAddress->country_id,
                'contact_email' => $cart->billingAddress->contact_email,
                'contact_phone' => $cart->billingAddress->contact_phone,
            ] : null,
            'shippingOptionIdentifier' => $cart->getShippingOption()?->getIdentifier(),
        ];
    }
}

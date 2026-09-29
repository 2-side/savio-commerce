<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Lunar\Exceptions\LunarException;
use Lunar\Facades\CartSession;
use Lunar\Models\Order;
use Lunar\Models\OrderAddress;

class OrderController extends Controller
{
    /**
     * Turn the current session cart into a draft order.
     *
     * Safe to call more than once for the same cart (e.g. once the buyer
     * reaches the payment step) - Cart::createOrder() reuses/updates the
     * existing draft order rather than creating a duplicate. This runs the
     * same stock/discount validation Lunar uses internally, so problems
     * surface before the buyer is sent to PayPal rather than during capture.
     */
    public function createOrder(): JsonResponse
    {
        $cart = CartSession::current();

        try {
            $order = $cart->createOrder(
                allowMultipleOrders: false,
                orderIdToUpdate: null,
            );
        } catch (LunarException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'orderId' => $order->id,
            'reference' => $order->reference,
            'total' => $order->total->formatted(),
        ]);
    }

    /**
     * List the authenticated user's placed orders.
     */
    public function index(Request $request): Response
    {
        $orders = $request->user()
            ->orders()
            ->whereNotNull('placed_at')
            ->latest('placed_at')
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'reference' => $order->reference,
                'status' => $order->status,
                'placedAt' => $order->placed_at?->toDateTimeString(),
                'total' => $order->total->formatted(),
            ]);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show a single placed order belonging to the authenticated user.
     */
    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $order->load(['lines', 'shippingAddress', 'billingAddress']);

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'reference' => $order->reference,
                'status' => $order->status,
                'placedAt' => $order->placed_at?->toDateTimeString(),
                'lines' => $order->lines->map(fn ($line) => [
                    'id' => $line->id,
                    'description' => $line->description,
                    'quantity' => $line->quantity,
                    'total' => $line->total->formatted(),
                ]),
                'subTotal' => $order->sub_total->formatted(),
                'shippingTotal' => $order->shipping_total->formatted(),
                'taxTotal' => $order->tax_total->formatted(),
                'total' => $order->total->formatted(),
                'shippingAddress' => $this->transformAddress($order->shippingAddress),
                'billingAddress' => $this->transformAddress($order->billingAddress),
            ],
        ]);
    }

    private function transformAddress(?OrderAddress $address): ?array
    {
        if (! $address) {
            return null;
        }

        return [
            'first_name' => $address->first_name,
            'last_name' => $address->last_name,
            'line_one' => $address->line_one,
            'line_two' => $address->line_two,
            'city' => $address->city,
            'state' => $address->state,
            'postcode' => $address->postcode,
        ];
    }
}

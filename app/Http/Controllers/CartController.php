<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Lunar\Facades\CartSession;
use Lunar\Models\Cart;
use Lunar\Models\CartLine;
use Lunar\Models\ProductVariant;

class CartController extends Controller
{
    public function index(): Response
    {
        $cart = CartSession::current(calculate: true);

        return Inertia::render('Cart/Cart', [
            'cart' => $cart ? $this->transform($cart) : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_variant_id' => ['required', 'integer', 'exists:'.(new ProductVariant)->getTable().',id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $variant = ProductVariant::findOrFail($data['product_variant_id']);

        // CartSession::current() creates a cart for the session/user if one
        // doesn't exist yet, then Cart::add() pushes a new/merged CartLine.
        CartSession::add($variant, $data['quantity']);

        return back();
    }

    public function update(Request $request, CartLine $cartLine): RedirectResponse
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        CartSession::current()->updateLine($cartLine->id, $data['quantity']);

        return back();
    }

    public function destroy(CartLine $cartLine): RedirectResponse
    {
        CartSession::current()->remove($cartLine->id);

        return back();
    }

    public function clear(): RedirectResponse
    {
        CartSession::current()->clear();

        return back();
    }

    private function transform(Cart $cart): array
    {
        return [
            'id' => $cart->id,
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
            'total' => $cart->total?->formatted(),
        ];
    }
}

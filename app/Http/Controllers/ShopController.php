<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Lunar\Models\Channel;
use Lunar\Models\Product;

class ShopController extends Controller
{
    public function index()
    {
        $products = Product::query()
            ->with(['variants.prices', 'thumbnail'])
            ->channel(Channel::getDefault())
            ->status('published')
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->translateAttribute('name'),
                'description' => $product->translateAttribute('description'),
                'thumbnail' => $product->getThumbnailImage(),
                'price' => $product->variants->first()?->prices->first()?->price->formatted(),
                'stock' => $product->variants->first()?->stock,
            ]);

        return Inertia::render('Shop/Shop', [
            'products' => $products,
        ]);
    }
}

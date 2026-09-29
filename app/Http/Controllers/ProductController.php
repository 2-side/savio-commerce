<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Lunar\Models\Product;

class ProductController extends Controller
{
    public function show(Product $product)
    {
        $product->load(['variants.prices', 'thumbnail']);

        return Inertia::render('Shop/Product', [
            'product' => [
                'id' => $product->id,
                'variantId' => $product->variants->first()?->id,
                'name' => $product->translateAttribute('name'),
                'description' => $product->translateAttribute('description'),
                'thumbnail' => $product->getThumbnailImage(),
                'price' => $product->variants->first()?->prices->first()?->price->formatted(),
                'stock' => $product->variants->first()?->stock,
            ],
        ]);
    }
}

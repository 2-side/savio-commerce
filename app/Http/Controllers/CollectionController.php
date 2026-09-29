<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Lunar\Models\Channel;
use Lunar\Models\Collection;
use Lunar\Models\Product;
use Lunar\Models\Url;

class CollectionController extends Controller
{
    public function show(string $slug)
    {
        $url = Url::where('slug', $slug)
            ->where('element_type', (new Collection)->getMorphClass())
            ->firstOrFail();

        $collection = $url->element;

        $products = $collection->products()
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

        return Inertia::render('Shop/Collection', [
            'collection' => [
                'id' => $collection->id,
                'name' => $collection->translateAttribute('name'),
                'description' => $collection->translateAttribute('description'),
            ],
            'products' => $products,
        ]);
    }
}

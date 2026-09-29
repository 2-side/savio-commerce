<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Lunar\FieldTypes\TranslatedText;
use Lunar\Models\Attribute;
use Lunar\Models\AttributeGroup;
use Lunar\Models\Channel;
use Lunar\Models\Country;
use Lunar\Models\Currency;
use Lunar\Models\CustomerGroup;
use Lunar\Models\Language;
use Lunar\Models\Price;
use Lunar\Models\Product;
use Lunar\Models\ProductType;
use Lunar\Models\ProductVariant;
use Lunar\Models\TaxClass;
use Lunar\Models\TaxZone;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $channel = Channel::whereDefault(true)->first() ?? Channel::create([
            'name' => 'Webstore',
            'handle' => 'webstore',
            'default' => true,
            'url' => config('app.url'),
        ]);

        if (! Language::count()) {
            Language::create([
                'code' => 'it',
                'name' => 'Italiano',
                'default' => true,
            ]);
        }

        $currency = Currency::whereDefault(true)->first() ?? Currency::create([
            'code' => 'EUR',
            'name' => 'Euro',
            'exchange_rate' => 1,
            'decimal_places' => 2,
            'default' => true,
            'enabled' => true,
        ]);

        $customerGroup = CustomerGroup::whereDefault(true)->first() ?? CustomerGroup::create([
            'name' => 'Retail',
            'handle' => 'retail',
            'default' => true,
        ]);

        $taxClass = TaxClass::whereDefault(true)->first() ?? TaxClass::create([
            'name' => 'Default Tax Class',
            'default' => true,
        ]);

        if (! TaxZone::count()) {
            $taxZone = TaxZone::create([
                'name' => 'Default Tax Zone',
                'zone_type' => 'country',
                'price_display' => 'tax_exclusive',
                'default' => true,
                'active' => true,
            ]);

            $taxZone->countries()->createMany(
                Country::get()->map(fn ($country) => [
                    'country_id' => $country->id,
                ])
            );
        }

        if (! Attribute::whereHandle('name')->whereAttributeType(Product::morphName())->exists()) {
            $group = AttributeGroup::firstOrCreate(
                ['handle' => 'details', 'attributable_type' => Product::morphName()],
                ['name' => collect(['en' => 'Details']), 'position' => 1]
            );

            Attribute::create([
                'attribute_type' => 'product',
                'attribute_group_id' => $group->id,
                'position' => 1,
                'name' => ['en' => 'Name'],
                'handle' => 'name',
                'section' => 'main',
                'type' => TranslatedText::class,
                'required' => true,
                'system' => true,
                'description' => ['en' => ''],
                'configuration' => ['richtext' => false],
            ]);

            Attribute::create([
                'attribute_type' => 'product',
                'attribute_group_id' => $group->id,
                'position' => 2,
                'name' => ['en' => 'Description'],
                'handle' => 'description',
                'section' => 'main',
                'type' => TranslatedText::class,
                'required' => false,
                'system' => false,
                'description' => ['en' => ''],
                'configuration' => ['richtext' => true],
            ]);
        }

        $productType = ProductType::firstOrCreate(['name' => 'Stock']);

        $productType->mappedAttributes()->syncWithoutDetaching(
            Attribute::whereAttributeType(Product::morphName())->pluck('id')
        );

        collect([
            [
                'name' => 'Succo Mela e Kiwi',
                'description' => 'Succo genuino di mela e kiwi, senza zuccheri aggiunti. Dolce, fresco e ricco di vitamina C.',
            ],
            [
                'name' => 'Succo Pesca Big Top',
                'description' => 'Succo ottenuto dalle pesche Big Top, raccolte a piena maturazione per un sapore intenso e naturale.',
            ],
            [
                'name' => 'Pesca Nettarina',
                'description' => 'Nettarine succose e profumate, coltivate al sole del meridione e raccolte a mano.',
            ],
            [
                'name' => 'Albicocca',
                'description' => 'Albicocche dolci e mature, dal colore acceso e dal profumo intenso, dritte dal campo alla tavola.',
            ],
        ])->each(function (array $data) use ($productType, $taxClass, $currency, $channel, $customerGroup) {
            $product = Product::create([
                'product_type_id' => $productType->id,
                'status' => 'published',
                'attribute_data' => collect([
                    'name' => new TranslatedText(['it' => $data['name']]),
                    'description' => new TranslatedText(['it' => $data['description']]),
                ]),
            ]);

            $product->channels()->syncWithoutDetaching([
                $channel->id => ['enabled' => true, 'starts_at' => now()],
            ]);

            $product->customerGroups()->syncWithoutDetaching([
                $customerGroup->id => [
                    'purchasable' => true,
                    'visible' => true,
                    'enabled' => true,
                    'starts_at' => now(),
                ],
            ]);

            $variant = ProductVariant::create([
                'product_id' => $product->id,
                'tax_class_id' => $taxClass->id,
                'sku' => Str::upper(Str::slug($data['name'], '')).'-'.Str::random(4),
                'unit_quantity' => 1,
                'stock' => fake()->numberBetween(20, 100),
                'shippable' => true,
                'purchasable' => 'always',
            ]);

            Price::create([
                'priceable_type' => ProductVariant::morphName(),
                'priceable_id' => $variant->id,
                'currency_id' => $currency->id,
                'price' => 300,
                'min_quantity' => 1,
            ]);
        });
    }
}

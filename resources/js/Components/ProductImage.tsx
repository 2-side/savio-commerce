import { cn } from '@/lib/utils';

type ProductTheme = {
    from: string;
    to: string;
    emoji: string;
};

const FALLBACK_THEME: ProductTheme = { from: '#c6e06a', to: '#8fb52b', emoji: '🍃' };

const KEYWORD_THEMES: [RegExp, ProductTheme][] = [
    [/kiwi/i, { from: '#c6e06a', to: '#8fb52b', emoji: '🥝' }],
    [/mela/i, { from: '#d7e28a', to: '#a3c93f', emoji: '🍏' }],
    [/pesca|nettarina/i, { from: '#f7b267', to: '#e0793f', emoji: '🍑' }],
    [/albicocca/i, { from: '#f6b53d', to: '#e08a2b', emoji: '🍊' }],
];

function themeFor(name: string): ProductTheme {
    const match = KEYWORD_THEMES.find(([pattern]) => pattern.test(name));
    return match ? match[1] : FALLBACK_THEME;
}

export default function ProductImage({
    name,
    className,
}: {
    name: string;
    className?: string;
}) {
    const theme = themeFor(name);

    return (
        <div
            className={cn(
                'relative flex aspect-square w-full items-center justify-center overflow-hidden',
                className,
            )}
            style={{
                background: `radial-gradient(circle at 32% 28%, ${theme.from}, ${theme.to})`,
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.25),transparent_55%)]" />
            <span className="relative text-7xl leading-none drop-shadow-sm sm:text-8xl">{theme.emoji}</span>
        </div>
    );
}

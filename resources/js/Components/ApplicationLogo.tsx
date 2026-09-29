import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="24" cy="24" r="24" fill="#A5CD39" />
            <path
                d="M24 34c-6.6 0-11-5.2-11-11.6C13 15.8 18 11 24 11c1 0 2 .1 2.9.4-.7 1-1.1 2.2-1.1 3.5 0 3.4 2.7 6.1 6.1 6.1.4 0 .8 0 1.1-.1.7 1.7 1 3.6 1 3.5C34 28.8 30.6 34 24 34Z"
                fill="#3B2F25"
            />
            <path
                d="M25 12c0-2.2 1.8-4 4-4-1 2-1 4 0 6-2.2 0-4-1.8-4-4Z"
                fill="#3B2F25"
            />
        </svg>
    );
}

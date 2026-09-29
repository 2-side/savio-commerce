function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
}

/**
 * Laravel's VerifyCsrfToken middleware accepts the decrypted XSRF-TOKEN
 * cookie via this header, so plain fetch() calls need it set manually
 * (axios does this automatically, fetch does not).
 */
export function csrfHeaders(): HeadersInit {
    return {
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
    }
}

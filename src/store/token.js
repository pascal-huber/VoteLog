/**
 * Requests an id_token from the OIDC provider using the Resource Owner
 * Password Credentials grant.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{id_token: string, access_token: string, expires_in: number}>}
 */
export async function fetchToken(username, password) {
    const response = await fetch(import.meta.env.VITE_OIDC_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'password',
            client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
            scope: 'openid profile email',
            username,
            password,
        }),
    })

    if (!response.ok) {
        const message = await response.text()
        throw new Error(`Login failed: ${message}`)
    }

    return response.json()
}

/**
 * Converts the OIDC provider's relative "expires_in" (seconds) into an
 * absolute epoch-millisecond timestamp, which is what's actually useful
 * to compare against later — "expires_in" alone is only meaningful at
 * the instant the token was issued.
 *
 * @param {number} expiresInSeconds
 * @returns {number} epoch ms when the token expires
 */
export function computeExpiresAt(expiresInSeconds) {
    return Date.now() + expiresInSeconds * 1000
}

/**
 * Persists just enough state in sessionStorage to survive a page refresh.
 * Note: sessionStorage is cleared when the tab closes, unlike localStorage.
 */
export function persistSession(userName, webDav, idToken, expiresAt) {
    sessionStorage.setItem('userName', userName)
    sessionStorage.setItem('idToken', idToken)
    sessionStorage.setItem('webDav', webDav)
    sessionStorage.setItem('tokenExpiresAt', String(expiresAt))
}

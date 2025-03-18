const A = 'a'.charCodeAt(0);

export const getExtensionIdForPubkey = async (pub_key: CryptoKey) => {
    const key_buf = await crypto.subtle.exportKey('spki', pub_key);
    const digest = new Uint8Array(
        await crypto.subtle.digest(
            { name: 'SHA-256' },
            key_buf,
        ),
    );

    return [...digest.slice(0, 16)].map((byte) => {
        const hi = (byte >> 4) & 0xf;
        const lo = byte & 0xf;
        return String.fromCharCode(A + hi, A + lo);
    }).join('');
};

/// <reference lib="webworker" />
import { getExtensionIdForPubkey } from './lib/crx-id.ts';
import { makeChecker } from './lib/checker.ts';

const generateKeypair = async () => {
    const keypair = await crypto.subtle.generateKey(
        {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: { name: 'SHA-256' },
        },
        /*extractable=*/ true,
        /*keyUsages=*/ ['sign'],
    );

    return keypair;
};

export type WorkerFoundResponse = { id: string; key: ArrayBuffer };

async function work(isValid: (s: string) => boolean) {
    let ext_id, keypair;

    do {
        keypair = await generateKeypair();
        ext_id = await getExtensionIdForPubkey(keypair.publicKey);
    } while (!isValid(ext_id));

    const key_bytes = await crypto.subtle.exportKey('pkcs8', keypair.privateKey);
    const response: WorkerFoundResponse = {
        id: ext_id,
        key: key_bytes,
    };

    self.postMessage(response, [key_bytes]);
}

self.addEventListener('message', (event: MessageEvent) => {
    const data = event.data as unknown;

    if (typeof data === 'object' && data && 'conditions' in data) {
        work(makeChecker(event.data.conditions));
    } else throw 'nope';
}, { once: true });

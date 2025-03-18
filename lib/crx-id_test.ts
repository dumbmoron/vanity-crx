import { assertEquals } from '@std/assert';
import { getExtensionIdForPubkey } from './crx-id.ts';
import { decodeBase64 } from 'jsr:@std/encoding/base64';

const importKey = (spki_pubkey: string) => {
    return crypto.subtle.importKey(
        'spki',
        decodeBase64(spki_pubkey),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        true,
        ['verify'],
    );
};

Deno.test(async function testKnownExtensions() {
    const knownExtensions = {
        cjpalhdlnbpafiamejdnhcphjbkeiagm: // uBlock Origin
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmJNzUNVjS6Q1qe0NRqpmfX/oSJdgauSZNdfeb5RV1Hji21vX0TivpP5gq0fadwmvmVCtUpOaNUopgejiUFm/iKHPs0o3x7hyKk/eX0t2QT3OZGdXkPiYpTEC0f0p86SQaLoA2eHaOG4uCGi7sxLJmAXc6IsxGKVklh7cCoLUgWEMnj8ZNG2Y8UKG3gBdrpES5hk7QyFDMraO79NmSlWRNgoJHX6XRoY66oYThFQad8KL8q3pf3Oe8uBLKywohU0ZrDPViWHIszXoE9HEvPTFAbHZ1umINni4W/YVs+fhqHtzRJcaKJtsTaYy+cholu5mAYeTZqtHf6bcwJ8t9i2afwIDAQAB',
        kbfnbcaeplbcioakkpcpgfkobkghlhen: // Grammarly
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDXGarzPXVb5UpkDTsw4cdApsrQvPTNTMXdz/7j9QVuQZoPm5R9l3o9ppfGYeae7sZRaJiueBEO/LA8s7KCuE9icPl72xSqdei3Jo0PTTUlmNQIysl9PZy6Xd520sS5wNFhPaxOy1ApHZ6+o+yMEXWmjx2fX0tHJd7dKTii47MTnQIDAQAB',
        aapbdbdomjkkjkaonfhkkikfgjllcleb: // Google Translate
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfHy1M+jghaHyaVAILzx/c/Dy+RXtcaP9/5pC7EY8JlNEI/G4DIIng9IzlrH8UWStpMWMyGUsdyusn2PkYFrqfVzhc2azVF3PX9D0KHG3FLN3mNoz1YTBHvO5QSXJf292qW0tTYuoGqeTfXtF9odLdg20Xd0YrLmtS4TQkpSYGDwIDAQAB',
        bmnlcjabgnpnenekpadlanbbkooimhnj: // Honey
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC79mayLyuCYY/dyT7Ycr1sVBp9yHrY4mnogVEgu+sDT6+/A121Na+aTw6mFLD6LHgbgHt4fnQ2V/QwcfBSXRTSkGpgNsZAjnYs4/XzZQYKGltWT93EP9zXN1kGbtzfkPGzTakquCfOjbKtbAQKWh8ppzqLhWcRUn9g/PhU99F29QIDAQAB',
        nkbihfbeogaeaoehlefnkodbefgpgknn: // MetaMask
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlcgI4VVL4JUvo6hlSgeCZp9mGltZrzFvc2Asqzb1dDGO9baoYOe+QRoh27/YyVXugxni480Q/R147INhBOyQZVMhZOD5pFMVutia9MHMaZhgRXzrK3BHtNSkKLL1c5mhutQNwiLqLtFkMSGvka91LoMEC8WTI0wi4tACnJ5FyFZQYzvtqy5sXo3VS3gzfOBluLKi7BxYcaUJjNrhOIxl1xL2qgK5lDrDOLKcbaurDiwqofVtAFOL5sM3uJ6D8nOO9tG+T7hoobRFN+nxk43PHgCv4poicOv+NMZQEk3da1m/xfuzXV88NcE/YRbRLwAS82m3gsJZKc6mLqm4wZHzBwIDAQAB',
        dhdgffkkebhmkfjojejmpbldmpobfkfo: // TamperMonkey
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDjiyuc6OWY8gaVTe+b16fH2BBe0PQLMeUpEXSQvyv5a/6OiQ1D8bBLTfLvApD3zT2MZoXWu2KUILdkyg5OC/Tru8m+Js6e3RjHY9Rqbvnh8CJQgTJ+63L5w9aLsTvA2fqdDfhw8Mnl1GMcJd/RI/ZiBEm0stog0ZfyQjD1jpSEXQIDAQAB',
    };

    for (const [id, pubkey] of Object.entries(knownExtensions)) {
        const key = await importKey(pubkey);
        assertEquals(await getExtensionIdForPubkey(key), id);
    }
});

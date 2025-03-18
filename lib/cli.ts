import { encodeBase64 } from '@std/encoding/base64';

const tryParseNumber = (
    thing: unknown,
    { signed, integer } = { signed: false, integer: true },
): number => {
    if (typeof thing !== 'string') {
        throw 'not a string';
    }

    const number = +thing;
    if (isNaN(number)) {
        throw 'not a number';
    }

    if (!signed && number < 0) {
        throw 'negative number';
    }

    if (integer && !Number.isInteger(number)) {
        throw 'not an integer';
    }

    return number;
};

const parseArguments = () => {
    const loose = [], mapping: Record<string, string> = {};
    let next_value, empty = true;

    for (const arg of Deno.args) {
        empty = false;

        if (next_value) {
            if (!arg) throw `${next_value} is missing a value`;
            mapping[next_value] = arg;
            next_value = undefined;
        } else if (arg.startsWith('--')) {
            const [name, value, ...rest] = arg.split('=');
            if (value) {
                if (rest.length !== 0) {
                    throw `invalid argument: ${arg}`;
                }

                mapping[name.slice(2)] = value;
            } else {
                next_value = name.slice(2);
                continue;
            }
        } else {
            loose.push(arg);
        }
    }

    return { loose, mapping, empty };
};

const checkString = (s: string) => {
    if (!/^[a-q]*$/.test(s))
        throw `unsatisfiable string: ${s}`;
    return s;
}

export type Arguments = {
    threads: number;
    regex?: RegExp;
    startsWith?: string;
    endsWith?: string;
    contains?: string;
};

export const tryParseArguments = () => {
    const { empty, loose, mapping } = parseArguments();

    const cleanArgs: Arguments = {
        threads: 8,
    };

    if (mapping.threads) {
        cleanArgs.threads = tryParseNumber(mapping.threads);
    }
    if (mapping.regex) {
        cleanArgs.regex = new RegExp(mapping.regex.replace(/^\//, '').replace(/\/$/, ''));
    }
    if (mapping['starts-with']) {
        cleanArgs.startsWith = checkString(mapping['starts-with']);
    }
    if (mapping['ends-with']) {
        cleanArgs.endsWith = checkString(mapping['ends-with']);
    }
    if (mapping.contains) {
        cleanArgs.contains = checkString(mapping.contains);
    }

    if (empty || loose.length > 0 || Object.keys(cleanArgs).length < 2) {
        console.error(
            'usage: deno run start [--threads <n>] ' +
                '[--starts-with <str>] [--ends-with <str>] [--contains <str>] [--regex <regex>]',
        );
        console.error("e.g. deno run start --regex '/^demo/'");
        Deno.exit(1);
    }

    return cleanArgs;
};

export const stringifyPrivateKey = (bytes: ArrayBuffer) => {
    const der_body = encodeBase64(bytes).match(/.{1,64}/g);
    if (der_body === null) {
        throw 'oops';
    }

    return [
        '-----BEGIN PRIVATE KEY-----',
        ...der_body,
        '-----END PRIVATE KEY-----',
    ].join('\n');
};

import { stringifyPrivateKey, tryParseArguments } from './lib/cli.ts';
import type { WorkerFoundResponse } from './worker.ts';

if (import.meta.main) {
    const { threads, ...rest } = tryParseArguments();
    const workers = Array(threads).fill(null).map((_, i) => {
        return new Worker(
            new URL('./worker.ts', import.meta.url).href,
            { type: 'module', name: i.toString() },
        );
    });

    console.log(`Running on ${threads} threads`);
    console.log(`Conditions: `, rest);

    workers.forEach((worker, i) => {
        worker.onmessage = (e: MessageEvent) => {
            const data = e.data as WorkerFoundResponse;
            console.log(`Found extension id: ${data.id}`);
            console.log('Private key:');
            console.log(stringifyPrivateKey(data.key));
            workers.map((w) => w.terminate());
        };

        worker.onerror = (e) => {
            console.error(`Worker ${i} encountered an error: ${e}`);
            worker.terminate();
        };

        worker.postMessage({ conditions: rest });
    });
}

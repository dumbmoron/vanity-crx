import { Arguments } from './cli.ts';

export const makeChecker = (
    { regex, startsWith, endsWith, contains }: Omit<Arguments, 'threads'>,
) => {
    const checkers: ((_: string) => boolean)[] = [];

    if (startsWith) {
        checkers.push((s) => s.startsWith(startsWith));
    }
    if (endsWith) {
        checkers.push((s) => s.endsWith(endsWith));
    }
    if (contains) {
        checkers.push((s) => s.includes(contains));
    }
    if (regex) {
        checkers.push((s) => regex.test(s));
    }

    return checkers.length === 1
        ? checkers[0]
        : (s: string) => checkers.some((checker) => checker(s));
};

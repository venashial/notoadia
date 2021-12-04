import {Assignment} from './types.d.ts';
import {fetchAssignments} from "./api.ts";

export const cache: Assignment[] = []

export async function fillCache(): Promise<void> {
    cache.concat(await fetchAssignments())
    console.log('Cache filled.')
}
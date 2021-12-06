import { Assignment } from './types.d.ts'
import { fetchAssignments } from './api.ts'

export let cache: Assignment[] = []

export async function fillCache(): Promise<void> {
  cache = cache.concat(await fetchAssignments())
  console.log(`Cache filled with ${cache.length} assignments.`)
}

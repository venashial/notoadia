import { fillCache } from './cache.ts'
import { start } from './schedule.ts'

await fillCache()

start()

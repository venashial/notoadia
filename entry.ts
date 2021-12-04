import { start } from './schedule.ts'
import {fillCache} from "./cache.ts";

await fillCache()

start()
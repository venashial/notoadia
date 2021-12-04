import { cron } from 'https://deno.land/x/deno_cron@v1.0.0/cron.ts'
import routine from './routine.ts'
import env from './env.ts'

const hourInterval = JSON.parse(env.INTERVAL_MINUTES) / 60

// Run routine based in interval from env vars
export function start(): void {
    cron(`1 1 */${hourInterval} * * *`, async () => {
        await routine()
    })

    console.log('Routine scheduled.')
}

import { config } from 'https://deno.land/x/dotenv@v3.1.0/mod.ts'

export default {
    ...config({safe: true}),
    ...Deno.env.toObject(),
}
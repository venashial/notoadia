import {Assignment} from './types.d.ts';
import env from "./env.ts";
import { fetchAssignments } from "./api.ts";
import { cache } from './cache.ts'

export default async function(): Promise<void> {
    console.log('Starting routine!')

    const fetchedAssignments: Assignment[] = await fetchAssignments()

    if (fetchedAssignments.length > cache.length) {
        const newAssignments = fetchedAssignments
            .filter((_assignment, index) => index > cache.length - 1)

        if (newAssignments) {
            console.log(`Posting ${newAssignments.length} new assignments.`)

            for (const assignment of newAssignments) {
                await fetch(env.DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        avatar_url: 'https://i.ibb.co/JmVV8Vf/notoadia.png',
                        content: assignment.description,
                        embeds: [],
                        tts: false,
                        username: 'Notoadia'
                    })
                })
            }
        }
    }

    console.log('Routine finished.')
}
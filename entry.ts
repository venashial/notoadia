import {config} from "https://deno.land/x/dotenv@v3.1.0/mod.ts"
import {cron} from 'https://deno.land/x/deno_cron@v1.0.0/cron.ts'

const env = {
    ...config({safe: true}),
    ...Deno.env.toObject(),
}

interface Assignment {
    description: string | null
    pointsPossible: number | null
    unlockAt: string | Date
}

interface FilteredAssignment {
    description: string
    pointsPossible: number
    unlockAt: Date
}

const hourInterval = JSON.parse(env.INTERVAL_MINUTES) / 60

// Run routine every 2 hours
cron(`1 1 */${hourInterval} * * *`, async () => {
    await routine()
})

async function routine() {
    console.log('Starting routine!');

    const response = await fetch(env.CANVAS_GRAPHQL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + env.CANVAS_TOKEN,
        },
        body: JSON.stringify({
            query: `query CheckAssignments($id:ID) {
                  course(id: $id) {
                    assignmentsConnection {
                      nodes {
                        description
                        pointsPossible
                        unlockAt
                      }
                    }
                  }
                }
               `,
            variables: {
                id: '30915'
            },
            operationName: 'CheckAssignments'
        })
    })

    if (response.ok) {
        const assignments: FilteredAssignment[] = (await response.json()).data.course.assignmentsConnection.nodes
            .filter(
                (assignment: Assignment) =>
                    assignment.pointsPossible === JSON.parse(env.POINTS_MATCHES)
                    && typeof assignment.description === 'string'
            )
            .map((assignment: Assignment) => ({
                ...assignment,
                unlockAt: new Date(assignment.unlockAt)
            }))

        const matchedAssignments = assignments
            .map((assignment) => ({
                ...assignment,
                description: assignment.description
                    .replace(/<[^>]*>?/gm, '')
                    .replace(/&nbsp;/g, '')
            }))
            .filter((assignment) => assignment.description.startsWith(env.DESCRIPTION_MATCHES))

        const newAssignments = matchedAssignments
            .filter((assignment) => Date.now().valueOf() - assignment.unlockAt.valueOf() < hourInterval * 60 * 60 * 1000)

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
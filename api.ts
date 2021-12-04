import {Assignment, unfilteredAssignment} from './types.d.ts';
import env from "./env.ts";

export async function fetchAssignments(): Promise<Assignment[]> {
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
        const assignments: Assignment[] = (await response.json()).data.course.assignmentsConnection.nodes
            .filter(
                (assignment: unfilteredAssignment) =>
                    assignment.pointsPossible === JSON.parse(env.POINTS_MATCHES)
                    && typeof assignment.description === 'string'
            )
            .map((assignment: unfilteredAssignment) => ({
                ...assignment,
                unlockAt: new Date(assignment.unlockAt)
            }))

        return assignments
            .map((assignment) => ({
                ...assignment,
                description: assignment.description
                    .replace(/<[^>]*>?/gm, '')
                    .replace(/&nbsp;/g, '')
            }))
            .filter((assignment) => assignment.description.startsWith(env.DESCRIPTION_MATCHES))
    } else {
        console.log('Could not fetch assignments.')
        return []
    }
}
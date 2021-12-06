import {
  Assignment,
  semifilteredAssignment,
  unfilteredAssignment,
} from './types.d.ts'
import env from './env.ts'

export async function fetchAssignments(): Promise<Assignment[]> {
  const response = await fetch(env.CANVAS_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + env.CANVAS_TOKEN,
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
        id: '30915',
      },
      operationName: 'CheckAssignments',
    }),
  })

  if (response.ok) {
    return (await response.json()).data.course.assignmentsConnection.nodes
      .filter(
        (assignment: unfilteredAssignment) =>
          typeof assignment.description === 'string' &&
          typeof assignment.pointsPossible === 'number'
      )
      .map((assignment: semifilteredAssignment) => ({
        ...assignment,
        description: assignment.description
          .replace(/<[^>]*>?/gm, '')
          .replace(/&nbsp;/g, ''),
      }))
      .filter(
        (assignment: semifilteredAssignment) =>
          assignment.pointsPossible === JSON.parse(env.POINTS_MATCHES) &&
          assignment.description.startsWith(env.DESCRIPTION_MATCHES)
      )
      .map((assignment: semifilteredAssignment) => {
        const description: string = assignment.description
          .replace(/<[^>]*>?/gm, '')
          .replace(/&nbsp;/g, '')

        const [start, stop] = description
          .match(/[0-9]{3}-[0-9]{3}/)?.[0]
          .split('-') || ['', '']

        const stopAt = description
          .match(/stop at (.*?)(\.|$)/i)?.[0]
          .replaceAll('.', '')
          .replace(/stop at /i, '')
        const startAt = description
          .match(/start at (.*?)$/i)?.[0]
          .replaceAll('.', '')
          .replace(/start at /i, '')

        return {
          date: new Date(assignment.unlockAt),
          range: {
            start,
            stop,
          },
          headings: {
            ...(stopAt !== undefined ? { stopAt } : {}),
            ...(startAt !== undefined ? { startAt } : {}),
          },
        }
      })
  } else {
    console.log('Could not fetch assignments.')
    return []
  }
}

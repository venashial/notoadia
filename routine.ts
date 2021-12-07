import { Assignment } from './types.d.ts'
import { fetchAssignments } from './canvas.ts'
import { cache } from './cache.ts'
import { sendAssignment } from './discord.ts'

export default async function (): Promise<void> {
  console.log('Starting routine!')

  const fetchedAssignments: Assignment[] = await fetchAssignments()

  if (fetchedAssignments.length > cache.length) {
    const newAssignments = fetchedAssignments.filter(
      (_assignment, index) => index > cache.length - 1
    )

    if (newAssignments) {
      console.log(`Posting ${newAssignments.length} new assignments.`)

      for (const assignment of newAssignments) {
        await sendAssignment(assignment)
      }
    }
  }

  console.log('Routine finished.')
}

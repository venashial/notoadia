interface unfilteredAssignment {
    description: string | null
    pointsPossible: number | null
    unlockAt: string | Date
}

interface Assignment {
    description: string
    pointsPossible: number
    unlockAt: Date
}
export interface unfilteredAssignment {
    description: string | null
    pointsPossible: number | null
    unlockAt: string
}

export interface semifilteredAssignment {
    description: string
    pointsPossible: number
    unlockAt: string
}


export interface Assignment {
    date: Date
    range: {
        start: number
        stop: number
    }
    headings: {
        stopAt?: string,
        startAt?: string,
    }
}

export interface Embed {
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    timestamp?: Date;
    footer?: {
        icon_url?: string;
        text: string;
    };
    thumbnail?: {
        url: string;
    };
    image?: {
        url: string;
    };
    author?: {
        name: string;
        url: string;
        icon_url: string;
    };
    fields?: Field[];
}

interface Field {
    name: string;
    value: string;
    inline?: boolean;
}

export interface Part {
    tag: string;
    text: string;
}
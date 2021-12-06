import {Assignment, Embed, Part} from "./types.d.ts";
import env from "./env.ts";
import {getPages} from "./book.ts";

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

const colors = [
    0xFF0000,
    0xFF9A00,
    0xFFEC00,
    0xBEFF00,
    0x00C200,
    0x65FFFF,
    0x3875DB,
    0xF21EEC,
    0xE4BCFF,
    0xF21EEC,
]

export async function sendAssignment(assignment: Assignment): Promise<void> {
    const bookPages = await getPages(assignment.range.start, assignment.range.stop)

    let initialMessage = {id: '', 'channel_id': ''}

    if (bookPages.length > 0) {
        initialMessage = await sendMessage(`_ _\nStart of pages for ${assignment.date.toLocaleDateString('en', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })} ⤵️`)

        for (const page of bookPages) {
            const body = page.parts.map(
                (part: Part) => {
                    part.text = part.text.trim()
                    if (part.tag.startsWith('h')) {
                        part.text = `\n\n***${part.text}***\n\n`
                    } else if (part.tag === 'b') {
                        part.text = ` __**${part.text}**__ `
                    } else if (part.tag === 'i') {
                        part.text = ` *${part.text}* `
                    }
                    return part
                }
            ).map((part: Part) => {
                return part.text
            }).join('')


            if (body.length > 0) {
                await sendMessage([{
                    title: `Page ${page.number}`,
                    description: body.substring(0, 4096),
                    color: colors[Math.floor(page.number % 10)]
                }])
            }
            if (body.length >= 4096) {
                await sendMessage([{
                    title: '',
                    description: body.substring(4096, 8192),
                    color: colors[Math.floor(page.number % 10)]
                }])
            }
        }
    }

    const {startAt, stopAt} = assignment.headings
    await sendMessage([{
        title: `🔔 Today's notes are pgs ${assignment.range.start}-${assignment.range.stop}`,
        description: ''
            + (startAt ? `\n🏁 Start at __${startAt}__` : '')
            + (stopAt ? `\n🛑 Stop at __${stopAt}__` : '')
            + (initialMessage.id ? `\n\n[Jump to start of pages ⤴️](https://discord.com/channels/${env.DISCORD_SERVER_ID}/${initialMessage.channel_id}/${initialMessage.id})` : ''),
        color: 0xFdFdFd,
        footer: {
            text: 'Notoadia',
            icon_url: 'https://i.ibb.co/JmVV8Vf/notoadia.png'
        },
        timestamp: assignment.date
    }])
}

async function sendMessage(content: string | Embed[]): Promise<{ id: string, channel_id: string }> {
    const baseBody = {
        // original: 'https://i.ibb.co/JmVV8Vf/notoadia.png'
        // pink: 'https://i.ibb.co/p0fhxVD/notoadia2.png'
        'avatar_url': 'https://i.ibb.co/JmVV8Vf/notoadia.png',
        tts: false,
        username: 'Notoadia',
        content: '',
        embeds: [],
    }

    let body: string

    if (typeof content === 'string') {
        body = JSON.stringify({
            ...baseBody,
            content,
        })
    } else {
        body = JSON.stringify({
            ...baseBody,
            embeds: content,
        })
    }

    const response = await fetch(env.DISCORD_WEBHOOK + '?wait=true', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    })

    await delay(500)

    if (!response.ok) {
        console.log({
            status: response.statusText,
            response: await response.text()
        })
        return {id: '', channel_id: ''}
    } else {
        return await response.json()
    }
}
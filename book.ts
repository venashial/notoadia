export async function getPages(start: number, end: number) {
  const range = [...Array(end - start + 1).keys()].map((i) => i + start)

  const book = JSON.parse(await Deno.readTextFile('book.json'))

  return range.map((number) =>
    book.find((page: { number: number }) => number === page.number)
  )
}

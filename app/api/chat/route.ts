export const maxDuration = 30

export async function POST(req: Request) {
  return new Response(
    JSON.stringify({
      error: "Chat API is disabled. Using client-side responses instead.",
    }),
    { status: 200 },
  )
}

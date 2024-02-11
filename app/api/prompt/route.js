import Prompt from "@models/prompt"
import { connectToDB } from "@utils/database"

export const GET = async (request) => {
  try {
    await connectToDB()

    const prompts = await Prompt.find({}).populate({
      path: "creator",
    })

    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate", // Add cache-control headers to disable caching
    }

    return new Response(JSON.stringify(prompts), { status: 200, headers })
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 })
  }
}

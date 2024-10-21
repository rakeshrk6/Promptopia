import mongoose from "mongoose"

let isConnected = false

export const connectToDB = async () => {
  if (isConnected) {
    console.log("mongoDB is already connected")
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompt",
    })

    isConnected = true
    console.log("mongoDB connected")
  } catch (error) {
    console.log(error)
  }
}

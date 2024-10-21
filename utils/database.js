import mongoose from "mongoose"

let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export const connectToDB = async () => {
  // if (isConnected) {
  //   console.log("mongoDB is already connected")
  //   return
  // }

  // try {
  //   await mongoose.connect(process.env.MONGODB_URI, {
  //     dbName: "share_prompt",
  //   })

  //   isConnected = true
  //   console.log("mongoDB connected")
  // } catch (error) {
  //   console.log(error)
  // }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}

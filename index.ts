import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 5555

// CORS configuration
const allowedOrigins = ['https://coin100.link', 'http://localhost:5173']
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

// Main route to check if API is alive
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is alive and accepting requests' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

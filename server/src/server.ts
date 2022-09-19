import { PrismaClient } from "@prisma/client"
import express, { Request, Response } from "express"
import { convertHourToMinutes } from "./utils/convert-hour-to-minutes"
import { convertMinutesToHour } from "./utils/convert-minutes-to-hour"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()

app.get("/games", async (request: Request, response: Response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        }
      }
    }
  })

  return response.status(200).json(games)
})

app.get("/games/:id/ads", async (request: Request, response: Response) => {
  const gameId = request.params.id

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourEnd: true,
      hourStart: true,
      createdAt: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return response.status(200).json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHour(ad.hourStart),
      hourEnd: convertMinutesToHour(ad.hourEnd),
    }
  }))
})

app.post("/games/:id/ads", async (request: Request, response: Response) => {
  const gameId = request.params.id
  const body = request.body

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourEnd: convertHourToMinutes(body.hourEnd),
      hourStart: convertHourToMinutes(body.hourStart),
      useVoiceChannel: body.useVoiceChannel
    }
  })

  return response.status(201).json(ad)
})

app.get("/ads/:id/discord", async (request: Request, response: Response) => {
  const adId = request.params.id

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId
    }
  })

  return response.status(200).json({
    discord: ad.discord
  })
})

app.listen(3333)

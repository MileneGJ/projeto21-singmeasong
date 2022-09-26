import { Request, Response } from "express";
import * as testService from '../services/testService.js'

export async function reset (req:Request, res:Response) {
    await testService.remove()
    res.sendStatus(200)
}

export async function createAndGetAll (req:Request, res:Response) {
    const result = await testService.get11Cases()
    res.send(result)
}

export async function createAndGetOne (req:Request, res:Response) {
    const result = await testService.getLowScoreCase()
    res.send(result)
}
import { Router } from "express";
import * as testController from '../controllers/testController.js'

const testsRouter = Router()

testsRouter.post('/database-reset',testController.reset)
testsRouter.post('/database-seed/11-cases',testController.createAndGetAll)
testsRouter.post('/database-seed/low-score-case',testController.createAndGetOne)

export default testsRouter
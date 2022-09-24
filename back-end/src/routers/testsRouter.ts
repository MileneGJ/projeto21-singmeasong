import { Router } from "express";
import * as testController from '../controllers/testController.js'

const testsRouter = Router()

testsRouter.post('/database-reset',testController.reset)

export default testsRouter
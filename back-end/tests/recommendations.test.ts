import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";
import recommendationFactory from "./factories/recommendationFactory";

beforeEach(async()=>{
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
})

afterAll(async()=>{
    await prisma.$disconnect();
})

describe('Testing POST /recommendations',()=>{

    it('Returns 201 and creates recommendation when sending a body with correct format',async()=>{
        const recommendation = await recommendationFactory()
        const result = await supertest(app).post('/recommendations').send(recommendation)

        const createdRecommendation = await prisma.recommendation.findFirst({where:{name:recommendation.name}})

        expect(result.status).toBe(201)
        expect(createdRecommendation).not.toBeFalsy()
    })

    it.todo('Returns 422 when sending a body with incorrect format')

    it.todo('Returns 409 when sending an already existing name')

})

describe('Testing POST /recommendations/:id/upvote',()=>{

    it.todo('Returns 200 and changes recommendation property when param is valid')

    it.todo('Returns 404 when recommendation id is not found')

})

describe('Testing POST /recommendations/:id/downvote',()=>{

    it.todo('Returns 200 and changes recommendation property when param is valid')

    it.todo('Returns 404 when recommendation id is not found')

})

describe('Testing GET /recommendations',()=>{

    it.todo('Returns 200 and array of recommendations')

})

describe('Testing GET /recommendations/random',()=>{

    it.todo('Returns 200 and recommendation when at least one recommendation exists')

    it.todo('Returns 404 when no recommendations exist')

})

describe('Testing GET /recommendations/top/:amount',()=>{

    it.todo('Returns 200 and array of recommendations whose length corresponds to param')

})

describe('Testing GET /recommendations/:id',()=>{

    it.todo('Returns 200 and recommendation when param is valid')

    it.todo('Returns 404 when recommendation id is not found')

})
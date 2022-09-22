import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";
import idFactory from "./factories/idFactory";
import invalidRecommendationFactory from "./factories/invalidRecommendationFactory";
import lowIdFactory from "./factories/lowIdFactory";
import recommendationFactory from "./factories/recommendationFactory";

beforeEach(async()=>{
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`;
})

afterAll(async()=>{
    await prisma.$disconnect();
})

describe('Testing POST /recommendations',()=>{

    it('Returns 201 and creates recommendation when sending a body with correct format',async()=>{
        const recommendation = await recommendationFactory()
        const result = await supertest(app).post('/recommendations').send(recommendation)

        const createdRecommendation = await prisma.recommendation.findMany({where:{name:recommendation.name}})

        expect(result.status).toBe(201)
        expect(createdRecommendation).toBeInstanceOf(Array)
        expect(createdRecommendation.length).toBe(1)
        expect(createdRecommendation[0]).not.toBeFalsy()
    });

    it('Returns 422 when sending a body with incorrect format',async()=>{
        const recommendation = await invalidRecommendationFactory()
        const result = await supertest(app).post('/recommendations').send(recommendation)

        const createdRecommendation = await prisma.recommendation.findMany({where:{name:recommendation.name}})

        expect(result.status).toBe(422)
        expect(createdRecommendation).toBeInstanceOf(Array)
        expect(createdRecommendation.length).toBe(0)
        expect(createdRecommendation[0]).toBeFalsy()
    });

    it('Returns 409 when sending an already existing name',async()=>{
        const recommendation = await recommendationFactory()
        await supertest(app).post('/recommendations').send(recommendation)
        const result = await supertest(app).post('/recommendations').send(recommendation)

        const createdRecommendation = await prisma.recommendation.findMany({where:{name:recommendation.name}})

        expect(result.status).toBe(409)
        expect(createdRecommendation).toBeInstanceOf(Array)
        expect(createdRecommendation.length).toBe(1)
        expect(createdRecommendation[0]).not.toBeFalsy()
    })

})

describe('Testing POST /recommendations/:id/upvote',()=>{

    it('Returns 200 and changes recommendation property when param is valid',async()=>{
        const recommendation = await recommendationFactory()
        await supertest(app).post('/recommendations').send(recommendation)
        const {id,score} = await idFactory(recommendation)

        const result = await supertest(app).post(`/recommendations/${id}/upvote`).send()

        const createdRecommendation = await prisma.recommendation.findFirst({where:{id}})

        expect(result.status).toBe(200)
        expect(createdRecommendation).not.toBeFalsy()
        expect(createdRecommendation.score).toBeGreaterThan(score)
    })

    it('Returns 404 when recommendation id is not found',async()=>{
        const recommendation = await recommendationFactory()
        await supertest(app).post('/recommendations').send(recommendation)
        const {id,score} = await idFactory(recommendation)

        const result = await supertest(app).post(`/recommendations/${id+1}/upvote`).send()

        const createdRecommendation = await prisma.recommendation.findFirst({where:{id}})

        expect(result.status).toBe(404)
        expect(createdRecommendation).not.toBeFalsy()
        expect(createdRecommendation.score).toBe(score)
    })

})

describe('Testing POST /recommendations/:id/downvote',()=>{

    it('Returns 200 and changes recommendation property when param is valid',async()=>{
        const recommendation = await recommendationFactory()
        await supertest(app).post('/recommendations').send(recommendation)
        const {id,score} = await idFactory(recommendation)

        const result = await supertest(app).post(`/recommendations/${id}/downvote`).send()

        const createdRecommendation = await prisma.recommendation.findFirst({where:{id}})

        expect(result.status).toBe(200)
        expect(createdRecommendation).not.toBeFalsy()
        expect(createdRecommendation.score).toBeLessThan(score)
    })

    it('Returns 200 and deletes recommendation when its score is less than -5',async()=>{
        const recommendation = await recommendationFactory()
        await supertest(app).post('/recommendations').send(recommendation)
        const {id,score} = await lowIdFactory(recommendation)

        const result = await supertest(app).post(`/recommendations/${id}/downvote`).send()

        const createdRecommendation = await prisma.recommendation.findFirst({where:{id}})

        expect(result.status).toBe(200)
        expect(score).toBe(-5)
        expect(createdRecommendation).toBeFalsy()
    })

    it('Returns 404 when recommendation id is not found',async()=>{
        const recommendation = await recommendationFactory()
        await supertest(app).post('/recommendations').send(recommendation)
        const {id,score} = await idFactory(recommendation)

        const result = await supertest(app).post(`/recommendations/${id+1}/downvote`).send()

        const createdRecommendation = await prisma.recommendation.findFirst({where:{id}})

        expect(result.status).toBe(404)
        expect(createdRecommendation).not.toBeFalsy()
        expect(createdRecommendation.score).toBe(score)
    })

})

describe('Testing GET /recommendations',()=>{

    it('Returns 200 and array of recommendations when there is at least one item',async()=>{
        const createdRecommendation = await recommendationFactory()
        await supertest(app).post('/recommendations').send(createdRecommendation)

        const result = await supertest(app).get('/recommendations').send()

        expect(result.status).toBe(200)
        expect(result.body).toBeInstanceOf(Array)
        expect(result.body.length).toBeGreaterThan(0)
    })

    it('Returns 200 and empty array when there are no recommendations in database',async()=>{
        const result = await supertest(app).get('/recommendations').send()

        expect(result.status).toBe(200)
        expect(result.body).toBeInstanceOf(Array)
        expect(result.body.length).toBe(0)
    })

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
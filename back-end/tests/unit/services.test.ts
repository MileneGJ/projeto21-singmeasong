import { faker } from "@faker-js/faker";
import { recommendationRepository } from "../../src/repositories/recommendationRepository"
import { recommendationService } from "../../src/services/recommendationsService"
import recommendationFactory from "../integration/factories/recommendationFactory"
import recommendationFromDBFactory from "../integration/factories/recommendationFromDBFactory";
import recommendationListFromDBFactory from "../integration/factories/recommendationListFromDBFactory";

beforeEach(()=>{
    jest.resetAllMocks();
    jest.clearAllMocks();
});

describe('insert', () => {

    it('Create recommendation successfully when name is not found in database', async () => {
        const recommendation = await recommendationFactory()
        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any=>{null})
        jest.spyOn(recommendationRepository, 'create').mockImplementationOnce(():any=>{null})

        const result = recommendationService.insert(recommendation)

        await expect(result).resolves.toBeUndefined()
        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    })

    it('Throws error 409 when name already exists in database', async () => {
        const recommendation = await recommendationFactory()
        const expectedError = { type: 'conflict', message: "Recommendations names must be unique" }
        jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(():any=>({ ...recommendation, id: 1, score: 0 }))
        jest.spyOn(recommendationRepository, 'create').mockImplementationOnce(():any=>{null})

        const result = recommendationService.insert(recommendation)

        await expect(result).rejects.toEqual(expectedError)
        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).not.toBeCalled();
    })
})


describe('upvote', () => {

    it('Modify recomendation score when id exists', async () => {
        const recommendation = await recommendationFromDBFactory()
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=>recommendation)
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any=>recommendation)

        const result = recommendationService.upvote(recommendation.id)

        await expect(result).resolves.toBeUndefined()
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    })

    it('Throws error 404 when id is not found', async () => {
        const recommendation = await recommendationFromDBFactory()
        const expectedError = { type: 'not_found', message: "" }
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=>{null})
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any=>recommendation)

        const result = recommendationService.upvote(recommendation.id)

        await expect(result).rejects.toEqual(expectedError)
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).not.toBeCalled();
    })
})


describe('downvote', () => {

    it('Modify recomendation score when id exists', async () => {
        const recommendation = await recommendationFromDBFactory()
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=>recommendation)
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any=>recommendation)
        jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce(():any=>{null})

        const result = recommendationService.downvote(recommendation.id)

        await expect(result).resolves.toBeUndefined()
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).not.toBeCalled();
    })

    it('Modify and delete recomendation when score becomes lower than -5', async () => {
        const recommendation = await recommendationFromDBFactory()
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=>recommendation)
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any=>({...recommendation,score:-6}))
        jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce(():any=>{null})

        const result = recommendationService.downvote(recommendation.id)

        await expect(result).resolves.toBeUndefined()
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    })

    it('Throws error 404 when id is not found', async () => {
        const recommendation = await recommendationFromDBFactory()
        const expectedError = { type: 'not_found', message: "" }
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=>{null})
        jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(():any=>recommendation)
        jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce(():any=>{null})

        const result = recommendationService.upvote(recommendation.id)

        await expect(result).rejects.toEqual(expectedError)
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).not.toBeCalled();
        expect(recommendationRepository.remove).not.toBeCalled();
    })

})


describe('getByIdOrFail', () => {

    it('Returns recommendation when id is found', async () => {
        const recommendation = await recommendationFromDBFactory()
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=>recommendation)

        const result = recommendationService.getById(recommendation.id)

        await expect(result).resolves.toEqual(recommendation)
        expect(recommendationRepository.find).toBeCalled();
    })

    it('Throws error 404 when id is not found', async () => {
        const recommendation = await recommendationFromDBFactory()
        const expectedError = { type: 'not_found', message: "" }
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(():any=>{null})

        const result = recommendationService.getById(recommendation.id + 1)

        await expect(result).rejects.toEqual(expectedError);
        expect(recommendationRepository.find).toBeCalled();
    })
})


describe('get', () => {

    it('Returns array of recommendations when there is at least one in database',async()=>{
        const recommendation = await recommendationFromDBFactory()
        jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(():any=>[recommendation])

        const result = recommendationService.get()

        await expect(result).resolves.toEqual([recommendation]);
        expect(recommendationRepository.findAll).toBeCalled();
    })

})


describe('getTop', () => {

    it('Returns array of recommendations ordered by score and length = amount',async()=>{
        const amount = faker.datatype.number({min:1,max:10})
        const recommendationList = await recommendationListFromDBFactory(amount)
        jest.spyOn(recommendationRepository, 'getAmountByScore').mockImplementationOnce(():any=>recommendationList)

        const result = recommendationService.getTop(amount)

        await expect(result).resolves.toEqual(recommendationList);
        expect(recommendationRepository.getAmountByScore).toBeCalled();
    })

})


describe('getRandom', () => {

    it('Returns one recommendation when at least one exists in database',async()=>{
        const amount = 1
        const recommendationList = await recommendationListFromDBFactory(amount)
        jest.spyOn(recommendationRepository,'findAll').mockImplementationOnce(():any=>recommendationList)

        const result = recommendationService.getRandom()

        await expect(result).resolves.toEqual(recommendationList[0])
        expect(recommendationRepository.findAll).toBeCalledTimes(1)
    })

    it('Throws error 404 when no recommendations are found',async()=>{
        const expectedError = { type: 'not_found', message: "" }
        jest.spyOn(recommendationRepository,'findAll').mockImplementationOnce(():any=>([]))
        jest.spyOn(recommendationRepository,'findAll').mockImplementationOnce(():any=>([]))

        const result = recommendationService.getRandom()

        await expect(result).rejects.toEqual(expectedError)
        expect(recommendationRepository.findAll).toBeCalledTimes(2)
    })

})

describe('getScoreFilter',()=>{

    it('Returns gt when random < 0.7',async()=>{
        const random = 0.6

        const result = recommendationService.getScoreFilter(random)

        expect(result).toBe('gt')
    })


    it('Returns lte when random > 0.7',async()=>{
        const random = 0.8

        const result = recommendationService.getScoreFilter(random)

        expect(result).toBe('lte')
    })
})
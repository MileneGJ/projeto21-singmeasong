import {recommendationRepository} from "../../src/repositories/recommendationRepository"
import {recommendationService} from "../../src/services/recommendationsService"
import recommendationFactory from "../integration/factories/recommendationFactory"
import { createScenarioOneRecommendation, createScenarioRecommendationLowId } from "../integration/factories/scenarioFactory"


describe('insert',()=>{

    it('Create recommendation successfully when name is not found in database',async ()=>{
        const recommendation = await recommendationFactory()
        const spy1 = jest.spyOn(recommendationRepository,'findByName').mockResolvedValue(undefined)
        const spy2 = jest.spyOn(recommendationRepository,'create').mockResolvedValue()

        const result = recommendationService.insert(recommendation)

        expect(result).resolves.toBeUndefined()
        expect(spy1).toHaveBeenCalled();
        //expect(spy2).toHaveBeenCalled();
    })

    it('Throw error 409 when name already exists in database',async()=>{
        const recommendation = await recommendationFactory()
        const expectedError = {type:'conflict',message:"Recommendations names must be unique"}
        const spy1 = jest.spyOn(recommendationRepository,'findByName').mockResolvedValue({...recommendation,id:1,score:0})
        const spy2 = jest.spyOn(recommendationRepository,'create').mockResolvedValue()

        const result = recommendationService.insert(recommendation)
        
        expect(result).rejects.toEqual(expectedError)
        expect(spy1).toHaveBeenCalled();
        //expect(spy2).toHaveBeenCalled();
    })
})


describe('upvote',()=>{

    it('Modify recomendation score when id exists',async()=>{
        const recommendation = await createScenarioOneRecommendation()
        const spy1 = jest.spyOn(recommendationRepository,'find').mockResolvedValue(recommendation)
        const spy2 = jest.spyOn(recommendationRepository,'updateScore').mockResolvedValue(recommendation)

        const result = recommendationService.upvote(recommendation.id)

        expect(result).resolves.toBeUndefined()
        expect(spy1).toHaveBeenCalled();
        //expect(spy2).toHaveBeenCalled();
    })

    it('Throw error 404 when id is not found',async()=>{
        const recommendation = await createScenarioOneRecommendation()
        const expectedError = {type:'not_found',message:""}
        const spy1 = jest.spyOn(recommendationRepository,'find').mockResolvedValue(undefined)
        const spy2 = jest.spyOn(recommendationRepository,'updateScore').mockResolvedValue(recommendation)

        const result = recommendationService.upvote(recommendation.id)

        expect(result).rejects.toEqual(expectedError)
        expect(spy1).toHaveBeenCalled();
        //expect(spy2).toHaveBeenCalled();
    })
})


describe('downvote',()=>{

    it('Modify recomendation score when id exists',async()=>{
        const recommendation = await createScenarioOneRecommendation()
        const spy1 = jest.spyOn(recommendationRepository,'find').mockResolvedValue(recommendation)
        const spy2 = jest.spyOn(recommendationRepository,'updateScore').mockResolvedValue(recommendation)
        const spy3 = jest.spyOn(recommendationRepository,'remove').mockResolvedValue()

        const result = recommendationService.downvote(recommendation.id)

        expect(result).resolves.toBeUndefined()
        expect(spy1).toHaveBeenCalled();
        //expect(spy2).toHaveBeenCalled();
    })

    it('Modify and delete recomendation when score becomes lower than -5',async()=>{
        const recommendation = await createScenarioRecommendationLowId()
        const spy1 = jest.spyOn(recommendationRepository,'find').mockResolvedValue(recommendation)
        const spy2 = jest.spyOn(recommendationRepository,'updateScore').mockResolvedValue(recommendation)
        const spy3 = jest.spyOn(recommendationRepository,'remove').mockResolvedValue()

        const result = recommendationService.downvote(recommendation.id)

        expect(result).resolves.toBeUndefined()
        expect(spy1).toHaveBeenCalled();
        //expect(spy3).toHaveBeenCalled();
    })

    it('Throw error 404 when id is not found',async()=>{
        const recommendation = await createScenarioOneRecommendation()
        const expectedError = {type:'not_found',message:""}
        const spy1 = jest.spyOn(recommendationRepository,'find').mockResolvedValue(undefined)
        const spy2 = jest.spyOn(recommendationRepository,'updateScore').mockResolvedValue(recommendation)
        const spy3 = jest.spyOn(recommendationRepository,'remove').mockResolvedValue()

        const result = recommendationService.upvote(recommendation.id)

        expect(result).rejects.toEqual(expectedError)
        expect(spy1).toHaveBeenCalled();
        //expect(spy2).toHaveBeenCalled();
    })

})


describe('getByIdOrFail',()=>{



})


describe('get',()=>{



})


describe('getTop',()=>{



})


describe('getRandom',()=>{



})


describe('getByScore',()=>{



})


describe('getScoreFilter',()=>{



})
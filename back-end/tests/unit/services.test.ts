import {recommendationRepository} from "../../src/repositories/recommendationRepository"
import {recommendationService} from "../../src/services/recommendationsService"
import recommendationFactory from "../integration/factories/recommendationFactory"


describe('insert',()=>{

    it('Create recommendation successfully when name is not found in database',async ()=>{
        const recommendation = await recommendationFactory()
        const spy1 = jest.spyOn(recommendationRepository,'findByName').mockResolvedValue(undefined)
        const spy2 = jest.spyOn(recommendationRepository,'create').mockResolvedValue()

        const result = await recommendationService.insert(recommendation)

        expect(result).toBeUndefined()
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    })

    it('Throw error 409 when name already exists in database',async()=>{
        const recommendation = await recommendationFactory()
        const expectedError = "Recommendations names must be unique"
        const spy1 = jest.spyOn(recommendationRepository,'findByName').mockResolvedValue({...recommendation,id:1,score:0})
        const spy2 = jest.spyOn(recommendationRepository,'create').mockResolvedValue()

        const insertFunction = async ()=> {
            try {
                await recommendationService.insert(recommendation)
            } catch (error) {
                return error
            }
        }

        expect(insertFunction).toThrow(expectedError)
        expect(spy1).toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();

    })

})


describe('upvote',()=>{



})


describe('downvote',()=>{



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
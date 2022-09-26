import * as testRepository from '../repositories/testRepository.js'

export async function remove(){
    return await testRepository.removeAll()
}

export async function get11Cases () {
    return await testRepository.createAndGet11Cases()
}

export async function getLowScoreCase () {
    return await testRepository.createAndGetCaseLowScore()
}
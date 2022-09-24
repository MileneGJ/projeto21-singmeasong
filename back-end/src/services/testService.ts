import * as testRepository from '../repositories/testRepository.js'

export async function remove(){
    return await testRepository.removeAll()
}
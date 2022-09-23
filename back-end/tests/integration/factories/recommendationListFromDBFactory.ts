import recommendationFactory from "./recommendationFactory";

export default async function recommendationListFromDBFactory (amount:number) {
    const recommendation = await recommendationFactory()
    const result = []
    for(let i=0; i<amount; i++) {
        result.push(recommendation)
    }
    return result
}
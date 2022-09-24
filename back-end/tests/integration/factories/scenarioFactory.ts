import { prisma } from "../../../src/database";
import recommendationFactory from "./recommendationFactory";

export async function createScenarioOneRecommendation () {
    const body = await recommendationFactory()
    return await prisma.recommendation.create({data:body})
}

export async function createScenarioRecommendationLowId () {
    const body = await recommendationFactory()
    return await prisma.recommendation.create({data:{...body,score:-5}})
}

export async function createScenarioRecommendationsDifferentScores (amount:number) {
    const body1 = await recommendationFactory()
    const body2 = await recommendationFactory()
    const body3 = await recommendationFactory()
    const body4 = await recommendationFactory()
    const body5 = await recommendationFactory()
    const body6 = await recommendationFactory()
    const body7 = await recommendationFactory()
    const body8 = await recommendationFactory()
    const body9 = await recommendationFactory()
    const body10 = await recommendationFactory()

    await prisma.recommendation.create({data:{...body1,score:1}})
    await prisma.recommendation.create({data:{...body2,score:2}})
    await prisma.recommendation.create({data:{...body3,score:3}})
    await prisma.recommendation.create({data:{...body4,score:4}})
    await prisma.recommendation.create({data:{...body5,score:5}})
    await prisma.recommendation.create({data:{...body6,score:6}})
    await prisma.recommendation.create({data:{...body7,score:7}})
    await prisma.recommendation.create({data:{...body8,score:8}})
    await prisma.recommendation.create({data:{...body9,score:9}})
    await prisma.recommendation.create({data:{...body10,score:10}})

    return [10,9,8,7,6,5,4,3,2,1].slice(0,amount)
}

export async function deleteAllData() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`
}
  
export async function disconnectPrisma() {
    await prisma.$disconnect();
  }
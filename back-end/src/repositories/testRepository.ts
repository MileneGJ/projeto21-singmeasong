import { prisma } from "../database.js";
import recommendationFactory from "../../tests/integration/factories/recommendationFactory.js";

export async function removeAll() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`;
}

export async function createAndGet11Cases() {
  let cases = []
  for(let i=0;i<11;i++){
    const recommendation = await recommendationFactory()
    const createdRecommendation = await prisma.recommendation.create({data:{...recommendation,score:i}});
    cases.push(createdRecommendation)
  }
  return cases
}

export async function createAndGetCaseLowScore () {
  const recommendation = await recommendationFactory()
  return await prisma.recommendation.create({data:{...recommendation,score:-5}});
}
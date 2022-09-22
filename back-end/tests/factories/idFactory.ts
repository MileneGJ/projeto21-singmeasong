import { prisma } from "../../src/database"
import { CreateRecommendationData } from "../../src/services/recommendationsService"

export default async function idFactory (createdRecommendation:CreateRecommendationData) {
        const result = await prisma.recommendation.findFirst({where:{name:createdRecommendation.name}})
        return result
}
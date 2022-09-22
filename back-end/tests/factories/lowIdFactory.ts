import { prisma } from "../../src/database"
import { CreateRecommendationData } from "../../src/services/recommendationsService"

export default async function lowIdFactory (createdRecommendation:CreateRecommendationData) {
    await prisma.recommendation.update({
            where:{name:createdRecommendation.name},
            data:{score:-5}
    })
    const result = await prisma.recommendation.findFirst({where:{name:createdRecommendation.name}})
    
    return result
}
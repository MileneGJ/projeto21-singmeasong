import {faker} from '@faker-js/faker'

export default async function invalidRecommendationFactory () {
    return {
        name: faker.music.songName(),
        youtubeLink: faker.internet.url()
    }
}
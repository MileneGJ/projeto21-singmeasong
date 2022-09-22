import {faker} from '@faker-js/faker'

export default async function recommendationFactory () {
    return {
        name: faker.music.songName(),
        youtubeLink: 'https://www.youtube.com/watch?v=' + faker.internet.password()
    }
}
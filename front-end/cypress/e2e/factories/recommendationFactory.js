import { faker } from '@faker-js/faker'

export default function recommendationFactory () {
    return {
        name: faker.lorem.words(3),
        youtubeLink: 'https://www.youtube.com/watch?v=ZzZ_BdnbYGA'
      }
}
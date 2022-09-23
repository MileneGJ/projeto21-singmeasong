import {faker} from '@faker-js/faker'

export default async function recommendationFromDBFactory () {
    return {
        id:faker.datatype.number({min:1,max:10}),
        name: faker.datatype.string(),
        youtubeLink: 'https://www.youtube.com/watch?v=' + faker.internet.password(),
        score:0
    }
}
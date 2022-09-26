# <p align = "center"> Driven Bootcamp - Projeto Sing me a Song </p>

<p align="center">
   <img src="https://user-images.githubusercontent.com/72531277/178094665-f46c6a55-c821-42a0-bb9c-d5dd5f2d69fa.png"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-MileneGJ-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/MileneGJ/projeto21-singmeasong?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Description

Full-stack project developed for Driven Bootcamp. It was designed as a song recommendation app, in which users can enter and rate songs, get the best rated songs or a random song from the app.

***

## :computer:	 Technologies and Concepts

- REST APIs
- Node.js and Express
- TypeScript
- PostgreSQL using PrismaClient

***

## :rocket: Routes

```yml
POST /recommendations
    - Route for entering new songs
    - headers: {}
    - body: {
        "name": "lorem",
        "youtubeLink": "https://www.youtube.com/watch?v=loremipsum"
    }
```
    
```yml 
POST /recommendations/:id/upvote
    - Route for increasing the score of a song (id) in one point
    - headers: {}
    - body: {}
```
    
```yml 
POST /recommendations/:id/downvote
    - Route for decreasing the score of a song (id) in one point
    - headers: {}
    - body: {}
```

```yml
GET /recommendations
    - Route for returning the last 10 songs added in database
    - headers: {}
    - body: {}
``` 

```yml
GET /recommendations/random
    - Route for returning a random recommendation from the database
    - headers: {}
    - body: {}
```
 
```yml
GET /recommendations/top/:amount
    - Route for returning the top best rated songs. List length can be customized with amount param
    - headers: {}
    - body: {}
```

```yml
GET /recommendations/:id
    - Route for returning a specific song based on its id
    - headers: {}
    - body: {}
```
***

## 🏁 Running the application

This Api can be used in two different ways: by cloning the project or by running in your preferred client, such as [Insomnia](https://insomnia.rest/) or [Postman](https://www.getpostman.com/).

To clone the project, run the following command:

```git
git clone https://github.com/MileneGJ/projeto21-singmeasong.git
```

Then, navigate to the project folder and run the following command:

```git
npm install
```

Finally, start the server:

```git
npm start
```

You can now access the API's endpoints by navigating to `http://localhost:5000/`.

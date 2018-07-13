# Learn Farsi

[Client Side Repo](https://github.com/thinkful-ei20/SP-sayed-darren-client)

A spaced repitition app build to help people learn and practice Farsi. Once logged in the app displays a word in Farsi and asks for the English translation, once given an input the app will display whether the user was correct or incorrect, the english translation of the word, and how many times the user has gotten the answer correct for that specific word.

## Getting started

Clone repo and run npm install

Create a local mongo database and then enter it's name in config.js

DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend'

Replace 'thinkful-backend' with your database name.

run node utils/seed-DB.js

This will create or overwrite(will erase all user data) the users and questions collections.

## Databases

Connects to a MongoDB database using Mongoose.  

## Clone and Run

## Tech-stack
- node
- express
- mongo/mongoose
- jwt-decode

### Noteable File Paths

/DB/seed folder has the questions for seeding the database as well a 'test' and 'test2' dummy user, both with a password "password".

/models folder has the schemas for Mongo

/passport folder has the jwt and local strategies

/routes folder has the endpoints

/utils folder has the seed-DB.js file you run in node to seed the database 


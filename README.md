# Atlas :earth_africa:: Group Project

In the final two weeks of the Sigma Labs training, students were assigned to various group projects, one of which was the Atlas project. The Atlas team consisted of five members: David Ingram, Guy Hotchin, Joanna Hawthorne, Michael Baugh and Omid Wakili. 

Our motivation behind the project was to build an enjoyable game that would challenge the player's knowledge and memory of the countries of the world.

### What are the game rules?

![game_inst](https://user-images.githubusercontent.com/56037686/129879420-3e956025-a33a-40f3-a419-afae5bd9e2e0.PNG)

The player is presented with a random letter of the alphabet (except 'X') and needs to type in a country beginning with that letter. If they are correct, they earn some points.

![game_prog](https://user-images.githubusercontent.com/56037686/129882270-0609ddc9-8f16-4d1e-9215-9e008872eb82.PNG)

After correctly naming a country, the player also has the option to name the capital city of their given country. If correct, they earn additional points, but if they get it wrong it is game over! As this is an optional question, they can skip if they don't know it.

![game_cap](https://user-images.githubusercontent.com/56037686/129882400-2167fcd4-229c-4d23-aec3-bae79cfcf751.PNG)

After answering correctly or skipping, the AI names another country beginning with the last letter of the player's named country. The user is then given the last letter of the AI's country to keep playing. This loop then continues, until the player either gets an answer wrong, or names a country that has already been played, both of which trigger the game over screen. 

![game_over](https://user-images.githubusercontent.com/56037686/129882280-b07e046e-e2a9-48ba-9c97-83601671dab1.PNG)

Some design decisions with regards to the game play:
- Timed turns: the player has to return a response within a specified (i.e. 15 seconds) time period
- Scoring: 10 points for naming a country correctly and 5 points for naming the capital city correctly
- No choices left for letter: if all countries beginning with a specific letter have been named, the next letter alphabetically is presented instead as the next question
- All countries named: if all countries have been named then the game finishes and the player scores are tallied up
- Incorrect naming of country or capital city (including misspellings) results in loss of game
- Played countries: at the end of the game, the player can view the list of countries that were played during the game
- Possible countries: at the end of the game, the player can view a list of possible countries they could have played for a letter if they got it wrong
- Correct capital city: at the end of the game, a player who incorrectly named a capital city can view the correct response

## Data Architecture: How we set up our database

We used PostgreSQL for our database.

In our database schema, we decided on using five tables:

- countries: to include the country names, their capital cities, and flag image urls
- users: to store user email, username, and encrypted passwords
- sessions: for login tracking through cookies
- current_games: to keep track of any current games (user details, the countries played, current score, date)
- finished_games: to store details of any finished games (user details, final score, date)

### Countries data
When it came to the data for all of the countries and their capital cities, we decided to use the [countries-now-space](https://countriesnow.space) API. This API was chosen because it provided more commonly known colloquial names of the countries, instead of their strictly official names, which many English speaking users may not be aware of. 

One of the issues that the team had to address was whether to include all countries included in the API, such as Greenland, the Réunion island, etc. We decided to use the United Nations [member states](https://www.un.org/en/about-us/member-states) as a guide to deciding which countries to include. 

We also decided to change the name of a few countries to their more commonly-known or most-latest accepted names, i.e. North Macedonia (insead of Macedonia), or Palestine (instead of Palestinian Territory).

### Deployment

For our database, we used [ElephantSQL](https://www.elephantsql.com/).

## Backend: How we set up our backend

We set up our backend in JavaScript (JS) using [Deno](https://deno.land), and specifically using Deno's [Abc](https://deno.land/x/abc@v1.3.1) framework.

We decided to simplify our main JS file for the backend by splitting up the functions for each endpoint into its own handler. We also took out certain helper functions into their own JS files.

For user authentication, we used a third party module, [BCrypt](https://deno.land/x/bcrypt/mod.ts), to handle the user password hashing and for checking the password. 

We used cookies in the backend for dealing with user authorisation, to keep track of the currently logged-in user, current games being played now, etc.

An interesting issue arose in that we wanted non-registered users to be able to play our game, yet we were tracking the game in our database via the username. To address this, we created a temporary user account with a uuid as the username when the 'Play Game' button is clicked with no user logged in. This temporary user can be upgraded to a full account with a proper username on the game end screen to save their score. To avoid polluting our users table with countless temporary users that would never be used again, temporary users older than a day are deleted whenever the 'Play Game' button is clicked.

### Deployment

For our backend, we used [heroku](https://heroku.com/home).

## Frontend: How we set up our frontend

For our frontend, we used the [React](https://reactjs.org) library and split our main App JS file into separate components to handle different pages, i.e. login, register, homepage, etc.

Some of the packages we used (for installation):
- React [Router](https://reactrouter.com/web/guides/quick-start): for handling the routing to the different pages
- Countdown [clock](https://www.npmjs.com/package/react-countdown-clock): for providing a visual animation to the time countdown during game play
- [Confetti](https://www.npmjs.com/package/react-dom-confetti) animations: for displaying a visual animation whenever the user correctly names a country or its capital city

### Deployment

For our frontend, we used [netlify](https://www.netlify.com).

![game_prog](https://user-images.githubusercontent.com/56037686/129882236-2e1804f1-03f0-4c8e-9eaa-366cbc4cc99e.PNG)
![game_prog](https://user-images.githubusercontent.com/56037686/129882258-b918f8a4-05d1-4319-b372-9473e80b1127.PNG)

## Extra: What if we had more time?

- Implement user to user gaming experience (i.e. on one device)
- Implement online multiplayer gaming experience
- More bonus questions, i.e. naming neighbouring countries, official/main languages, population sizes, etc.
- Difficulty settings
- Anything else you can think of? Do let us know! :smiley:

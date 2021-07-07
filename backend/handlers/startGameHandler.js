import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts"
import { config } from 'https://deno.land/x/dotenv/mod.ts'
import { v4 } from "https://deno.land/std/uuid/mod.ts"
import getCurrentUser from "./helperFunctions/getCurrentUser.js"

const DENO_ENV = Deno.env.get('DENO_ENV') ?? 'development'
config({ path: `./.env.${DENO_ENV}`, export: true })

const client = new Client(Deno.env.get("PG_URL"))
await client.connect()

const startGameHandler = async (server) => {
    // handles checking the current user, making a temporary user if need be
    // and either creating a new game or accessing one in progress
    
    const { sessionID, tempUser } = await server.cookies

    // find logged in user, prioritising registered log ins
    let user
    const userData = await getCurrentUser(server)
    if (userData) {
        user = userData.username
    } else if (tempUser) {
        user = tempUser
    } 

    // if user is NEW guest, generate a temporary username for them
    const trackedName = user ? user : v4.generate()
    console.log('trackedName: ', trackedName)

    // create a temporary user with the uuid (to account for foreign key constraint on current_games)
    if (!user) {
        await client.queryObject('INSERT INTO users (username, email, password_encrypted, created_at, updated_at) VALUES ($1, $1, $2, NOW(), NOW());', trackedName, v4.generate())

        // set a cookie for the temporary user to track their game
        server.setCookie({
            name: "tempUser",
            value: trackedName,
            path: "/",
            expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24) // a day
        })
    }

    const [existingGame] = (await client.queryObject(`SELECT game_id FROM current_games WHERE username=$1;`, trackedName)).rows
    console.log('game: ', existingGame)

    if (existingGame) {
        // delete game if exists
        await client.queryObject(`DELETE FROM current_games WHERE username=$1;`, trackedName)
        console.log('deleted existing game for user:', trackedName)        
    } 

    await client.queryObject(`INSERT INTO current_games (username, created_at) VALUES ($1, NOW());`, trackedName)
    console.log('created game for user:', trackedName)

    // delete old games from current_games
    // const tester = (await client.queryObject("SELECT created_at, NOW() - interval '20 seconds' AS time FROM current_games;")).rows
    // console.log(tester)

    await client.queryObject("DELETE FROM current_games WHERE created_at < NOW() - interval '1 day';")

    // delete old temporary users from users
    await client.queryObject("DELETE FROM users WHERE created_at < NOW() - interval '1 day' AND username = email;")
}

// TO DO: REMEMBER TO DELETE THIS TEMPORARY USER AFTER GAME ENDS/USER MAYBE REGISTERS (different handler!)

export default startGameHandler
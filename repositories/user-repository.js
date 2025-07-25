import db from '../db/index.js'
export const userRepository = {
    async findByEmail(email) {
        const { rows } = await db.query(`SELECT *  FROM users WHERE email=$1`, [
            email,
        ])
        return rows[0]
    },

    async createUserWithEmail({
        firstName,
        lastName,
        username,
        password,
        email,
    }) {
        const { rows } = await db.query(
            `INSERT INTO users (username, email, password, firstName, lastName)
            VALUES ($1,$2,$3,$4, $5) RETURNING id, username, firstName, lastName`,
            [username, email, password, firstName, lastName]
        )
        return rows[0]
    },

    async createUserWithTwitter({ twitterId, username }) {
        const { rows } = await db.query(
            `INSERT INTO users (twitter_id, username)
            VALUES ($1,$2) RETURNING id`,
            [twitterId, username]
        )

        return rows[0]
    },

    async createUserWithGoogle({ googleId, email, username }) {
        const { rows } = await db.query(
            `INSERT INTO users (google_id, username, email)
            VALUES ($1,$2,$3) RETURNING id`,
            [googleId, username, email]
        )

        return rows[0]
    },

    async findByGoogleId(id) {
        const { rows } = await db.query(
            `SELECT * FROM users 
            WHERE google_id=$1`,
            [id]
        )
        return rows[0]
    },

    async findByTwitterId(id) {
        const { rows } = await db.query(
            `SELECT *  FROM users 
            WHERE twitter_id=$1`,
            [id]
        )
        return rows[0]
    },
}

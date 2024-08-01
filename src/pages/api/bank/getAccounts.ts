import logtoClient from "@/lib/auth";
import db, {dbSession} from "@/lib/surrealdb";

export default logtoClient.withLogtoApiRoute(async (request, response) => {
    if (request.method !== "GET") {
        response.status(405).send("Wrong method.")
    }

    if(!request.user.isAuthenticated) {
        response.status(403).send("Unauthorized")
    }

    if (!db.status || db.status === 'disconnected' || db.status === 'error') {
        await dbSession.then(
            (session) => {
                console.log('Connected to SurrealDB');
            }
        ).catch(
            (error) => {
                console.error('Failed to connect to SurrealDB', error);
                return response.status(400).json({outcome: "REJECTED"});
            }
        );
    }

    db.query(`SELECT * FROM accounts WHERE owner == "${request.user.claims?.sub}"`).then(
        (result) => {
            console.log(request.user.claims?.sub)
            response.status(200).json(result[0]);
        }
    )
})
import logtoClient from "@/lib/auth";
import db, {dbSession} from "@/lib/surrealdb";

export default logtoClient.withLogtoApiRoute(async (request, response) => {
    if (request.method !== "POST") {
        response.status(405).json({message: "Method not allowed"});
        return;
    }
    if (!db.status) {
        await dbSession.then(
            (session) => {
                console.log('Connected to SurrealDB');
            }
        ).catch(
            (error) => {
                console.error('Failed to connect to SurrealDB', error);
                return response.status(500).json({message: "Internal Server Error"});
            }
        );
    }

    const {currency} = request.body;

    return db.create("accounts", {
        balance: 0,
        
    })
});
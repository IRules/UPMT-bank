import logtoClient from "@/lib/auth";
import db, {dbSession} from "@/lib/surrealdb";

let costs = [
    {
        crypto: "BTC",
        cost: 50000
    },
    {
        crypto: "ETH",
        cost: 3000
    },
    {
        crypto: "DOGE",
        cost: 200
    }
]


export default logtoClient.withLogtoApiRoute((request, response) => {
    if (request.method !== "GET") {
        response.status(405).json({message: "Method not allowed"});
        return;
    }

    if (!request.user.isAuthenticated) {
        response.status(401).json({message: "Unauthorized"});
        return;
    }

    if (!db.status || db.status === 'disconnected' || db.status === 'error') {
        dbSession.then(
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

    db.select("crypto:"+request.user.claims?.sub).then(
        (result) => {
            console.log(result)
            response.status(200).json(result[0]);
        }
    )
});
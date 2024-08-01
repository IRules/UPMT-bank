import logtoClient from "@/lib/auth";
import db, {dbSession} from "@/lib/surrealdb";

export default logtoClient.withLogtoApiRoute(async (request, response) => {
        if (request.method !== "GET") {
            response.status(405).send("Wrong method.")
        }

        if (!request.user.isAuthenticated) {
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

        const {iban} = request.query;

        db.query(`SELECT * FROM transactions WHERE timestamp > ${new Date().getUTCMilliseconds()} - 60000`).then(
            (transactions) => {
                // @ts-ignore
                response.status(200).json(transactions[0].filter(
                    (transaction: { creditorAccount: { iban: string | string[] | undefined; }; debtorAccount: { iban: string | string[] | undefined; }; }) => transaction.creditorAccount.iban === iban || transaction.debtorAccount.iban === iban
                ));
            }
        )
    }
)
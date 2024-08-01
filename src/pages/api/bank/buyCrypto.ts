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
    if (request.method !== "POST") {
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

    const {iban, crypto, amount} = request.body;

    db.query(`SELECT * FROM accounts WHERE iban = ${iban}`).then(
        (result) => {
            // @ts-ignore
            if (result[0].length === 0) {
                response.status(404).json({message: "Account not found"});
                return;
            }

            let cost = costs.find(c => c.crypto === crypto);

            if (!cost) {
                response.status(400).json({message: "Invalid crypto"});
                return;
            }

            let totalCost = cost.cost * amount;

            // @ts-ignore
            let account = result[0][0];
            if (account.balance < totalCost) {
                response.status(400).json({message: "Insufficient funds"});
                return;
            }

            db.update(account.id, {
                ...account,
                balance: account.balance - totalCost
            }).then(() => {
                db.insert("crypto:" + request.user.claims?.sub, {
                    btc: amount,
                }).then(() => {
                    response.status(201).json({message: "Crypto bought successfully"});
                })
            })
        }
    ).catch(
        (error) => {
            console.error('Failed to query account', error);
            return response.status(500).json({message: "Internal Server Error"});
        }
    );
});
import logtoClient from "@/lib/auth";
import db, {dbSession} from "@/lib/surrealdb";
import OAuth2 from "fetch-mw-oauth2";

const v7 = () => {
    return 'tttttttt-tttt-7xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.trunc(Math.random() * 16);
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).replace(/^[t]{8}-[t]{4}/, function() {
        const unixtimestamp = Date.now().toString(16).padStart(12, '0');
        return unixtimestamp.slice(0, 8) + '-' + unixtimestamp.slice(8);
    });
}

const oauth2 = new OAuth2({
    grantType: 'client_credentials',
    clientId: 'UPMT',
    clientSecret: "54f45a1b-f4ed-41e6-81a1-0b0e28b055ca",
    tokenEndpoint: 'https://open.infoedu-web.ulfsvel.com/auth/realms/infoeducatie/protocol/openid-connect/token',
});

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

    const {debtorAccount, creditorAccount, instructedAmount} = request.body;

    return db.query(`SELECT * FROM accounts WHERE iban = "${debtorAccount.iban}"`).then((debtorAcc) => {
        // @ts-ignore
        if(debtorAcc[0][0].balance > instructedAmount.amount) {

        }
    })


})
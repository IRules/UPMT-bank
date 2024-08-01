import logtoClient from "@/lib/auth";
import db, {dbSession} from "@/lib/surrealdb";

function generateRomanianIBAN(currency: string) {
    // Generate a random 16-digit account number
    const accountNumber = Math.floor(Math.random() * 9000000000000000) + 1000000000000000;

    // Calculate the checksum
    const checkDigits = calculateChecksum(`ROUPMT${currency}${accountNumber}`);

    // Construct the IBAN
    const iban = `RO${checkDigits}UPMT${currency}${accountNumber}`; // RO45UPMTEUR2839294468372986

    return iban;
}

function calculateChecksum(base: string) {
    const baseDigits = base.split('').map(char => {
        const code = char.charCodeAt(0);
        return (code >= 65 && code <= 90) ? code - 55 : parseInt(char);
    });

    let total = 0;
    for (let i = 0; i < baseDigits.length; i++) {
        total = (total * 10 + baseDigits[i]) % 97;
    }
    total = 98 - total;

    return ('0' + total).slice(-2);
}

export default logtoClient.withLogtoApiRoute(async (request, response) => {
    if (request.method !== "POST") {
        response.status(405).json({message: "Method not allowed"});
        return;
    }

    if (!request.user.isAuthenticated) {
        response.status(401).json({message: "Unauthorized"});
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
    console.log(currency)

    return db.create("accounts", {
        balance: 0,
        currency,
        iban: `RO${Math.floor(Math.random() * 100)}UPMT${currency}${Math.floor(Math.random() * 100000000)}`,
        owner: request.user.claims?.sub
    }).then(() => {
        response.status(201).json({message: "Account created successfully"});
    })
});
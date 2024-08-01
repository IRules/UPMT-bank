// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import db, {dbSession} from "@/lib/surrealdb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "PUT") {
        return res.status(405).end();
    }

    if(!db.status) {
        await dbSession.then(
            (session) => {
                console.log('Connected to SurrealDB');
            }
        ).catch(
            (error) => {
                console.error('Failed to connect to SurrealDB', error);
            }
        );
    }

    const {transactionId, debtorAccount, creditorAccount, instructedAmount} = req.body;
    return db.query(`SELECT * FROM transactions WHERE transactionId = "${transactionId}"`).then(
        (result) => {
            //@ts-ignore
            if (result[0].length > 0) {
                return res.status(400).json({outcome: "REJECTED"});
            } else {
                res.status(200).json({outcome: "ACCEPTED"});
                db.create("transactions", {
                    transactionId,
                    debtorAccount,
                    creditorAccount,
                    instructedAmount,
                }).then(
                    async () => {
                        return db.query(`SELECT * FROM accounts WHERE iban = "${creditorAccount.iban}"`).then(
                            (result) => {
                                //@ts-ignore
                                if (result[0].length === 0) {
                                    // return res.status(400).json({outcome: "REJECTED"});
                                    return true;
                                } else {
                                    //@ts-ignore
                                    const balance = result[0][0].balance + instructedAmount.amount;
                                    db.update("accounts", {
                                        iban: creditorAccount.iban,
                                        balance,
                                    }).then(
                                        () => {
                                            return true;
                                        }
                                    )
                                }
                            }
                        )
                    }
                ).catch(
                    (error) => {
                        console.error('Failed to create transaction', error);
                        return res.status(500).json({outcome: "REJECTED"});
                    }
                )
            }
        }
    ).catch(
        (error) => {
            console.error('Failed to query transactions', error);
            return res.status(500).json({outcome: "REJECTED"}
            );
        }
    )
}

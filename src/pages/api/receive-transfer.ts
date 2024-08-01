// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import db, {dbSession} from "@/lib/surrealdb";
import OAuth2 from "fetch-mw-oauth2";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "PUT") {
        return res.status(405).end();
    }

    if (!db.status || db.status === 'disconnected' || db.status === 'error') {
        await dbSession.then(
            (session) => {
                console.log('Connected to SurrealDB');
            }
        ).catch(
            (error) => {
                console.error('Failed to connect to SurrealDB', error);
                return res.status(400).json({outcome: "REJECTED"});
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
                db.create("transactions", {
                    transactionId,
                    debtorAccount,
                    creditorAccount,
                    instructedAmount,
                    timestamp: new Date(),
                    status: "REJECTED"
                }).then(
                    async (transaction) => {
                        return db.query(`SELECT * FROM accounts WHERE iban = "${creditorAccount.iban}"`).then(
                            // @ts-ignore
                            (result) => {
                                //@ts-ignore
                                if (result[0].length === 0) {
                                    return res.status(400).json({outcome: "REJECTED"});
                                } else {
                                    //@ts-ignore
                                    const balance = result[0][0].balance + instructedAmount.amount;
                                    //@ts-ignore
                                    return db.update(result[0][0].id, {
                                        iban: creditorAccount.iban,
                                        balance,
                                    }).then(
                                        () => {
                                            return db.update(transaction[0].id, {
                                                ...transaction[0],
                                                status: "ACCEPTED",
                                            }).then(() => {
                                                res.status(200).json({outcome: "ACCEPTED"});
                                            })
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

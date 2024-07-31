// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db, {dbSession} from "@/lib/surrealdb";


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "PUT") {
        return res.status(405).end();
    }

    const {transactionId, debtorAccount, creditorAccount, instructedAmount} = req.body;

    return dbSession.then(
        async () => {
            return db.query(`SELECT * FROM transactions WHERE transactionId = "${transactionId}"`).then(
                (result) => {
                    //@ts-ignore
                    if (result[0].length > 0) {
                        return res.status(400).json({ outcome: "REJECTED" });
                    } else {
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
                                            return res.status(400).json({ outcome: "REJECTED" });
                                        } else {
                                            console.log(instructedAmount.amount)
                                            //@ts-ignore
                                            const balance = result[0][0].balance + instructedAmount.amount;
                                            db.update("accounts", {
                                                iban: creditorAccount.iban,
                                                balance,
                                            }).then(
                                                () => {
                                                    return res.status(200).json({ outcome: "ACCEPTED" });
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        )
                    }
                }
            )
        }
    )
}

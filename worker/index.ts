import OAuth2 from "fetch-mw-oauth2";
import {Surreal} from "surrealdb.js";

const oauth2 = new OAuth2({
    grantType: 'client_credentials',
    clientId: 'UPMT',
    clientSecret: "54f45a1b-f4ed-41e6-81a1-0b0e28b055ca",
    tokenEndpoint: 'https://open.infoedu-web.ulfsvel.com/auth/realms/infoeducatie/protocol/openid-connect/token',
});

const db = new Surreal();

const dbSession = db.connect("http://44.211.236.177:80/rpc", {
    namespace: 'upmt',
    database: 'upmt',

    auth: {
        username: 'upmt',
        password: 'HoF7J55BpXe6D73omP4e97cY',
    },
});

function run() {
    dbSession.then(
        () => {
            //select all transactions from the last minute
            db.query(`SELECT * FROM transactions WHERE  result != "FINALIZED"`).then(
                (result) => {
                    //@ts-ignore
                    result[0].map((transaction) => {
                        console.log(transaction);
                        oauth2.fetch("https://open.infoedu-web.ulfsvel.com/ach/transfer/" + transaction.transactionId).then(
                            (res) => {
                                res.json().then(
                                    (json) => {
                                        if(json.status === "PENDING") {
                                            oauth2.fetch("https://open.infoedu-web.ulfsvel.com/ach/transfer/" + transaction.transactionId + "/outcome", {
                                                method: "PUT",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    outcome: "ACCEPTED",
                                                }),
                                            }).then(
                                                (result) => {
                                                    result.json().then(
                                                        (json) => {
                                                            console.log(json);
                                                        }
                                                    )
                                                }
                                            )
                                        } else if (json.status === "FINALIZED") {
                                            db.update(transaction.id, {
                                                ...transaction,
                                                result: "FINALIZED",
                                            }).then(
                                                () => {
                                                    console.log("Transaction confirmed!");
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        )
                    })
                    run();
                }
            )
        }
    ).catch(
        (e) => {
            console.log(e)
            const dbSession = db.connect("http://44.211.236.177:80/rpc", {
                namespace: 'upmt',
                database: 'upmt',

                auth: {
                    username: 'upmt',
                    password: 'HoF7J55BpXe6D73omP4e97cY',
                },
            });
        }
    )
}


run();
"use client";

import {Inter} from "next/font/google";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useQRCode} from "next-qrcode";
import GeneratePDF from "@/components/shared/GeneratePDF";
import QRCodeScanner from "@/components/shared/QrCode";


const inter = Inter({subsets: ["latin"]});

type Account = {
    balance: number
    currency: string
    iban: string
    id: string
    owner: string
}

type Transaction = {
    creditorAccount: {
        iban: string,
        name: string;
    },
    debtorAccount: {
        iban: string,
        name: string;
    },
    id: string,
    instructedAmount: {
        amount: number,
        currency: string,
    },
    status: string
}

export default function Home() {

    const {Canvas} = useQRCode();

    const invoices = [
        {
            tid: "COMI:dd3aa585-89b3-40ca-ace8-e9ad4ffbf41a",
            received: true,
            from: "Comisia RO21COMI123456789ABCDEFG",
            status: "ACCEPTED",
            amount: "50 RON",
            category: "Groceries",
        },
    ]

    const emptyAccount = {
        balance: 0,
        currency: "RON",
        iban: "RO",
        id: "1",
        owner: ""
    }

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [activeAccount, setActiveAccount] = useState<Account>(emptyAccount);

    const [createAccountCurrency, setCreateAccountCurrency] = useState("RON");
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [cardNumber, setCardNumber] = useState();
    const [addAmount, setAddAmount] = useState<number>()

    const [crypto, setCrypto] = useState({});

    useEffect(() => {
        fetch("/api/bank/getAccounts").then(
            (res) => {
                res.json().then(
                    (json) => {
                        setAccounts(json);
                        setActiveAccount(json[0]);
                    }
                )
            }
        )
        // getCrypto();
    }, []);

    function createAccount() {
        fetch("/api/bank/createAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({currency: createAccountCurrency}),
        }).then(
            (res) => {
                res.json().then(
                    (json) => {
                        console.log(json);
                        fetch("/api/bank/getAccounts").then(
                            (res) => {
                                res.json().then(
                                    (json) => {
                                        setAccounts(json);
                                        setActiveAccount(json[0]);
                                        getTransactions(json[0].iban)
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    }

    function getTransactions(iban: string) {
        fetch("/api/bank/getTransactions?" + new URLSearchParams({
            iban: iban
        })).then(
            (res) => {
                res.json().then(
                    (json) => {
                        setTransactions(json);
                    }
                )
            }
        )
    }

    function addFunds(iban: string) {
        fetch("/api/bank/addFunds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({addAmount: addAmount, cardNumber, iban: iban}),
        }).then(
            (res) => {
                res.json().then(
                    (json) => {
                        console.log(json);
                        fetch("/api/bank/getAccounts").then(
                            (res) => {
                                res.json().then(
                                    (json) => {
                                        setAccounts(json);
                                        setActiveAccount(json[0]);
                                        getTransactions(json[0].iban)
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    }

    // function getCrypto() {
    //     fetch("/api/bank/getCrypto").then(
    //         (res) => {
    //             console.log(res)
    //             res.json().then(
    //                 (json) => {
    //                     setCrypto(json);
    //                     console.log(json);
    //                 }
    //             )
    //         }
    //     )
    // }

    function buyCrypto(){

    }

    function sellCrypto() {

    }

    return (
        <main
            className="flex flex-col h-screen w-full"
        >
            <div className="flex justify-between px-5 lg:px-20 py-5 w-full">
                <h1 className="text-2xl font-bold">UPMT Dashboard</h1>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-wrap justify-between gap-10 lg:p-10 w-full">
                <div className="flex flex-col p-10 gap-3 bg-gray-900 w-full lg:w-2/5">
                    <div className="flex justify-between items-center">
                        <h1 className="font-semibold text-xl">
                            Account
                        </h1>
                        <Dialog>
                            <DialogTrigger asChild><Button>Create Account</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create a new account</DialogTitle>
                                    <DialogDescription className="p-5 flex flex-col gap-3 items-center">
                                        Please select the currency:
                                        <Select onValueChange={
                                            (e) => {
                                                setCreateAccountCurrency(e)
                                            }
                                        } value={createAccountCurrency}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="RON"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="RON">RON</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button onClick={
                                        createAccount
                                    }>Create</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div>
                        <Select onValueChange={
                            (e) => {
                                //@ts-ignore
                                setActiveAccount(accounts.find(
                                    (account) => account.id === e
                                ))
                                getTransactions(activeAccount.iban)
                            }
                        }>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={activeAccount.iban}/>
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.map(
                                    (account) => (
                                        <SelectItem
                                            key={account.iban}
                                            value={account.id}>
                                            {account.iban}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        {/*make a credit card like div with acc iban, name on account and balance*/}
                        <div
                            className="flex flex-wrap justify-between items-center p-5 gap-5 bg-gray-800 rounded-lg">
                            <div>
                                <h1 className="text-lg font-semibold">{activeAccount.iban}</h1>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold">{activeAccount.balance} {activeAccount.currency}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Dialog>
                            <DialogTrigger asChild><Button variant='default'>
                                Add funds
                            </Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add funds from a card</DialogTitle>
                                    <DialogDescription className="p-5 flex flex-col gap-3 items-center">
                                        <input onChange={
                                            (e) => {
                                                //@ts-ignore
                                                setCardNumber(e.target.value)
                                            }
                                        } type="text" placeholder="Visa Card number" className="
                                        w-[180px] p-2 bg-gray-800 rounded-lg
                                        "/>
                                        <input onChange={
                                            (e) => {
                                                //@ts-ignore
                                                setAddAmount(e.target.value)
                                            }
                                        } type="number" className="
                                        w-[180px] p-2 bg-gray-800 rounded-lg
                                        " placeholder="Amount"/>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button onClick={
                                        () => {
                                            addFunds(activeAccount.iban)
                                        }
                                    }>Add funds</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild><Button variant='outline'>
                                Request money
                            </Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Have your friend scan the QR Code</DialogTitle>
                                    <DialogDescription className="p-5 flex flex-col gap-3 items-center">
                                        <Canvas
                                            text={JSON.stringify(
                                                {
                                                    bank: "UPMT",
                                                    owner: "Aris Toma",
                                                    iban: "RO45UPMTEUR2839294468372986",
                                                    currency: "EUR",
                                                })}
                                            options={{
                                                errorCorrectionLevel: 'M',
                                                margin: 3,
                                                scale: 4,
                                                width: 300,
                                            }}/>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild><Button variant='outline'>
                                Send money with QR Code
                            </Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Scan your friends QR Code</DialogTitle>
                                    <DialogDescription className="p-5 flex flex-col gap-3 items-center">
                                        <QRCodeScanner />
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button>Send money</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <GeneratePDF accounts={accounts} />
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    Send across accounts
                                </Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Select accounts and amount</DialogTitle>
                                    <DialogDescription className="p-5 flex flex-col gap-3 items-center">
                                        From:
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="From"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">EUR *2986</SelectItem>
                                                <SelectItem value="dark">USD *2986</SelectItem>
                                                <SelectItem value="system">YEN *2986</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        To:
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="From"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">EUR *2986</SelectItem>
                                                <SelectItem value="dark">USD *2986</SelectItem>
                                                <SelectItem value="system">YEN *2986</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        Amount:
                                        <input type="number" placeholder="Amount"
                                               className="w-[180px] p-2 bg-gray-800 rounded-lg"/>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button>Send money across accounts</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="flex flex-col p-10 gap-3 bg-gray-900 w-full lg:w-2/5 ">
                    <div className="flex justify-between items-center">
                        <h1 className="font-semibold text-xl">
                            Crypto
                        </h1>
                    </div>
                    <div>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="BTC"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">BTC</SelectItem>
                                <SelectItem value="light">ETH</SelectItem>
                                <SelectItem value="dark">DODGE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        {/*make a credit card like div with acc iban, name on account and balance*/}
                        <div className="flex justify-between items-center p-5 gap-5 bg-gray-800 rounded-lg">
                            <div>
                                <h1 className="text-lg font-semibold">ETH</h1>
                                <p className="text-sm">1 ETH = 1$</p>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold">€ 9567</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant='default'>
                                    Buy crypto
                                </Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Buy crypto</DialogTitle>
                                    <DialogDescription className="p-5 flex flex-col gap-3 items-center">
                                        Account to pay with:
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="From"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">EUR *2986</SelectItem>
                                                <SelectItem value="dark">USD *2986</SelectItem>
                                                <SelectItem value="system">YEN *2986</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        Amount of ETH:
                                        <input type="number" placeholder="Amount"
                                               className="w-[180px] p-2 bg-gray-800 rounded-lg"/>
                                        Price per eth: 14696.91 RON
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button>Buy</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant='outline'>
                                    Sell crypto
                                </Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Sell crypto</DialogTitle>
                                    <DialogDescription className="p-5 flex flex-col gap-3 items-center">
                                        Account to receive the money on:
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="From"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">EUR *2986</SelectItem>
                                                <SelectItem value="dark">USD *2986</SelectItem>
                                                <SelectItem value="system">YEN *2986</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        Amount of ETH:
                                        <input type="number" placeholder="Amount"
                                               className="w-[180px] p-2 bg-gray-800 rounded-lg"/>
                                        Price per eth: 14696.91 RON
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button>Sell</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="flex flex-col gap-5 px-10 py-10 w-full">
                    <h1 className="font-semibold text-xl">Latest Transactions</h1>
                    <Table>
                        <TableCaption>A list of your recent transactions.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>TID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Sent to/Received from</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">{transaction.id}</TableCell>
                                    <TableCell>{transaction.creditorAccount.iban === activeAccount.iban ? "Received" : "Sent"}</TableCell>
                                    <TableCell>{transaction.status}</TableCell>
                                    <TableCell>{transaction.debtorAccount.name} {transaction.debtorAccount.iban}</TableCell>
                                    <TableCell
                                        className="text-right">{transaction.instructedAmount.amount} {transaction.instructedAmount.currency}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </main>
    );
}//
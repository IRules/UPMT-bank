import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {Button} from "@/components/ui/button";
import React from "react";
// @ts-ignore
export default function GeneratePDF({ accounts }) {

    function generate() {
        const doc = new jsPDF()

        //@ts-ignore
        doc.autoTable({
            head: [['IBAN', "Balance"]],
            body:
                // @ts-ignore
                accounts.map(({ iban, balance}) => {
                    return [
                        iban, balance
                    ]
                }),
        })

        doc.save('UPMT_accounts.pdf')
    }

    return (
            <Button variant='outline' onClick={generate}>
                Generate PDF statement
            </Button>
    )
}
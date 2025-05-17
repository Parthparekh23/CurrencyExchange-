import { UUID } from "mongodb";

export class TransactionHistory {
    type: 'buy' | 'sell' | 'fund added' | 'withdraw';
    userUId: string;
    uId:string;
    amount: number; // PLN amount
    note: string; // Description of the transaction, e.g., currency purchased, sold, etc.
    createdOn:Date
    dType:string
    constructor(type: 'buy' | 'sell' | 'fund added' | 'withdraw', userUId: string, amount: number, note: string) {
        this.type = type;
        this.userUId = userUId;
        this.amount = amount;
        this.note = note;
        this.createdOn=  new Date();
        this.dType="transaction";
        this.uId= ""
    }
}
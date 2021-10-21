import { Currency } from "./currency.enum";
import { FixedTerm } from "./fixed-term";
import { Movement } from "./movement";

export class Account {
    owner: string;
    availableMoney: number;
    cbu: string;
    currency: Currency;
    movements: Movement[];
    fixedTerms: FixedTerm[];

    constructor(owner: string, currency: Currency) {
        this.owner = owner;
        this.availableMoney = 0;
        this.cbu = this.generateCBU();
        this.currency = currency;
        this.movements = [];
        this.fixedTerms = [];
    }

    generateCBU() {
        let cbu = "99905909";
        for (let i = 0; i < 7; i++) {
            const random = Math.floor(Math.random() * (99 - 10 + 1) + 10);
            cbu += random;
        }
        return cbu;
    }
}

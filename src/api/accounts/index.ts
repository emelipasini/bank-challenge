import { createAccount } from "./create";
import { createFixedTerm } from "./create-fixed-term";
import { deleteFixedTerm } from "./delete-fixed-term";
import { deposit } from "./deposit";
import { exchange } from "./exchange";
import { getMovements } from "./get-movements";
import { transfer } from "./transfer";

export const accountsController = {
    createAccount,
    createFixedTerm,
    deleteFixedTerm,
    deposit,
    exchange,
    getMovements,
    transfer,
};

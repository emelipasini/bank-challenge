import { NextFunction, Request, Response } from "express";
import usersDB from "../database/users";
import { User } from "../domain/user";

export async function registerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userFromBody = req.query as any as User;

        if (!nameIsValid(userFromBody.firstname)) {
            return res
                .status(400)
                .json({ message: "Bad Request: Invalid firstname" });
        }

        if (!nameIsValid(userFromBody.lastname)) {
            return res
                .status(400)
                .json({ message: "Bad Request: Invalid lastname" });
        }

        if (!pinIsValid(userFromBody.pin)) {
            return res
                .status(400)
                .json({ message: "Bad Request: Invalid PIN" });
        }

        if (!passwordIsValid(userFromBody.password)) {
            return res
                .status(400)
                .json({ message: "Bad Request: Invalid password" });
        }

        if (!(await emailIsValid(userFromBody.email))) {
            return res
                .status(400)
                .json({ message: "Bad Request: Invalid email" });
        }

        next();
    } catch (error) {
        return res.status(500).json(error);
    }
}

function nameIsValid(field: string) {
    const number = /[0-9]/;
    if (number.test(field)) {
        return false;
    }

    if (field.trim().length < 3) {
        return false;
    }
    return true;
}

function pinIsValid(pin: number) {
    if (pin.toString().length !== 8) {
        return false;
    }

    const letter = /[a-zA-Z]/;
    if (letter.test(pin.toString())) {
        return false;
    }
    return true;
}

function passwordIsValid(password: string): boolean {
    const letter = /[a-zA-Z]/;
    const number = /[0-9]/;
    if (!(number.test(password) && letter.test(password))) {
        return false;
    }

    if (password.trim().length < 8) {
        return false;
    }
    return true;
}

async function emailIsValid(email: string) {
    const format = /^\S+@\S+\.\S+$/;
    if (!format.test(email)) {
        return false;
    }

    const user = await usersDB.findUser(email);
    if (user) {
        return false;
    }
    return true;
}

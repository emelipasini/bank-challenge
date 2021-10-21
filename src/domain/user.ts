import jwt from "jsonwebtoken";
import config from "config";

export class User {
    firstname: string;
    lastname: string;
    email: string;
    pin: number;
    password: string;

    constructor(
        firstname: string,
        lastname: string,
        email: string,
        password?: string
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }

    generateToken() {
        return jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                ...this.getJSONData(),
            },
            config.get("secret")
        );
    }

    static validateToken(userJwt: string) {
        return jwt.verify(userJwt, config.get("secret"), (error, res) => {
            if (error) {
                return { error };
            }
            return new User(res.firstname, res.lastname, res.email);
        });
    }

    getJSONData() {
        return {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
        };
    }
}

import { Collection, MongoClient } from "mongodb";
import config from "config";

import { User } from "../domain/user";

let users: Collection;

export default class usersDB {
    static async injectDB(conn: MongoClient) {
        if (users) {
            return;
        }
        try {
            users = conn.db(config.get("dbName")).collection("users");
        } catch (e) {
            console.error(
                `Unable to establish collection handles in users database: ${e}`
            );
        }
    }

    static async addUser(userInfo: User) {
        try {
            await users.insertOne(userInfo);
        } catch (e) {
            console.error(`Error occurred while adding user, ${e}`);
            return { error: e };
        }
    }

    static async findUser(email: string) {
        try {
            return await users.findOne({ email });
        } catch (e) {
            console.error(`Error occurred while adding user, ${e}`);
            return { error: e };
        }
    }
}

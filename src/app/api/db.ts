import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.DATABASE_URL;

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToDB = async () => {
    if (db) {
        return db;
    }

    if (!client) {
        client = new MongoClient(uri as string, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });
        await client.connect();
    }

    db = client.db('nextjs-inventory-app');
    return db;
}
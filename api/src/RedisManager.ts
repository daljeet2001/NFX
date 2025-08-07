import { RedisClientType, createClient } from "redis";
import { MessageFromOrderbook } from "./types";
import { MessageToEngine } from "./types/to";

export class RedisManager {
    private client: RedisClientType;
    private publisher: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        const redisUrl = process.env.REDIS_URL; 
        if (!redisUrl) {
            throw new Error("REDIS_URL is not defined in environment variables");
        }

        this.client = createClient({
            url: redisUrl,
            socket: {
                tls: true,
            },
        });

        this.publisher = createClient({
            url: redisUrl,
            socket: {
                tls: true,
            },
        });

        // Safe async connection
        this.client.connect().catch(console.error);
        this.publisher.connect().catch(console.error);
    }

    public static getInstance(): RedisManager {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    public sendAndAwait(message: MessageToEngine): Promise<MessageFromOrderbook> {
        return new Promise<MessageFromOrderbook>((resolve, reject) => {
            const id = this.getRandomClientId();
            let resolved = false;

            const onMessage = (message: string) => {
                if (resolved) return;
                resolved = true;
                clearTimeout(timeout);
                this.client.unsubscribe(id).catch(console.error);
                resolve(JSON.parse(message));
            };

            const timeout = setTimeout(() => {
                if (resolved) return;
                resolved = true;
                this.client.unsubscribe(id).catch(console.error);
                reject(new Error("Redis response timeout"));
            }, 5000); // 5s timeout

            this.client.subscribe(id, onMessage).then(() => {
                this.publisher.lPush("messages", JSON.stringify({ clientId: id, message }));
            }).catch((err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
    }

    private getRandomClientId(): string {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }
}

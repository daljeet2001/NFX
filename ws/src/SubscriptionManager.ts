import { RedisClientType, createClient } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager {
    private static instance: SubscriptionManager;
    private subscriptions: Map<string, string[]> = new Map();
    private reverseSubscriptions: Map<string, string[]> = new Map();
    private redisClient: RedisClientType;

    private constructor() {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            throw new Error("REDIS_URL is not defined in environment variables");
        }

        this.redisClient = createClient({
            url: redisUrl,
            socket: {
                tls: true,
            },
        });

        this.redisClient.on("error", (err) => {
            console.error("Redis connection error:", err);
        });

        this.redisClient.connect();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SubscriptionManager();
        }
        return this.instance;
    }

    public subscribe(userId: string, subscription: string) {
        if (this.subscriptions.get(userId)?.includes(subscription)) {
            return;
        }

        this.subscriptions.set(
            userId,
            (this.subscriptions.get(userId) || []).concat(subscription)
        );
        this.reverseSubscriptions.set(
            subscription,
            (this.reverseSubscriptions.get(subscription) || []).concat(userId)
        );

        if (this.reverseSubscriptions.get(subscription)?.length === 1) {
            this.redisClient.subscribe(subscription, this.redisCallbackHandler);
        }
      
        console.log("Current subscriptions:", this.subscriptions);
        console.log("Current reverse subscriptions:", this.reverseSubscriptions);
    }

    private redisCallbackHandler = (message: string, channel: string) => {
        const parsedMessage = JSON.parse(message);
        console.log(`Received message on channel ${channel}:`, parsedMessage);
        this.reverseSubscriptions
            .get(channel)
            ?.forEach((s) =>
                UserManager.getInstance().getUser(s)?.emit(parsedMessage)
            );
    };

    public unsubscribe(userId: string, subscription: string) {
        const subscriptions = this.subscriptions.get(userId);
        if (subscriptions) {
            this.subscriptions.set(
                userId,
                subscriptions.filter((s) => s !== subscription)
            );
        }

        const reverseSubscriptions = this.reverseSubscriptions.get(subscription);
        if (reverseSubscriptions) {
            this.reverseSubscriptions.set(
                subscription,
                reverseSubscriptions.filter((s) => s !== userId)
            );

            if (this.reverseSubscriptions.get(subscription)?.length === 0) {
                this.reverseSubscriptions.delete(subscription);
                this.redisClient.unsubscribe(subscription);
            }
        }
    }

    public userLeft(userId: string) {
        console.log("user left " + userId);
        this.subscriptions.get(userId)?.forEach((s) =>
            this.unsubscribe(userId, s)
        );
    }

    public getSubscriptions(userId: string) {
        return this.subscriptions.get(userId) || [];
    }
}

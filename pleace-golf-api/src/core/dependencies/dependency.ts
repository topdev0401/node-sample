
/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

export abstract class Dependency<T> {
    protected client: T;

    public constructor(protected host: string) {
    }

    protected abstract disconnected(): void;
    protected abstract connected(): void;
    protected abstract getName(): string;
    public abstract async connect(): Promise<T>;

    public async getClient(): Promise<T> {
        if (!this.client) {
            throw new Error(`${this.getName()} is not connected.`);
        }
        return this.client;
    }
}

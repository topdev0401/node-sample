/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { Dependency } from "./dependency";
import { Logger } from "../logging";

export class DependencyBootstrapper {
    private dependencies: Dependency<any>[];

    public constructor(...dependencies: Dependency<any>[]) {
        this.dependencies = dependencies;
    }

    public async bootstrap() {
        Logger.info("Starting dependency bootstrap");
        await this.connect();
        Logger.info("Finished dependency bootstrap");
    }

    private async connect(): Promise<void> {
        const connectDependencies = this.dependencies.map((dependency) => {
            return dependency.connect();
        });
        await Promise.all(connectDependencies);

        Logger.info("All dependencies connected");
    }
}

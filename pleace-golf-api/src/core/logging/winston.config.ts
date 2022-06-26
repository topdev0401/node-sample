/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

export interface WinstonConfig {
    development: {
        transports: WinstonTransportConfig[];
    }
    production: {
        transports: WinstonTransportConfig[];
    }
}

export interface WinstonTransportConfig {
    type: string;
    level: string;
    filename?: string;
}
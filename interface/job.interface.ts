import { Image } from './image.interface.ts';

export interface Job {
    name: string;
    variables?: Record<string, string>;
    extends?: string[];
    allow_failure?: boolean;
    stage: string;
    environment?: {
        name: string;
        deployment_tier?: string;
        url?: string;
    };
    needs?: string[];
    script: string | string[];
    image?: string | Image;
    services?: string[];
    artifacts?: {
        reports?: {
            dotenv: string;
        };
        paths?: string[];
    };
}

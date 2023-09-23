import { Job } from '@interface/job.interface.ts';

export const hasStages = (yaml: unknown): yaml is { stages: string[] } => {
    return typeof yaml === 'object' && yaml !== null && 'stages' in yaml && yaml.stages !== undefined;
};

export const hasInclude = (yaml: unknown): yaml is { include: string[] } => {
    return typeof yaml === 'object' && yaml !== null && 'include' in yaml && yaml.include !== undefined;
};

export const hasExtends = (yaml: unknown): yaml is { extends: string } => {
    return typeof yaml === 'object' && yaml !== null && 'extends' in yaml && yaml.extends !== undefined;
};

export const isJob = (parsedGitlabConfigElement: unknown): parsedGitlabConfigElement is Job => {
    return typeof parsedGitlabConfigElement === 'object' && parsedGitlabConfigElement !== null
        && 'stage' in parsedGitlabConfigElement && 'script' in parsedGitlabConfigElement
        && parsedGitlabConfigElement.stage !== undefined && parsedGitlabConfigElement.script !== undefined;
};

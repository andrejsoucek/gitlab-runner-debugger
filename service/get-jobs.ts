import { dirname } from 'path';
import { load } from 'js-yaml';
import { Job } from '@interface/job.interface';
import { hasExtends, hasInclude, hasStages, isJob } from '@utils/typeguard.ts';

const parseInclude = async (rootPath: string, include: string[]): Promise<unknown[]> => {
    const includes = include.map(async (path) => {
        return load(await Bun.file(`${rootPath}/${path}`).text());
    });

    return Promise.all(includes);
};

export const getJobs = async (gitlabYamlFilePath: string): Promise<{ stage: string; jobs: Job[] }[]> => {
    const yaml = load(await Bun.file(gitlabYamlFilePath).text());
    const stages = [];
    const jobs: Record<string, Job> = {};
    const includedYamls = [];

    if (hasInclude(yaml)) {
        includedYamls.push(...await parseInclude(dirname(gitlabYamlFilePath), yaml.include));
    }
    const config = Object.assign({}, yaml, ...includedYamls);
    Object.keys(config).forEach((key) => {
        if (hasExtends(config[key])) {
            const extensions: string[] = Array.isArray(config[key].extends) ? config[key].extends : [config[key].extends];
            extensions.forEach((extension) => {
                config[key] = { ...config[extension], ...config[key] };
            });
        }
    });

    if (hasStages(yaml)) {
        stages.push(...yaml.stages);
    } else {
        console.error('Not a valid Gitlab YAML file');
    }

    Object.keys(config).forEach((key) => {
        if (isJob(config[key])) {
            const job = config[key];
            job.name = key;
            jobs[key] = job;
        }
    });

    return stages.map((stage) => {
        return {
            stage,
            jobs: Object.values(jobs).filter((job) => job.stage === stage),
        };
    });
};

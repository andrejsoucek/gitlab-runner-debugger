import { dirname } from 'path';
import * as os from 'os';
import { unlinkSync } from 'fs';
import clc from 'cli-color';
import { Errorlike, Subprocess } from 'bun';
import { getJobs } from '@service/get-jobs.ts';
import { getImageName } from '@utils/get-image-name.ts';
import { Job } from '@interface/job.interface.ts';

const getEnvs = (env: Record<string, string>): string[] => {
    const envs = [
        '-e', `CI=${true}`,
        '-e', 'CI_PROJECT_DIR=/app',
    ];
    Object.keys(env).forEach((key) => {
        envs.push('-e', `${key}=${env[key]}`);
    });

    return envs;
};

const handleArtifacts = async (cwd: string, artifacts: Job['artifacts']): Promise<void> => {
    if (artifacts?.reports?.dotenv) {
        const filename = artifacts.reports.dotenv;
        console.log(clc.black.bold.bgGreen(`Artifacts: ${filename}`));
        const filePath = `${cwd}/${filename}`;
        const dotenvReport = Bun.file(filePath);
        console.log(await dotenvReport.text());
        unlinkSync(filePath);
    }

    if (artifacts?.paths) {
        artifacts.paths.forEach((path) => {
            const filePath = `${cwd}/${path}`;
            Bun.file(filePath).text().then((text) => {
                console.log(clc.black.bold.bgGreen(`Artifacts: ${path}`));
                console.log(text);
                unlinkSync(filePath);
            });
        });
    }
};

export const actionRunJob = async (gitlabYamlFilePath: string, jobName: string): Promise<void> => {
    const stagesWithJobs = await getJobs(gitlabYamlFilePath);
    const job = stagesWithJobs
        .map((stage) => stage.jobs.find((x) => x.name === jobName))
        .find((x) => x !== undefined);
    if (job === undefined) {
        console.error(`Job ${jobName} not found.`);
        process.exit(1);
    }
    const imageName = getImageName(job.image);
    console.info(`${clc.black.bold.bgGreen('Image:')} ${imageName}`);
    const script = Array.isArray(job.script) ? job.script.join(' && ') : job.script;
    console.info(`${clc.black.bold.bgGreen('Image:')} ${script}`);
    console.log(clc.black.bold.bgGreen('Job output:'));
    console.log(clc.bgWhite('\n'));

    const cwd = dirname(gitlabYamlFilePath);
    const user = os.userInfo();
    const dockerProcess = Bun.spawn(
        [
            'docker', 'run', '--rm',
            '-v', `${cwd}:/app`,
            '-w', '/app',
            '--user', `${user.uid}:${user.gid}`,
            ...getEnvs(Object.assign(process.env, job.variables || {})),
            imageName,
            script,
        ],
        {
            stdout: 'pipe',
            cwd,
            async onExit(subprocess: Subprocess, exitCode: number | null, signalCode: number | null, error?: Errorlike): Promise<void> {
                if (exitCode === 0) {
                    console.log(clc.green('Job succeeded.'));
                    console.log(clc.bgWhite('\n'));
                    await handleArtifacts(cwd, job.artifacts);

                    return;
                }
                if (exitCode === 1) {
                    console.error('Job failed.');
                    console.log(clc.bgWhite('\n'));

                    return;
                }
                console.error('Job ended unexpectedly.', 'Exit code:', exitCode, 'Signal code:', signalCode, 'Error:', error);
                console.log(clc.bgWhite('\n'));
            },
        }
    );
    const decoder = new TextDecoder();
    // eslint-disable-next-line no-restricted-syntax
    for await (const line of dockerProcess.stdout) {
        console.log(decoder.decode(line));
    }
};

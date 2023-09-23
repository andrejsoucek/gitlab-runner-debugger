import { Command } from 'commander';
import { actionJobs } from "./action/jobs.ts";
import { actionRunJob } from "./action/run-job.ts";

const program = new Command();

program
    .name('grd')
    .description('Run Gitlab DinD jobs locally!')
    .version('0.0.1');

program.command('jobs')
    .description('Show pipeline jobs')
    .argument('<yaml-path>', 'Path to .gitlab-ci.yml file')
    .action(actionJobs);

program.command('run-job')
    .description('Run a specific job locally')
    .argument('<yaml-path>', 'Path to .gitlab-ci.yml file')
    .argument('<job-name>', 'Name of the job to run')
    .action(actionRunJob);

program.parse();

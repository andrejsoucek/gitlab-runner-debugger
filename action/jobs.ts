import clc from 'cli-color';
import { getJobs } from '@service/get-jobs.ts';
import { getImageName } from '@utils/get-image-name.ts';

export const actionJobs = async (gitlabYamlFilePath: string): Promise<void> => {
    const stagesWithJobs = await getJobs(gitlabYamlFilePath);

    stagesWithJobs.forEach((stage) => {
        console.log(clc.black.bold.bgGreen(stage.stage));
        stage.jobs.forEach((job) => {
            if (job.services && job.services.filter((service) => service.includes('dind')).length > 0) {
                console.log(`  - ${job.name} ${clc.green('✔ Locally runnable')}`);
                console.log(`    - image: ${getImageName(job.image)}`);
            } else {
                console.log(`  - ${job.name} ${clc.red('❌ Not a DinD job.')}`);
            }
        });
    });
};

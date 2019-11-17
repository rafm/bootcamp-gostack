import Bee from 'bee-queue';
import redisConfig from '../config/redis';
import SubscriptionMail from '../app/jobs/SubscriptionMail';
import AnswerMail from '../app/jobs/AnswerMail';

const jobs = [SubscriptionMail, AnswerMail];

class Queue {
    constructor() {
        this.queues = {};

        this.init();
    }

    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    add(key, job) {
        return this.queues[key].bee.createJob(job).save();
    }

    processQueue() {
        jobs.forEach(({ key }) => {
            const { bee, handle } = this.queues[key];

            bee.on('failure', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}

export default new Queue();

import cron from 'node-cron';

export default class CronAdapter {
  private static readonly cronTime: string = process.env.CRON_SCHEDULE ?? '1 */1 * * *';

  static readonly schedule = (onTick: () => void, cronTime = this.cronTime): void => {
    cron.schedule(cronTime, onTick);
  };

  static {
    console.debug('Cron Time:', this.cronTime);
  }
}

import cron from 'node-cron';

export class Cron {
  static readonly schedule = (cronTime: string, onTick: () => void): void => {
    cron.schedule(cronTime, onTick);
  };

  static {
    console.debug('Cron Time:', process.env.CRON_SCHEDULE);
  }
}

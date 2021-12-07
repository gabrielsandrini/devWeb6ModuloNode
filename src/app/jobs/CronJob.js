import cron from 'node-cron';

class CronJob {
  constructor() {
    console.log('Iniciando Cron...');
    cron.schedule(
      '0 19 * * *',
      () => {
        console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
      },
      {
        scheduled: true,
        timezone: 'America/Sao_Paulo',
      }
    );
  }
}

export default new CronJob();

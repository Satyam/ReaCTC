import { start, stop } from './server';

async function startup() {
  try {
    await start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at http://localhost:${PORT}/`);
}

startup();

const shutdown = async () => {
  await stop();
  console.log(`Server at  http://localhost:${PORT}/ closed`);
  process.exit();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

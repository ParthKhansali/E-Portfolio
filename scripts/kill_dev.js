const { execSync } = require('child_process');

try {
  process.kill(80151, 'SIGKILL');
  console.log('Successfully killed PID 80151');
} catch (err) {
  console.log('PID kill err:', err.message);
}

try {
  const pids = execSync('lsof -t -i:3000', { encoding: 'utf-8' }).trim().split('\n');
  for (const pid of pids) {
    if (pid) {
      try {
        process.kill(parseInt(pid, 10), 'SIGKILL');
        console.log('Killed port 3000 PID:', pid);
      } catch (e) {
        console.log('Error killing', pid, e.message);
      }
    }
  }
} catch (e) {
  console.log('No remaining process on port 3000');
}

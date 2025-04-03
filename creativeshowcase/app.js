// app.js (in creativeshowcase/)
const { exec } = require('child_process');

const child = exec('npm run dev');

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
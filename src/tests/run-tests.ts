import { exec } from 'child_process';
import path from 'path';

const testFile = path.join(__dirname, 'api-test.ts');

// Execute the test file using ts-node
exec(`npx ts-node -r tsconfig-paths/register ${testFile}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});

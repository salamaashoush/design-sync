import { downloadTemplate } from 'giget';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export async function fetchTokens(repo: string, filePath: string, auth?: string) {
  const tmpDir = await mkdtemp(join(tmpdir(), 'tokenize-'));
  const { dir } = await downloadTemplate(repo, {
    cwd: tmpDir,
    dir: tmpDir,
    auth,
  });
  const tokens = await readFile(join(dir, filePath), 'utf-8');
  return JSON.parse(tokens);
}

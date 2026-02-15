import { existsSync } from "node:fs";
import { mkdir, writeFile, mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execSync } from "node:child_process";

type Format = "typescript" | "json" | "css";

const formatExtensions: Record<Format, string> = {
  typescript: ".ts",
  json: ".json",
  css: ".css",
};

export async function formatTextWithPrettier(text: string, parser: Format = "typescript") {
  const ext = formatExtensions[parser];
  const tempDir = await mkdtemp(join(tmpdir(), "oxfmt-"));
  const tempFile = join(tempDir, `temp${ext}`);

  try {
    await writeFile(tempFile, text);
    execSync(`npx oxfmt "${tempFile}"`, { stdio: "pipe" });
    return await readFile(tempFile, "utf-8");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function detectFileFormat(path: string) {
  const ext = path.split(".").pop();
  switch (ext) {
    case "css":
      return "css";
    case "json":
      return "json";
    default:
      return "typescript";
  }
}
export async function formatAndWriteFile(path: string, content: string, prettify = false) {
  const format = detectFileFormat(path);
  const folderPath = path.split("/").slice(0, -1).join("/");
  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  }
  if (prettify) {
    content = await formatTextWithPrettier(content, format);
  }
  return writeFile(path, content);
}

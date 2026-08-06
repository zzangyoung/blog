// src/index.ts
import { execFileSync } from "child_process";
import path from "path";
function getEarliestCommitDate(absoluteFilePath) {
  try {
    const output = execFileSync(
      "git",
      ["log", "--format=%ct", "--follow", "--", absoluteFilePath],
      { cwd: path.dirname(absoluteFilePath), encoding: "utf8" }
    );
    const timestamps = output.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    if (timestamps.length === 0) return void 0;
    const oldestSeconds = parseInt(timestamps[timestamps.length - 1], 10);
    if (Number.isNaN(oldestSeconds)) return void 0;
    return new Date(oldestSeconds * 1e3);
  } catch {
    return void 0;
  }
}
var GitCreatedDate = () => {
  return {
    name: "GitCreatedDate",
    markdownPlugins(_ctx) {
      return [
        () => {
          return async (_tree, file) => {
            const data = file.data;
            if (!data || !data.dates) return;
            if (data.frontmatter && data.frontmatter.created) return;
            const fp = data.filePath;
            if (!fp) return;
            const absoluteFilePath = path.resolve(process.cwd(), fp);
            const earliest = getEarliestCommitDate(absoluteFilePath);
            if (earliest) {
              data.dates.created = earliest;
            }
          };
        }
      ];
    }
  };
};
export {
  GitCreatedDate
};

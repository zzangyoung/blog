import { QuartzTransformerPlugin } from "@quartz-community/types"
import { execFileSync } from "child_process"
import path from "path"

/**
 * The built-in created-modified-date plugin only derives "modified" from git
 * (the latest commit touching a file). Its "created" date falls back to the
 * filesystem birth time when frontmatter doesn't specify one -- and on every
 * CI build the repo is freshly checked out, so that birth time is always
 * "now", making the displayed created date drift to the build date instead
 * of reflecting when the note was actually first written.
 *
 * This plugin runs after created-modified-date (order 10) and, for any file
 * that doesn't have an explicit frontmatter "created" value, overwrites
 * data.dates.created with the timestamp of the earliest git commit that
 * touched the file. This requires the git checkout to have enough history
 * to see that commit (a fully shallow depth-1 clone will only see "now").
 */
function getEarliestCommitDate(absoluteFilePath: string): Date | undefined {
  try {
    const output = execFileSync(
      "git",
      ["log", "--format=%ct", "--follow", "--", absoluteFilePath],
      { cwd: path.dirname(absoluteFilePath), encoding: "utf8" },
    )
    const timestamps = output
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
    if (timestamps.length === 0) return undefined

    // git log lists newest-first; the last entry is the oldest commit.
    // (Deliberately not using --reverse here: combined with --follow it
    // has known unreliable behavior in some git versions.)
    const oldestSeconds = parseInt(timestamps[timestamps.length - 1], 10)
    if (Number.isNaN(oldestSeconds)) return undefined
    return new Date(oldestSeconds * 1000)
  } catch {
    return undefined
  }
}

export const GitCreatedDate: QuartzTransformerPlugin = () => {
  return {
    name: "GitCreatedDate",
    markdownPlugins(_ctx) {
      return [
        () => {
          return async (_tree: unknown, file: { data: Record<string, any> }) => {
            const data = file.data
            if (!data || !data.dates) return
            if (data.frontmatter && data.frontmatter.created) return

            const fp: string | undefined = data.filePath
            if (!fp) return

            // data.filePath is relative to the directory quartz build was
            // invoked from (typically the repo root); resolve to an
            // absolute path so git can be run reliably from any cwd.
            const absoluteFilePath = path.resolve(process.cwd(), fp)

            const earliest = getEarliestCommitDate(absoluteFilePath)
            if (earliest) {
              data.dates.created = earliest
            }
          }
        },
      ]
    },
  }
}

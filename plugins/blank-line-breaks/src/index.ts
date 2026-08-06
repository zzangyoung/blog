import { QuartzTransformerPlugin } from "@quartz-community/types"

/**
 * Obsidian and most editors collapse "how many blank lines did I press Enter for"
  * once the file hits a standard Markdown parser -- any run of 2+ blank lines
   * renders identically to a single blank line (one paragraph gap). Obsidian also
    * often leaves trailing whitespace (the "  " hard-break marker) on lines that
     * are otherwise empty, so a naive check for pure "\n\n\n" runs misses those.
      *
       * This plugin runs on the raw file text before Markdown parsing and converts
        * any *extra* blank lines (beyond the first, which is the normal paragraph
         * break) into explicit <br> blocks, so pressing Enter extra times in Obsidian
          * actually produces extra vertical space on the published page.
           *
            * Content inside triple-backtick fenced code blocks is left untouched so
             * blank lines inside code samples aren't altered.
              */
              const FENCE = String.fromCharCode(96, 96, 96)
              const FENCE_SPLIT_RE = new RegExp("(" + FENCE + "[\\s\\S]*?" + FENCE + ")", "g")

              export const BlankLineBreaks: QuartzTransformerPlugin = () => {
                return {
                    name: "BlankLineBreaks",
                        textTransform(_ctx, src) {
                              const segments = src.split(FENCE_SPLIT_RE)
                                    return segments
                                            .map((segment, i) => {
                                                      if (i % 2 === 1) return segment

                                                                const normalized = segment.replace(/^[ \t]+$/gm, "")

                                                                          return normalized.replace(/\n{3,}/g, (match) => {
                                                                                      const extraBlankLines = match.length - 2
                                                                                                  if (extraBlankLines <= 0) return match
                                                                                                              const brBlocks = Array(extraBlankLines).fill("<br>").join("\n\n")
                                                                                                                          return "\n\n" + brBlocks + "\n\n"
                                                                                                                                    })
                                                                                                                                            })
                                                                                                                                                    .join("")
                                                                                                                                                        },
                                                                                                                                                          }
                                                                                                                                                          }

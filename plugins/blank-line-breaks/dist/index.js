// src/index.ts
var FENCE = String.fromCharCode(96, 96, 96);
var FENCE_SPLIT_RE = new RegExp("(" + FENCE + "[\\s\\S]*?" + FENCE + ")", "g");
var BlankLineBreaks = () => {
    return {
          name: "BlankLineBreaks",
          textTransform(_ctx, src) {
                  const segments = src.split(FENCE_SPLIT_RE);
                  return segments.map((segment, i) => {
                            if (i % 2 === 1) return segment;
                            const normalized = segment.replace(/^[ \t]+$/gm, "");
                            return normalized.replace(/\n{3,}/g, (match) => {
                                        const extraBlankLines = match.length - 2;
                                        if (extraBlankLines <= 0) return match;
                                        const brBlocks = Array(extraBlankLines).fill("<br>").join("\n\n");
                                        return "\n\n" + brBlocks + "\n\n";
                            });
                  }).join("");
          }
    };
};
export {
    BlankLineBreaks
};

import { Editor, FoldPosition, HeadingCache } from 'obsidian'
import { foldable } from "@codemirror/language"
// import { Node, Heading as MdastHeading } from 'mdast'


// Returns heading level based on match result of heading line (counting #)-
export function levelOfHeading(match: RegExpExecArray): number {
    return (match[1]?.length ?? 0) + 1
}

// Returns the index of the heading to which the line belongs
export function getIndexOfCurrentHeading(headings: HeadingCache[], line: number): number|null {
    for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].position.start.line <= line)
            return i
    }
    return null
}

// Returns start and end+1 line of branch rooted by the heading to which the line belongs
export function getLineRangeOfBranch(headings: HeadingCache[], line: number): [number, number|null] {
    const currentHeadingIndex = getIndexOfCurrentHeading(headings, line)!
    let level = headings[currentHeadingIndex].level
    let next: HeadingCache|null = null
    for (let i = currentHeadingIndex + 1; i < headings.length; i++) {
        if (headings[i].level <= level) {
            next = headings[i]
            break
        }
    }
    return [headings[currentHeadingIndex].position.start.line, next ? next.position.start.line : null]
}

// Returns start and end+1 line of branch before the branch rooted by the heading to which the line belongs
export function getLineRangeOfPreviousBranch(headings: HeadingCache[], line: number): [number, number]|null {
    const currentHeadingIndex = getIndexOfCurrentHeading(headings, line)
    if (!currentHeadingIndex)
        return null
    let level = headings[currentHeadingIndex].level
    let root: HeadingCache|null = null
    for (let i = currentHeadingIndex - 1; i >= 0; i--) {
        if (headings[i].level <= level) {
            root = headings[i]
            break
        }
    }
    if (!root || root.level < level)
        return null
    return [root.position.start.line, headings[currentHeadingIndex].position.start.line]
}

// Returns headings of branch starting on rootLine
export function getBranch(headings: HeadingCache[], rootLine: number): HeadingCache[] {
    const [start, end] = getLineRangeOfBranch(headings, rootLine)
    return headings.filter((heading) => {
        return heading.position.start.line >= start && (!end || heading.position.start.line < end)
    })
}

// Returns the previous heading with level <= maxLevel.
export function getPreviousHeading(headings: HeadingCache[], line: number, maxLevel?: number|null): HeadingCache|null {
    let previousHeading: HeadingCache|null = null
    headings.every((heading) => {
        if (heading.position.start.line >= line)
            return false
        if (!maxLevel || heading.level <= maxLevel)
            previousHeading = heading
        return true
    })
    return previousHeading
}

// export function getAllFoldableLines(editor: Editor): FoldPosition[] {
//     if (this.app.vault.getConfig("legacyEditor")) {
//       const foldOpts = editor.cm.state.foldGutter.options
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const getFoldRegion = (editor.cm as any).foldOption(foldOpts, "rangeFinder")

//       const foldPositions: FoldPosition[] = []
//       for (let lineNum = 0; lineNum <= editor.lastLine(); lineNum++) {
//         // @ts-ignore
//         const foldRegion = getFoldRegion(editor.cm, CodeMirror.Pos(lineNum, 0))
//         if (foldRegion) {
//           foldPositions.push({
//             from: foldRegion.from.line,
//             to: foldRegion.to.line,
//           });
//         }
//       }
//       return foldPositions
//     }

//     const foldPositions: FoldPosition[] = [];
//     for (let lineNum = 0; lineNum <= editor.lastLine(); lineNum++) {
//       const linePos = editor.posToOffset({ line: lineNum, ch: 0 });
//       const foldRegion = foldable(editor.cm.state, linePos, linePos);
//       if (foldRegion) {
//         const foldStartPos = editor.offsetToPos(foldRegion.from);
//         const foldEndPos = editor.offsetToPos(foldRegion.to);
//         foldPositions.push({
//           from: foldStartPos.line,
//           to: foldEndPos.line,
//         });
//       }
//     }
//     return foldPositions;
// }

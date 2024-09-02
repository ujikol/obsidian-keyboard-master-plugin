import { Editor, FoldPosition, HeadingCache } from 'obsidian'
import { foldable } from "@codemirror/language"
import { Node, Heading as MdastHeading } from 'mdast'

function getIndexOfCurrentHeading(tree: Node[], cursorLine: number): number {
    return tree.findIndex((node) => {
        return node.type === "heading" && node.position!.start.line - 1 === cursorLine
    })
}

export function getLineRangeOfPreviousBranch(tree: Node[], cursorLine: number): [number, number]|null {
    const currentHeadingIndex = getIndexOfCurrentHeading(tree, cursorLine)
    var depth = (tree[currentHeadingIndex] as MdastHeading).depth
    const root = tree.slice(0, currentHeadingIndex).findLast((node) => {
        return node.type === "heading" && (node as MdastHeading).depth <= depth
    })
    if (!root || (root as MdastHeading).depth < depth)
        return null
    return [root.position!.start.line - 1, cursorLine]
}

export function getLineRangeOfBranch(tree: Node[], rootLine: number): [number, number|null] {
    const currentHeadingIndex = getIndexOfCurrentHeading(tree, rootLine)
    var depth = (tree[currentHeadingIndex] as MdastHeading).depth
    const next = tree.slice(currentHeadingIndex + 1).find((node) => {
        return node.type === "heading" && (node as MdastHeading).depth <= depth
    })
    return [tree[currentHeadingIndex].position!.start.line - 1,
            next ? next.position!.start.line - 1 : null]
}

export function getBranch(tree: Node[], cursorLine: number): MdastHeading[] {
    const [start, end] = getLineRangeOfBranch(tree, cursorLine)
    return tree.filter((node) => {
        return node.type === "heading" &&
               node.position!.start.line > start &&
               (!end || node.position!.start.line <= end)
    }) as MdastHeading[]
}

export function getPreviousHeading(tree: Node[], cursorLine: number, depth?: number|null): MdastHeading|null {
    let heading: MdastHeading|null = null
    tree.every((node) => {
        if (node.position!.start.line > cursorLine)
            return false
        if (node.type === "heading" && (!depth || (node as MdastHeading).depth <= depth))
            heading = node as MdastHeading
        return true
    })
    return heading
}

export function depthOfHeading(match: RegExpExecArray): number {
    return match[1]?.length ?? 0 + 1
}

export function getAllFoldableLines(editor: Editor): FoldPosition[] {
    if (this.app.vault.getConfig("legacyEditor")) {
      const foldOpts = editor.cm.state.foldGutter.options
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getFoldRegion = (editor.cm as any).foldOption(foldOpts, "rangeFinder")

      const foldPositions: FoldPosition[] = []
      for (let lineNum = 0; lineNum <= editor.lastLine(); lineNum++) {
        // @ts-ignore
        const foldRegion = getFoldRegion(editor.cm, CodeMirror.Pos(lineNum, 0))
        if (foldRegion) {
          foldPositions.push({
            from: foldRegion.from.line,
            to: foldRegion.to.line,
          });
        }
      }
      return foldPositions
    }

    const foldPositions: FoldPosition[] = [];
    for (let lineNum = 0; lineNum <= editor.lastLine(); lineNum++) {
      const linePos = editor.posToOffset({ line: lineNum, ch: 0 });
      const foldRegion = foldable(editor.cm.state, linePos, linePos);
      if (foldRegion) {
        const foldStartPos = editor.offsetToPos(foldRegion.from);
        const foldEndPos = editor.offsetToPos(foldRegion.to);
        foldPositions.push({
          from: foldStartPos.line,
          to: foldEndPos.line,
        });
      }
    }
    return foldPositions;
}

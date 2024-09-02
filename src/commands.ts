import { Command, Editor, EditorChange, Notice, MarkdownView, HeadingCache } from 'obsidian'
import { MyPluginInterface } from "./types.d"
import { getPreviousHeading, getBranch, getLineRangeOfBranch, getLineRangeOfPreviousBranch,
    depthOfHeading, getAllFoldableLines } from "./util"
import { fromMarkdown } from 'mdast-util-from-markdown'
import { Heading as MdastHeading } from 'mdast' 

const HeadingRegex = /^#(#{0,5})?\s+/


export const gotoPreviousHeading = (plugin: MyPluginInterface): Command => ({
    id: 'goto-previous-heading',
    name: 'Goto previous heading',
    hotkeys: [{ modifiers: ["Alt"], key: "ArrowUp" }],
    editorCallback: (editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        const tree = fromMarkdown(editor.getValue()).children
        const depth = match ? depthOfHeading(match) : null
        const heading = getPreviousHeading(tree, cursor.line, depth)
        if (heading)
            editor.setCursor((heading as MdastHeading).position!.start.line - 1)
    }
})

export const gotoNextHeading = (plugin: MyPluginInterface): Command => ({
    id: 'goto-next-heading',
    name: 'Goto next heading',
    hotkeys: [{ modifiers: ["Alt"], key: "ArrowDown" }],
    editorCallback: (editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        const tree = fromMarkdown(editor.getValue()).children
        let depth = 1
        if (match)
            depth = depthOfHeading(match)
        else {
            const previousHeading = getPreviousHeading(tree, cursor.line, null)
            if (previousHeading)
                depth = previousHeading.depth + 1
        }
        const heading = tree.find((node) => {
            return (node.position!.start.line > cursor.line + 1) &&
                   (node.type === "heading" &&
                   ((node as MdastHeading).depth <= depth))
        })
        if (heading)
            editor.setCursor((heading as MdastHeading).position!.start.line - 1)
    }
})

export const demoteHeadingCommand = (plugin: MyPluginInterface): Command => ({
    id: 'demote-heading',
    name: 'Demote heading',
    hotkeys: [{ modifiers: ["Alt"], key: "ArrowRight" }],
    editorCheckCallback: (checking: boolean, editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        if (match) {
            if (!checking) {
                if (depthOfHeading(match) >= 6) {
                    new Notice("Demoting heading would exceed maximum depth of 6!")
                    return false
                }
                editor.replaceRange("#", { line: cursor.line, ch: 0 })
            }
            return true
        }
        return false
    }
})

export const promoteHeadingCommand = (plugin: MyPluginInterface): Command => ({
    id: 'promote-heading',
    name: 'Promote heading',
    hotkeys: [{ modifiers: ["Alt"], key: "ArrowLeft" }],
    editorCheckCallback: (checking: boolean, editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        if (match && match[1]) {
            if (!checking) {
                editor.replaceRange("", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: 1 })
            }
            return true
        }
        return false
    }
})

export const demoteBranchCommand = (plugin: MyPluginInterface): Command => ({
    id: 'demote-branch',
    name: 'Demote branch',
    hotkeys: [{ modifiers: ["Alt", "Shift"], key: "ArrowRight" }],
    editorCheckCallback: (checking: boolean, editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        if (match) {
            if (!checking) {
                const tree = fromMarkdown(editor.getValue()).children
                const headings = getBranch(tree, cursor.line)
                if (Math.max(...headings.map(h => h.depth)) >= 6) {
                    new Notice("Demoting branch would exceed maximum depth of 6!")
                    return false // demoting level 6 headings would break them
                }
                let changes: EditorChange[] = []
                headings.forEach((heading) => {
                    changes.push({from: {line: heading.position!.start.line - 1, ch: 0}, text: "#"})
                })
                editor.transaction({
                    changes: changes
                })
            }
            return true
        }
        return false
    }
})

export const promoteBranchCommand = (plugin: MyPluginInterface): Command => ({
    id: 'promote-branch',
    name: 'Promote branch',
    hotkeys: [{ modifiers: ["Alt", "Shift"], key: "ArrowLeft" }],
    editorCheckCallback: (checking: boolean, editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        if (match && match[1]) {
            if (!checking) {
                const tree = fromMarkdown(editor.getValue()).children
                const headings = getBranch(tree, cursor.line)
                let changes: EditorChange[] = []
                headings.forEach((heading) => {
                    changes.push({from: {line: heading.position!.start.line - 1, ch: 0},
                                  to: {line: heading.position!.start.line - 1, ch: 1},
                                  text: "", })
                })
                editor.transaction({
                    changes: changes
                })
            }
            return true
        }
        return false
    }
})

export const moveBranchUpCommand = (plugin: MyPluginInterface): Command => ({
    id: 'move-branch-up',
    name: 'Move branch up',
    hotkeys: [{ modifiers: ["Alt", "Shift"], key: "ArrowUp" }],
    editorCheckCallback: (checking: boolean, editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        if (match) {
            if (!checking) {
                const tree = fromMarkdown(editor.getValue()).children
                let [currentBranchStartLine, currentBranchEndLine] = getLineRangeOfBranch(tree, cursor.line)
                if (!currentBranchEndLine)
                    currentBranchEndLine = editor.lineCount()
                const prevBranchLineRange = getLineRangeOfPreviousBranch(tree, cursor.line)
                if (!prevBranchLineRange)
                    return false
                const branchText = editor.getRange({line: currentBranchStartLine, ch: 0}, {line: currentBranchEndLine, ch: 0})
                let changes: EditorChange[] = [
                    {from: {line: currentBranchStartLine, ch: 0}, to: {line: currentBranchEndLine, ch: 0}, text: ""},
                    {from: {line: prevBranchLineRange[0], ch: 0}, text: branchText},
                ]
                editor.transaction({
                    changes: changes,
                    selection: {from: {line: prevBranchLineRange[0], ch: cursor.ch}}
                })
            }
            return true
        }
        return false
    }
})

export const moveBranchDownCommand = (plugin: MyPluginInterface): Command => ({
    id: 'move-branch-down',
    name: 'Move branch down',
    hotkeys: [{ modifiers: ["Alt", "Shift"], key: "ArrowDown" }],
    editorCheckCallback: (checking: boolean, editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        if (match) {
            if (!checking) {
                const tree = fromMarkdown(editor.getValue()).children
                const [currentBranchStartLine, currentBranchEndLine] = getLineRangeOfBranch(tree, cursor.line)
                if (!currentBranchEndLine)
                    return false
                let [nextBranchStartLine, nextBranchEndLine] = getLineRangeOfBranch(tree, currentBranchEndLine)!
                if (depthOfHeading(match) !== depthOfHeading(HeadingRegex.exec(editor.getLine(nextBranchStartLine))!))
                    return false
                if (!nextBranchEndLine)
                    nextBranchEndLine = editor.lineCount()
                const needsNewLine = nextBranchEndLine === editor.lineCount() && editor.getLine(nextBranchEndLine - 1) !== ""
                const branchText = (needsNewLine ? "\n" : "") + editor.getRange({line: currentBranchStartLine, ch: 0}, {line: currentBranchEndLine, ch: 0})
                let changes: EditorChange[] = [
                    {from: {line: currentBranchStartLine, ch: 0}, to: {line: currentBranchEndLine, ch: 0}, text: ""},
                    {from: {line: nextBranchEndLine, ch: 0}, text: branchText},
                ]
                editor.transaction({
                    changes: changes,
                    selection: {from: {line: currentBranchStartLine - nextBranchStartLine + nextBranchEndLine -
                        (!needsNewLine && nextBranchEndLine === editor.lineCount() ? 1 : 0), ch: cursor.ch}}
                })
            }
            return true
        }
        return false
    }
})

export const copyBranchCommand = (plugin: MyPluginInterface): Command => ({
    id: 'copy-branch',
    name: 'Copy branch',
    hotkeys: [{ modifiers: ["Alt"], key: "C" }],
    editorCheckCallback: (checking: boolean, editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        if (match) {
            if (!checking) {
                const tree = fromMarkdown(editor.getValue()).children
                let [currentBranchStartLine, currentBranchEndLine] = getLineRangeOfBranch(tree, cursor.line)
                if (!currentBranchEndLine)
                    currentBranchEndLine = editor.lineCount()
                const branchText = editor.getRange({line: currentBranchStartLine, ch: 0}, {line: currentBranchEndLine, ch: 0})
                navigator.clipboard.writeText(branchText)
                new Notice("Copied branch to clipboard.")
                // let changes: EditorChange[] = [
                //     {from: {line: currentBranchStartLine, ch: 0}, to: {line: currentBranchEndLine, ch: 0}, text: ""},
                //     {from: {line: prevBranchLineRange[0], ch: 0}, text: branchText},
                // ]
                // editor.transaction({
                //     changes: changes,
                //     selection: {from: {line: prevBranchLineRange[0], ch: cursor.ch}}
                // })
            }
            return true
        }
        return false
    }
})

export const cutBranchCommand = (plugin: MyPluginInterface): Command => ({
    id: 'cut-branch',
    name: 'Cut branch',
    hotkeys: [{ modifiers: ["Alt"], key: "X" }],
    editorCheckCallback: (checking: boolean, editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = HeadingRegex.exec(lineText)
        if (match) {
            if (!checking) {
                const tree = fromMarkdown(editor.getValue()).children
                let [currentBranchStartLine, currentBranchEndLine] = getLineRangeOfBranch(tree, cursor.line)
                if (!currentBranchEndLine)
                    currentBranchEndLine = editor.lineCount()
                const branchText = editor.getRange({line: currentBranchStartLine, ch: 0}, {line: currentBranchEndLine, ch: 0})
                navigator.clipboard.writeText(branchText)
                editor.replaceRange("", {line: currentBranchStartLine, ch: 0}, {line: currentBranchEndLine, ch: 0})
                // let changes: EditorChange[] = [
                //     {from: {line: currentBranchStartLine, ch: 0}, to: {line: currentBranchEndLine, ch: 0}, text: ""},
                // ]
                // editor.transaction({
                //     changes: changes,
                //     selection: {from: {line: prevBranchLineRange[0], ch: cursor.ch}}
                // })
            }
            return true
        }
        return false
    }
})

export const pasteBranchCommand = (plugin: MyPluginInterface): Command => ({
    id: 'paste-branch',
    name: 'Paste branch',
    hotkeys: [{ modifiers: ["Alt"], key: "V" }],
    editorCallback: (editor: Editor) => {
        const cursor = editor.getCursor()
        let line = cursor.line
        const tree = fromMarkdown(editor.getValue()).children as MdastHeading[]
        const previousHeading = getPreviousHeading(tree, line + 1)
        const depth = previousHeading?.depth ?? 1
        if (previousHeading)
            line = previousHeading.position!.start.line - 1
        navigator.clipboard.readText().then((clipboardText) => {
            let branchText = clipboardText
            const match = HeadingRegex.exec(branchText)
            if (!match) {
                new Notice("No branch on clipboard!")
                return
            }
            const headings = fromMarkdown(branchText).children.filter((node) => {
                return node.type === "heading"
            }) as MdastHeading[]
            const depthOffset = depth - headings[0].depth
            if (Math.max(...headings.map(h => h.depth)) + depthOffset > 6) {
                new Notice("Pasting here would exceed maximum heading depth of 6!")
                return
            }
            editor.setCursor({line: line, ch: Math.max(1, cursor.ch)})
            editor.transaction({
                changes: [{from: {line: line, ch: 0}, text: branchText}],
            })
            let changes: EditorChange[] = []
            if (depthOffset > 0) {
                let insert = "#".repeat(depthOffset)
                headings.forEach((heading) => {
                    changes.push({from: {line: line + heading.position!.start.line - 1, ch: 0}, text: insert})
                })
            } else if (depthOffset < 0) {
                headings.slice().reverse().forEach((heading) => {
                    let l = line + heading.position!.start.line - 1
                    changes.push({from: {line: l, ch: 0}, to: {line: l, ch: -depthOffset}, text: ""})
                })
            }
            editor.transaction({
                changes: changes,
            })
            editor.setCursor({line: editor.getCursor().line, ch: cursor.ch})
        })
    }
})

export const toggleFolding = (plugin: MyPluginInterface): Command => ({
    id: 'toggle-folding',
    name: 'Toggle folding',
    hotkeys: [{ modifiers: ["Alt", "Shift"], key: "Key226" }],
    editorCallback: (editor: Editor, view: MarkdownView) => {
        const cursor = editor.getCursor()
        let line = cursor.line
        const existingFolds = view.currentMode.getFoldInfo()?.folds ?? []
        const headings = plugin.app.metadataCache.getFileCache(view.file!)?.headings || []
        const currentHeading = headings.findLast((heading) => heading.position.start.line <= line)
        if (!currentHeading)
            return
        if (currentHeading.position.start.line !== line) {
            line = currentHeading.position.start.line
            editor.setCursor(line, currentHeading.level + 1)
        }
        if (existingFolds.some((fold) => fold.from === line)) {
            // Unfold
            view.currentMode.applyFoldInfo({
                folds: existingFolds.filter((fold) => fold.from !== line),
                lines: view.editor.lineCount(),
            });
        } else {
            // Fold
            const foldPositions = [
                ...existingFolds,
                ...headings.filter((h)=> h.position.start.line === line).map((headingInfo) => ({
                    from: headingInfo.position.start.line,
                    to: headingInfo.position.start.line + 1,
                })),
            ];
            view.currentMode.applyFoldInfo({
                folds: foldPositions,
                lines: view.editor.lineCount(),
            });
        }
    }
})

export const focusFolding = (plugin: MyPluginInterface): Command => ({
    id: 'focus-folding',
    name: 'Focus folding',
    hotkeys: [{ modifiers: ["Alt"], key: "Key226" }],
    editorCallback: (editor: Editor, view: MarkdownView) => {
        const cursor = editor.getCursor()
        let line = cursor.line
        const headings = plugin.app.metadataCache.getFileCache(view.file!)?.headings || []
        const currentHeadingIndex = headings.findLastIndex((heading) => heading.position.start.line <= line)
        if (currentHeadingIndex === -1)
            return
        let focusHeadings = [headings[currentHeadingIndex]]
        let level = focusHeadings[0].level
        for (let index = currentHeadingIndex - 1; index >= 0; index--) {
            const heading = headings[index]
            if (heading.level < level) {
                focusHeadings.push(heading)
                level = heading.level
            }
        }
        const focusHeadingLines = new Set(focusHeadings.map((heading) => {
            return heading.position.start.line
        }))
        const foldPositions = [
            ...headings.filter((heading) => !focusHeadingLines.has(heading.position.start.line))
            .map((heading) => ({from: heading.position.start.line, to: heading.position.start.line + 1})),
        ];
        view.currentMode.applyFoldInfo({
            folds: foldPositions,
            lines: view.editor.lineCount(),
        })
    }
})

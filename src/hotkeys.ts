import { Editor, MarkdownView, Modifier, Notice } from 'obsidian'
import { MyPluginInterface } from "./types"

const hotkeys = [
    { keys: ["Alt", "Enter"], commands: ["quick-outliner:add-heading"]},
    { keys: ["Alt", "Home"], commands: ["quick-outliner:goto-parent-heading"]},
    { keys: ["Alt", "ArrowUp"], commands: ["quick-outliner:goto-previous-branch", "editor:table-row-before"]},
    { keys: ["Alt", "ArrowDown"], commands: ["quick-outliner:goto-next-branch", "editor:table-row-after"]},
    { keys: ["Alt", "ArrowLeft"], commands: ["quick-outliner:promote-heading", "editor:table-col-before"]},
    { keys: ["Alt", "ArrowRight"], commands: ["quick-outliner:demote-heading", "editor:table-col-after"]},
    { keys: ["Alt", "Shift", "ArrowUp"], commands: ["quick-outliner:move-branch-up", "editor:table-row-up", "editor:swap-line-up"]},
    { keys: ["Alt", "Shift", "ArrowDown"], commands: ["quick-outliner:move-branch-down", "editor:table-row-down", "editor:swap-line-down"]},
    { keys: ["Alt", "Shift", "ArrowLeft"], commands: ["quick-outliner:promote-branch", "editor:table-col-left"]},
    { keys: ["Alt", "Shift", "ArrowRight"], commands: ["quick-outliner:demote-branch", "editor:table-col-right"]},
    { keys: ["Alt", "X"], commands: ["quick-outliner:cut-branch"]},
    { keys: ["Alt", "C"], commands: ["quick-outliner:copy-branch"]},
    { keys: ["Alt", "V"], commands: ["quick-outliner:paste-branch"]},
    { keys: ["Alt", "Key226"], commands: ["quick-outliner:focus-folding"]},
    { keys: ["Alt", "Shift", "Key226"], commands: ["quick-outliner:toggle-folding"]},
    { keys: ["Alt", "Backspace"], commands: ["editor:table-row-delete"]},
    { keys: ["Alt", "Delete"], commands: ["editor:table-col-delete"]},
]
export function addHotkeys(plugin: MyPluginInterface) {
    hotkeys.forEach(h => {
        plugin.addCommand({
            id: h.keys.map(k => k.toLowerCase()).join("-"),
            name: h.keys.join(" "),
            hotkeys: [{ modifiers: h.keys.slice(0, -1) as Modifier[], key: h.keys.slice(-1)[0] }],
            editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
                return h.commands.some(c => {
                    const command = (plugin.app as any).commands.editorCommands[c]
                    if (!command) {
                        new Notice(`Error: Command ${c} does not exist.`)
                        return false
                    }
                    let callback: Function = command.editorCheckCallback
                    if (callback)
                        return callback(checking, editor, view)
                    else {
                        if (checking)
                            return true
                        else {
                            command.editorCallback(editor, view)
                            return true
                        }
                    }
                })
            }
        })
    })
}

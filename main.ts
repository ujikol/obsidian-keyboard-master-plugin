import { Plugin } from 'obsidian'
import { addHeading, gotoPreviousBranch, gotoNextBranch, gotoParentHeading, demoteHeadingCommand, promoteHeadingCommand, demoteBranchCommand, promoteBranchCommand,
	moveBranchUpCommand, moveBranchDownCommand, copyBranchCommand, cutBranchCommand, pasteBranchCommand, toggleFolding, focusFolding } from "src/commands"
import { addHotkeys } from "src/hotkeys"


export default class MyPlugin extends Plugin {

	async onload() {
		// this.registerEditorExtension(this)
		this.addCommand(gotoPreviousBranch(this))
		this.addCommand(gotoNextBranch(this))
		this.addCommand(gotoParentHeading(this))
		this.addCommand(demoteHeadingCommand(this))
		this.addCommand(promoteHeadingCommand(this))
		this.addCommand(demoteBranchCommand(this))
		this.addCommand(promoteBranchCommand(this))
		this.addCommand(moveBranchUpCommand(this))
		this.addCommand(moveBranchDownCommand(this))
		this.addCommand(copyBranchCommand(this))
		this.addCommand(cutBranchCommand(this))
		this.addCommand(pasteBranchCommand(this))
		this.addCommand(toggleFolding(this))
		this.addCommand(focusFolding(this))
		this.addCommand(addHeading(this))
		addHotkeys(this)
	}

	onunload() {

	}
}

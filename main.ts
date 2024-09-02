import { Plugin } from 'obsidian'
import { gotoPreviousHeading, gotoNextHeading, demoteHeadingCommand, promoteHeadingCommand, demoteBranchCommand, promoteBranchCommand,
	moveBranchUpCommand, moveBranchDownCommand, copyBranchCommand, cutBranchCommand, pasteBranchCommand, toggleFolding, focusFolding } from "src/commands"


export default class MyPlugin extends Plugin {

	async onload() {
		// this.registerEditorExtension(this)
		this.addCommand(gotoPreviousHeading(this))
		this.addCommand(gotoNextHeading(this))
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
	}

	onunload() {

	}
}

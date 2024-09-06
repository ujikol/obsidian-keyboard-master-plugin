# Obsidian Quick Outliner Plugin

This plugin allows to restructure your documents on the fly.

## Features

It provides (*keyboard*) commands for:
- Goto previous/next heading (staying on same level within branch and walk higher when going beyond)
- Goto parent heading
- Demote/promote a heading
- Demote/promote a branch (heading with all sub-headings)
- Move branch up/down (within parent heading)
- Cut/copy/paste branch (adjusting levels)
- Adjust all foldings to focus on relevant structural context
- Toggle folding of heading
- Add heading of same level below this branch

## Motivation

Restructuring a document is an integral part of authoring documents. Reorganizing topics and subtopics should not interupt to process of capturing content. This becomes even more important when you are capturing result of discussing or writing minutes during a meeting.

And even for an initial draft of the structure, why should I do this with bullet lists first, which I have to change to headings later?

The core graphical outline view is too separated, too limitted, too slow.

## Settings

Currently there are no settings.

## Keyboard shortcuts

Currently following keyboard shortcuts are set when the plugin is activated:

| **Shortcut** | **Command** |
| --- | --- |
| Alt Up | Goto previous heading |
| Alt Down | Goto next heading |
| Alt Home | Goto parent heading |
| Shift Alt Up | Move branch up |
| Shift Alt Down | Move branch down |
| Alt Left | Promote heading |
| Alt Right | Demote heading |
| Shift Alt Left | Promote branch |
| Shift Alt Right | Demote branch |
| Alt X | Cut branch |
| Alt C | Copy branch |
| Alt V | Paste branch |
| Alt < [^1] | Focus foldings |
| Shift Alt < | Toggle Folding |
| Alt Enter | Add heading below (as sibling) |

[^1]: on German keyboard; It is the key right of LeftShift.

## Recommendation

Add a CSS snippet, which indents according to outline.
```
/* Shift left all headings in the gutter in order to make them more distinguishable from text bodies in Editing and Reading modes. */
/* NOTE : `:not(.callout-content)` is used to exclude headings contained in callout boxes */
.HyperMD, 
:not(.callout-content) > h1,
:not(.callout-content) > h2,
:not(.callout-content) > h3,
:not(.callout-content) > h4,
:not(.callout-content) > h5,
:not(.callout-content) > h6 {
  position: relative;
}
h1, .HyperMD-header-1 {
  left: -60px;
}
h2, .HyperMD-header-2 {
  left: -50px;
}
h3, .HyperMD-header-3 {
  left: -40px;
}
h4, .HyperMD-header-4 {
  left: -30px;
}
h5, .HyperMD-header-5 {
  left: -20px;
}
h6, .HyperMD-header-6 {
  left: -10px;
}
div.markdown-preview-view,
div.markdown-source-view div.cm-content { /* This is used to center note considering shifted titles */
  padding-left: 60px !important;
  padding-right: 20px !important;
}
```
It would be great if somebody could recommend a better one, which indents the paragraphs according to the heading level.

## Roadmap

1. Add actions in settings to add/remove default keyboard shortcuts.

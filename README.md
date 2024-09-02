# Obsidian Sample Plugin

This plugin allows to restructure your documents on the fly. It provides (*keyboard*) commands for:
- Goto previous/next heading (staying on same level within branch and walk higher when going beyond)
- Demote/promote a heading
- Demote/promote a branch (heading with all sub-headings)
- Move branch up/down (within parent heading)
- Cut/copy/paste branch (adjusting levels)
- Adjust all foldings to focus on relevant structural context
- Toggle folding of heading

Currently there are no settings.

Following keyboard shortcuts are set:
| **Shortcut** | **Command** |
| --- | --- |
| Alt Up | Goto previous heading |
| Alt Down | Goto next heading |
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

[^1]: on German keyboard; It is the key right of LeftShift.

import { fromMarkdown } from 'mdast-util-from-markdown'
import { Heading as Heading } from 'mdast'


// Returns all headings of the text
export function getHeadings(text: string): Heading[] {
    return fromMarkdown(text).children
        .filter((heading: Heading) => heading.type === "heading") as Heading[]
}

export const getHeadingLine = (heading: Heading) => heading.position!.start.line - 1

// Returns the index of the branch to which the line belongs, -1 if before first heading
export function getBranchIndex(headings: Heading[], line: number): number {
    return headings.findLastIndex((heading: Heading) => heading.position!.start.line <= line + 1)
}

// Returns the index of the parent heading, -1 if none
export function getParentIndex(headings: Heading[], index: number): number {
    const branchDepth = headings[index].depth
    let branchIndex = index
    while (--branchIndex >= 0)
        if (headings[branchIndex].depth < branchDepth)
            break
    return branchIndex
}

// Returns the index of the previous sibling or (grand*) parent heading, -1 if none
export function getPreviousBranchIndex(headings: Heading[], index: number): number {
    const branchDepth = headings[index].depth
    let branchIndex = index
    while (--branchIndex >= 0)
        if (headings[branchIndex].depth <= branchDepth)
            break
    return branchIndex
}

// Returns the index of the next sibling or (grand*) uncle heading, -1 if none
export function getBranchEndIndex(headings: Heading[], startIndex: number): number {
    const branchDepth = headings[startIndex].depth
    let endIndex = startIndex
    while (++endIndex < headings.length)
        if (headings[endIndex].depth <= branchDepth)
            return endIndex
    return -1
}

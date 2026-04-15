/**
 * Parse markdown into typed content blocks for blog post rendering.
 *
 * Horizontal rules are dropped entirely.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, Paragraph, Heading, List, ListItem, Blockquote, Image, Text } from 'mdast';
import type { Node, Parent } from 'mdast';

export type ContentBlock =
    | { type: 'heading'; level: 2 | 3; text: string; anchor?: string }
    | { type: 'paragraph'; items: string[] }
    | { type: 'image'; src: string; alt: string }
    | { type: 'list'; ordered: boolean; items: string[] }
    | { type: 'toc'; items: { text: string; anchor: string }[] }
    | { type: 'blockquote'; text: string };

export type InlineSegment =
    | { type: 'text'; value: string }
    | { type: 'link'; text: string; url: string; draft?: boolean };

/** Parse inline markdown links from a string into structured segments.
 *  Links marked with {draft} (e.g. `[text](/url){draft}`) are parsed as draft links. */
export function parseInlineLinks(text: string): InlineSegment[] {
    const segments: InlineSegment[] = [];
    // Matches [text](url) optionally followed by {draft}
    const pattern = /\[([^\]]+)\]\(([^)]+)\)(\{draft\})?/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
        }
        const draft = !!match[3];
        segments.push({ type: 'link', text: match[1], url: match[2], draft });
        lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
        segments.push({ type: 'text', value: text.slice(lastIndex) });
    }

    return segments;
}

function getText(node: Node): string {
    switch (node.type) {
        case 'text':
            return normalizeDashes((node as Text).value);
        case 'strong': {
            const strong = node as { type: 'strong'; children: Node[] };
            return strong.children.map(getText).join('');
        }
        case 'emphasis': {
            const em = node as { type: 'emphasis'; children: Node[] };
            return em.children.map(getText).join('');
        }
        case 'link': {
            const link = node as { type: 'link'; url: string; children: Node[] };
            return `[${link.children.map(getText).join('')}](${link.url})`;
        }
        case 'break':
            return '\n';
        default: {
            if ('children' in node && Array.isArray(node.children)) {
                const parent = node as Parent;
                return parent.children.map(getText).join('');
            }
            return '';
        }
    }
}

/** Replace em-dash (U+2014) and en-dash (U+2013) with a regular hyphen. */
function normalizeDashes(text: string): string {
    return text.replace(/[\u2014\u2013]/g, '-');
}

/** Generate a URL-friendly slug from heading text. */
function slugify(text: string): string {
    return text
        .replace(/\s*\{#[^}]*\}\s*/g, '') // strip {#anchor} syntax
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')           // strip non-word chars (keeps Cyrillic via \w)
        .trim()
        .replace(/\s+/g, '-')               // spaces → hyphens
    // NOTE: Cyrillic characters pass through \w in JS regex, producing readable anchors.
    // If we want Latin-only slugs, we'd need a transliteration step.
}

function processNode(node: Node): ContentBlock[] {
    switch (node.type) {
        case 'heading': {
            const heading = node as Heading;
            if (heading.depth === 2 || heading.depth === 3) {
                const rawText = getText(heading);
                // Extract custom heading ID like {#my-anchor}
                const anchorMatch = rawText.match(/\{#([^}]+)\}/);
                const anchor = anchorMatch?.[1] ?? slugify(rawText);
                // Strip {#anchor} syntax from display text
                const text = rawText.replace(/\s*\{#[^}]*\}\s*/g, '').trim();
                return [{ type: 'heading', level: heading.depth as 2 | 3, text, anchor }];
            }
            return [];
        }

        case 'paragraph': {
            const para = node as Paragraph;
            return [{ type: 'paragraph', items: [getText(para)] }];
        }

        case 'image': {
            const img = node as Image;
            return [{ type: 'image', src: img.url, alt: img.alt ?? '' }];
        }

        case 'list': {
            const list = node as List;
            const rawItems = list.children.map((item: ListItem) => getText(item));

            // Detect TOC: if every item matches [text](#anchor), render as a toc block
            const tocPattern = /^\[([^\]]+)\]\(#[^)]+\)$/;
            if (rawItems.every(item => tocPattern.test(item))) {
                return [{
                    type: 'toc',
                    items: rawItems.map(item => {
                        const match = item.match(/^\[([^\]]+)\]\(#([^)]+)\)$/);
                        return match
                            ? { text: match[1], anchor: match[2] }
                            : { text: item, anchor: '' };
                    }),
                }];
            }

            return [
                {
                    type: 'list',
                    ordered: list.ordered ?? false,
                    items: rawItems,
                },
            ];
        }

        case 'blockquote': {
            const bq = node as Blockquote;
            const text = bq.children.map(getText).join(' ');
            return [{ type: 'blockquote', text }];
        }

        default:
            return [];
    }
}

const parser = unified().use(remarkParse).use(remarkGfm);

export function parseBlocks(markdown: string): ContentBlock[] {
    const ast = parser.parse(markdown) as Root;

    const rawBlocks: ContentBlock[] = [];
    for (const node of ast.children) {
        if (node.type === 'heading' && (node as Heading).depth === 1) {
            continue; // drop H1
        }
        if (node.type === 'thematicBreak') {
            continue; // drop HR
        }
        rawBlocks.push(...processNode(node));
    }

    return rawBlocks;
}

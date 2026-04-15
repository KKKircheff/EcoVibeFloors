import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { parseBlocks, parseInlineLinks, type ContentBlock } from '@/lib/markdown/parse-blocks';
import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import { BlogTitle } from '@/components/atoms/typography/BlogTitle';
import { BlogSubtitle } from '@/components/atoms/typography/BlogSubtitle';
import { BlogContent } from '@/components/atoms/typography/BlogContent';

interface BlogSectionRendererProps {
    /** Markdown content after the intro (intro is rendered by BlogIntroSection) */
    content: string;
}

// A "section" is a heading + its content blocks, until the next heading
type Section = {
    heading?: { level: 2 | 3; text: string; anchor?: string };
    blocks: Exclude<ContentBlock, { type: 'heading' }>[];
    isAccent: boolean;
};

// A "group" is one or more consecutive sections that share a single PageLayoutContainer.
// Accent sections (containing blockquotes) always break into their own group.
type SectionGroup = {
    sections: Section[];
    isAccent: boolean;
};

function buildSections(blocks: ContentBlock[]): Section[] {
    const sections: Section[] = [];
    let current: Section = { blocks: [], isAccent: false };

    for (const block of blocks) {
        if (block.type === 'heading') {
            if (current.heading || current.blocks.length > 0) {
                sections.push(current);
                current = { blocks: [], isAccent: false };
            }
            current.heading = { level: block.level, text: block.text, anchor: block.anchor };
        } else {
            if (block.type === 'blockquote') {
                current.isAccent = true;
            }
            current.blocks.push(block as Exclude<ContentBlock, { type: 'heading' }>);
        }
    }
    if (current.heading || current.blocks.length > 0) {
        sections.push(current);
    }

    return sections;
}

function buildGroups(sections: Section[]): SectionGroup[] {
    const groups: SectionGroup[] = [];
    let currentGroup: SectionGroup = { sections: [], isAccent: false };

    for (const section of sections) {
        if (section.isAccent) {
            // Close current non-accent group if it has content
            if (currentGroup.sections.length > 0) {
                groups.push(currentGroup);
                currentGroup = { sections: [], isAccent: false };
            }
            // Accent section gets its own group
            groups.push({ sections: [section], isAccent: true });
        } else {
            currentGroup.sections.push(section);
        }
    }
    // Push remaining non-accent sections
    if (currentGroup.sections.length > 0) {
        groups.push(currentGroup);
    }

    return groups;
}

// Background colors cycle across groups
const GROUP_BG_CYCLE = ['grey.50', 'background.paper'] as const;

export async function BlogSectionRenderer({ content }: BlogSectionRendererProps) {
    const blocks = parseBlocks(content);

    // Find where the intro ends (first H2) and split content
    let introEndIndex = blocks.length; // default: no H2 found, all is intro
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.type === 'heading' && block.level === 2) {
            introEndIndex = i;
            break;
        }
    }

    // Everything after the intro (from first H2 onward) is the body
    const bodyBlocks = blocks.slice(introEndIndex);
    if (bodyBlocks.length === 0) return null;

    const sections = buildSections(bodyBlocks);
    const groups = buildGroups(sections);

    let bgIdx = 0;

    return (
        <Stack width="100%" spacing={0}>
            {groups.map((group, gi) => {
                const bgcolor = group.isAccent
                    ? 'info.600'
                    : GROUP_BG_CYCLE[bgIdx++ % GROUP_BG_CYCLE.length];

                return (
                    <PageLayoutContainer key={gi} bgcolor='white' py={{ xs: 6, md: 10 }}>
                        <Stack spacing={6} sx={{ maxWidth: 'xl', mx: 'auto', width: '100%' }}>
                            {group.sections.map((section, si) => (
                                <Stack key={si} spacing={3}>
                                    {section.heading && section.heading.level === 2 && (
                                        <BlogTitle id={section.heading.anchor} color={group.isAccent ? 'primary.contrastText' : 'info.500'}>
                                            {section.heading.text}
                                        </BlogTitle>
                                    )}
                                    {section.heading && section.heading.level === 3 && (
                                        <BlogSubtitle id={section.heading.anchor} color={group.isAccent ? 'primary.contrastText' : 'primary.500'}>
                                            {section.heading.text}
                                        </BlogSubtitle>
                                    )}
                                    {section.blocks.map((block, bi) => (
                                        <BlockRenderer key={bi} block={block} isAccent={group.isAccent} />
                                    ))}
                                </Stack>
                            ))}
                        </Stack>
                    </PageLayoutContainer>
                );
            })}
        </Stack>
    );
}

/** Extract intro paragraphs (content before first H2) from parsed blocks */
export function extractIntroBlocks(blocks: ContentBlock[]): string[] {
    const paragraphs: string[] = [];
    for (const block of blocks) {
        if (block.type === 'heading' && block.level === 2) break;
        if (block.type === 'paragraph') {
            paragraphs.push(...block.items);
        }
    }
    return paragraphs;
}

function BlockRenderer({ block, isAccent }: { block: Exclude<ContentBlock, { type: 'heading' }>; isAccent: boolean }) {
    const textColor = isAccent ? 'primary.contrastText' : 'info.400';
    const linkColor = isAccent ? 'primary.contrastText' : 'primary.main';

    switch (block.type) {
        case 'paragraph':
            return (
                <Stack spacing={2}>
                    {block.items.map((item, i) => (
                        <BlogContent key={i} color={isAccent ? 'primary.contrastText' : undefined}>
                            <InlineContent text={item} linkColor={linkColor} />
                        </BlogContent>
                    ))}
                </Stack>
            );

        case 'image':
            return (
                <Stack
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        maxWidth: '1000px',
                        alignSelf: 'center',
                    }}
                >
                    <Image
                        src={block.src}
                        alt={block.alt}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        sizes="(min-width: 1200px) 80vw, 100vw"
                    />
                </Stack>
            );

        case 'list':
            return (
                <Stack component={block.ordered ? 'ol' : 'ul'} spacing={1} pl={3}>
                    {block.items.map((item, i) => (
                        <Typography
                            key={i}
                            component="li"
                            variant="body1"
                            color={textColor}
                            lineHeight={1.8}
                        >
                            <InlineContent text={item} linkColor={linkColor} />
                        </Typography>
                    ))}
                </Stack>
            );

        case 'toc':
            return (
                <Stack component="nav" spacing={1} pl={2}>
                    {block.items.map((item, i) => (
                        <Typography
                            key={i}
                            component="a"
                            href={`#${item.anchor}`}
                            variant="body1"
                            color={isAccent ? 'primary.contrastText' : 'primary.main'}
                            sx={{
                                textDecoration: 'none',
                                lineHeight: 1.8,
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            {item.text}
                        </Typography>
                    ))}
                </Stack>
            );

        case 'blockquote':
            return (
                <Stack
                    component="blockquote"
                    sx={{
                        borderLeft: '4px solid',
                        borderColor: isAccent ? 'primary.300' : 'secondary.main',
                        pl: 3,
                        py: 1,
                        my: 2,
                        bgcolor: isAccent ? 'info.700' : 'grey.50',
                    }}
                >
                    <BlogContent color={isAccent ? 'primary.contrastText' : undefined}>
                        <InlineContent text={block.text} linkColor={linkColor} />
                    </BlogContent>
                </Stack>
            );

        default:
            return null;
    }
}

/** Render text with inline markdown links as proper anchor elements. */
function InlineContent({ text, linkColor }: { text: string; linkColor: string }) {
    const segments = parseInlineLinks(text);
    if (segments.length === 1 && segments[0].type === 'text') return text;

    return segments.map((seg, i) => {
        if (seg.type === 'text') return seg.value || null;
        // Draft links render as plain text (target post not yet published)
        if (seg.draft) return seg.text;
        const isInternal = seg.url.startsWith('/');
        return isInternal ? (
            <Link key={i} href={seg.url} style={{ color: linkColor, textDecoration: 'underline' }}>
                {seg.text}
            </Link>
        ) : (
            <Typography
                key={i}
                component="a"
                href={seg.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: linkColor, textDecoration: 'underline' }}
            >
                {seg.text}
            </Typography>
        );
    });
}
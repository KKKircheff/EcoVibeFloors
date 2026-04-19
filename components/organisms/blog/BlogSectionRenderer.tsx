import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { parseBlocks, parseInlineLinks, type ContentBlock } from '@/lib/markdown/parse-blocks';
import { BlogTitle } from '@/components/atoms/typography/BlogTitle';
import { BlogSubtitle } from '@/components/atoms/typography/BlogSubtitle';
import { BlogContent } from '@/components/atoms/typography/BlogContent';

interface BlogSectionRendererProps {
    content: string;
}

type Section = {
    heading?: { level: 2 | 3; text: string; anchor?: string };
    blocks: Exclude<ContentBlock, { type: 'heading' }>[];
};

function buildSections(blocks: ContentBlock[]): Section[] {
    const sections: Section[] = [];
    let current: Section = { blocks: [] };

    for (const block of blocks) {
        if (block.type === 'heading') {
            if (current.heading || current.blocks.length > 0) {
                sections.push(current);
                current = { blocks: [] };
            }
            current.heading = { level: block.level, text: block.text, anchor: block.anchor };
        } else {
            current.blocks.push(block as Exclude<ContentBlock, { type: 'heading' }>);
        }
    }
    if (current.heading || current.blocks.length > 0) {
        sections.push(current);
    }

    return sections;
}

export async function BlogSectionRenderer({ content }: BlogSectionRendererProps) {
    const blocks = parseBlocks(content);

    // Body starts at the first H2
    let introEndIndex = blocks.length;
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.type === 'heading' && block.level === 2) {
            introEndIndex = i;
            break;
        }
    }

    const bodyBlocks = blocks.slice(introEndIndex);
    if (bodyBlocks.length === 0) return null;

    const sections = buildSections(bodyBlocks);

    return (
        <Stack spacing={3}>
            {sections
                .filter((section) => !section.blocks.every((b) => b.type === 'toc'))
                .map((section, si) => (
                    <Stack key={si} spacing={1.5}>
                        {section.heading?.level === 2 && (
                            <BlogTitle id={section.heading.anchor} color="info.500" py={1}>
                                {section.heading.text}
                            </BlogTitle>
                        )}
                        {section.heading?.level === 3 && (
                            <BlogSubtitle id={section.heading.anchor} color="primary.main" pb={0.5} fontWeight={500}>
                                {section.heading.text}
                            </BlogSubtitle>
                        )}
                        {section.blocks.map((block, bi) => (
                            <BlockRenderer key={bi} block={block} />
                        ))}
                    </Stack>
                ))}
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

function BlockRenderer({ block }: { block: Exclude<ContentBlock, { type: 'heading' }> }) {
    switch (block.type) {
        case 'paragraph':
            return (
                <Stack spacing={2}>
                    {block.items.map((item, i) => (
                        <BlogContent key={i} py={0}>
                            <InlineContent text={item} />
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
                        maxWidth: '900px',
                        alignSelf: 'center',
                    }}
                >
                    <Image
                        src={block.src}
                        alt={block.alt}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        sizes="(min-width: 1200px) 60vw, 100vw"
                    />
                </Stack>
            );

        case 'list':
            return (
                <Stack component={block.ordered ? 'ol' : 'ul'} spacing={0} pl={3}>
                    {block.items.map((item, i) => (
                        <Typography
                            key={i}
                            component="li"
                            variant="body1"
                            color="info.400"
                            lineHeight={1.8}
                        >
                            <InlineContent text={item} />
                        </Typography>
                    ))}
                </Stack>
            );

        case 'toc':
            // TOC is rendered in the sidebar — suppress inline rendering
            return null;

        case 'blockquote':
            return (
                <Stack
                    component="blockquote"
                    sx={{
                        borderLeft: '4px solid',
                        borderColor: 'primary.main',
                        borderRadius: '0 8px 8px 0',
                        pl: 4,
                        pr: 3,
                        py: 3,
                        my: 1,
                        bgcolor: 'primary.50',
                    }}
                >
                    <BlogContent>
                        <InlineContent text={block.text} />
                    </BlogContent>
                </Stack>
            );

        case 'table':
            return (
                <Box sx={{ overflowX: 'auto', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box
                        component="table"
                        sx={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            '& th': {
                                bgcolor: 'primary.50',
                                color: 'info.700',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                px: 2.5,
                                py: 1.5,
                                borderBottom: '2px solid',
                                borderColor: 'primary.100',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                            },
                            '& td': {
                                color: 'info.500',
                                fontSize: '0.875rem',
                                px: 2.5,
                                py: 1.5,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                verticalAlign: 'top',
                            },
                            '& tbody tr:last-child td': { borderBottom: 'none' },
                            '& tbody tr:hover td': { bgcolor: 'primary.50' },
                        }}
                    >
                        <Box component="thead">
                            <Box component="tr">
                                {block.headers.map((header, i) => (
                                    <Box key={i} component="th">
                                        <InlineContent text={header} />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <Box component="tbody">
                            {block.rows.map((row, ri) => (
                                <Box key={ri} component="tr">
                                    {row.map((cell, ci) => (
                                        <Box key={ci} component="td">
                                            <InlineContent text={cell} />
                                        </Box>
                                    ))}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            );

        default:
            return null;
    }
}

export function InlineContent({ text }: { text: string }) {
    const segments = parseInlineLinks(text);
    if (segments.length === 1 && segments[0].type === 'text') return text;

    return segments.map((seg, i) => {
        if (seg.type === 'text') return seg.value || null;
        if (seg.type === 'bold') return <strong key={i}>{seg.value}</strong>;
        if (seg.type === 'italic') return <em key={i}>{seg.value}</em>;
        if (seg.draft) return seg.text;
        const isInternal = seg.url.startsWith('/');
        return isInternal ? (
            <Link key={i} href={seg.url} style={{ color: 'inherit', textDecoration: 'underline' }}>
                {seg.text}
            </Link>
        ) : (
            <Typography
                key={i}
                component="a"
                href={seg.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'underline' }}
            >
                {seg.text}
            </Typography>
        );
    });
}

import 'server-only';
import { Stack, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BlogSectionRenderer, InlineContent } from '@/components/organisms/blog/BlogSectionRenderer';
import { BlogHeroImage } from './BlogHeroImage.section';
import { BlogSources } from '@/components/molecules/blog/BlogSources';
import { BlogCategoryBadge } from '@/components/atoms/blog/BlogCategoryBadge';
import { BlogContent } from '@/components/atoms/typography/BlogContent';
import { borderRadius } from '@/lib/styles/borderRadius';
import type { BlogCategory, BlogSource } from '@/lib/types/blog';
import type { extractPreH2Blocks } from '@/lib/markdown/parse-blocks';

interface BlogArticleBodyProps {
    contentMarkdown: string;
    heroImageUrl: string;
    alt: string;
    tags: string[];
    formattedDate: string;
    readingTimeMinutes: number;
    category: BlogCategory;
    introBlocks: ReturnType<typeof extractPreH2Blocks>;
    sources?: BlogSource[];
    locale: string;
}

export function BlogArticleBody({
    contentMarkdown,
    heroImageUrl,
    alt,
    tags,
    formattedDate,
    readingTimeMinutes,
    category,
    introBlocks,
    sources,
    locale,
}: BlogArticleBodyProps) {
    return (
        <Stack component="article" spacing={3}>
            {/* Metadata strip */}
            <Stack direction="row" justifyContent="flex-start" flexWrap="wrap" spacing={2}>
                <BlogCategoryBadge category={category} />
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarTodayIcon sx={{ fontSize: 15, color: 'info.400' }} />
                    <Typography variant="body2" color="info.400">
                        {formattedDate}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon sx={{ fontSize: 15, color: 'info.400' }} />
                    <Typography variant="body2" color="info.400">
                        {readingTimeMinutes} min
                    </Typography>
                </Stack>
            </Stack>

            {/* Hero image with tags overlay */}
            <BlogHeroImage
                src={heroImageUrl}
                alt={alt}
                tags={tags}
            />

            {/* Intro blocks: paragraphs + Накратко blockquote */}
            <Stack spacing={1.5}>
                {introBlocks.map((block, i) => {
                    if (block.type === 'paragraph') {
                        return block.items.map((text: string, j: number) => (
                            <BlogContent key={`${i}-${j}`}>
                                <InlineContent text={text} />
                            </BlogContent>
                        ));
                    }
                    if (block.type === 'blockquote') {
                        const isKeyTakeaway = /^\s*\*?\*?(Накратко|In brief|In Brief)[:\s]/.test(block.text);
                        return (
                            <Stack key={i} pt={6} pb={4}>
                                <Stack
                                    component="blockquote"
                                    className={isKeyTakeaway ? 'key-takeaway-box' : undefined}
                                    sx={{
                                        borderLeft: '4px solid',
                                        borderColor: 'primary.main',
                                        borderRadius: `0 ${borderRadius.md} ${borderRadius.md} 0`,
                                        pl: 4, pr: 3, py: 3,
                                        my: '16px !important',
                                        bgcolor: 'primary.50',
                                    }}
                                >
                                    <BlogContent><InlineContent text={block.text} /></BlogContent>
                                </Stack>
                            </Stack>
                        );
                    }
                    return null;
                })}
            </Stack>

            {/* Full article body */}
            <BlogSectionRenderer content={contentMarkdown} />

            {/* Sources — structured citations */}
            {sources && sources.length > 0 && (
                <BlogSources sources={sources} locale={locale} />
            )}
        </Stack>
    );
}

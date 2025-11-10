/**
 * MarkdownRenderer Component
 *
 * Renders markdown content with simplified, chat-friendly styling.
 * Implements two-layer memoization for optimal streaming performance:
 * 1. Block-level parsing with marked.lexer
 * 2. React.memo on individual blocks
 *
 * Features:
 * - Simple text formatting (bold, italic, lists, links)
 * - Subtle headers (no large sizes)
 * - Clean presentation for chat UI
 * - Performance-optimized for AI chat streaming responses
 */

'use client';

import React, { useMemo, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import { Link, Box } from '@mui/material';

// Custom components for chat-friendly markdown
const MarkdownComponents = {
    // Style links with MUI theme
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'primary.main', textDecoration: 'underline' }}
            {...props}
        >
            {children}
        </Link>
    ),
    // Simplified headers - just bold text with minimal size difference
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <Box component="p" sx={{ fontWeight: 600, fontSize: '1.05em', mb: 0.5, mt: 0.5 }} {...props}>
            {children}
        </Box>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <Box component="p" sx={{ fontWeight: 600, fontSize: '1.05em', mb: 0.5, mt: 0.5 }} {...props}>
            {children}
        </Box>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <Box component="p" sx={{ fontWeight: 600, fontSize: '1em', mb: 0.5, mt: 0.5 }} {...props}>
            {children}
        </Box>
    ),
    h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <Box component="p" sx={{ fontWeight: 600, fontSize: '1em', mb: 0.5, mt: 0.5 }} {...props}>
            {children}
        </Box>
    ),
    h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <Box component="p" sx={{ fontWeight: 600, fontSize: '1em', mb: 0.5, mt: 0.5 }} {...props}>
            {children}
        </Box>
    ),
    h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <Box component="p" sx={{ fontWeight: 600, fontSize: '1em', mb: 0.5, mt: 0.5 }} {...props}>
            {children}
        </Box>
    ),
    // Remove horizontal rules (render as subtle spacing)
    hr: () => <Box sx={{ my: 1 }} />,
    // Render code as plain text (no special styling for chat)
    code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
        <span {...props}>{children}</span>
    ),
    // Style paragraphs
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <Box component="p" sx={{ mb: 1, '&:last-child': { mb: 0 } }} {...props}>
            {children}
        </Box>
    ),
    // Style lists
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <Box component="ul" sx={{ mb: 1, pl: 2, mt: 0.5 }} {...props}>
            {children}
        </Box>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
        <Box component="ol" sx={{ mb: 1, pl: 2, mt: 0.5 }} {...props}>
            {children}
        </Box>
    ),
};

// Memoized markdown block to prevent unnecessary re-renders
interface MarkdownBlockProps {
    content: string;
}

const MemoizedMarkdownBlock = memo(
    ({ content }: MarkdownBlockProps) => {
        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
            >
                {content}
            </ReactMarkdown>
        );
    },
    // Only re-render if content actually changes
    (prevProps, nextProps) => prevProps.content === nextProps.content
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

// Main markdown renderer with block-level memoization
interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    // Parse content into blocks for memoization
    const blocks = useMemo(() => {
        try {
            const tokens = marked.lexer(content);
            return tokens.map((token, index) => ({
                id: `${index}-${token.type}`,
                content: token.raw || '',
            }));
        } catch (error) {
            // Fallback to rendering entire content if parsing fails
            console.error('Markdown parsing error:', error);
            return [{ id: '0-fallback', content }];
        }
    }, [content]);

    return (
        <>
            {blocks.map((block) => (
                <MemoizedMarkdownBlock key={block.id} content={block.content} />
            ))}
        </>
    );
}

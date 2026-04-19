'use client';

import { useDeferredValue, useRef, useState, useCallback } from 'react';
import { Box, Stack, TextField, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { EditOutlined as EditIcon, VisibilityOutlined as PreviewIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogMarkdownEditorProps {
    value: string;
    onChange: (markdown: string) => void;
}

type Mode = 'edit' | 'preview';

/** Toolbar that inserts markdown snippets via React state, not DOM mutation */
function Toolbar({ value, onChange, textareaRef }: {
    value: string;
    onChange: (newValue: string) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
    const insert = useCallback((snippet: string) => {
        const el = textareaRef.current;
        // Read cursor position from the DOM before React re-renders
        const start = el?.selectionStart ?? value.length;
        const end = el?.selectionEnd ?? value.length;

        const before = value.substring(0, start);
        const after = value.substring(end);
        const newValue = before + snippet + after;

        onChange(newValue);

        // Restore cursor position after React re-renders the textarea
        // using requestAnimationFrame to wait for the DOM update
        const newCursorPos = start + snippet.length;
        requestAnimationFrame(() => {
            if (el) {
                el.selectionStart = el.selectionEnd = newCursorPos;
                el.focus();
            }
        });
    }, [value, onChange, textareaRef]);

    const buttons = [
        { label: 'H2', snippet: '\n## ', title: 'Heading 2' },
        { label: 'H3', snippet: '\n### ', title: 'Heading 3' },
        { label: 'B', snippet: '**bold**', title: 'Bold' },
        { label: 'I', snippet: '*italic*', title: 'Italic' },
        { label: 'Link', snippet: '[text](url)', title: 'Insert link' },
        { label: 'Img', snippet: '![alt](src)', title: 'Insert image' },
        { label: 'List', snippet: '\n- ', title: 'Bullet list' },
        { label: 'Quote', snippet: '\n> ', title: 'Blockquote' },
    ];

    return (
        <Stack direction="row" spacing={0.5} mb={1}>
            {buttons.map((b) => (
                <Box
                    key={b.label}
                    component="button"
                    type="button"
                    title={b.title}
                    onClick={() => insert(b.snippet)}
                    sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'text.primary',
                        cursor: 'pointer',
                        bgcolor: 'grey.50',
                        '&:hover': { bgcolor: 'grey.200' },
                        fontFamily: 'monospace',
                        lineHeight: 1,
                    }}
                >
                    {b.label}
                </Box>
            ))}
        </Stack>
    );
}

const PREVIEW_STYLES = {
    '& h2': { fontSize: 20, fontWeight: 600, mt: 2, mb: 1 },
    '& h3': { fontSize: 16, fontWeight: 600, mt: 1.5, mb: 0.5 },
    '& p': { mb: 1, lineHeight: 1.7 },
    '& ul, & ol': { pl: 3, mb: 1 },
    '& li': { mb: 0.5 },
    '& blockquote': {
        borderLeft: '3px solid',
        borderColor: 'primary.main',
        pl: 2,
        ml: 0,
        color: 'text.secondary',
        fontStyle: 'italic',
    },
    '& a': { color: 'primary.main' },
    '& img': { maxWidth: '100%', borderRadius: 1 },
    '& code': {
        bgcolor: 'grey.100',
        px: 0.5,
        borderRadius: 0.5,
        fontSize: 13,
        fontFamily: 'monospace',
    },
    '& pre': {
        bgcolor: 'grey.100',
        p: 2,
        borderRadius: 1,
        overflow: 'auto',
    },
    '& table': { borderCollapse: 'collapse', width: '100%', mb: 1 },
    '& th, & td': { border: '1px solid', borderColor: 'grey.300', p: 1, fontSize: 13 },
    '& th': { bgcolor: 'grey.50', fontWeight: 600 },
};

export function BlogMarkdownEditor({ value, onChange }: BlogMarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const deferredValue = useDeferredValue(value);
    const [mode, setMode] = useState<Mode>('edit');

    return (
        <Stack spacing={1}>
            {/* Mode toggle */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <ToggleButtonGroup
                    size="small"
                    value={mode}
                    exclusive
                    onChange={(_, v: Mode | null) => v && setMode(v)}
                >
                    <ToggleButton value="edit" sx={{ px: 2 }}>
                        <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Edit
                    </ToggleButton>
                    <ToggleButton value="preview" sx={{ px: 2 }}>
                        <PreviewIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Preview
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            {/* Single pane — switches between edit and preview */}
            {mode === 'edit' ? (
                <>
                    <Toolbar value={value} onChange={onChange} textareaRef={textareaRef} />
                    <TextField
                        inputRef={textareaRef}
                        multiline
                        minRows={18}
                        maxRows={40}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        fullWidth
                        slotProps={{
                            input: {
                                sx: {
                                    fontFamily: 'monospace',
                                    fontSize: 13,
                                    lineHeight: 1.6,
                                },
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                alignItems: 'flex-start',
                            },
                        }}
                    />
                </>
            ) : (
                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        p: 3,
                        overflowY: 'auto',
                        minHeight: 400,
                        maxHeight: 600,
                        bgcolor: 'background.paper',
                    }}
                >
                    {deferredValue ? (
                        <Box sx={PREVIEW_STYLES}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {deferredValue}
                            </ReactMarkdown>
                        </Box>
                    ) : (
                        <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Nothing to preview. Switch to Edit to write content.
                        </Box>
                    )}
                </Box>
            )}
        </Stack>
    );
}
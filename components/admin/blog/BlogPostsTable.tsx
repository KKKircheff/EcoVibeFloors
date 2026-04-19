'use client';

import { useState } from 'react';
import {
    Box,
    Stack,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import {
    EditOutlined as EditIcon,
    DeleteOutlined as DeleteIcon,
    AddOutlined as AddIcon,
    CloseOutlined as CloseIcon,
    PhotoLibraryOutlined as PhotoLibraryIcon,
} from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import { BlogPost, BlogCategory } from '@/lib/types/blog';
import { BlogPostsDB } from '@/lib/firebase/db';
import { getFirebaseStorageUrl } from '@/lib/utils/getStorageUrl';
import { BlogPostForm } from './BlogPostForm';
import { StorageImagePicker } from './StorageImagePicker';
import Image from 'next/image';

interface BlogPostsTableProps {
    posts: BlogPost[];
    onPostDeleted: (slug: string) => void;
    onPostUpdated: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
    'engineered-parquet': 'Parquet',
    hybrid: 'Hybrid',
    'spc-lvt': 'SPC/LVT',
    comparison: 'Comparison',
    brand: 'Brand',
};

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'default'> = {
    published: 'success',
    draft: 'warning',
    archived: 'default',
};

type SortField = 'slug' | 'title' | 'category' | 'postType' | 'datePublished';
type SortDir = 'asc' | 'desc';

/** Hero image thumbnail with broken-image fallback */
function HeroImageThumb({ heroImage, alt }: { heroImage?: string; alt: string }) {
    const [error, setError] = useState(false);

    if (!heroImage || error) {
        return (
            <Box sx={{ width: 56, height: 42, bgcolor: 'grey.200', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontSize={9}>
                    {error ? '404' : '—'}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: 56, height: 42, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
            <Image
                src={getFirebaseStorageUrl(heroImage)}
                alt={alt}
                fill
                sizes="56px"
                style={{ objectFit: 'cover' }}
                onError={() => setError(true)}
            />
        </Box>
    );
}

function toDateStr(v: unknown): string {
    if (!v) return '—';
    if (v instanceof Date) return v.toLocaleDateString();
    if (typeof v === 'object' && v !== null && 'toDate' in v) {
        return (v as { toDate: () => Date }).toDate().toLocaleDateString();
    }
    return '—';
}

function sortPosts(posts: BlogPost[], field: SortField, dir: SortDir, locale: 'en' | 'bg'): BlogPost[] {
    return [...posts].sort((a, b) => {
        let aVal: string = '';
        let bVal: string = '';
        if (field === 'slug') { aVal = a.slug; bVal = b.slug; }
        else if (field === 'title') {
            aVal = a.translations?.[locale]?.title ?? a.translations?.bg?.title ?? '';
            bVal = b.translations?.[locale]?.title ?? b.translations?.bg?.title ?? '';
        }
        else if (field === 'category') { aVal = a.category; bVal = b.category; }
        else if (field === 'postType') { aVal = a.postType ?? ''; bVal = b.postType ?? ''; }

        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
    });
}

export function BlogPostsTable({ posts, onPostDeleted, onPostUpdated }: BlogPostsTableProps) {
    const t = useTranslations('admin.blog');
    const locale = useLocale() as 'en' | 'bg';

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortField, setSortField] = useState<SortField>('title');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editPost, setEditPost] = useState<BlogPost | null>(null);
    const [isNewPost, setIsNewPost] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);

    const handleSortClick = (field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const filtered = posts.filter((p) => {
        const matchesSearch =
            !search ||
            p.slug.toLowerCase().includes(search.toLowerCase()) ||
            (p.translations?.bg?.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (p.translations?.en?.title ?? '').toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
            categoryFilter === 'all' || p.category === categoryFilter;
        const matchesStatus =
            statusFilter === 'all' ||
            p.translations?.bg?.status === statusFilter ||
            p.translations?.en?.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const sorted = sortPosts(filtered, sortField, sortDir, locale);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        await BlogPostsDB.delete(deleteTarget.slug);
        onPostDeleted(deleteTarget.slug);
        setDeleting(false);
        setDeleteTarget(null);
    };

    const openNewPost = () => {
        setIsNewPost(true);
        setEditPost(null);
    };

    const openEditPost = (post: BlogPost) => {
        setIsNewPost(false);
        setEditPost(post);
    };

    const closeDialog = () => {
        setEditPost(null);
        setIsNewPost(false);
    };

    const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
        <TableSortLabel
            active={sortField === field}
            direction={sortField === field ? sortDir : 'asc'}
            onClick={() => handleSortClick(field)}
        >
            <Typography variant="caption" fontWeight={600}>{label}</Typography>
        </TableSortLabel>
    );

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={600}>{t('title')}</Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<PhotoLibraryIcon />}
                        onClick={() => setPickerOpen(true)}
                    >
                        {t('browseImages')}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={openNewPost}
                    >
                        {t('addPost')}
                    </Button>
                </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
                <TextField
                    placeholder={t('searchPlaceholder')}
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 260 }}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>{t('category')}</InputLabel>
                    <Select
                        value={categoryFilter}
                        label={t('category')}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <MenuItem value="all">{t('allCategories')}</MenuItem>
                        {(Object.keys(CATEGORY_LABELS) as BlogCategory[]).map((val) => (
                            <MenuItem key={val} value={val}>{CATEGORY_LABELS[val]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>{t('status')}</InputLabel>
                    <Select
                        value={statusFilter}
                        label={t('status')}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="all">{t('allStatuses')}</MenuItem>
                        <MenuItem value="published">{t('form.statuses.published')}</MenuItem>
                        <MenuItem value="draft">{t('form.statuses.draft')}</MenuItem>
                        <MenuItem value="archived">{t('form.statuses.archived')}</MenuItem>
                    </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary" alignSelf="center">
                    {t('postCount', { filtered: filtered.length, total: posts.length })}
                </Typography>
            </Stack>

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ width: 64 }} />
                            <TableCell><SortableHeader field="title" label={t('tableHeaders.title')} /></TableCell>
                            <TableCell><SortableHeader field="category" label={t('tableHeaders.category')} /></TableCell>
                            <TableCell><SortableHeader field="postType" label={t('tableHeaders.postType')} /></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.statusBg')}</Typography></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.statusEn')}</Typography></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.date')}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="caption" fontWeight={600}>{t('tableHeaders.actions')}</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorted.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('noPosts')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sorted.map((post) => (
                                <TableRow
                                    key={post.slug}
                                    hover
                                    onClick={() => openEditPost(post)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell sx={{ p: 0.5 }}>
                                        <HeroImageThumb
                                            heroImage={post.heroImage}
                                            alt={post.translations?.[locale]?.title ?? post.slug}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                                            {post.translations?.[locale]?.title ?? post.translations?.bg?.title ?? '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {CATEGORY_LABELS[post.category] ?? post.category}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {post.postType ?? '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={post.translations?.bg?.status ?? '—'}
                                            color={STATUS_COLORS[post.translations?.bg?.status ?? ''] ?? 'default'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={post.translations?.en?.status ?? '—'}
                                            color={STATUS_COLORS[post.translations?.en?.status ?? ''] ?? 'default'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {toDateStr(post.datePublished)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => { e.stopPropagation(); openEditPost(post); }}
                                                title={t('edit')}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => { e.stopPropagation(); setDeleteTarget(post); }}
                                                title={t('delete')}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit / New dialog */}
            <Dialog
                open={!!editPost || isNewPost}
                onClose={closeDialog}
                maxWidth="lg"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={600}>
                            {isNewPost
                                ? t('createPost')
                                : t('editPost', { title: editPost?.translations?.[locale]?.title ?? editPost?.slug ?? '' })}
                        </Typography>
                        <IconButton size="small" onClick={closeDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <BlogPostForm
                        key={editPost?.slug ?? 'new'}
                        initialBlogPost={isNewPost ? undefined : editPost ?? undefined}
                        onSaveSuccess={() => {
                            closeDialog();
                            onPostUpdated();
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle>{t('deleteConfirmTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('deleteConfirmText', { title: deleteTarget?.translations?.[locale]?.title ?? deleteTarget?.slug ?? '' })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>{t('cancel')}</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} /> : undefined}
                    >
                        {deleting ? t('deleting') : t('delete')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Storage image picker */}
            <StorageImagePicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
            />
        </Box>
    );
}
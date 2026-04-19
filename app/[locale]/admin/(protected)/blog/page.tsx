'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { BlogPostsDB } from '@/lib/firebase/db';
import { BlogPost, serializeBlogPost } from '@/lib/types/blog';
import { BlogPostsTable } from '@/components/admin/blog/BlogPostsTable';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        BlogPostsDB.getAll().then((result) => {
            if (result.success && result.data) {
                // Serialize Firestore Timestamps for safe client-side use
                const serialized = (result.data as unknown as Record<string, unknown>[]).map(
                    (doc) => serializeBlogPost(doc)
                );
                setPosts(serialized);
            } else {
                setError(result.error ?? 'Failed to load blog posts');
            }
            setLoading(false);
        });
    }, []);

    const handlePostDeleted = (slug: string) => {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
    };

    const handlePostUpdated = () => {
        BlogPostsDB.getAll().then((result) => {
            if (result.success && result.data) {
                const serialized = (result.data as unknown as Record<string, unknown>[]).map(
                    (doc) => serializeBlogPost(doc)
                );
                setPosts(serialized);
            }
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" pt={6}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <BlogPostsTable
            posts={posts}
            onPostDeleted={handlePostDeleted}
            onPostUpdated={handlePostUpdated}
        />
    );
}
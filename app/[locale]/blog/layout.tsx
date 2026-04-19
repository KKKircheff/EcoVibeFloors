import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import Footer from '@/components/organisms/footer/Footer';

interface BlogLayoutProps {
    children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
    return (
        <>
            {children}
            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </>
    );
}

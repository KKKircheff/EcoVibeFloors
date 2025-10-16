import 'server-only';
import { Stack } from '@mui/material';
import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import SampleBasketContent from './SampleBasketContent.section';

export default function SampleBasketPage() {
    return (
        <Stack>
            <PageLayoutContainer bgcolor="background.default" py={{ xs: 6, md: 10 }}>
                <SampleBasketContent />
            </PageLayoutContainer>
            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}

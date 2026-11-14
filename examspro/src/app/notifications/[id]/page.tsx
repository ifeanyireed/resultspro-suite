import ClientPage from './page-client';
import { MotionRise } from '@/components/ScrollRiseProvider';

export const generateStaticParams = () => [
  { id: 'placeholder' }
];

export default function Page() {
  return (
    <MotionRise>
      <ClientPage />
    </MotionRise>
  );
}

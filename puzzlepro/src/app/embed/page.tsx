import Home from '../page';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function EmbedPage() {
  return (
    <MotionRise className="w-full h-full">
      <Home />
    </MotionRise>
  );
}

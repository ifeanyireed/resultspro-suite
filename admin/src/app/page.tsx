import { redirect } from 'next/navigation';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export default function Home() {
  redirect('/overview');
  return (
    <MotionStagger className="w-full">
      <MotionRise />
    </MotionStagger>
  );
}

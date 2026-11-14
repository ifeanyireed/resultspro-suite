import { redirect } from 'next/navigation';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export default function AgentRoot() {
  redirect('/agent/dashboard');
  return (
    <MotionStagger className="w-full">
      <MotionRise />
    </MotionStagger>
  );
}

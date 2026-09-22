'use client';
import { IconClock, IconTrendingUp } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CohortCard({ cohort }: { cohort: any }) {
  const router = useRouter();

  const handleJoin = () => {
    // Save the selected cohort in a cookie (expires in 1 day)
    Cookies.set('selected_cohort_id', cohort.id, { expires: 1, path: '/' });
    router.push('/signup');
  };

  return (
    <div className="card overflow-hidden">
      <div className="h-48 bg-slate-200 relative">
         <img src={cohort.image_url || "/images/Students1.jpeg"} alt={cohort.title} className="w-full h-full object-cover" />
         <span className="absolute top-4 right-4 bg-white text-navy px-3 py-1 text-xs font-bold rounded-full shadow">
           ₦{cohort.price?.toLocaleString()}
         </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl fw-600 mb-2">{cohort.title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cohort.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted mb-6">
          <span className="flex items-center gap-1"><IconClock size={16} /> {cohort.duration_weeks} Weeks</span>
          <span className="flex items-center gap-1"><IconTrendingUp size={16} /> {cohort.difficulty_level || 'All Levels'}</span>
          {(cohort.location_type || cohort.meeting_days) && (
            <span className="flex items-center gap-1 w-full mt-1 text-xs text-slate-500">
              {cohort.location_type || 'Virtual'} • {cohort.meeting_days} {cohort.meeting_time}
            </span>
          )}
        </div>
        <button onClick={handleJoin} className="btn btn-navy w-full text-center block">
          Enroll Now
        </button>
      </div>
    </div>
  );
}

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
           {(cohort.currency === 'NGN' ? '₦' : cohort.currency === 'USD' ? '$' : cohort.currency + ' ')}{cohort.price?.toLocaleString() || '0'}
         </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl fw-600 mb-1">{cohort.title}</h3>
        {cohort.subtitle && <p className="text-xs text-navy font-semibold mb-2">{cohort.subtitle}</p>}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cohort.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted mb-6">
          <span className="flex items-center gap-1">
            <IconClock size={16} /> {cohort.duration_weeks} Weeks
          </span>
          {cohort.difficulty_level && (
            <span className="flex items-center gap-1">
              <IconTrendingUp size={16} /> {cohort.difficulty_level}
            </span>
          )}
          {cohort.start_date && (
            <span className="flex items-center gap-1 w-full mt-1 text-xs text-slate-500">
              Starts {new Date(cohort.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {(cohort.location_type || cohort.meeting_days) && (
            <span className="flex items-center gap-1 w-full text-xs text-slate-500">
              {cohort.location_type || 'Virtual'} • {cohort.meeting_days} {cohort.meeting_time}
            </span>
          )}
          
          <div className="flex items-center gap-4 w-full mt-1 text-xs text-slate-500 font-medium">
            <span className={`px-2 py-0.5 rounded-full ${cohort.status === 'ENROLLING' ? 'bg-green-100 text-green-700' : cohort.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
              {cohort.status === 'ENROLLING' ? 'Enrolling Now' : cohort.status}
            </span>
            {cohort.capacity > 0 && (
              <span>
                {Math.max(0, cohort.capacity - (cohort.enrolled_count || 0))} spots left
              </span>
            )}
          </div>
        </div>
        <button onClick={handleJoin} className="btn btn-navy w-full text-center block">
          Enroll Now
        </button>
      </div>
    </div>
  );
}

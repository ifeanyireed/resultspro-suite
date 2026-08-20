import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Layers, Award, ArrowRight } from 'lucide-react';
import { GradientMetricCard, WhiteMetricCard, WidgetCard } from '@resultspro/design-system';

export default function OverviewTab() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <GradientMetricCard
          title="Study Notes"
          value="2,450"
          subtitle="Generated content"
          trend="+12%"
          icon={BookOpen}
        />
        <WhiteMetricCard
          title="Active Quizzes"
          value="840"
          subtitle="Taken this month"
          trend="+8%"
          trendColor="green"
          icon={FileText}
        />
        <WhiteMetricCard
          title="Flashcard Decks"
          value="1,120"
          subtitle="Spaced repetition"
          trend="+15%"
          trendColor="green"
          icon={Layers}
        />
        <WhiteMetricCard
          title="Badges Awarded"
          value="4,560"
          subtitle="Gamified achievements"
          trend="+22%"
          trendColor="green"
          icon={Award}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-12 flex flex-col gap-3">
          <WidgetCard title="Classroom Operations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="group p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Content Library</h4>
                  <p className="text-xs text-slate-500 mt-1">Manage standard curriculum</p>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 transition-colors transform group-hover:translate-x-1" />
              </button>

              <button className="group p-6 bg-blue-50/50 border border-blue-200 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Quiz Reports</h4>
                  <p className="text-xs text-slate-500 mt-1">Review student performance</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
              </button>

              <button className="group p-6 bg-purple-50/50 border border-purple-200 rounded-2xl hover:bg-purple-50 transition-colors flex items-center justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">SRS Algorithm</h4>
                  <p className="text-xs text-slate-500 mt-1">Tweak flashcard repetition</p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors transform group-hover:translate-x-1" />
              </button>
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}

"use client";

import { IconSearch as Search, IconDotsVertical as MoreVertical, IconUserCheck as UserCheck, IconUserX as UserX, IconMail as Mail, IconActivity as Activity, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const usersData = [
  { id: 1, fullName: "Jessica Alabi", email: "jessica@student.com", role: "Student", school: "Lekki British School", status: "Active", lastLogin: "2 mins ago" },
  { id: 2, fullName: "Mr. Adeniyi", email: "adeniyi@teacher.com", role: "Teacher", school: "Lekki British School", status: "Active", lastLogin: "1 hour ago" },
  { id: 3, fullName: "Daniel Smith", email: "daniel@student.com", role: "Student", school: "Greenwood Hall", status: "Inactive", lastLogin: "2 days ago" },
  { id: 4, fullName: "Mrs. Olatunji", email: "olatunji@teacher.com", role: "Teacher", school: "Corona Schools", status: "Active", lastLogin: "15 mins ago" },
  { id: 5, fullName: "Funmi Williams", email: "funmi@school.com", role: "School Admin", school: "Corona Schools", status: "Active", lastLogin: "5 hours ago" },
];

export default function GlobalUserManagement() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        
        <main className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
             <Skeleton className="h-12 flex-1 rounded-xl" />
             <Skeleton className="h-12 w-40 rounded-xl" />
             <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-[32px]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      
      
      <main className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Directory</h2>
            <p className="text-sm text-gray-500">Manage all users across all schools and roles on the platform.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="border-gray-100 text-gray-900 hover:bg-gray-50">
                <UserX className="w-4 h-4 mr-2" /> Banned Users
             </Button>
             <Button className="bg-emerald-600 text-white font-bold">
                <UserCheck className="w-4 h-4 mr-2" /> Verify Users
             </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input placeholder="Search by name, email or school..." className="pl-10 h-12 bg-white shadow-sm border border-gray-100 border-gray-100 text-gray-900" />
           </div>
           <div className="flex gap-2">
              <select className="bg-white shadow-sm border border-gray-100 text-gray-900 text-sm font-bold px-4 h-12 rounded-xl outline-none focus:border-green">
                 <option>All Roles</option>
                 <option>Super Admin</option>
                 <option>School Admin</option>
                 <option>Teacher</option>
                 <option>Student</option>
                 <option>Parent</option>
              </select>
              <select className="bg-white shadow-sm border border-gray-100 text-gray-900 text-sm font-bold px-4 h-12 rounded-xl outline-none focus:border-green">
                 <option>All Status</option>
                 <option>Active</option>
                 <option>Inactive</option>
                 <option>Banned</option>
              </select>
           </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden text-sm">
           <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-gray-100 bg-white shadow-sm border border-gray-100">
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">User</th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Role</th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">School</th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Last Activity</th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Status</th>
                    <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {usersData.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-[#146ef5] border border-gray-100 flex items-center justify-center text-white font-bold">
                                {user.fullName.split(' ').map(n => n[0]).join('')}
                             </div>
                             <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{user.fullName}</h4>
                                <p className="text-[10px] text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-6">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", 
                             user.role === 'Super Admin' ? 'bg-red-500/10 text-red-500' :
                             user.role === 'School Admin' ? 'bg-purple-50 text-purple-600' :
                             user.role === 'Teacher' ? 'bg-blue-50 text-[#146ef5]' : 'bg-white shadow-sm border border-gray-100 text-gray-500'
                          )}>{user.role}</span>
                       </td>
                       <td className="p-6 text-gray-900 font-medium">{user.school}</td>
                       <td className="p-6">
                          <div className="flex items-center gap-2 text-gray-500">
                             <Activity className="w-3.5 h-3.5" />
                             <span className="text-xs">{user.lastLogin}</span>
                          </div>
                       </td>
                       <td className="p-6">
                          <span className={cn("flex items-center gap-1.5 text-xs font-bold", 
                             user.status === 'Active' ? 'text-emerald-600' : 'text-gray-500'
                          )}>
                             <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'Active' ? 'bg-emerald-600' : 'bg-white/20')} />
                             {user.status}
                          </span>
                       </td>
                       <td className="p-6 text-right">
                          <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
                             <MoreVertical className="w-5 h-5" />
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           
           {/* Pagination */}
           <div className="p-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-gray-500">Showing <span className="text-gray-900 font-bold">5</span> of <span className="text-gray-900 font-bold">12,450</span> users</p>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-100 text-gray-900 hover:bg-gray-50" disabled>
                    <ChevronLeft className="w-4 h-4" />
                 </Button>
                 <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-emerald-600 text-white border-green font-bold">1</Button>
                 <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-100 text-gray-900 hover:bg-gray-50">2</Button>
                 <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-100 text-gray-900 hover:bg-gray-50">3</Button>
                 <span className="text-gray-500">...</span>
                 <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-100 text-gray-900 hover:bg-gray-50">
                    <ChevronRight className="w-4 h-4" />
                 </Button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

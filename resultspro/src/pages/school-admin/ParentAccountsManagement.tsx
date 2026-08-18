import React, { useState, useEffect } from 'react';
import { Mail, MoreVertical, CheckCircle, Clock, Edit02, Trash01, Search } from '@/lib/hugeicons-compat';
import axiosInstance from '@/lib/axiosConfig';
import { useToast } from '@/hooks/use-toast';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Parent {
  id: string;
  userId: string;
  phoneNumber: string | null;
  address: string | null;
  occupation: string | null;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    status: string;
  };
  students: Array<{
    id: string;
    name: string;
    admissionNumber: string;
    class: {
      name: string;
    };
  }>;
}

const ParentAccountsManagement: React.FC = () => {
  const { toast } = useToast();
  const [parents, setParents] = useState<Parent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1, limit: 20 });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    occupation: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchParents = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/school/parents', {
        params: { page, limit: 20, search: searchTerm }
      });

      if (response.data.success) {
        setParents(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      console.error('Failed to fetch parents:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load parents',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [searchTerm]);

  const handleEdit = (parent: Parent) => {
    setEditingParent(parent);
    setFormData({
      firstName: parent.user.firstName || parent.user.fullName?.split(' ')[0] || '',
      lastName: parent.user.lastName || parent.user.fullName?.split(' ').slice(1).join(' ') || '',
      email: parent.user.email,
      phoneNumber: parent.phoneNumber || '',
      address: parent.address || '',
      occupation: parent.occupation || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingParent) return;

    try {
      setIsSaving(true);
      await axiosInstance.patch(`/school/parents/${editingParent.id}`, formData);

      toast({
        title: 'Success',
        description: 'Parent updated successfully',
      });
      setIsEditModalOpen(false);
      fetchParents(pagination.page);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update parent',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (parentId: string) => {
    if (!window.confirm('Are you sure you want to delete this parent? This action cannot be undone.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/school/parents/${parentId}`);

      toast({
        title: 'Success',
        description: 'Parent deleted successfully',
      });
      fetchParents(pagination.page);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete parent',
        variant: 'destructive',
      });
    }
  };

  const getParentDisplayName = (parent: Parent) => {
    if (parent.user.fullName) return parent.user.fullName;
    const nameParts = [];
    if (parent.user.firstName) nameParts.push(parent.user.firstName);
    if (parent.user.lastName) nameParts.push(parent.user.lastName);
    return nameParts.length > 0 ? nameParts.join(' ') : 'Unknown Parent';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Parent Accounts</h2>
          <p className="text-gray-400 text-sm mt-1">Manage parent accounts linked to students</p>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 flex items-center gap-2">
          <span className="text-blue-400 font-bold">{pagination.total}</span>
          <span className="text-gray-400 text-sm">Total Parents</span>
        </div>
      </div>

      {/* Parents Table */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <InlineLoadingSpinner size={40} />
              <p className="text-gray-400 mt-4">Loading parents...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/5 bg-white/2.5">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Parent Name</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Phone</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Children</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parents.length > 0 ? (
                  parents.map((parent) => (
                    <tr key={parent.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-6 text-white font-medium">
                        {getParentDisplayName(parent)}
                      </td>
                      <td className="py-4 px-6 text-gray-400">{parent.user.email}</td>
                      <td className="py-4 px-6 text-gray-400">{parent.phoneNumber || 'N/A'}</td>
                      <td className="py-4 px-6 text-white">
                        <div className="flex flex-wrap gap-1">
                          {parent.students.map((child, idx) => (
                            <span key={child.id} className="text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10">
                              {child.name} ({child.class?.name || 'Unknown'})
                            </span>
                          ))}
                          {parent.students.length === 0 && <span className="text-gray-500">None</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {parent.user.status === 'ACTIVE' ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-xs font-medium">Active</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-amber-400" />
                              <span className="text-amber-400 text-xs font-medium">{parent.user.status}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Send Email">
                            <Mail className="w-4 h-4" />
                          </button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1f2e] border-white/10 text-white">
                              <DropdownMenuItem 
                                className="focus:bg-white/5 cursor-pointer flex items-center gap-2"
                                onClick={() => handleEdit(parent)}
                              >
                                <Edit02 className="w-4 h-4 text-blue-400" />
                                <span>Edit Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="focus:bg-white/5 cursor-pointer flex items-center gap-2 text-red-400 focus:text-red-400"
                                onClick={() => handleDelete(parent.id)}
                              >
                                <Trash01 className="w-4 h-4" />
                                <span>Delete Account</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No parent accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-[#1a1f2e] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Parent Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-white/5 border-white/10 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-transparent border-white/10 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Communication Settings */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Communication Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-white">Send results via email</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-white">Send results via SMS</span>
            </label>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-white">Send portal access</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-white">Send notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAccountsManagement;

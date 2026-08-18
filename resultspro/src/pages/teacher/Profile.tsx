import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit02, Save, X, BookOpen } from '@/lib/hugeicons-compat';

const TeacherProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    bio: '',
  });

  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    // Load profile from localStorage or API
    const savedProfile = localStorage.getItem('teacherProfile');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setProfile(data);
      setEditForm(data);
    } else {
      // Default values from localStorage
      const teacherName = localStorage.getItem('teacherName') || 'Teacher User';
      const email = localStorage.getItem('email') || '';
      setProfile({
        name: teacherName,
        email: email,
        phone: '',
        department: '',
        specialization: '',
        bio: '',
      });
      setEditForm({
        name: teacherName,
        email: email,
        phone: '',
        department: '',
        specialization: '',
        bio: '',
      });
    }
  }, []);

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem('teacherProfile', JSON.stringify(editForm));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold text-white mb-6">My Profile</div>

      {/* Profile Card */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 hover:bg-white/5 transition-colors">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              <p className="text-slate-400">Teacher</p>
            </div>
          </div>
          <button
            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition text-white"
          >
            {isEditing ? (
              <>
                <X size={20} />
                Cancel
              </>
            ) : (
              <>
                <Edit02 size={20} />
                Edit
              </>
            )}
          </button>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          {/* Email */}
          <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
            <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <Mail size={16} />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full bg-[rgba(0,0,0,0.40)] text-white rounded border border-[rgba(255,255,255,0.1)] px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            ) : (
              <p className="text-white font-semibold">{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
            <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <Phone size={16} />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full bg-[rgba(0,0,0,0.40)] text-white rounded border border-[rgba(255,255,255,0.1)] px-3 py-2 focus:outline-none focus:border-blue-400 placeholder-slate-500"
              />
            ) : (
              <p className="text-white font-semibold">{profile.phone || 'Not provided'}</p>
            )}
          </div>

          {/* Department */}
          <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
            <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <BookOpen size={16} />
              Department
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                placeholder="e.g., Mathematics, English"
                className="w-full bg-[rgba(0,0,0,0.40)] text-white rounded border border-[rgba(255,255,255,0.1)] px-3 py-2 focus:outline-none focus:border-blue-400 placeholder-slate-500"
              />
            ) : (
              <p className="text-white font-semibold">{profile.department || 'Not provided'}</p>
            )}
          </div>

          {/* Specialization */}
          <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
            <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <User size={16} />
              Specialization
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.specialization}
                onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                placeholder="e.g., Calculus, Literature"
                className="w-full bg-[rgba(0,0,0,0.40)] text-white rounded border border-[rgba(255,255,255,0.1)] px-3 py-2 focus:outline-none focus:border-blue-400 placeholder-slate-500"
              />
            ) : (
              <p className="text-white font-semibold">{profile.specialization || 'Not provided'}</p>
            )}
          </div>

          {/* Bio */}
          <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
            <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <User size={16} />
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell students about yourself"
                rows={3}
                className="w-full bg-[rgba(0,0,0,0.40)] text-white rounded border border-[rgba(255,255,255,0.1)] px-3 py-2 focus:outline-none focus:border-blue-400 placeholder-slate-500 resize-none"
              />
            ) : (
              <p className="text-white font-semibold">{profile.bio || 'Not provided'}</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Changes
          </button>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8 hover:bg-white/5 transition-colors">
        <h3 className="text-xl font-bold text-white mb-4">Account Information</h3>
        <div className="space-y-3 text-sm text-slate-400">
          <div className="flex justify-between">
            <span>Account Type:</span>
            <span className="text-white font-semibold">Teacher</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-400 font-semibold">Active</span>
          </div>
          <div className="flex justify-between">
            <span>Access Level:</span>
            <span className="text-white font-semibold">Class Management & Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit02, Save, X } from '@/lib/hugeicons-compat';

const ParentProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    relationship: '',
  });

  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    // Load profile from localStorage or API
    const savedProfile = localStorage.getItem('parentProfile');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setProfile(data);
      setEditForm(data);
    } else {
      // Default values from localStorage
      const parentName = localStorage.getItem('parentName') || 'Parent User';
      const email = localStorage.getItem('email') || '';
      setProfile({
        name: parentName,
        email: email,
        phone: '',
        address: '',
        relationship: 'Parent',
      });
      setEditForm({
        name: parentName,
        email: email,
        phone: '',
        address: '',
        relationship: 'Parent',
      });
    }
  }, []);

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem('parentProfile', JSON.stringify(editForm));
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
              <p className="text-slate-400">{profile.relationship}</p>
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

          {/* Address */}
          <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
            <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <MapPin size={16} />
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                placeholder="Enter address"
                className="w-full bg-[rgba(0,0,0,0.40)] text-white rounded border border-[rgba(255,255,255,0.1)] px-3 py-2 focus:outline-none focus:border-blue-400 placeholder-slate-500"
              />
            ) : (
              <p className="text-white font-semibold">{profile.address || 'Not provided'}</p>
            )}
          </div>

          {/* Relationship */}
          <div className="bg-[rgba(0,0,0,0.40)] rounded-[15px] p-4 border border-[rgba(255,255,255,0.07)]">
            <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <User size={16} />
              Relationship to Student
            </label>
            {isEditing ? (
              <select
                value={editForm.relationship}
                onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
                className="w-full bg-[rgba(0,0,0,0.40)] text-white rounded border border-[rgba(255,255,255,0.1)] px-3 py-2 focus:outline-none focus:border-blue-400"
              >
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
                <option value="Relative">Relative</option>
              </select>
            ) : (
              <p className="text-white font-semibold">{profile.relationship}</p>
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
            <span className="text-white font-semibold">Parent/Guardian</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-400 font-semibold">Active</span>
          </div>
          <div className="flex justify-between">
            <span>Access Level:</span>
            <span className="text-white font-semibold">Student Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;

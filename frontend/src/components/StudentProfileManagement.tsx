import { useState, useEffect } from 'react';
import { User, Save, Upload, Globe, Award, Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

interface StudentProfile {
  bio: string;
  photo: string;
  phone: string;
  location: string;
  education: Array<{ institution: string; degree: string; year: number }>;
  interests: string[];
  languages: string[];
  achievements: Array<{ title: string; description: string; year: number }>;
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export default function StudentProfileManagement() {
  const [profile, setProfile] = useState<StudentProfile>({
    bio: '',
    photo: '',
    phone: '',
    location: '',
    education: [],
    interests: [],
    languages: [],
    achievements: [],
    socialLinks: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '', year: new Date().getFullYear() });
  const [newInterest, setNewInterest] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', year: new Date().getFullYear() });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = sessionStorage.getItem('token');
      // If no token, maybe redirect or just stop
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/students/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure arrays are initialized if empty from backend
        setProfile({
          ...data,
          education: data.education || [],
          interests: data.interests || [],
          languages: data.languages || [],
          achievements: data.achievements || [],
          socialLinks: data.socialLinks || {}
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/students/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);

        // Dispatch custom event to notify other components like Header
        window.dispatchEvent(new CustomEvent('profileUpdated', {
          detail: { photo: updatedProfile.photo }
        }));

        alert('Profile updated successfully!');
        setIsEditing(false); // Switch back to view mode after saving
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setProfile({
        ...profile,
        education: [...profile.education, { ...newEducation }]
      });
      setNewEducation({ institution: '', degree: '', year: new Date().getFullYear() });
    }
  };

  const removeEducation = (index: number) => {
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index)
    });
  };

  const addInterest = () => {
    if (newInterest && !profile.interests.includes(newInterest)) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(i => i !== interest)
    });
  };

  const addLanguage = () => {
    if (newLanguage && !profile.languages.includes(newLanguage)) {
      setProfile({
        ...profile,
        languages: [...profile.languages, newLanguage]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setProfile({
      ...profile,
      languages: profile.languages.filter(l => l !== lang)
    });
  };

  const addAchievement = () => {
    if (newAchievement.title && newAchievement.description) {
      setProfile({
        ...profile,
        achievements: [...profile.achievements, { ...newAchievement }]
      });
      setNewAchievement({ title: '', description: '', year: new Date().getFullYear() });
    }
  };

  const removeAchievement = (index: number) => {
    setProfile({
      ...profile,
      achievements: profile.achievements.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const renderViewMode = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header/Cover Area */}
        <div className="h-32 bg-gradient-to-r from-teal-500 to-blue-600 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-white text-teal-600 rounded-lg hover:bg-gray-100 flex items-center gap-2 font-bold shadow-lg transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              {profile.photo ? (
                <img src={profile.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center border-4 border-white shadow-md">
                  <User className="w-16 h-16 text-teal-600" />
                </div>
              )}
              <div className="pb-2">
                <h2 className="text-3xl font-bold text-gray-900">{user.name || 'New Student'}</h2>
                <div className="flex items-center gap-4 text-gray-600 mt-1">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Bio and Interests */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {profile.bio || "No bio added yet. Tell us about your learning goals!"}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-600" />
                  Education
                </h3>
                <div className="space-y-4">
                  {profile.education.length > 0 ? (
                    profile.education.map((edu, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                        <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500 font-medium mt-1">Class of {edu.year}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No education history added.</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  Achievements
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {profile.achievements.length > 0 ? (
                    profile.achievements.map((ach, idx) => (
                      <div key={idx} className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{ach.title}</h4>
                          <span className="text-sm font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                            {ach.year}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{ach.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No achievements added yet.</p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Skills, Languages, Social */}
            <div className="space-y-8">
              <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Interests & Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.length > 0 ? (
                    profile.interests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white text-teal-700 border border-teal-100 rounded-full text-sm font-medium">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">Add your interests to help AI matching!</p>
                  )}
                </div>
              </section>

              <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.length > 0 ? (
                    profile.languages.map((lang, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-medium">
                        {lang}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">Add languages you speak.</p>
                  )}
                </div>
              </section>

              <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Social Links</h3>
                <div className="space-y-3">
                  {profile.socialLinks.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition">
                      <span className="w-8 h-8 bg-white rounded flex items-center justify-center border border-gray-200">in</span>
                      <span className="text-sm font-medium">LinkedIn Profile</span>
                    </a>
                  )}
                  {profile.socialLinks.github && (
                    <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition">
                      <span className="w-8 h-8 bg-white rounded flex items-center justify-center border border-gray-200">gh</span>
                      <span className="text-sm font-medium">GitHub Profile</span>
                    </a>
                  )}
                  {profile.socialLinks.portfolio && (
                    <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-medium">Portfolio Website</span>
                    </a>
                  )}
                  {!profile.socialLinks.linkedin && !profile.socialLinks.github && !profile.socialLinks.portfolio && (
                    <p className="text-gray-500 text-sm italic">No social links added.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditMode = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <p className="text-gray-500 text-sm">Update your information to get better AI recommendations</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              loadProfile(); // Reload original data
              setIsEditing(false);
            }}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 font-semibold shadow-sm disabled:opacity-50 transition"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-4">Profile Photo</label>
        <div className="flex items-center gap-8">
          {profile.photo ? (
            <img src={profile.photo} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-teal-100 flex items-center justify-center border-4 border-white shadow-md">
              <User className="w-14 h-14 text-teal-600" />
            </div>
          )}
          <div className="space-y-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
              <span className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 w-max font-semibold shadow-sm transition">
                <Upload className="w-4 h-4" />
                Change Photo
              </span>
            </label>
            <p className="text-xs text-gray-500">Square images work best. Max size: 2MB.</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1234567890"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="City, Country"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Tell us about yourself, your goals, and what you're looking for..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
        />
      </div>

      {/* Structured Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Education Section */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-600" />
            Education
          </label>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-sm">{edu.degree}</p>
                  <p className="text-xs text-gray-500">{edu.institution} • {edu.year}</p>
                </div>
                <button onClick={() => removeEducation(idx)} className="text-red-500 hover:text-red-700 p-1">
                  ×
                </button>
              </div>
            ))}
            <div className="pt-2 space-y-2">
              <input
                type="text"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                placeholder="Institution"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  placeholder="Degree"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="number"
                  value={newEducation.year}
                  onChange={(e) => setNewEducation({ ...newEducation, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button onClick={addEducation} className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Achievements
          </label>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
            {profile.achievements.map((ach, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-sm">{ach.title} ({ach.year})</p>
                  <p className="text-xs text-gray-500">{ach.description}</p>
                </div>
                <button onClick={() => removeAchievement(idx)} className="text-red-500 hover:text-red-700 p-1">
                  ×
                </button>
              </div>
            ))}
            <div className="pt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  placeholder="Achievement Title"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="number"
                  value={newAchievement.year}
                  onChange={(e) => setNewAchievement({ ...newAchievement, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="flex gap-2">
                <input
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  placeholder="Short description"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button onClick={addAchievement} className="px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm font-bold">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Interests & Languages */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Interests</label>
            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white text-teal-700 border border-teal-100 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    {interest}
                    <button onClick={() => removeInterest(interest)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  placeholder="Add skill or interest"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button onClick={addInterest} className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold">Add</button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Languages</label>
            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.languages.map((lang, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white text-blue-700 border border-blue-100 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    {lang}
                    <button onClick={() => removeLanguage(lang)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                  placeholder="Add language"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button onClick={addLanguage} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700">Social Presence</label>
          <div className="space-y-4 p-4 border border-gray-100 rounded-2xl bg-gray-50">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase px-1">LinkedIn</label>
              <input
                type="url"
                value={profile.socialLinks.linkedin || ''}
                onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase px-1">GitHub</label>
              <input
                type="url"
                value={profile.socialLinks.github || ''}
                onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })}
                placeholder="https://github.com/yourusername"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Portfolio</label>
              <input
                type="url"
                value={profile.socialLinks.portfolio || ''}
                onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, portfolio: e.target.value } })}
                placeholder="https://yourportfolio.me"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 fade-in">
      {isEditing ? renderEditMode() : renderViewMode()}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Book, BookOpen, Edit2, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi, bookApi } from '../services/api';

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'history'>('profile');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    dominant_trait: '',
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const response = await userApi.getProfile();
          setProfile(response.data);
          setEditForm({
            bio: response.data.bio || '',
            dominant_trait: response.data.dominant_trait || '',
          });
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [isAuthenticated]);

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userApi.updateProfile({
        ...profile,
        ...editForm,
      });
      setProfile(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <UserCircle size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">You're not logged in</h2>
        <p className="text-gray-600 mb-6">
          Please log in to view your profile, preferences, and reading history.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            onClick={() => window.location.href = '/login'}
          >
            Log In
          </button>
          <button 
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => window.location.href = '/register'}
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-t-lg"></div>
          <div className="bg-white rounded-b-lg p-6">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full -mt-16 border-4 border-white"></div>
              <div className="ml-4 flex-grow">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="mt-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 h-32 rounded-t-lg relative"></div>
      
      <div className="bg-white rounded-b-lg shadow-md relative mb-8">
        <div className="px-6 pt-0 pb-6">
          {/* Profile picture and name */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full -mt-12 border-4 border-white flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={72} className="text-gray-400" />
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <h1 className="text-2xl font-serif font-bold text-gray-800">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-auto">
              <button 
                onClick={() => setEditing(true)}
                className="inline-flex items-center text-amber-700 hover:text-amber-900"
              >
                <Edit2 size={16} className="mr-1" /> Edit Profile
              </button>
            </div>
          </div>
          
          {/* Reading stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Books Read</p>
              <p className="text-2xl font-bold text-amber-700">{profile.books_read}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Currently Reading</p>
              <p className="text-2xl font-bold text-amber-700">1</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Reading Personality</p>
              <p className="text-amber-700 font-medium">
                {profile.dominant_trait ? profile.dominant_trait.charAt(0).toUpperCase() + profile.dominant_trait.slice(1) : 'Not set'}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Member Since</p>
              <p className="text-amber-700 font-medium">April 2025</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            className={`inline-block py-4 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`inline-block py-4 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'preferences'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Reading Preferences
          </button>
          <button
            className={`inline-block py-4 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Reading History
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {activeTab === 'profile' && (
          <div>
            {editing ? (
              <form onSubmit={handleSubmitEdit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={editForm.bio}
                    onChange={handleEditFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={4}
                    placeholder="Tell us about yourself and your reading interests..."
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dominant_trait">
                    Reading Personality
                  </label>
                  <select
                    id="dominant_trait"
                    name="dominant_trait"
                    value={editForm.dominant_trait}
                    onChange={handleEditFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select personality trait</option>
                    <option value="introvert">Introvert</option>
                    <option value="extrovert">Extrovert</option>
                    <option value="analytical">Analytical</option>
                    <option value="creative">Creative</option>
                    <option value="practical">Practical</option>
                    <option value="adventurous">Adventurous</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4">About Me</h2>
                <p className="text-gray-700 mb-6">
                  {profile.bio || "You haven't added a bio yet. Click 'Edit Profile' to add one."}
                </p>
                
                <h2 className="text-xl font-bold text-gray-800 mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <button className="text-amber-700 hover:text-amber-900">Change Password</button>
                  </div>
                  <div>
                    <button className="text-amber-700 hover:text-amber-900">Email Notification Settings</button>
                  </div>
                  <div>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        if (confirm('Are you sure you want to log out?')) {
                          logout();
                        }
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'preferences' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Reading Preferences</h2>
            
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Fantasy</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Science Fiction</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Mystery</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">+ Add More</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">Reading Complexity</h3>
              <div className="flex items-center">
                <span className="text-gray-600 text-sm mr-4">Easy</span>
                <div className="flex-grow h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-amber-600 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-gray-600 text-sm ml-4">Challenging</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">Reading Personality</h3>
              <p className="text-gray-600">
                {profile.dominant_trait 
                  ? `Your dominant trait is: ${profile.dominant_trait.charAt(0).toUpperCase() + profile.dominant_trait.slice(1)}` 
                  : "You haven't taken the personality quiz yet."}
              </p>
              <button className="mt-2 text-amber-700 hover:text-amber-900 text-sm">
                {profile.dominant_trait ? "Retake Quiz" : "Take Personality Quiz"}
              </button>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Other Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="prefer_fiction" className="mr-2" checked />
                  <label htmlFor="prefer_fiction" className="text-gray-700">Prefer fiction over non-fiction</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="prefer_series" className="mr-2" />
                  <label htmlFor="prefer_series" className="text-gray-700">Prefer book series over standalone</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="prefer_recent" className="mr-2" checked />
                  <label htmlFor="prefer_recent" className="text-gray-700">Prefer recent publications</label>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors">
                Update Preferences
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Reading History</h2>
            
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">Currently Reading</h3>
              <div className="bg-amber-50 p-4 rounded-lg flex items-start">
                <div className="w-16 h-24 bg-gray-200 rounded flex-shrink-0">
                  <img 
                    src="https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Book cover" 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">The Silent Observer</h4>
                  <p className="text-gray-600 text-sm">Elena Martins</p>
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-amber-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-gray-600 text-xs">65%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-700 mb-3">Recently Completed</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-start">
                    <div className="w-12 h-18 bg-gray-200 rounded flex-shrink-0">
                      <img 
                        src="https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                        alt="Book cover" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Echoes of Tomorrow</h4>
                      <p className="text-gray-600 text-sm">Javier Rodriguez</p>
                      <div className="mt-1 flex items-center">
                        <div className="flex text-amber-500">
                          ★★★★☆
                        </div>
                        <span className="text-gray-500 text-xs ml-2">Completed April 12, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-start">
                    <div className="w-12 h-18 bg-gray-200 rounded flex-shrink-0">
                      <img 
                        src="https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                        alt="Book cover" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Sunflower Summer</h4>
                      <p className="text-gray-600 text-sm">Grace Chen</p>
                      <div className="mt-1 flex items-center">
                        <div className="flex text-amber-500">
                          ★★★★★
                        </div>
                        <span className="text-gray-500 text-xs ml-2">Completed March 27, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start">
                    <div className="w-12 h-18 bg-gray-200 rounded flex-shrink-0">
                      <img 
                        src="https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                        alt="Book cover" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">The Alchemist's Secret</h4>
                      <p className="text-gray-600 text-sm">Marcus Webb</p>
                      <div className="mt-1 flex items-center">
                        <div className="flex text-amber-500">
                          ★★★☆☆
                        </div>
                        <span className="text-gray-500 text-xs ml-2">Completed February 18, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="mt-6 text-amber-700 hover:text-amber-900 text-sm flex items-center">
                <Book className="mr-1" size={16} /> View Full Reading History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
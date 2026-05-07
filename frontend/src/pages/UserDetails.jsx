import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserById } from '../api/userService';
import StatusBadge from '../components/StatusBadge';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getUserById(id);
        setUser(data?.user || data?.data || data);
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load user.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id]);

  return (
    <section className="min-h-screen bg-white p-4 sm:p-6 w-full">
  <div className="mx-auto max-w-4xl pt-10">
    {/* Header Title */}
    <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-12">
      User Details
    </h1>

    {isLoading && (
      <div className="text-center py-10 text-gray-500 font-medium">Loading user...</div>
    )}
    
    {error && (
      <div className="rounded-md border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700 mb-6">
        {error}
      </div>
    )}

    {!isLoading && !error && user && (
      <div className="relative rounded-xl border border-gray-200 bg-white p-6 sm:p-12 shadow-xl">
        {/* Centered Profile Avatar */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            <img
              src={user?.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="User profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 pt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2323]">First Name</p>
            <p className="mt-1 text-base font-semibold text-gray-900 border-b border-gray-100 pb-1 uppercase">
              {user?.firstName || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2323]">Last Name</p>
            <p className="mt-1 text-base font-semibold text-gray-900 border-b border-gray-100 pb-1 uppercase">
              {user?.lastName || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2323]">Email Address</p>
            <p className="mt-1 text-base font-semibold text-gray-900 border-b border-gray-100 pb-1">
              {user?.email || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2323]">Mobile</p>
            <p className="mt-1 text-base font-semibold text-gray-900 border-b border-gray-100 pb-1">
              {user?.mobile || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2323]">Gender</p>
            <p className="mt-1 text-base font-semibold text-gray-900 border-b border-gray-100 pb-1 capitalize">
              {user?.gender || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2323]">Status</p>
            <div className="mt-1">
              <span className={`inline-block px-4 py-1 rounded text-xs font-bold text-white uppercase ${user?.status === 'active' ? 'bg-[#8B2323]' : 'bg-gray-500'}`}>
                {user?.status || 'inactive'}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B2323]">Location</p>
            <p className="mt-1 text-base font-semibold text-gray-900 border-b border-gray-100 pb-1 capitalize">
              {user?.location || 'N/A'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col gap-3">
          <Link
            to={`/edit/${id}`}
            className="w-full h-12 bg-[#8B2323] text-white flex items-center justify-center rounded-md font-bold text-sm shadow-md hover:bg-red-900 transition-colors uppercase tracking-wider"
          >
            Edit User
          </Link>
          <Link
            to="/"
            className="w-full text-center text-xs text-gray-500 hover:text-[#8B2323] hover:underline transition-colors"
          >
            Back to User List
          </Link>
        </div>
      </div>
    )}
  </div>
</section>
  );
};

export default UserDetails;

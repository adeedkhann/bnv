import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteUser, exportUsersCsv, getUsers, updateUser } from '../api/userService';
import Pagination from '../components/Pagination';
import TableRow from '../components/TableRow';

const DEFAULT_LIMIT = 10;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getUsers({ page, limit, search: searchTerm });
        const usersPayload = data?.data || data?.users || data || [];

        setUsers(Array.isArray(usersPayload) ? usersPayload : []);
        setTotal(Number(data?.pagination?.total) || (Array.isArray(usersPayload) ? usersPayload.length : 0));
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load users.';
        setError(message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, searchTerm]);

  const totalPages = useMemo(() => {
    if (!total || !limit) return 1;
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  const handleSearchClick = () => {
    setSearchTerm(searchInput.trim());
    setPage(1);
  };

  const handleExportCsv = async () => {
    try {
      const { blob, filename } = await exportUsersCsv();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'users.csv';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('CSV export ready.');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to export CSV.';
      toast.error(message);
    }
  };

  const handleDelete = async (userId) => {
    if (!userId) return;
    const confirmed = window.confirm('Delete this user?');
    if (!confirmed) return;

    try {
      await deleteUser(userId);
      toast.success('User deleted.');
      setUsers((prev) => prev.filter((user) => (user?._id || user?.id) !== userId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to delete user.';
      toast.error(message);
    }
  };

  const handleStatusChange = async (userId, nextStatus) => {
    if (!userId) return;

    try {
      await updateUser(userId, { status: nextStatus });
      setUsers((prev) =>
        prev.map((user) => ((user?._id || user?.id) === userId ? { ...user, status: nextStatus } : user))
      );
      toast.success('Status updated.');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update status.';
      toast.error(message);
    }
  };

  return (
   <section className="p-4 sm:p-6 bg-white min-h-screen w-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Your exact search bar design */}
          <div className="flex w-full gap-4 max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none text-sm"
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSearchClick();
              }}
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="bg-[#8B2323] text-white px-4 py-2 rounded hover:bg-red-900 transition shadow-md text-sm font-medium"
            >
              Search
            </button>
          </div>

          {/* Your exact buttons design */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              to="/add"
              className="bg-[#8B2323] text-white px-3 h-10 rounded-md flex items-center justify-center gap-1 hover:bg-red-900 transition shadow-md text-xs sm:text-sm font-medium flex-1 sm:flex-none whitespace-nowrap"
            >
              <span className="text-lg leading-none">+</span> 
              <span>Add User</span>
            </Link>
            
            <button
              onClick={handleExportCsv}
              className="bg-[#8B2323] text-white px-3 h-10 rounded-md flex items-center justify-center hover:bg-red-900 transition shadow-md text-xs sm:text-sm font-medium flex-1 sm:flex-none whitespace-nowrap"
            >
              Export To Csv
            </button>
          </div>
        </div>
      </div>

      {/* Table with horizontal scroll support for mobile */}
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto min-w-[800px]">
            <thead className="bg-[#212529] text-white whitespace-nowrap">
              <tr>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold">FullName</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold">Gender</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-center">Profile</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-500 text-sm">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-500 text-sm">No users found.</td></tr>
              ) : (
                users.map((user, index) => (
                  <TableRow 
                    key={user?._id || index} 
                    user={user} 
                    index={(page - 1) * limit + index + 1} 
                    onDelete={handleDelete} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination to match the UI */}
      <div className="flex justify-end mt-6">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
};

export default UserList;

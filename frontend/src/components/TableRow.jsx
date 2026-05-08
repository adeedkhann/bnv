import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

const TableRow = ({ user, index, onDelete, onStatusChange }) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [statusMenuPos, setStatusMenuPos] = useState({ top: 0, left: 0 });
  const [actionMenuPos, setActionMenuPos] = useState({ top: 0, left: 0 });
  const actionMenuRef = useRef(null);
  const statusMenuRef = useRef(null);
  const actionButtonRef = useRef(null);
  const statusButtonRef = useRef(null);
  const userId = user?._id || user?.id;
  const normalizedStatus = String(user?.status || '').toLowerCase() || 'inactive';

  useEffect(() => {
    const handleClickOutside = (event) => {
      const actionOpen = actionMenuRef.current && actionMenuRef.current.contains(event.target);
      const statusOpen = statusMenuRef.current && statusMenuRef.current.contains(event.target);
      const actionButtonOpen = actionButtonRef.current && actionButtonRef.current.contains(event.target);
      const statusButtonOpen = statusButtonRef.current && statusButtonRef.current.contains(event.target);
      if (!actionOpen && !statusOpen && !actionButtonOpen && !statusButtonOpen) {
        setShowActionMenu(false);
        setShowStatusMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showStatusMenu || !statusButtonRef.current) return;
    const rect = statusButtonRef.current.getBoundingClientRect();
    setStatusMenuPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
    });
  }, [showStatusMenu]);

  useEffect(() => {
    if (!showActionMenu || !actionButtonRef.current) return;
    const rect = actionButtonRef.current.getBoundingClientRect();
    const menuWidth = 144;
    setActionMenuPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.right + window.scrollX - menuWidth,
    });
  }, [showActionMenu]);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm text-gray-700">{index}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{user.firstName} {user.lastName}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
        <td className="px-4 py-3 text-sm text-gray-700 uppercase">{user.gender?.charAt(0) || 'O'}</td>
        
        <td className="px-4 py-3" ref={statusMenuRef}>
          <button 
            type="button"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            ref={statusButtonRef}
            className={`px-3 py-1 rounded text-white text-xs flex items-center gap-1 transition shadow-sm ${
              normalizedStatus === 'active' ? 'bg-[#8B2323]' : 'bg-gray-500'
            }`}
          >
            {normalizedStatus === 'active' ? 'Active' : 'InActive'}
            <span className="text-[10px]">▼</span>
          </button>
        </td>

        <td className="px-4 py-3">
          <div className="flex justify-center items-center">
            <img 
              src={user.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              className="w-8 h-8 rounded-full border border-gray-200" 
              alt="profile" 
            />
          </div>
        </td>

        <td className="px-4 py-3 text-center" ref={actionMenuRef}>
          <button 
            type="button"
            onClick={() => setShowActionMenu(!showActionMenu)}
            ref={actionButtonRef}
            className="p-1 hover:bg-gray-200 rounded-full transition"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        </td>
      </tr>

      {showStatusMenu && createPortal(
        <StatusMenu
          top={statusMenuPos.top}
          left={statusMenuPos.left}
          onSelect={(status) => {
            onStatusChange(userId, status);
            setShowStatusMenu(false);
          }}
        />,
        document.body
      )}

      {showActionMenu && createPortal(
        <ActionMenu
          top={actionMenuPos.top}
          left={actionMenuPos.left}
          userId={userId}
          onDelete={(id) => {
            onDelete(id);
            setShowActionMenu(false);
          }}
        />,
        document.body
      )}
    </>
  );
};

const StatusMenu = ({ top, left, onSelect }) => (
  <div
    className="fixed z-[80] w-28 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden"
    style={{ top, left }}
    onMouseDown={(event) => event.stopPropagation()}
  >
    <button type="button" onClick={() => onSelect('active')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 text-gray-700">Active</button>
    <button type="button" onClick={() => onSelect('inactive')} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 text-gray-700">InActive</button>
  </div>
);

const ActionMenu = ({ top, left, userId, onDelete }) => (
  <div
    className="fixed z-[80] w-36 bg-white border border-gray-200 shadow-xl rounded-md py-1"
    style={{ top, left }}
    onMouseDown={(event) => event.stopPropagation()}
  >
    <Link to={`/user/${userId}`} className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-gray-50"><Eye size={14} /> View</Link>
    <Link to={`/edit/${userId}`} className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-gray-50"><Edit size={14} /> Edit</Link>
    <button type="button" onClick={() => onDelete(userId)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50"><Trash2 size={14} /> Delete</button>
  </div>
);

export default TableRow;
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createUser, getUserById, updateUser } from '../api/userService';
import { userSchema } from '../utils/validations';

const DEFAULT_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  gender: 'male',
  status: 'active',
  location: '',
  profileImage: undefined,
};

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formTitle = useMemo(() => (isEditMode ? 'Edit User' : 'Add User'), [isEditMode]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const loadUser = async () => {
      if (!isEditMode) return;

      setIsLoading(true);
      setError('');

      try {
        const data = await getUserById(id);
        const user = data?.user || data?.data || data;
        reset({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          mobile: user?.mobile || '',
          gender: user?.gender || 'male',
          status: user?.status || 'active',
          location: user?.location || '',
          profileImage: undefined,
        });
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load user.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id, isEditMode, reset]);

  const onSubmit = async (values) => {
    setError('');

    try {
      const payload = {
        ...values,
        profileImage: values.profileImage?.[0] || undefined,
      };

      if (isEditMode) {
        await updateUser(id, payload);
        toast.success('User updated.');
      } else {
        await createUser(payload);
        toast.success('User created.');
      }
      navigate('/');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to save user.';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl p-4 sm:p-6 min-h-screen bg-white">
  {/* Header Title */}
  <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
    {isEditMode ? 'Edit User Details' : 'Register Your Details'}
  </h1>

  <form 
    onSubmit={handleSubmit(onSubmit)} 
    className="relative rounded-xl border border-gray-200 bg-white p-4 sm:p-10 shadow-lg"
  >
    {/* Centered Avatar Placeholder */}
    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
      <div className="h-20 w-20 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
          alt="avatar" 
          className="h-full w-full object-cover"
        />
      </div>
    </div>

    {/* Error Alert */}
    {error && (
      <div className="mb-6 rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
        {error}
      </div>
    )}

    <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 pt-8">
      {/* First Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">First name</label>
        <input
          type="text"
          {...register('firstName')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none"
          placeholder="Enter FirstName"
        />
        {errors.firstName && <p className="text-[10px] text-red-600">{errors.firstName.message}</p>}
      </div>

      {/* Last Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Last Name</label>
        <input
          type="text"
          {...register('lastName')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none"
          placeholder="Enter LastName"
        />
        {errors.lastName && <p className="text-[10px] text-red-600">{errors.lastName.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Email address</label>
        <input
          type="email"
          {...register('email')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none"
          placeholder="Enter Email"
        />
        {errors.email && <p className="text-[10px] text-red-600">{errors.email.message}</p>}
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Mobile</label>
        <input
          type="tel"
          {...register('mobile')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none"
          placeholder="Enter Mobile"
        />
        {errors.mobile && <p className="text-[10px] text-red-600">{errors.mobile.message}</p>}
      </div>

      {/* Gender Radio Group */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Select Your Gender</label>
        <div className="flex flex-col gap-2 pt-1">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="radio" value="male" {...register('gender')} className="accent-red-800" />
            Male
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="radio" value="female" {...register('gender')} className="accent-red-800" />
            Female
          </label>
        </div>
        {errors.gender && <p className="text-[10px] text-red-600">{errors.gender.message}</p>}
      </div>

      {/* Status Dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Select Your Status</label>
        <select 
          {...register('status')} 
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-red-800"
        >
          <option value="">Select...</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="text-[10px] text-red-600">{errors.status.message}</p>}
      </div>

      {/* Profile File Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Select Your Profile</label>
        <div className="flex items-center w-full border border-gray-300 rounded-md overflow-hidden bg-gray-50">
          <input
            type="file"
            accept="image/*"
            {...register('profileImage')}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Enter Your Location</label>
        <input
          type="text"
          {...register('location')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-800 outline-none"
          placeholder="Enter Your Location"
        />
        {errors.location && <p className="text-[10px] text-red-600">{errors.location.message}</p>}
      </div>
    </div>

    {/* Submit Button (Full Width as per image) */}
    <div className="mt-10">
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full rounded-md bg-[#8B2323] py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-900 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Processing...' : 'Submit'}
      </button>
      
      {/* Optional Cancel Link for better UX */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-3 w-full text-center text-xs text-gray-500 hover:underline"
      >
        Back to List
      </button>
    </div>
  </form>
</section>
  );
};

export default UserForm;

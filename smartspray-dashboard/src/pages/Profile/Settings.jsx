import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { CROP_TYPES } from '../../utils/constants';
import FormInput from '../../components/common/FormInput';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser, updateUserLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      farmName: user?.farmName || '',
      farmSize: user?.farmSize || '',
      crops: user?.crops || [],
      notifications: user?.notifications || {
        email: true,
        sms: false,
        whatsapp: false,
        criticalAlerts: true,
      },
    },
  });

  const selectedCrops = watch('crops') || [];
  const notifications = watch('notifications') || {};

  const handleCropToggle = (crop, onChange) => {
    const newCrops = selectedCrops.includes(crop)
      ? selectedCrops.filter(c => c !== crop)
      : [...selectedCrops, crop];
    
    onChange(newCrops);
  };

  const handleNotificationToggle = (field, value) => {
    const newNotifications = {
      ...notifications,
      [field]: value,
    };
    
    // This would need a custom setValue function for nested objects
    // For now, we'll handle this in the submit
  };

  const onSubmit = async (data) => {
    try {
      await updateUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Update your profile and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />

            <FormInput
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
            />
          </div>

          <FormInput
            label="Phone Number"
            type="tel"
            {...register('phone')}
            placeholder="Enter your phone number"
          />

          <h3 className="text-lg font-medium text-gray-900 mb-4 mt-8">Farm Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Farm Name"
              {...register('farmName', { required: 'Farm name is required' })}
              error={errors.farmName?.message}
            />

            <FormInput
              label="Farm Size (hectares)"
              type="number"
              step="0.1"
              {...register('farmSize', {
                required: 'Farm size is required',
                min: { value: 0.1, message: 'Minimum size is 0.1 hectares' },
              })}
              error={errors.farmSize?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crops Grown
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CROP_TYPES.map((crop) => (
                <label key={crop} className="flex items-center">
                  <input
                    type="checkbox"
                    value={crop}
                    checked={selectedCrops.includes(crop)}
                    onChange={(e) => {
                      handleCropToggle(crop, (newCrops) => {
                        register('crops').onChange({
                          target: {
                            name: 'crops',
                            value: newCrops,
                          },
                        });
                      });
                    }}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{crop}</span>
                </label>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-4 mt-8">Notification Preferences</h3>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => handleNotificationToggle('email', e.target.checked)}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Email notifications</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => handleNotificationToggle('sms', e.target.checked)}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">SMS alerts</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.whatsapp}
                onChange={(e) => handleNotificationToggle('whatsapp', e.target.checked)}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">WhatsApp messages</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.criticalAlerts}
                onChange={(e) => handleNotificationToggle('criticalAlerts', e.target.checked)}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Critical alerts</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateUserLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {updateUserLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
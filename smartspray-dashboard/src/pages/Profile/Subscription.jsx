import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '../../utils/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Subscription = () => {
  const { user, updateUser, updateUserLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(user?.subscription || 'Basic');

  const handlePlanSelect = async (plan) => {
    setSelectedPlan(plan);
    try {
      await updateUser({ subscription: plan });
      toast.success('Subscription updated successfully');
    } catch (error) {
      toast.error('Failed to update subscription');
      setSelectedPlan(user.subscription);
    }
  };

  if (!user) return <LoadingSpinner />;

  const plans = [
    {
      id: 'Basic',
      name: 'Basic Plan',
      price: '₹999',
      period: '/month',
      features: [
        'Up to 5 hectares monitoring',
        'Basic disease detection',
        'Email support',
        '7-day data history',
      ],
      current: user.subscription === 'Basic',
    },
    {
      id: 'Premium',
      name: 'Premium Plan',
      price: '₹1,999',
      period: '/month',
      features: [
        'Up to 20 hectares monitoring',
        'Advanced disease detection',
        'Priority support',
        '30-day data history',
        'SMS alerts',
      ],
      popular: true,
      current: user.subscription === 'Premium',
    },
    {
      id: 'Enterprise',
      name: 'Enterprise Plan',
      price: 'Custom',
      period: ' pricing',
      features: [
        'Unlimited monitoring',
        'AI-powered analytics',
        '24/7 dedicated support',
        'Unlimited data history',
        'Custom integrations',
      ],
      current: user.subscription === 'Enterprise',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-600">Manage your subscription plan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-6 border rounded-lg ${
              plan.current
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            } ${plan.popular ? 'ring-2 ring-green-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                Popular
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">
                {plan.price}
                <span className="text-base font-normal text-gray-600">{plan.period}</span>
              </p>
            </div>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-3 text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanSelect(plan.id)}
              disabled={plan.current || updateUserLoading}
              className={`mt-6 w-full py-2 px-4 rounded-md ${
                plan.current
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {plan.current ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Current Plan</p>
            <p className="text-lg font-semibold text-gray-900">{user.subscription} Plan</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Next Billing Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
'use client';

import React, { useState } from 'react';
import { User } from 'next-auth';

import { SubscriptionCard } from './billing-cards';
import { UserSubscriptionPlan } from '../subscription';
import { storeMonthlySubcsriptionPlans, storeYearlySubcsriptionPlans } from '@/config/stripe/subscriptions';

const SubscriptionPlan = ({ subscriptionPlan, user }: { subscriptionPlan: UserSubscriptionPlan, user: User }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  console.log('current subsciption', subscriptionPlan);

  return (
    <div>
      <div className="w-full flex">
        <div className="relative w-48 my-2 mx-auto inline-flex gap-2">
          {/* Indicator */}
          <div className={`absolute inset-0  transition-transform duration-300 ease-in-out ${selectedPlan === 'yearly' ? 'translate-x-24' : 'translate-x-0'}`}>
            <div className="border-2 border-blue-500 rounded h-full w-1/2"></div>
          </div>

          {/* Buttons */}
          <button
            className={`flex-1 relative z-10 p-2 rounded text-center ${selectedPlan === 'monthly' ? 'text-green-500' : 'text-gray-700'}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            Monthly
          </button>
          <button
            className={`flex-1 relative z-10 p-2 rounded ${selectedPlan === 'yearly' ? 'text-green-500' : 'text-gray-700'}`}
            onClick={() => setSelectedPlan('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className='w-full h-full flex gap-4 py-4'>
        {selectedPlan === 'monthly' ? (

          <>
            {storeMonthlySubcsriptionPlans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                user={user}
                subscriptionPlan={subscriptionPlan}
                selectedPlan='monthly' />
            ))}
          </>

        ) : (

          <>
            {storeYearlySubcsriptionPlans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                user={user}
                subscriptionPlan={subscriptionPlan}
                selectedPlan='yearly' />
            ))}
          </>

        )}
      </div>

    </div >
  );
};

export default SubscriptionPlan;
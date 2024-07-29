'use client';

import { useState, useEffect } from 'react';

import { useUserAccountStore } from '../stores/user-account-store';

type ScopeOption = "search-console" | "ads";

const SCOPE_URLS: Record<ScopeOption, string> = {
  "search-console": "https://www.googleapis.com/auth/webmasters.readonly",
  'ads': "https://www.googleapis.com/auth/adwords",
};

const useGoogleToken = (requiredScope: ScopeOption) => {
  const accountDetails = useUserAccountStore((state) => state.accountDetails)

  const [hasAccess, setHasAccess] = useState(false);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accountDetails || !accountDetails.scope) {
      console.error('Google token AccountDetails not found');
      setIsLoading(false);
      return;
    }
    setHasAccess(accountDetails.scope.includes(SCOPE_URLS[requiredScope]));
    setRefreshToken(accountDetails.refresh_token);
    setIsLoading(false);

  }, [requiredScope, accountDetails]);

  return { hasAccess, refreshToken, isLoading };
};

export default useGoogleToken;


// ? Only set the refresh token if the user has access to the required scope
// const accessGranted = accountDetails.scope.includes(SCOPE_URLS[requiredScope]);
// setHasAccess(accessGranted);
// setRefreshToken(accessGranted ? accountDetails.refresh_token : null);
// setIsLoading(false);
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

import { useApi } from 'soapbox/hooks/useApi';
import { useFeatures } from 'soapbox/hooks/useFeatures';

type Validation = {
  error: string;
  message: string;
}

const ValidationKeys = {
  validation: (name: string) => ['group', 'validation', name] as const,
};

function useGroupValidation(name: string = '') {
  const api = useApi();
  const features = useFeatures();

  const getValidation = async () => {
    try {
      return api.get<Validation>('/api/v1/groups/validate', {
        searchParams: { name },
      }).json();
    } catch (e) {
      if (e instanceof HTTPError && e.response.status === 422) {
        return e.response.json();
      }

      throw e;
    }
  };

  const queryInfo = useQuery<Validation>({
    queryKey: ValidationKeys.validation(name),
    queryFn: getValidation,
    enabled: features.groupsValidation && !!name,
  });

  return {
    ...queryInfo,
    data: {
      ...queryInfo.data,
      isValid: !queryInfo.data?.error,
    },
  };
}

export { useGroupValidation };
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useApi } from 'soapbox/hooks';
import { InstanceV1, instanceV1Schema } from 'soapbox/schemas/instance';

interface Opts extends Pick<UseQueryOptions<unknown>, 'enabled' | 'retry' | 'retryOnMount' | 'staleTime'> {
  /** The base URL of the instance. */
  baseUrl?: string;
}

/** Get the Instance for the current backend. */
export function useInstanceV1(opts: Opts = {}) {
  const api = useApi();

  const { baseUrl } = opts;

  const { data: instance, ...rest } = useQuery<InstanceV1>({
    queryKey: ['instance', baseUrl ?? api.baseUrl, 'v1'],
    queryFn: async () => {
      const response = await api.get('/api/v1/instance');
      const data = await response.json();
      return instanceV1Schema.parse(data);
    },
    ...opts,
  });

  return { instance, ...rest };
}

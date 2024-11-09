import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';


import { __stub } from 'soapbox/api';
import { buildGroup } from 'soapbox/jest/factory';
import { render, screen, waitFor } from 'soapbox/jest/test-helpers';
import { instanceV1Schema } from 'soapbox/schemas/instance';

import Search from './search';

const store = {
  instance: instanceV1Schema.parse({
    version: '3.4.1 (compatible; TruthSocial 1.0.0+unreleased)',
  }),
};

const renderApp = (children: React.ReactElement) => render(children, undefined, store);

describe('<Search />', () => {
  describe('with no results', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet('/api/v1/groups/search').reply(200, []);
      });
    });

    it('should render the blankslate', async () => {
      renderApp(<Search searchValue={'some-search'} onSelect={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByTestId('no-results')).toBeInTheDocument();
      });
    });
  });

  describe('with results', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet('/api/v1/groups/search').reply(200, [
          buildGroup({
            display_name: 'Group',
            id: '1',
          }),
        ]);
      });
    });

    it('should render the results', async () => {
      renderApp(<Search searchValue={'some-search'} onSelect={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByTestId('results')).toBeInTheDocument();
      });
    });
  });

  describe('before starting a search', () => {
    it('should render the RecentSearches component', () => {
      renderApp(<Search searchValue={''} onSelect={vi.fn()} />);

      expect(screen.getByTestId('recent-searches')).toBeInTheDocument();
    });
  });
});
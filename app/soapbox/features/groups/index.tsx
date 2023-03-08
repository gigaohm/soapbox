import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { openModal } from 'soapbox/actions/modals';
import GroupCard from 'soapbox/components/group-card';
import ScrollableList from 'soapbox/components/scrollable-list';
import { Button, Stack, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector, useFeatures } from 'soapbox/hooks';
import { useGroups } from 'soapbox/queries/groups';
import { PERMISSION_CREATE_GROUPS, hasPermission } from 'soapbox/utils/permissions';

import PlaceholderGroupCard from '../placeholder/components/placeholder-group-card';

import TabBar, { TabItems } from './components/tab-bar';

import type { Group as GroupEntity } from 'soapbox/types/entities';

// const getOrderedGroups = createSelector([
//   (state: RootState) => state.groups.items,
//   (state: RootState) => state.group_relationships,
// ], (groups, group_relationships) => ({
//   groups: (groups.toList().filter((item: GroupEntity | false) => !!item) as ImmutableList<GroupEntity>)
//     .map((item) => item.set('relationship', group_relationships.get(item.id) || null))
//     .filter((item) => item.relationship?.member)
//     .sort((a, b) => a.display_name.localeCompare(b.display_name)),
// }));

const EmptyMessage = () => (
  <Stack space={6} alignItems='center' justifyContent='center' className='h-full p-6'>
    <Stack space={2} className='max-w-sm'>
      <Text size='2xl' weight='bold' tag='h2' align='center'>
        <FormattedMessage
          id='groups.empty.title'
          defaultMessage='No Groups yet'
        />
      </Text>

      <Text size='sm' theme='muted' align='center'>
        <FormattedMessage
          id='groups.empty.subtitle'
          defaultMessage='Start discovering groups to join or create your own.'
        />
      </Text>
    </Stack>
  </Stack>
);

const Groups: React.FC = () => {
  const dispatch = useAppDispatch();
  const features = useFeatures();

  const canCreateGroup = useAppSelector((state) => hasPermission(state, PERMISSION_CREATE_GROUPS));

  const { groups, isLoading } = useGroups();

  const createGroup = () => {
    dispatch(openModal('MANAGE_GROUP'));
  };

  return (
    <Stack space={4}>
      {canCreateGroup && (
        <Button
          className='sm:w-fit sm:self-end xl:hidden'
          icon={require('@tabler/icons/circles.svg')}
          onClick={createGroup}
          theme='secondary'
          block
        >
          <FormattedMessage id='new_group_panel.action' defaultMessage='Create Group' />
        </Button>
      )}

      {features.groupsDiscovery && (
        <TabBar activeTab={TabItems.MY_GROUPS} />
      )}

      <ScrollableList
        scrollKey='groups'
        emptyMessage={<EmptyMessage />}
        itemClassName='py-3 first:pt-0 last:pb-0'
        isLoading={isLoading}
        showLoading={isLoading && groups.length === 0}
        placeholderComponent={PlaceholderGroupCard}
        placeholderCount={3}
      >
        {groups.map((group) => (
          <Link key={group.id} to={`/groups/${group.id}`}>
            <GroupCard group={group as GroupEntity} />
          </Link>
        ))}
      </ScrollableList>
    </Stack>
  );
};

export default Groups;

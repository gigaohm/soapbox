import affiliateFilledIcon from '@tabler/icons/filled/affiliate.svg';
import bellFilledIcon from '@tabler/icons/filled/bell.svg';
import circlesFilledIcon from '@tabler/icons/filled/circles.svg';
import mailFilledIcon from '@tabler/icons/filled/mail.svg';
import affiliateIcon from '@tabler/icons/outline/affiliate.svg';
import bellIcon from '@tabler/icons/outline/bell.svg';
import circlesIcon from '@tabler/icons/outline/circles.svg';
import dashboardIcon from '@tabler/icons/outline/dashboard.svg';
import mailIcon from '@tabler/icons/outline/mail.svg';
import messagesIcon from '@tabler/icons/outline/messages.svg';
import searchIcon from '@tabler/icons/outline/search.svg';
import { FormattedMessage } from 'react-intl';

import ThumbNavigationLink from 'soapbox/components/thumb-navigation-link.tsx';
import { useStatContext } from 'soapbox/contexts/stat-context.tsx';
import { useAppSelector } from 'soapbox/hooks/useAppSelector.ts';
import { useFeatures } from 'soapbox/hooks/useFeatures.ts';
import { useOwnAccount } from 'soapbox/hooks/useOwnAccount.ts';

const ThumbNavigation: React.FC = (): JSX.Element => {
  const { account } = useOwnAccount();
  const features = useFeatures();

  const { unreadChatsCount } = useStatContext();

  const notificationCount = useAppSelector((state) => state.notifications.unread);
  const dashboardCount = useAppSelector((state) => state.admin.openReports.count() + state.admin.awaitingApproval.count());

  /** Conditionally render the supported messages link */
  const renderMessagesLink = (): React.ReactNode => {
    if (features.chats) {
      return (
        <ThumbNavigationLink
          src={messagesIcon}
          text={<FormattedMessage id='navigation.chats' defaultMessage='Chats' />}
          to='/chats'
          exact
          count={unreadChatsCount}
          countMax={9}
        />
      );
    }

    if (features.directTimeline || features.conversations) {
      return (
        <ThumbNavigationLink
          src={mailIcon}
          activeSrc={mailFilledIcon}
          text={<FormattedMessage id='navigation.direct_messages' defaultMessage='Messages' />}
          to='/messages'
          paths={['/messages', '/conversations']}
        />
      );
    }

    return null;
  };

  return (
    <div
      className='hide-scrollbar fixed inset-x-0 bottom-0 z-50 flex w-full border-t border-solid border-gray-200 bg-white/90 shadow-2xl backdrop-blur-md black:bg-black/90 dark:border-gray-800 dark:bg-primary-900/90 lg:hidden' style={{
        paddingBottom: 'env(safe-area-inset-bottom)', // iOS PWA
        overflowX: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#fff transparent',
      }}
    >
      <ThumbNavigationLink
        src={affiliateIcon}
        activeSrc={affiliateFilledIcon}
        text={<FormattedMessage id='navigation.my_nostr' defaultMessage='My Nostr' />}
        to='/'
        exact
      />

      {features.groups && (
        <ThumbNavigationLink
          src={circlesIcon}
          activeSrc={circlesFilledIcon}
          text={<FormattedMessage id='tabs_bar.groups' defaultMessage='Groups' />}
          to='/groups'
          exact
        />
      )}

      <ThumbNavigationLink
        src={searchIcon}
        text={<FormattedMessage id='navigation.search' defaultMessage='Discover' />}
        to='/search'
        exact
      />

      {account && (
        <ThumbNavigationLink
          src={bellIcon}
          activeSrc={bellFilledIcon}
          text={<FormattedMessage id='navigation.notifications' defaultMessage='Notifications' />}
          to='/notifications'
          exact
          count={notificationCount}
        />
      )}

      {account && renderMessagesLink()}

      {(account && account.staff) && (
        <ThumbNavigationLink
          src={dashboardIcon}
          text={<FormattedMessage id='navigation.dashboard' defaultMessage='Dashboard' />}
          to='/soapbox/admin'
          count={dashboardCount}
        />
      )}
    </div>
  );
};

export default ThumbNavigation;

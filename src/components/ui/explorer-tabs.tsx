import clsx from 'clsx';
import { useState } from 'react';

import HStack from 'soapbox/components/ui/hstack.tsx';
import SvgIcon from 'soapbox/components/ui/svg-icon.tsx';
import Text from 'soapbox/components/ui/text.tsx';
import Search from 'soapbox/features/compose/components/search.tsx';
import { useIsMobile } from 'soapbox/hooks/useIsMobile.ts';

interface TabItem {
  name: string;
  label: string;
  action: () => void;
  icon: string;
}

interface TabsProps {
  items: TabItem[];
  activeItem?: string;
}

/**
 *
 */
const ExplorerTabs: React.FC<TabsProps> = ({ items, activeItem }) => {
  const [activeTab, setActiveTab] = useState(activeItem || items[0].name);
  const [lastSelected, setLastSelected] = useState('');
  const isMobile = useIsMobile();

  const handleTabClick = (name: string) => {
    setLastSelected(activeTab);
    setActiveTab(name);
    const activeItem = items.find(item => item.name === name);
    if (activeItem && typeof activeItem.action === 'function') {
      activeItem.action();
    }
  };

  return (
    <HStack className='inset-x-0 bottom-4 z-[999] w-full p-2' alignItems='center' justifyContent='center'>
      {/* Header */}
      <HStack space={1} className='w-full rounded-full bg-gray-200/60 p-1.5 dark:bg-gray-800' justifyContent='around'>
        {items.map(({ name, label, icon }) => {
          const isSelected = activeTab === name;
          const shouldKeepBg = lastSelected === name && activeTab === 'search';

          return (
            <HStack key={name} alignItems='center' justifyContent='center'>
              {name === 'search' && isSelected ? (
                <Search autoSubmit />
              ) : (
                <HStack
                  space={1}
                  alignItems='center'
                  justifyContent='center'
                  onClick={() => handleTabClick(name)}
                  /* eslint-disable-next-line tailwindcss/no-custom-classname */
                  className={clsx(
                    'group cursor-pointer rounded-full px-5 py-3 text-sm font-medium transition-all duration-300',
                    isSelected || shouldKeepBg
                      ? 'border-gray-500 bg-gray-500 text-white shadow-md dark:border-gray-700 dark:bg-gray-700'
                      : 'dark:hover:bg-gray-800/200 text-gray-500 hover:bg-gray-400/60 hover:!text-white',
                    { '!p-2': shouldKeepBg },
                  )}
                >
                  <SvgIcon
                    src={icon}
                    className='size-5 '
                  />
                  {(activeTab !== 'search' || isSelected) &&
                    (isMobile ? isSelected : !isMobile) && (
                    <Text
                      className={clsx('transition-all duration-300', {
                        '!text-gray-500 group-hover:!text-white': !isSelected,
                        '!text-white': isSelected || shouldKeepBg,
                      })}
                    >
                      {label}
                    </Text>
                  )}
                </HStack>
              )}
            </HStack>
          );
        })}
      </HStack>
    </HStack>
  );
};

export default ExplorerTabs;
import React from 'react';

import {
  FiLayers,
  FiLayout,
  FiLink2,
  FiRss,
  FiSmartphone,
  FiXCircle,
} from 'react-icons/fi';

import { IconButton } from '@app/components/generic/IconButton.jsx';
import { useBreakpoint } from '@app/hooks/breakpoint';
import { Drawer } from '@components/generic/Drawer';
import { SidebarItem } from '@components/generic/SidebarItem';
import { Tab } from '@headlessui/react';

import { Channels } from './Channels';
import { Connection } from './Connection';
import { Device } from './Device';
import { Interface } from './Interface';
import { Radio } from './Radio';

export const Settings = (): JSX.Element => {
  const [navOpen, setNavOpen] = React.useState(false);

  const { breakpoint } = useBreakpoint();

  return (
    <Tab.Group>
      <div className="relative flex w-full dark:text-white">
        <Drawer
          open={breakpoint === 'sm' ? navOpen : true}
          permenant={breakpoint !== 'sm'}
          onClose={(): void => {
            setNavOpen(!navOpen);
          }}
        >
          <Tab.List className="flex flex-col border-b divide-y divide-gray-300 dark:divide-gray-600 dark:border-gray-600">
            <div className="flex items-center justify-between m-8 mr-6 md:my-10">
              <div className="text-4xl font-extrabold leading-none tracking-tight">
                Settings
              </div>
              <div className="md:hidden">
                <IconButton
                  icon={<FiXCircle className="w-5 h-5" />}
                  onClick={(): void => {
                    setNavOpen(false);
                  }}
                />
              </div>
            </div>
            <Tab
              onClick={(): void => {
                setNavOpen(false);
              }}
            >
              {({ selected }): JSX.Element => (
                <SidebarItem
                  title="Connection"
                  description="Method and peramaters for connecting to the device"
                  selected={selected}
                  icon={<FiLink2 className="flex-shrink-0 w-6 h-6" />}
                />
              )}
            </Tab>
            <Tab
              onClick={(): void => {
                setNavOpen(false);
              }}
            >
              {({ selected }): JSX.Element => (
                <SidebarItem
                  title="Device"
                  description="Device settings, such as device name and wifi settings"
                  selected={selected}
                  icon={<FiSmartphone className="flex-shrink-0 w-6 h-6" />}
                />
              )}
            </Tab>
            <Tab>
              {({ selected }): JSX.Element => (
                <SidebarItem
                  title="Radio"
                  description="Adjust radio power and frequency settings"
                  selected={selected}
                  icon={<FiRss className="flex-shrink-0 w-6 h-6" />}
                />
              )}
            </Tab>
            <Tab>
              {({ selected }): JSX.Element => (
                <SidebarItem
                  title="Interface"
                  description="Change language and other UI settings"
                  selected={selected}
                  icon={<FiLayout className="flex-shrink-0 w-6 h-6" />}
                />
              )}
            </Tab>
            <Tab>
              {({ selected }): JSX.Element => (
                <SidebarItem
                  title="Channels"
                  description="Manage channels"
                  selected={selected}
                  icon={<FiLayers className="flex-shrink-0 w-6 h-6" />}
                />
              )}
            </Tab>
          </Tab.List>
        </Drawer>
        <div className="flex w-full">
          <Tab.Panels className="flex w-full">
            <Tab.Panel className="flex w-full">
              <Connection navOpen={navOpen} setNavOpen={setNavOpen} />
            </Tab.Panel>
            <Tab.Panel className="flex w-full">
              <Device navOpen={navOpen} setNavOpen={setNavOpen} />
            </Tab.Panel>
            <Tab.Panel className="flex w-full">
              <Radio navOpen={navOpen} setNavOpen={setNavOpen} />
            </Tab.Panel>
            <Tab.Panel className="flex w-full">
              <Interface navOpen={navOpen} setNavOpen={setNavOpen} />
            </Tab.Panel>
            <Tab.Panel className="flex w-full">
              <Channels navOpen={navOpen} setNavOpen={setNavOpen} />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </div>
    </Tab.Group>
  );
};
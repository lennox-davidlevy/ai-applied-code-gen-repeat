import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  SkipToContent,
  SideNav,
  SideNavItems,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
  HeaderSideNavItems,
} from '@carbon/react';
import {
  Switcher as SwitcherIcon,
  Notification,
  UserAvatar,
} from '@carbon/icons-react';

import { useNavigate, useLocation } from 'react-router-dom';

const BRANDING_NAME = process.env.BRANDING_NAME || 'IBM';
const APPLICATION_NAME =
  process.env.APPLICATION_NAME || 'AI Applied Demo';

const CarbonHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.split('/').pop();

  const handleMenuItemClick = (page: string) => {
    if (!page) {
      navigate(`/`);
      return;
    }
    navigate(`/${page}`);
  };

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label={BRANDING_NAME}>
          <SkipToContent />
          <HeaderMenuButton
            aria-label='Open menu'
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName prefix=''>{BRANDING_NAME}</HeaderName>
          <HeaderNavigation aria-label={APPLICATION_NAME}>
            <HeaderMenuItem
              onClick={() => handleMenuItemClick('')}
              isActive={currentPage === ''}
            >
              Home
            </HeaderMenuItem>
          </HeaderNavigation>
          {/*<SideNav
            aria-label='Side navigation'
            expanded={isSideNavExpanded}
            isPersistent={false}
            placeholder=''
          >
            <SideNavItems>
              <HeaderSideNavItems>
                <HeaderMenuItem>Home</HeaderMenuItem>
              </HeaderSideNavItems>
            </SideNavItems>
          </SideNav>*/}
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label='Notifications'
              tooltipAlignment='center'
            >
              <Notification size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label='User Avatar'
              tooltipAlignment='center'
            >
              <UserAvatar size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-expanded={isSideNavExpanded}
              isActive={isSideNavExpanded}
              onClick={onClickSideNavExpand}
              tooltipAlignment='end'
              aria-label={
                isSideNavExpanded ? 'Close switcher' : 'Open switcher'
              }
            >
              <SwitcherIcon size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          <HeaderPanel
            expanded={isSideNavExpanded}
            onHeaderPanelFocus={onClickSideNavExpand}
          >
            <Switcher
              aria-label='Switcher Container'
              expanded={isSideNavExpanded}
            >
              <SwitcherItem aria-label='Update watsonx.ai Params'>
                Update watsonx.ai Params
              </SwitcherItem>
              <SwitcherDivider />
              <SwitcherItem aria-label='Link 2'>Link 2</SwitcherItem>
              <SwitcherItem aria-label='Link 3'>Link 3</SwitcherItem>
              <SwitcherItem aria-label='Link 4'>Link 4</SwitcherItem>
              <SwitcherItem aria-label='Link 5'>Link 5</SwitcherItem>
              <SwitcherDivider />
              <SwitcherItem aria-label='Link 6'>Link 6</SwitcherItem>
            </Switcher>
          </HeaderPanel>
        </Header>
      )}
    />
  );
};

export default CarbonHeader;

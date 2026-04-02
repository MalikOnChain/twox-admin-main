'use client'
import { UserCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useAuth } from '@/context/AuthContext'

import { useSidebar } from '../context/SidebarContext'
import {
  BannerIcon,
  ChevronDownIcon,
  DollarLineIcon,
  GamePadIcon,
  GiftIcon,
  GridIcon,
  HandHeartIcon,
  HorizontaLDots,
  PromotionIcon,
  SettingsIcon,
  UserRoundCog,
  UsersRound,
} from '../icons/index'

import { Permissions } from '@/types/permission'
import { NavItem } from '@/types/sidebar'

export const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Dashboard',
    subItems: [
      {
        name: 'Overview',
        path: '/',
        permissions: [Permissions.VIEW_DASHBOARD],
      },
      {
        name: 'Finance',
        path: '/finance',
        permissions: [Permissions.VIEW_DASHBOARD],
      },
      {
        name: 'Platform Fees Widget',
        path: '/platform-fees',
        permissions: [Permissions.VIEW_DASHBOARD],
      },
      {
        name: 'System Health / Live Activity',
        path: '/system-health',
        permissions: [Permissions.VIEW_DASHBOARD],
      },
    ],
  },
  {
    icon: <SettingsIcon />,
    name: 'Settings',
    subItems: [
      {
        name: 'Site Settings',
        path: `/settings`,
        permissions: [Permissions.MANAGE_SETTINGS],
      },
      {
        name: 'IP',
        path: `/ip`,
        permissions: [Permissions.MANAGE_SETTINGS],
      },
      {
        name: 'CMS & Content',
        path: `/cms`,
        permissions: [Permissions.MANAGE_SETTINGS],
      },
      {
        name: 'Email Template',
        path: `/email-template`,
        permissions: [Permissions.MANAGE_SETTINGS],
      },
      {
        name: 'Operating Providers',
        path: `/operating-providers`,
        permissions: [Permissions.MANAGE_OPERATING_PROVIDERS],
      },
      {
        name: 'API Key',
        path: `/apikey`,
        permissions: [Permissions.MANAGE_ROYALTY_TIERS],
      },
      // {
      //   name: 'Crypto Assets',
      //   path: `/crypto/assets`,
      //   permissions: [Permissions.MANAGE_CRYPTO],
      // },
      // {
      //   name: 'Crypto Wallet',
      //   path: `/crypto/wallet`,
      //   permissions: [Permissions.MANAGE_CRYPTO],
      // },
    ],
  },
  {
    icon: <DollarLineIcon />,
    name: 'Payments & Treasury',
    subItems: [
      {
        name: 'Deposits / Withdrawals',
        path: '/payments/deposits-withdrawals',
        pro: false,
        permissions: [Permissions.MANAGE_CRYPTO],
      },
      {
        name: 'Treasury',
        path: '/payments/treasury',
        pro: false,
        permissions: [Permissions.MANAGE_CRYPTO],
      },
      {
        name: 'Fee Analytics',
        path: '/payments/fee-analytics',
        pro: false,
        permissions: [Permissions.MANAGE_CRYPTO],
      },
      {
        name: 'Admin-Only Payment Settings',
        path: '/payments/admin-settings',
        pro: false,
        permissions: [Permissions.MANAGE_CRYPTO],
      },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: 'Admin Management',
    subItems: [
      {
        name: 'Admins',
        path: '/admins',
        permissions: [Permissions.MANAGE_ADMINS],
      },
      {
        name: 'Roles',
        path: `/roles`,
        permissions: [Permissions.MANAGE_ROLES],
      },
    ],
  },
  {
    icon: <UserRoundCog />,
    name: 'User Management',
    subItems: [
            {
              name: 'Player List',
              path: `/user-management/player-list`,
              permissions: [Permissions.MANAGE_USERS],
            },
      {
        name: 'KYC Shortcut',
        path: `/user-management/kyc-shortcut`,
        permissions: [Permissions.MANAGE_USERS],
      },
      {
        name: 'Bonuses in Profile',
        path: `/user-management/bonuses-in-profile`,
        permissions: [Permissions.MANAGE_USERS],
      },
      {
        name: 'VIP Manager',
        path: `/user-management/vip-manager`,
        permissions: [Permissions.MANAGE_USERS],
      },
      {
        name: 'Engagement & Play-Time',
        path: `/user-management/engagement`,
        permissions: [Permissions.MANAGE_USERS],
      },
      {
        name: 'Streamer/Influencer Accounts',
        path: `/user-management/streamer-accounts`,
        permissions: [Permissions.MANAGE_USERS],
      },
      {
        name: 'Bot Accounts',
        path: `/user-management/bot-accounts`,
        permissions: [Permissions.MANAGE_USERS],
      },
    ],
  },
  {
    icon: <HandHeartIcon />,
    name: 'Loyalty Tiers (VIP)',
    path: `/tier`,
    permissions: [Permissions.MANAGE_ROYALTY_TIERS],
  },
  {
    icon: <UsersRound />,
    name: 'Affiliate',
    subItems: [
      {
        name: 'Partners',
        path: `/affiliate/partners`,
        permissions: [Permissions.MANAGE_TIER_AFFILIATES],
      },
      {
        name: 'Deals',
        path: `/affiliate/deals`,
        permissions: [Permissions.MANAGE_TIER_AFFILIATES],
      },
      {
        name: 'Payouts',
        path: `/affiliate/payouts`,
        permissions: [Permissions.MANAGE_TIER_AFFILIATES],
      },
      {
        name: 'Mini-Affiliates',
        path: `/affiliate/mini-affiliates`,
        permissions: [Permissions.MANAGE_TIER_AFFILIATES],
      },
      {
        name: 'User Affiliate',
        path: `/user-affiliate`,
        permissions: [Permissions.MANAGE_TIER_AFFILIATES],
      },
      {
        name: 'Tier Affiliate',
        path: `/tier-affiliate`,
        permissions: [Permissions.MANAGE_TIER_AFFILIATES],
      },
      // {
      //   name: 'UTM Links',
      //   path: `/utm-links`,
      //   permissions: [Permissions.MANAGE_TIER_AFFILIATES],
      // },
    ],
  },
  {
    icon: <PromotionIcon stroke='#E4E7EC' />,
    name: 'Promotions',
    path: `/promotion`,
    permissions: [Permissions.MANAGE_ROYALTY_TIERS],
  },
  {
    icon: <BannerIcon stroke='#E4E7EC' />,
    name: 'Banners',
    path: `/banner`,
    permissions: [Permissions.MANAGE_ROYALTY_TIERS],
  },
  {
    icon: <GiftIcon />,
    name: 'Bonuses & Loyalty',
    subItems: [
      {
        name: 'Bonus Overview',
        path: `/bonuses-loyalty/overview`,
        permissions: [Permissions.MANAGE_BONUSES],
      },
      {
        name: 'Bonus Type Config',
        path: `/bonuses-loyalty/bonus-type-config`,
        permissions: [Permissions.MANAGE_BONUSES],
      },
      {
        name: 'Scheduling & Automation',
        path: `/bonuses-loyalty/scheduling`,
        permissions: [Permissions.MANAGE_BONUSES],
      },
      {
        name: 'Segmentation',
        path: `/bonuses-loyalty/segmentation`,
        permissions: [Permissions.MANAGE_BONUSES],
      },
      {
        name: 'Performance & Liability',
        path: `/bonuses-loyalty/performance`,
        permissions: [Permissions.MANAGE_BONUSES],
      },
      {
        name: 'Manual Credit Issuance',
        path: `/bonuses-loyalty/manual-credit`,
        permissions: [Permissions.MANAGE_BONUSES],
      },
      {
        name: 'Tournaments',
        path: `/bonuses-loyalty/tournaments`,
        permissions: [Permissions.MANAGE_BONUSES],
      },
      {
        name: 'Raffles',
        path: `/bonuses-loyalty/raffles`,
        permissions: [Permissions.MANAGE_BONUSES],
      },
      {
        name: 'VIP-Triggered Allocations',
        path: `/bonuses-loyalty/vip-allocations`,
        permissions: [Permissions.MANAGE_BONUSES],
      },
    ],
  },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: 'Trivia',
  //   subItems: [
  //     {
  //       name: 'Dashboard',
  //       path: `/trivia`,
  //       permission: Permissions.MANAGE_TRIVIA,
  //     },
  //     {
  //       name: 'Question Management',
  //       path: `/trivia/question`,
  //       permission: Permissions.MANAGE_TRIVIA,
  //     },
  //     {
  //       name: 'Launch Trivia',
  //       path: `/trivia/launch`,
  //       permission: Permissions.MANAGE_TRIVIA,
  //     },
  //     {
  //       name: 'Winner Management',
  //       path: `/trivia/winner`,
  //       permission: Permissions.MANAGE_TRIVIA,
  //     },
  //     {
  //       name: 'Reward System',
  //       path: `/trivia/reward`,
  //       permission: Permissions.MANAGE_TRIVIA,
  //     },
  //     {
  //       name: 'Logs & History',
  //       path: `/trivia/log-history`,
  //       permission: Permissions.MANAGE_TRIVIA,
  //     },
  //   ],
  // },
  {
    name: 'Games & Providers',
    icon: <GamePadIcon />,
    subItems: [
      {
        name: 'Games / Game Detail',
        path: '/games-providers/games',
        pro: false,
        permissions: [Permissions.MANAGE_GAMES],
      },
      {
        name: 'Providers',
        path: '/game-providers/blueocean',
        pro: false,
        permissions: [Permissions.MANAGE_GAMES],
      },
      {
        name: 'Analytics',
        path: '/games-providers/analytics',
        pro: false,
        permissions: [Permissions.MANAGE_GAMES],
      },
      {
        name: 'Multi-Provider & Multi-Vertical',
        path: '/games-providers/multi-provider',
        pro: false,
        permissions: [Permissions.MANAGE_GAMES],
      },
      // {
      //   name: 'Crash',
      //   path: '/games/crash',
      //   pro: false,
      //   permissions: [Permissions.MANAGE_GAMES],
      // },
    ],
  },
]


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
  const pathname = usePathname()
  const { user } = useAuth()
  const { permissions } = user
  const [sideMenu, setSideMenu] = useState<NavItem[]>(navItems)

  const hasPermission = useCallback(
    (requiredPermissions?: string[]) => {
      if (!requiredPermissions || requiredPermissions.length < 1) return true

      return requiredPermissions.some((permission) =>
        permissions.includes(permission)
      )
    },
    [permissions]
  )

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: 'main' | 'others'
  ) => (
    <ul className='flex flex-col gap-4'>
      {permissions.length > 0 &&
        navItems
          .filter((nav) => {
            // If there are subItems, we need to check permissions for each subItem as well
            if (nav.subItems) {
              nav.subItems = nav.subItems.filter((subItem) =>
                hasPermission(subItem.permissions)
              )
              return nav.subItems.length > 0
            }
            return hasPermission(nav.permissions)
          })
          .map((nav, index) => (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? 'menu-item-active'
                      : 'menu-item-inactive'
                  } cursor-pointer ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}`}
                >
                  <span
                    className={`${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className='menu-item-text'>{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? 'text-brand-500 rotate-180'
                          : ''
                      }`}
                    />
                  )}
                </button>
              ) : (
                nav.path &&
                hasPermission(nav.permissions) && (
                  <Link
                    href={nav.path}
                    className={`menu-item group ${
                      isActive(nav.path)
                        ? 'menu-item-active'
                        : 'menu-item-inactive'
                    }`}
                  >
                    <span
                      className={`${
                        isActive(nav.path)
                          ? 'menu-item-icon-active'
                          : 'menu-item-icon-inactive'
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className='menu-item-text'>{nav.name}</span>
                    )}
                  </Link>
                )
              )}
              {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el
                  }}
                  className='overflow-hidden transition-all duration-300'
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : '0px',
                  }}
                >
                  <ul className='mt-2 ml-9 space-y-1'>
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? 'menu-dropdown-item-active'
                              : 'menu-dropdown-item-inactive'
                          }`}
                        >
                          {subItem.name}
                          <span className='ml-auto flex items-center gap-1'>
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? 'menu-dropdown-badge-active'
                                    : 'menu-dropdown-badge-inactive'
                                } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${
                                  isActive(subItem.path)
                                    ? 'menu-dropdown-badge-active'
                                    : 'menu-dropdown-badge-inactive'
                                } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
    </ul>
  )

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'others'
    index: number
  } | null>(null)
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({})
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback(
    (path: string) =>
      path === pathname ||
      (path !== '/' &&
        path !== '/trivia' &&
        pathname.split('/').length > 2 &&
        pathname.includes(path + '/')),
    [pathname]
  )

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false
    sideMenu.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: 'main',
              index,
            })
            submenuMatched = true
          }
        })
      }
    })

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null)
    }
  }, [pathname, isActive, sideMenu])

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }))
      }
    }
  }, [openSubmenu])

  useEffect(() => {
    setSideMenu(() => {
      const filtered = navItems.filter((nav) => {
        if (nav.subItems) {
          nav.subItems = nav.subItems.filter((subItem) =>
            hasPermission(subItem.permissions)
          )
          return nav.subItems.length > 0
        }
        return hasPermission(nav.permissions)
      })
      return filtered
    })
  }, [permissions, hasPermission])

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null
      }
      return { type: menuType, index }
    })
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-[100dvh] flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen
          ? 'w-[290px]'
          : isHovered
            ? 'w-[290px]'
            : 'w-[90px]'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        } ${isMobileOpen ? 'py-4' : 'py-8'}`}
      >
        {!isMobileOpen && (
          <Link href='/'>
            {isExpanded || isHovered ? (
              <>
                <Image
                  className='dark:hidden'
                  src='/images/logo/main-logo.png'
                  alt='Logo'
                  width={160}
                  height={50}
                />
                <Image
                  className='hidden dark:block'
                  src='/images/logo/main-logo.png'
                  alt='Logo'
                  width={160}
                  height={50}
                />
              </>
            ) : (
              <Image
                src='/images/logo/main-logo.png'
                alt='Logo'
                width={62}
                height={62}
              />
            )}
          </Link>
        )}
      </div>
      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        <nav className='mb-6'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(sideMenu, 'main')}
            </div>

          </div>
        </nav>
      </div>
    </aside>
  )
}

export default AppSidebar

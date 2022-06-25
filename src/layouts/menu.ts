import { PageName } from '@/common/constants';
import { ISidebar } from '@/common/types';
import {
    User as UserIcon,
    House as HouseIcon,
    Printer as PrinterIcon,
    Key as KeyIcon,
    Money as MoneyIcon,
    KnifeFork as KnifeForkIcon,
    Calendar as CalendarIcon,
    Grid as GridIcon,
} from '@element-plus/icons-vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
// start dashboardGroup
const dashboard: ISidebar = {
    iconComponent: HouseIcon,
    name: 'common.app.menu.dashboard',
    active: true,
    to: '/dashboard',
    pageName: PageName.DASHBOARD_PAGE,
};
// end dashboardGroup

// start user group
const userMenu: ISidebar = {
    iconComponent: UserIcon,
    name: 'common.app.menu.user.title',
    to: '/user',
    active: false,
    pageName: PageName.USER_PAGE,
    requiredPermissions: [
        `${PermissionResources.USER}_${PermissionActions.READ}`,
        `${PermissionResources.USER}_${PermissionActions.CREATE}`,
        `${PermissionResources.USER}_${PermissionActions.UPDATE}`,
        `${PermissionResources.USER}_${PermissionActions.DELETE}`,
    ],
};

const billing: ISidebar = {
    iconComponent: PrinterIcon,
    name: 'common.app.menu.billing.title',
    active: false,
    to: '/billing',
    pageName: PageName.BILLING_PAGE,
    requiredPermissions: [
        `${PermissionResources.BILLING}_${PermissionActions.READ}`,
        `${PermissionResources.BILLING}_${PermissionActions.CREATE}`,
        `${PermissionResources.BILLING}_${PermissionActions.UPDATE}`,
        `${PermissionResources.BILLING}_${PermissionActions.DELETE}`,
    ],
};

const roleMenu: ISidebar = {
    iconComponent: KeyIcon,
    name: 'common.app.menu.role.title',
    active: false,
    to: '/role',
    pageName: PageName.ROLE_LIST_PAGE,
    requiredPermissions: [
        `${PermissionResources.ROLE}_${PermissionActions.READ}`,
        `${PermissionResources.ROLE}_${PermissionActions.CREATE}`,
        `${PermissionResources.ROLE}_${PermissionActions.UPDATE}`,
        `${PermissionResources.ROLE}_${PermissionActions.DELETE}`,
    ],
};

const tableDiagram: ISidebar = {
    iconComponent: GridIcon,
    name: 'common.app.menu.tableDiagram.title',
    active: false,
    to: '/table-diagram',
    pageName: PageName.TABLE_DIAGRAM_PAGE,
    requiredPermissions: [
        `${PermissionResources.TABLE_DIAGRAM}_${PermissionActions.READ}`,
        `${PermissionResources.TABLE_DIAGRAM}_${PermissionActions.UPDATE}`,
    ],
};

const booking: ISidebar = {
    iconComponent: CalendarIcon,
    name: 'common.app.menu.booking.title',
    active: false,
    to: '/booking',
    pageName: PageName.BOOKING_PAGE,
    requiredPermissions: [
        `${PermissionResources.BOOKING}_${PermissionActions.READ}`,
        `${PermissionResources.BOOKING}_${PermissionActions.CREATE}`,
        `${PermissionResources.BOOKING}_${PermissionActions.UPDATE}`,
    ],
};

const menuMenu: ISidebar = {
    iconComponent: KnifeForkIcon,
    name: 'common.app.menu.menu.title',
    active: false,
    children: [
        {
            name: 'common.app.menu.menu.food',
            to: '/food',
            active: false,
            pageName: PageName.MENU_FOOD_PAGE,
            requiredPermissions: [
                `${PermissionResources.MENU_FOOD}_${PermissionActions.READ}`,
                `${PermissionResources.MENU_FOOD}_${PermissionActions.CREATE}`,
                `${PermissionResources.MENU_FOOD}_${PermissionActions.UPDATE}`,
                `${PermissionResources.MENU_FOOD}_${PermissionActions.DELETE}`,
            ],
        },
        {
            name: 'common.app.menu.menu.category',
            to: '/category',
            active: false,
            pageName: PageName.MENU_CATEGORY_PAGE,
            requiredPermissions: [
                `${PermissionResources.MENU_CATEGORY}_${PermissionActions.READ}`,
                `${PermissionResources.MENU_CATEGORY}_${PermissionActions.CREATE}`,
                `${PermissionResources.MENU_CATEGORY}_${PermissionActions.UPDATE}`,
                `${PermissionResources.MENU_CATEGORY}_${PermissionActions.DELETE}`,
            ],
        },
    ],
};

const closingRevenueMenu: ISidebar = {
    iconComponent: MoneyIcon,
    name: 'common.app.menu.closingRevenue.title',
    to: '/closing-revenue',
    active: false,
    pageName: PageName.REPORT_CLOSING_REVENUE_PAGE,
    requiredPermissions: [
        `${PermissionResources.CLOSING_REVENUE}_${PermissionActions.READ}`,
        `${PermissionResources.CLOSING_REVENUE}_${PermissionActions.CREATE}`,
        `${PermissionResources.CLOSING_REVENUE}_${PermissionActions.UPDATE}`,
        `${PermissionResources.CLOSING_REVENUE}_${PermissionActions.DELETE}`,
    ],
};

export const sidebars = [
    dashboard,
    userMenu,
    tableDiagram,
    booking,
    menuMenu,
    billing,
    closingRevenueMenu,
    roleMenu,
];

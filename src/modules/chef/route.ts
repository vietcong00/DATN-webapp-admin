import ChefPage from './pages/ChefPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import { PageName } from '@/common/constants';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/chef',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.CHEF_PAGE,
                component: ChefPage,
                meta: {
                    requiresAuth: true,
                    requiredPermissions: [
                        `${PermissionResources.CHEF}_${PermissionActions.READ}`,
                        `${PermissionResources.CHEF}_${PermissionActions.UPDATE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];

import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { IFoodBilling, IQueryStringFoodBilling } from './types';
import { IBodyResponse, IGetListResponse } from '@/common/types';
import { appService } from '@/utils/app';
import { PermissionResources } from '../role/constants';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_MAX_SIZE_PER_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
} from '@/common/constants';
import { foodBillingApiService } from '../billing/services/api.services';

const initFoodBookingQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_MAX_SIZE_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    keyword: '',
    billingId: undefined,
};

@Module({ dynamic: true, stateFactory: true, namespaced: true, store, name: 'billing' })
class ChefModule extends VuexModule {
    // food-billing
    foodBillingList: IFoodBilling[] = [];
    totalFoodBillings = 0;
    foodBillingQueryString: IQueryStringFoodBilling = initFoodBookingQueryString;

    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.BILLING);
    }

    // actions

    @Action
    async getFoodBillingList(): Promise<IBodyResponse<IGetListResponse<IFoodBilling>>> {
        const response = (await foodBillingApiService.getList({
            ...this.foodBillingQueryString,
        })) as IBodyResponse<IGetListResponse<IFoodBilling>>;
        if (response.success) {
            this.MUTATE_FOOD_BILLING_LIST(response?.data?.items || []);
            this.MUTATE_TOTAL_FOOD_BILLING(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_FOOD_BILLING_LIST([]);
            this.MUTATE_TOTAL_FOOD_BILLING(0);
        }
        return response;
    }

    @Action
    setFoodBillingQueryString(query: IQueryStringFoodBilling) {
        this.MUTATE_FOOD_BILLING_QUERY_STRING(query);
    }

    @Action
    clearFoodBillingQueryString() {
        this.MUTATE_FOOD_BILLING_QUERY_STRING(initFoodBookingQueryString);
    }

    // MUTATIONS

    @Mutation
    MUTATE_FOOD_BILLING_LIST(billings: IFoodBilling[]) {
        this.foodBillingList = billings;
    }

    @Mutation
    MUTATE_TOTAL_FOOD_BILLING(totals: number) {
        this.totalFoodBillings = totals;
    }

    @Mutation
    MUTATE_FOOD_BILLING_QUERY_STRING(query: IQueryStringFoodBilling) {
        this.foodBillingQueryString = {
            ...this.foodBillingQueryString,
            ...query,
        };
    }
}

export const chefModule = getModule(ChefModule);

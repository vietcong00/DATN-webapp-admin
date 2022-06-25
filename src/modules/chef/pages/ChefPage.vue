<template>
    <div>
        <BaseListPageHeader
            @toggle-filter-form="toggleFilterForm"
            :pageTitle="$t('billing.billing.title')"
            :createButtonText="$t('billing.billing.button.create')"
            :hasSortBox="true"
            v-model:keyword="keyword"
            :isShowCreateButton="false"
            @onPaginate="handlePaginate"
            @search="handleFilter"
        >
            <template #sort-box-content>
                <BillingSort />
            </template>
        </BaseListPageHeader>
        <FilterForm :isToggleFilterForm="isToggleFilterForm" />
        <ChefTable />
    </div>
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import ChefTable from '../components/ChefTable.vue';
import FilterForm from '../components/FilterForm.vue';
import { DEFAULT_MAX_SIZE_PER_PAGE, LIMIT_PER_PAGE } from '@/common/constants';
import { ElLoading } from 'element-plus';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { chefModule } from '../store';

@Options({
    components: { FilterForm, ChefTable },
})
export default class ChefPage extends mixins(UtilMixins) {
    isShowSearchBox = true;
    isToggleFilterForm = true;

    // check permission
    get isCanCreate(): boolean {
        return checkUserHasPermission(chefModule.userPermissions, [
            `${PermissionResources.BILLING}_${PermissionActions.CREATE}`,
        ]);
    }

    get keyword(): string {
        return chefModule.foodBillingQueryString?.keyword || '';
    }

    set keyword(value: string) {
        chefModule.foodBillingQueryString.keyword = value;
    }

    created(): void {
        chefModule.clearFoodBillingQueryString();
        this.fetchData();
    }

    async fetchData(): Promise<void> {
        const loading = ElLoading.service({});
        await chefModule.getFoodBillingList();
        loading.close();
    }

    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    async getBillingList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await chefModule.getFoodBillingList();
        loading.close();
    }

    async handleFilter(): Promise<void> {
        chefModule.setFoodBillingQueryString({
            page: DEFAULT_MAX_SIZE_PER_PAGE,
            limit: LIMIT_PER_PAGE,
            keyword: this.keyword?.trim(),
        });
        await this.getBillingList();
    }
}
</script>

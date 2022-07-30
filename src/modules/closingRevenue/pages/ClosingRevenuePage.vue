<template>
    <div class="content-wrapper filter-wrapper">
        <FilterForm />
    </div>

    <div class="content-wrapper">
        <ClosingRevenueTable />
    </div>
    <ClosingRevenuePopup />
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
import ClosingRevenueTable from '../components/ClosingRevenueTable.vue';
import ClosingRevenueSort from '../components/Sort.vue';
import ClosingRevenuePopup from '../components/ClosingRevenueFormPopup.vue';
import FilterForm from '../components/FilterForm.vue';
import { DEFAULT_FIRST_PAGE, LIMIT_PER_PAGE } from '@/common/constants';
import { ElLoading } from 'element-plus';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { closingRevenueModule } from '../store';

@Options({
    components: {
        FilterForm,
        ClosingRevenueTable,
        ClosingRevenueSort,
        ClosingRevenuePopup,
    },
})
export default class ClosingRevenuesPage extends mixins(UtilMixins) {
    isShowSearchBox = true;
    isToggleFilterForm = true;

    // check permission
    get isCanCreate(): boolean {
        return checkUserHasPermission(closingRevenueModule.userPermissions, [
            `${PermissionResources.CLOSING_REVENUE}_${PermissionActions.CREATE}`,
        ]);
    }

    get keyword(): string {
        return closingRevenueModule.closingRevenueQueryString?.keyword || '';
    }

    set keyword(value: string) {
        closingRevenueModule.closingRevenueQueryString.keyword = value;
    }

    created(): void {
        closingRevenueModule.clearQueryString();
        this.fetchData();
    }

    async fetchData(): Promise<void> {
        const loading = ElLoading.service({});
        Promise.all([closingRevenueModule.getClosingRevenueList()]);
        loading.close();
    }

    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    async getClosingRevenueList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await closingRevenueModule.getClosingRevenueList();
        loading.close();
    }

    async handleFilter(): Promise<void> {
        closingRevenueModule.setClosingRevenueQueryString({
            page: DEFAULT_FIRST_PAGE,
            limit: LIMIT_PER_PAGE,
            keyword: this.keyword?.trim(),
        });
        await this.getClosingRevenueList();
    }

    onClickButtonCreate(): void {
        closingRevenueModule.setIsShowClosingRevenueFormPopUp(true);
    }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
    margin: 20px 25px;
    padding: 30px 25px;
    background-color: white;
    border-radius: 15px;
}

.filter-wrapper {
    margin-top: 0;
}
</style>

<template>
    <BaseSort :sort-options="reportRevenueSortOptions" @handleSort="handleSort" />
</template>

<script lang="ts">
import { OrderDirection } from '@/common/constants';
import { ISelectOptions } from '@/common/types';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import { ReportRevenueSortOptions } from '../constants';
import { reportRevenueModule } from '../store';

@Options({})
export default class ReportRevenueSort extends Vue {
    get reportRevenueSortOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(ReportRevenueSortOptions);
    }

    async handleSort(orderBy: string, orderDirection: OrderDirection): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        reportRevenueModule.setReportRevenueQueryString({
            orderBy,
            orderDirection,
        });
        await reportRevenueModule.getReportRevenueList();
        loading.close();
    }
}
</script>

<style lang="scss" scoped></style>

<template>
    <BaseTableLayout :data="foodBillingTable">
        <template #table-columns>
            <el-table-column
                prop="food.name"
                align="left"
                :label="$t('chef.chef.foodBillingTable.food')"
            >
                <template #default="scope">
                    {{ scope.row.food?.foodName }}
                </template>
            </el-table-column>
            <el-table-column
                prop="billing.table.name"
                :label="$t('chef.chef.foodBillingTable.table')"
                width="120"
            >
                <template #default="scope">
                    {{ scope.row.billing?.table?.name }}
                </template>
            </el-table-column>
            <el-table-column
                prop="food.category.name"
                :label="$t('chef.chef.foodBillingTable.category')"
                width="120"
            >
                <template #default="scope">
                    {{ scope.row.food?.category?.name }}
                </template>
            </el-table-column>
            <el-table-column
                prop="food.category.priority"
                :label="$t('chef.chef.foodBillingTable.priority')"
                align="center"
                width="120"
            >
                <template #default="scope">
                    {{ scope.row.food?.category?.priority }}
                </template>
            </el-table-column>
            <el-table-column
                prop="quantity"
                align="center"
                width="100"
                :label="$t('chef.chef.foodBillingTable.selectedCount')"
            >
                <template #default="scope">
                    {{ scope.row.selectedCount }}
                </template>
            </el-table-column>
            <el-table-column
                prop="quantity"
                width="120"
                align="center"
                :label="$t('chef.chef.foodBillingTable.remainingCount')"
            >
                <template #default="scope">
                    {{
                        scope.row.selectedCount -
                        scope.row.processingCount -
                        scope.row.doneCount -
                        scope.row.canceledCount
                    }}
                </template>
            </el-table-column>
            <el-table-column
                prop="quantity"
                align="center"
                width="260"
                :label="$t('chef.chef.foodBillingTable.cook')"
            >
                <template #default="scope">
                    <InputCountFood
                        v-model:value="scope.row.processingCount"
                        :max="
                            scope.row.selectedCount -
                            scope.row.doneCount -
                            scope.row.canceledCount
                        "
                        :type="'processing'"
                        :label="$t('chef.chef.foodBillingTable.processingCount')"
                    />
                    <InputCountFood
                        v-model:value="scope.row.doneCount"
                        :max="
                            scope.row.selectedCount -
                            scope.row.processingCount -
                            scope.row.canceledCount
                        "
                        :type="'done'"
                        :label="$t('chef.chef.foodBillingTable.doneCount')"
                    />
                    <InputCountFood
                        v-model:value="scope.row.canceledCount"
                        :max="
                            scope.row.selectedCount -
                            scope.row.processingCount -
                            scope.row.doneCount
                        "
                        :type="'canceled'"
                        :label="$t('chef.chef.foodBillingTable.canceledCount')"
                    />
                </template>
            </el-table-column>
            <el-table-column
                prop="quantity"
                align="center"
                width="100"
                :label="$t('chef.chef.foodBillingTable.action')"
            >
                <template #default="scope">
                    <el-button
                        type="primary"
                        @click="
                            saveCookProcessingCount(
                                scope.row.id,
                                scope.row.selectedCount,
                                scope.row.processingCount,
                                scope.row.doneCount,
                                scope.row.canceledCount,
                            )
                        "
                        >{{ $t('chef.chef.foodBillingTable.button.save') }}</el-button
                    >
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { Options } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { IFoodBilling } from '../types';
import { UtilMixins } from '@/mixins/utilMixins';
import { chefModule } from '../store';
import InputCountFood from './InputCountFood.vue';
import { foodBillingApiService } from '@/modules/billing/services/api.services';
import {
    showSuccessNotificationFunction,
    showErrorNotificationFunction,
    showConfirmPopUpFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import i18n from '@/plugins/vue-i18n';

@Options({
    components: {
        InputCountFood,
    },
})
export default class ChefTable extends mixins(UtilMixins) {
    get foodBillingTable(): IFoodBilling[] {
        return chefModule.foodBillingList;
    }

    async saveCookProcessingCount(
        id: number,
        selectedCount: number,
        processingCount: number,
        doneCount: number,
        canceledCount: number,
    ): Promise<void> {
        if (selectedCount === doneCount + canceledCount) {
            const isConfirm = await showConfirmPopUpFunction(
                i18n.global.t('chef.chef.message.confirm.confirmAsk') as string,
                i18n.global.t('chef.chef.message.confirm.title') as string,
                {},
            );
            if (!isConfirm) {
                return;
            }
        }
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await foodBillingApiService.update(id, {
            processingCount,
            doneCount,
            canceledCount,
        });
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t('chef.chef.message.updateSuccess'),
            );
            await chefModule.getFoodBillingList();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message as string);
            await chefModule.getFoodBillingList();
            loading.close();
        }
    }
}
</script>

<style lang="scss" scoped>
.button-group {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
}
.group-left {
    justify-content: space-between;
}
.action-icon {
    height: 1em;
    width: 1em;
}

.billing-image {
    text-decoration: underline;
}

.description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
}
</style>

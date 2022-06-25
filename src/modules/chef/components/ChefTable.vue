<template>
    <BaseTableLayout :data="foodBillingTable">
        <template #table-columns>
            <el-table-column
                prop="food.name"
                :label="$t('chef.chef.foodBillingTable.food')"
            >
                <template #default="scope">
                    {{ scope.row.food?.foodName }}
                </template>
            </el-table-column>
            <el-table-column
                prop="billing.table.name"
                :label="$t('chef.chef.foodBillingTable.table')"
            >
                <template #default="scope">
                    {{ scope.row.billing?.table?.name }}
                </template>
            </el-table-column>
            <el-table-column
                prop="food.category.name"
                :label="$t('chef.chef.foodBillingTable.category')"
            >
                <template #default="scope">
                    {{ scope.row.food?.category?.name }}
                </template>
            </el-table-column>
            <el-table-column
                prop="food.category.priority"
                :label="$t('chef.chef.foodBillingTable.priority')"
            >
                <template #default="scope">
                    {{ scope.row.food?.category?.priority }}
                </template>
            </el-table-column>
            <el-table-column
                prop="quantity"
                width="200"
                :label="$t('chef.chef.foodBillingTable.selectedCount')"
            >
                <template #default="scope">
                    {{ scope.row.selectedCount }}
                </template>
            </el-table-column>
            <el-table-column
                prop="quantity"
                width="250"
                :label="$t('chef.chef.foodBillingTable.selectedCount')"
            >
                <template #default="scope">
                    <InputCountFood
                        v-model:value="scope.row.processingCount"
                        :max="scope.row.selectedCount"
                        :textLabel="'info'"
                        :label="$t('chef.chef.foodBillingTable.processingCount')"
                    />
                    <InputCountFood
                        v-model:value="scope.row.doneCount"
                        :max="scope.row.selectedCount"
                        :textLabel="'success'"
                        :label="$t('chef.chef.foodBillingTable.doneCount')"
                    />
                    <InputCountFood
                        v-model:value="scope.row.canceledCount"
                        :max="scope.row.selectedCount"
                        :textLabel="'danger'"
                        :label="$t('chef.chef.foodBillingTable.canceledCount')"
                    />
                </template>
            </el-table-column>
            <el-table-column
                prop="quantity"
                width="200"
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

@Options({
    components: {
        InputCountFood,
    },
})
export default class ChefTable extends mixins(UtilMixins) {
    get foodBillingTable(): IFoodBilling[] {
        return chefModule.foodBillingList;
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

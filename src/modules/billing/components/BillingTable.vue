<template>
    <BaseTableLayout :data="billingList">
        <template #table-columns>
            <el-table-column
                prop="customerName"
                :label="$t('billing.billing.billingTable.customerName')"
            />
            <el-table-column
                prop="table"
                :label="$t('billing.billing.billingTable.table')"
            >
                <template #default="scope">
                    <span class="totalBillingPrice">
                        {{ scope.row.table?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="paymentTotal"
                :label="$t('billing.billing.billingTable.paymentTotal')"
            >
                <template #default="scope">
                    <span class="totalBillingPrice">
                        {{ parseMoney(scope.row.paymentTotal) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="payDate"
                :label="$t('billing.billing.billingTable.paymentTime')"
                align="center"
                min-width="120"
            >
                <template #default="scope">
                    {{
                        scope.row.paymentTime
                            ? parseDateTime(
                                  scope.row.paymentTime,
                                  YYYY_MM_DD_HYPHEN_HH_MM_COLON,
                              )
                            : ''
                    }}
                </template>
            </el-table-column>
            <el-table-column
                width="200"
                :label="$t('billing.billing.billingTable.billingStatus')"
            >
                <template #default="scope">
                    <div
                        :class="`badge status-field badge-md bg-${statusBadge(
                            scope.row.billingStatus,
                        )}`"
                    >
                        {{
                            $t(
                                `billing.billing.statusBillingOptions.${scope.row.billingStatus}`,
                            )
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                width="150"
                align="center"
                :label="$t('billing.billing.billingTable.action')"
            >
                <template #default="scope">
                    <div class="button-group">
                        <el-tooltip
                            effect="dark"
                            :content="$t('billing.billing.tooltip.edit')"
                            placement="top"
                            v-if="isCanUpdate"
                        >
                            <el-button
                                type="warning"
                                size="mini"
                                @click="onClickButtonEdit(scope.row)"
                            >
                                <EditIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { Options } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { billingModule } from '@billing/store';
import { IBilling, IBillingUpdate, BillingStatus } from '../types';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { UtilMixins } from '@/mixins/utilMixins';

@Options({
    components: {
        DeleteIcon,
        EditIcon,
    },
})
export default class BillingTable extends mixins(UtilMixins) {
    get billingList(): IBilling[] {
        return billingModule.billingList;
    }

    get isCanDelete(): boolean {
        return checkUserHasPermission(billingModule.userPermissions, [
            `${PermissionResources.BILLING}_${PermissionActions.DELETE}`,
        ]);
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(billingModule.userPermissions, [
            `${PermissionResources.BILLING}_${PermissionActions.UPDATE}`,
        ]);
    }

    async onClickButtonEdit(updateBilling: IBillingUpdate): Promise<void> {
        billingModule.setSelectedBilling(updateBilling);
        billingModule.setIsShowBillingFormPopUp(true);
    }

    statusBadge(status: BillingStatus): string {
        switch (status) {
            case BillingStatus.EATING:
                return 'info';
            case BillingStatus.WAIT_FOR_PAY:
                return 'info';
            case BillingStatus.PAID:
                return 'success';
            case BillingStatus.CANCELED:
                return 'danger';
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

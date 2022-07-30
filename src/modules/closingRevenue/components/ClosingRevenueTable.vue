<template>
    <BaseTableLayout
        :data="closingRevenueList"
        :isHighlightCurrentRow="true"
        v-model:selectedPage="selectedPage"
        :totalItems="totalItems"
        @handlePaginate="handlePaginate"
    >
        <template #table-columns>
            <el-table-column
                prop="date"
                :label="$t('closingRevenue.closingRevenue.closingRevenueTable.date')"
                align="center"
                min-width="150"
            >
                <template #default="scope">
                    {{
                        scope.row.createdAt
                            ? parseDateTime(scope.row.createdAt, YYYY_MM_DD_HYPHEN)
                            : ''
                    }}
                </template>
            </el-table-column>
            <el-table-column
                width="150"
                :label="$t('closingRevenue.closingRevenue.closingRevenueTable.shiftWork')"
            >
                <template #default="scope">
                    <div
                        :class="`badge status-field badge-md bg-${shiftBadge(
                            scope.row.shift,
                        )}`"
                    >
                        {{
                            $t(
                                `closingRevenue.closingRevenue.shiftWork.${scope.row.shift}`,
                            )
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="shiftLeader.fullName"
                :label="
                    $t('closingRevenue.closingRevenue.closingRevenueTable.shiftLeader')
                "
                width="150"
            />
            <el-table-column
                prop="billingRevenue"
                :label="
                    $t('closingRevenue.closingRevenue.closingRevenueTable.billingRevenue')
                "
                width="150"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.billingRevenue) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="cashAtBeginningOfShift"
                :label="
                    $t(
                        'closingRevenue.closingRevenue.closingRevenueTable.cashAtBeginningOfShift',
                    )
                "
                width="300"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.cashAtBeginningOfShift) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="cashAtEndingOfShift"
                :label="
                    $t(
                        'closingRevenue.closingRevenue.closingRevenueTable.cashAtEndingOfShift',
                    )
                "
                width="300"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.cashAtEndingOfShift) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="bankingRevenue"
                :label="
                    $t('closingRevenue.closingRevenue.closingRevenueTable.bankingRevenue')
                "
                width="250"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.bankingRevenue) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="differenceRevenue"
                :label="
                    $t(
                        'closingRevenue.closingRevenue.closingRevenueTable.differenceRevenue',
                    )
                "
                width="250"
            >
                <template #default="scope">
                    <div
                        :class="`badge status-field badge-md bg-${differenceRevenueBadge(
                            scope.row.shift,
                        )}`"
                    >
                        {{ parseMoney(scope.row.differenceRevenue) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="note"
                :label="$t('closingRevenue.closingRevenue.closingRevenueTable.note')"
                width="150"
            />
            <el-table-column
                fixed="right"
                width="150"
                align="center"
                :label="$t('closingRevenue.closingRevenue.closingRevenueTable.action')"
            >
                <template #default="scope">
                    <div class="button-group">
                        <el-tooltip
                            effect="dark"
                            :content="$t('closingRevenue.closingRevenue.tooltip.edit')"
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
                        <el-tooltip
                            effect="dark"
                            :content="$t('closingRevenue.closingRevenue.tooltip.delete')"
                            placement="top"
                            v-if="isCanDelete"
                        >
                            <el-button
                                type="danger"
                                size="mini"
                                @click="onClickButtonDelete(scope.row.id)"
                            >
                                <DeleteIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { Options, setup } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { setupDelete } from '../composition/closingRevenue';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { UtilMixins } from '@/mixins/utilMixins';
import { closingRevenueModule } from '../store';
import { IClosingRevenue, IClosingRevenueUpdateBody, SHIFT } from '../types';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';

@Options({
    components: {
        DeleteIcon,
        EditIcon,
    },
})
export default class ClosingRevenueTable extends mixins(UtilMixins) {
    deleteAction = setup(() => setupDelete());

    get closingRevenueList(): IClosingRevenue[] {
        return closingRevenueModule.closingRevenueList;
    }

    get totalItems(): number {
        return closingRevenueModule.totalClosingRevenueList;
    }

    get selectedPage(): number {
        return closingRevenueModule.closingRevenueQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        closingRevenueModule.closingRevenueQueryString.page = value;
    }

    get isCanDelete(): boolean {
        return checkUserHasPermission(closingRevenueModule.userPermissions, [
            `${PermissionResources.CLOSING_REVENUE}_${PermissionActions.DELETE}`,
        ]);
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(closingRevenueModule.userPermissions, [
            `${PermissionResources.CLOSING_REVENUE}_${PermissionActions.UPDATE}`,
        ]);
    }

    async onClickButtonEdit(
        updateClosingRevenue: IClosingRevenueUpdateBody,
    ): Promise<void> {
        closingRevenueModule.setSelectedClosingRevenue(updateClosingRevenue);
        closingRevenueModule.setIsShowClosingRevenueFormPopUp(true);
    }

    async onClickButtonDelete(id: number): Promise<void> {
        await this.deleteAction.deleteClosingRevenue(id);
    }

    differenceRevenueBadge(difference: number): string {
        if (difference >= 0) return 'success';
        else {
            return 'danger';
        }
    }

    shiftBadge(shift: SHIFT): string {
        switch (shift) {
            case SHIFT.MORNING_SHIFT:
                return 'info';
            case SHIFT.AFTERNOON_SHIFT:
                return 'warning';
            default:
                return '';
        }
    }

    async getClosingRevenueList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await closingRevenueModule.getClosingRevenueList();
        loading.close();
    }

    async handlePaginate(): Promise<void> {
        closingRevenueModule.setClosingRevenueQueryString({
            page: this.selectedPage,
        });
        this.getClosingRevenueList();
    }
}
</script>

<style lang="scss" scoped>
.button-group {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
}

.action-icon {
    height: 1em;
    width: 1em;
}
</style>

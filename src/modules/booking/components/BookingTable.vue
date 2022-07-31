<template>
    <BaseTableLayout
        :data="bookingList"
        class="booking-table-data"
        :isHighlightCurrentRow="true"
        v-model:selectedPage="selectedPage"
        :totalItems="totalItems"
        @handlePaginate="handlePaginate"
    >
        <template #table-columns>
            <el-table-column
                align="center"
                :label="$t('booking.booking.bookingTable.header.id')"
                type="index"
                width="75"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                :label="$t('booking.booking.bookingTable.header.nameCustomer')"
                width="200"
                sortable="custom"
            >
                <template #default="scope">
                    <div class="booking__table__name">
                        {{ scope.row.nameCustomer }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                :label="$t('booking.booking.bookingTable.header.phone')"
                width="170"
                sortable="custom"
            >
                <template #default="scope">
                    <div class="booking__table__phone">
                        {{ scope.row.phone }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="arrivalTime"
                :label="$t('booking.booking.bookingTable.header.arrivalTime')"
                width="250"
                sortable="custom"
            >
                <template #default="scope">
                    <div class="booking__table__arrival_time">
                        {{
                            scope.row.arrivalTime
                                ? parseDateTime(
                                      scope.row.arrivalTime,
                                      YYYY_MM_DD_HYPHEN_HH_MM_COLON,
                                  )
                                : ''
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="idCategory"
                :label="$t('booking.booking.bookingTable.header.numberPeople')"
                width="200"
            >
                <template #default="scope">
                    <div class="booking__table__name_table">
                        {{ scope.row.numberPeople }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="idCategory"
                :label="$t('booking.booking.bookingTable.header.table')"
                width="150"
            >
                <template #default="scope">
                    <div class="booking__table__name_table">
                        {{ scope.row.tablesRestaurant?.name || '' }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="idCategory"
                :label="$t('booking.booking.bookingTable.header.status')"
                width="150"
            >
                <template #default="scope">
                    <div
                        class="booking__table__status"
                        :class="`badge status-field badge-md bg-${statusBadge(
                            scope.row.status,
                        )}`"
                    >
                        {{ scope.row.status }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="id"
                :label="$t('booking.booking.bookingTable.header.actions')"
                width="120"
                fixed="right"
            >
                <template #default="scope">
                    <div class="booking__table__action">
                        <div class="status-btn-group">
                            <div
                                class="booking-done action-button"
                                v-if="
                                    scope.row.status == BookingStatus.WAITING &&
                                    scope.row.tablesRestaurant
                                "
                            >
                                <el-popconfirm
                                    :confirm-button-text="
                                        $t('booking.booking.message.button.confirm')
                                    "
                                    :cancel-button-text="
                                        $t('booking.booking.message.button.cancel')
                                    "
                                    icon-color="green"
                                    :title="
                                        $t('booking.booking.message.complete.confirmAsk')
                                    "
                                    @confirm.stop="
                                        changeStatus(scope.row, BookingStatus.DONE)
                                    "
                                >
                                    <template #reference>
                                        <div>
                                            <SelectIcon class="icon-class" />
                                        </div>
                                    </template>
                                </el-popconfirm>
                            </div>
                            <div
                                class="booking-canceled action-button"
                                v-if="scope.row.status == BookingStatus.WAITING"
                            >
                                <el-popconfirm
                                    :confirm-button-text="
                                        $t('booking.booking.message.button.confirm')
                                    "
                                    :cancel-button-text="
                                        $t('booking.booking.message.button.cancel')
                                    "
                                    icon-color="red"
                                    :title="
                                        $t('booking.booking.message.canceled.confirmAsk')
                                    "
                                    @confirm.stop="
                                        changeStatus(scope.row, BookingStatus.CANCELED)
                                    "
                                >
                                    <template #reference>
                                        <div>
                                            <CloseBoldIcon class="icon-class" />
                                        </div>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </div>
                        <div
                            class="booking-change-table action-button"
                            :class="
                                !scope.row.tablesRestaurant ? 'need-select-table' : ''
                            "
                            @click="updateBooking(scope.row)"
                            v-if="scope.row.status == BookingStatus.WAITING"
                        >
                            <img
                                class="icon-select-table"
                                :src="require('@/assets/icons/dinner-table.svg')"
                            />
                        </div>
                    </div>
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-property-decorator';

import { IBooking } from '../types';
import { bookingModule } from '../store';
import { BookingMixins } from '../mixins';
import { bookingService } from '@/modules/table-diagram/services/api.service';
import { tableDiagramModule } from '@/modules/table-diagram/store';
import { BookingStatus } from '../constants';
import { billingService } from '@/modules/billing/services/api.services';
import moment from 'moment';
import { BillingStatus, IBillingCreate } from '@/modules/billing/types';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import i18n from '@/plugins/vue-i18n';
import {
    Select as SelectIcon,
    CloseBold as CloseBoldIcon,
} from '@element-plus/icons-vue';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
@Options({
    name: 'booking-table-component',
    components: {
        SelectIcon,
        CloseBoldIcon,
    },
})
export default class BookingTable extends mixins(BookingMixins) {
    get bookingList(): IBooking[] {
        return bookingModule.bookingList;
    }

    get selectedPage(): number {
        return bookingModule.bookingQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        bookingModule.bookingQueryString.page = value;
    }

    get totalItems(): number {
        return bookingModule.totalBookings;
    }

    created(): void {
        bookingModule.getBookings();
    }

    async changeStatus(booking: IBooking, status: BookingStatus): Promise<void> {
        let createBillingResponse;
        if (status === BookingStatus.DONE) {
            createBillingResponse = await billingService.create({
                customerName: booking?.nameCustomer || '',
                customerPhone: booking?.phone || '',
                tableId: booking?.tablesRestaurant?.id || '',
                arrivalTime: moment(new Date()).fmFullTimeWithoutSecond(),
                billingStatus: BillingStatus.EATING,
            } as IBillingCreate);

            if (!createBillingResponse?.success) {
                showErrorNotificationFunction(createBillingResponse?.message as string);
                return;
            }
        }
        const response = await bookingService.update(booking.id, {
            status: status,
        });
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t('booking.booking.message.update.success'),
            );
            bookingModule.getBookings();
            tableDiagramModule.setCanChosenTable(false);
        }
    }

    statusBadge(status: BookingStatus): string {
        switch (status) {
            case BookingStatus.WAITING:
            case BookingStatus.WAITING_FOR_APPROVE:
                return 'info';
            case BookingStatus.DONE:
                return 'success';
            case BookingStatus.CANCELED:
                return 'danger';
        }
    }

    async handlePaginate(): Promise<void> {
        bookingModule.setBookingQueryString({ page: this.selectedPage });
        this.getBookingList();
    }

    async getBookingList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await bookingModule.getBookings();
        loading.close();
    }

    updateBooking(booking: IBooking): void {
        bookingModule.setIsShowBookingFormPopUp(true);
        bookingModule.setSelectedBooking(booking);
    }
}
</script>

<style lang="scss" scoped>
.header-options-table {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
.booking__table__action {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    margin: 0 18%;
    .status-btn-group {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        width: 100%;
        .booking-done:hover {
            color: green;
            border: 2px solid rgb(3, 180, 3);
        }

        .booking-canceled:hover {
            color: red;
            border: 2px solid rgb(235, 0, 0);
        }
    }

    .need-select-table {
        border: 2px solid rgb(255, 21, 21);
        border-radius: 5px;
    }

    .booking-change-table {
        margin: 2px;
        padding: 5px;
        &:hover {
            border: 2px solid rgb(21, 239, 255);
        }

        .icon-select-table {
            height: 20px;
        }
    }
}

.icon-class {
    height: 20px;
    width: 20px;
}

.action-button {
    cursor: pointer;
    border-radius: 5px;
    border: solid 2px #fff;
}
</style>

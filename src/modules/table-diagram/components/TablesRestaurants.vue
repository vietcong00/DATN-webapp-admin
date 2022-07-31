<template>
    <div class="table-item" :class="table.id === tableSelected?.id ? 'selected' : ''">
        <div class="table-action" v-if="table?.bookingCount" @click="getBookingsOfTable">
            <div class="booking-action">
                <el-button type="warning" circle>
                    {{ table?.bookingCount ?? 0 }}
                </el-button>
            </div>
        </div>
        <div :class="table.status">
            <div
                class="table-layout"
                @click="selectTable"
                :class="
                    table.numberSeat < selectedBooking?.numberPeople ? 'not-enough' : ''
                "
            >
                <div class="table-description">{{ table.name }}</div>
                <img
                    class="table-img"
                    :src="
                        require(`../../../assets/icons/table-diagram/table-${getImgLink(
                            table?.numberSeat,
                        )}.svg`)
                    "
                    alt=""
                />
                <div class="table-description">
                    {{
                        $t('tableDiagram.table.tableList.numberSeat', {
                            numberSeat: table?.numberSeat,
                        })
                    }}
                </div>
            </div>
            <ModalTableDetailBooking v-if="isShowModalTableDetail" />
        </div>
        <div v-if="!isShowSetupTableOfBookingPopup">
            <el-button
                type="danger mt-3"
                plain
                round
                v-if="table.status === TableStatus.USED"
                @click="updateStatusTable(table.id, TableStatus.READY)"
                >Kết thức</el-button
            >
            <el-button
                type="success mt-3"
                plain
                round
                v-else
                @click="updateStatusTable(table.id, TableStatus.USED)"
                >Phục vụ</el-button
            >
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { tableDiagramModule } from '../store';
import ModalTableDetailBooking from './ModalTableDetailBooking.vue';
import { ElLoading, ElMessageBox } from 'element-plus';
import { TableStatus } from '../constants';
import { Prop } from 'vue-property-decorator';
import { bookingModule } from '@/modules/booking/store';
import { ITable } from '../types';
import { IBookingUpdate } from '@/modules/booking/types';
import { HttpStatus } from '@/common/constants';
import { billingService } from '@/modules/billing/services/api.services';
import { BillingStatus, IBillingCreate } from '@/modules/billing/types';
import { tableService } from '@/modules/booking/services/api.service';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import moment from 'moment';

@Options({
    name: 'table',
    components: {
        ModalTableDetailBooking,
    },
})
export default class TablesRestaurants extends Vue {
    @Prop({}) table!: ITable;

    TableStatus = TableStatus;

    get tableSelected(): ITable | null {
        return tableDiagramModule.tableSelected;
    }

    get isShowModalTableDetail(): boolean {
        return tableDiagramModule.isShowModalTableDetail;
    }

    get isShowSetupTableOfBookingPopup(): boolean {
        return bookingModule.isShowSetupTableOfBookingPopup;
    }

    get isShowBookingFormPopUp(): boolean {
        return bookingModule.isShowBookingFormPopUp;
    }

    get selectedBooking(): IBookingUpdate | null {
        return bookingModule.selectedBooking;
    }

    getImgLink(numberSeat: number): string {
        switch (numberSeat) {
            case 1:
                return 'one';
            case 2:
                return 'two';
            case 4:
                return 'four';
            case 6:
                return 'six';
            case 8:
                return 'eight';
            case 10:
                return 'ten';
            default:
                return 'one';
        }
    }

    selectTable(): void {
        tableDiagramModule.setTableSelected(this.table);
    }

    async getBookingsOfTable(): Promise<void> {
        const loading = ElLoading.service({
            target: '.table-detail-booking-table-data',
        });
        await bookingModule.getBookingsOfTable(this.table.id);
        tableDiagramModule.setIsShowBookingsOfTablePopup(true);
        loading.close();
    }

    checkNumberSeat(numberPeople: number, numberSeat: number): boolean {
        if (numberPeople > numberSeat) {
            const textWarning = `Yêu cầu đặt bàn có ${numberPeople} chỗ. Bàn bạn vừa chọn chỉ có ${numberSeat} chỗ. Vui lòng chọn bàn khác!`;
            ElMessageBox.alert(textWarning, 'Warning', {
                confirmButtonText: 'OK',
            });
            return false;
        }
        return true;
    }

    async updateStatusTable(tableId: number, status: TableStatus): Promise<void> {
        let createBillingResponse;
        if (status === TableStatus.USED) {
            createBillingResponse = await billingService.create({
                tableId,
                arrivalTime: moment(new Date()).fmFullTimeWithoutSecond(),
                billingStatus: BillingStatus.EATING,
            } as IBillingCreate);

            if (!createBillingResponse?.success) {
                showErrorNotificationFunction(createBillingResponse?.message as string);
                return;
            }
        }
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await tableService.update(tableId, {
            status,
        });
        loading.close();
        if (response.success) {
            showSuccessNotificationFunction('Thay đổi trạng thái bàn thành công');
            await tableDiagramModule.getTables();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                const loading = ElLoading.service({
                    target: '.content',
                });
                await tableDiagramModule.getTables();
                loading.close();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.table-item {
    width: 15%;
    margin: 15px;
    padding: 10px;
    cursor: pointer;
    border-radius: 10px;
    position: relative;
    .table-img {
        width: 50px;
        height: 50px;
    }
    .table-description {
        margin: 5px 0px;
        color: #000000;
        font-weight: 200;
    }
    &:hover {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        .table-description {
            font-weight: 700;
        }
    }
    .table-layout {
        padding: 10px;
    }

    .table-action {
        position: absolute;
        right: 5px;
        top: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        button {
            &:not(:last-child) {
                margin-bottom: 5px;
            }
        }
        .booking-action {
            cursor: pointer;
            button {
                width: 24px;
                height: 24px;
                min-height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}

.not-enough {
    padding: 10px;
    background: #e6e6e6;
    border: 1px solid #ffeded;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    opacity: 0.2;
    cursor: none;
}

.selected {
    border: 1px solid #ff0000;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

// .booked {
//     background: #ebff78;
//     border-radius: 10px;
//     border: 1px solid #c2c2c2;
//     box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
// }

.used {
    background: #9eb3fa;
    border-radius: 10px;
    border: 1px solid #c2c2c2;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>

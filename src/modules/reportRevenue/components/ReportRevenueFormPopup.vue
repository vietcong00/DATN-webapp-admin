<template>
    <el-dialog
        width="50%"
        v-model="isShowReportRevenueFormPopUp"
        @closed="closePopup"
        @open="form.openPopup"
        custom-class="report-revenue-form-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{
                    form.isCreate
                        ? $t('reportRevenue.reportRevenue.createTitle')
                        : $t('reportRevenue.reportRevenue.updateTitle')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-4">
                <BaseInputText
                    class="readonly-input-text"
                    :value="parseDateTime(new Date(), YYYY_MM_DD_HYPHEN_HH_MM_COLON)"
                    :isReadonly="true"
                    :label="$t('reportRevenue.reportRevenue.reportRevenueForm.date')"
                />
            </div>
            <div class="col-md-4">
                <BaseInputText
                    class="readonly-input-text"
                    :value="fullNameShiftLeader"
                    :isReadonly="true"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.shiftLeader')
                    "
                />
            </div>
            <div class="col-md-4">
                <BaseSingleSelect
                    v-model:value="form.shift"
                    :filterable="true"
                    :options="shiftOptions"
                    :is-required="true"
                    :label="$t('reportRevenue.reportRevenue.reportRevenueForm.shiftWork')"
                    :error="translateYupError(form.errors.shift)"
                />
            </div>
            <div class="col-md-6">
                <h3>
                    {{ $t('reportRevenue.reportRevenue.reportRevenueForm.input') }}
                </h3>
                <BaseInputNumber
                    name="cashAtBeginningOfShift"
                    is-required="true"
                    v-model:value="form.cashAtBeginningOfShift"
                    :label="
                        $t(
                            'reportRevenue.reportRevenue.reportRevenueForm.cashAtBeginningOfShift',
                        )
                    "
                    :placeholder="
                        $t(
                            'reportRevenue.reportRevenue.placeholder.cashAtBeginningOfShift',
                        )
                    "
                    :error="translateYupError(form.errors.cashAtBeginningOfShift)"
                />
                <BaseInputText
                    name="billingRevenue"
                    is-required="true"
                    class="readonly-input-text"
                    :value="parseMoney(form.billingRevenue)"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.billingRevenue')
                    "
                    :error="translateYupError(form.errors.billingRevenue)"
                />
            </div>
            <div class="col-md-6">
                <h3>
                    {{ $t('reportRevenue.reportRevenue.reportRevenueForm.output') }}
                </h3>
                <BaseInputNumber
                    name="cashAtEndingOfShift"
                    is-required="true"
                    v-model:value="form.cashAtEndingOfShift"
                    :label="
                        $t(
                            'reportRevenue.reportRevenue.reportRevenueForm.cashAtEndingOfShift',
                        )
                    "
                    :placeholder="
                        $t('reportRevenue.reportRevenue.placeholder.cashAtEndingOfShift')
                    "
                    :error="translateYupError(form.errors.cashAtEndingOfShift)"
                />
                <BaseInputNumber
                    name="bankingRevenue"
                    is-required="true"
                    v-model:value="form.bankingRevenue"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.bankingRevenue')
                    "
                    :placeholder="
                        $t('reportRevenue.reportRevenue.placeholder.bankingRevenue')
                    "
                    :error="translateYupError(form.errors.bankingRevenue)"
                />
            </div>
            <div class="col-md-6">
                <h3>
                    {{ $t('reportRevenue.reportRevenue.reportRevenueForm.totalInput') }}
                </h3>
                <BaseInputText
                    name="totalInput"
                    class="readonly-input-text"
                    :isReadonly="true"
                    :value="parseMoney(calculateTotalInput)"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.totalInput')
                    "
                    :error="translateYupError(form.errors.totalInput)"
                />
                <BaseInputText
                    name="differenceRevenue"
                    class="readonly-input-text"
                    :class="calculateDifference < 0 ? 'text-danger' : 'text-info'"
                    :isReadonly="true"
                    :value="parseMoney(calculateDifference)"
                    :label="
                        $t(
                            'reportRevenue.reportRevenue.reportRevenueForm.differenceRevenue',
                        )
                    "
                    :error="translateYupError(form.errors.differenceRevenue)"
                />
            </div>
            <div class="col-md-6">
                <h3>
                    {{ $t('reportRevenue.reportRevenue.reportRevenueForm.totalOutput') }}
                </h3>
                <BaseInputText
                    name="totalOutput"
                    class="readonly-input-text"
                    :isReadonly="true"
                    :value="parseMoney(calculateTotalOutput)"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.totalOutput')
                    "
                    :error="translateYupError(form.errors.totalOutput)"
                />
                <BaseInputText
                    v-model:value="form.note"
                    :error="translateYupError(form.errors.note)"
                    :label="$t('reportRevenue.reportRevenue.reportRevenueForm.note')"
                />
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center">
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                    >
                        <el-button @click="onClickCancel">
                            {{ $t('reportRevenue.reportRevenue.button.cancel') }}
                        </el-button>
                    </div>
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                    >
                        <el-button
                            :disabled="isDisabledSaveButton"
                            v-show="checkIsShiftLeaderOfReportRevenue"
                            type="primary"
                            @click="onClickSaveButton()"
                        >
                            {{ $t('reportRevenue.reportRevenue.button.submit') }}
                        </el-button>
                    </div>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { initData } from '../composition/reportRevenue';
import { setup } from 'vue-class-component';
import { reportRevenueModule } from '../store';
import { UtilMixins } from '@/mixins/utilMixins';
import { ISelectOptions } from '@/common/types';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { SHIFT_OPTIONS } from '../constants';
import { appService } from '@/utils/app';

export default class ReportRevenueFormPopup extends UtilMixins {
    get shiftOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(SHIFT_OPTIONS);
    }

    get checkIsShiftLeaderOfReportRevenue(): boolean {
        if (!reportRevenueModule.selectedReportRevenue?.shiftLeaderId) {
            return true;
        }
        if (
            reportRevenueModule.selectedReportRevenue?.shiftLeaderId ===
            appService.getUser().id
        ) {
            return true;
        }
        return false;
    }

    form = setup(() => initData());

    get isDisabledSaveButton(): boolean {
        return reportRevenueModule.isDisabledSaveButton;
    }

    get isShowReportRevenueFormPopUp(): boolean {
        return reportRevenueModule.isShowReportRevenueFormPopUp || false;
    }

    set isShowReportRevenueFormPopUp(val: boolean) {
        reportRevenueModule.setIsShowReportRevenueFormPopUp(val);
    }

    get fullNameShiftLeader(): string | undefined {
        return reportRevenueModule.selectedReportRevenue?.shiftLeaderId
            ? reportRevenueModule.selectedReportRevenue?.shiftLeader?.fullName
            : appService.getUser().fullName;
    }

    get calculateTotalInput(): number {
        return (
            parseFloat(this.form.cashAtBeginningOfShift as string) +
            parseFloat(this.form.billingRevenue as string)
        );
    }

    get calculateTotalOutput(): number {
        return (
            parseFloat(this.form.cashAtEndingOfShift as string) +
            parseFloat(this.form.bankingRevenue as string)
        );
    }

    get calculateDifference(): number {
        const diff = this.calculateTotalInput - this.calculateTotalOutput || 0;
        this.form.differenceRevenue = diff;
        return diff;
    }

    onClickCancel(): void {
        reportRevenueModule.setIsShowReportRevenueFormPopUp(false);
    }

    async closePopup(): Promise<void> {
        reportRevenueModule.setIsShowReportRevenueFormPopUp(false);
        reportRevenueModule.setSelectedReportRevenue(null);
        (this.form.resetForm as () => void)();
    }

    async onClickSaveButton(): Promise<void> {
        reportRevenueModule.setIsDisabledSaveButton(true);
        await this.form.onSubmit();
        reportRevenueModule.setIsDisabledSaveButton(false);
    }
}
</script>
<style lang="scss" scoped>
@media (max-width: 1199.98px) {
    :deep(.el-dialog) {
        width: 80%;
    }
}
.text-left {
    text-align: left;
}
.font-weight-bold {
    font-weight: 700;
}
.price-text {
    width: fit-content;
    border-top: 1px solid rgb(126, 126, 126);
}
.readonly-input-text {
    :deep(.el-input__inner) {
        box-shadow: none;
    }
}
.text-danger {
    :deep(.el-input__inner) {
        font-weight: 700;
        color: red;
    }
}
.text-info {
    :deep(.el-input__inner) {
        font-weight: 700;
        color: blue;
    }
}
</style>

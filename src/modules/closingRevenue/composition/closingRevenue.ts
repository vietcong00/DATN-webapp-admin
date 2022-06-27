import { appService } from './../../../utils/app';
import { closingRevenueModule } from './../store';
import { useField, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE, HttpStatus } from '@/common/constants';
import { validateClosingRevenueSchema } from '../constants';
import { IBodyResponse } from '@/common/types';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import i18n from '@/plugins/vue-i18n';
import { IClosingRevenue, IClosingRevenueUpdateBody } from '../types';
import { closingRevenueService } from '../services/closing-revenue.api.services';

export function initData() {
    const { t } = useI18n();
    const initValues = {
        shift: undefined,
        shiftLeaderId: undefined,
        cashAtBeginningOfShift: undefined,
        cashAtEndingOfShift: undefined,
        bankingRevenue: undefined,
        differenceRevenue: 0,
        note: '',
        billingRevenue: 0,
    };
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: validateClosingRevenueSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const createBody = {
            shiftLeaderId: appService.getUser().id,
            shift: values.shift,
            cashAtBeginningOfShift: values.cashAtBeginningOfShift,
            cashAtEndingOfShift: values.cashAtEndingOfShift,
            bankingRevenue: values.bankingRevenue,
            differenceRevenue: values.differenceRevenue,
            note: values.note,
        } as IClosingRevenueUpdateBody;
        const closingRevenueId = closingRevenueModule.selectedClosingRevenue?.id;
        const loading = ElLoading.service({
            target: '.closing-revenue-form',
        });
        const response = await closingRevenueService.update(
            closingRevenueId as number,
            createBody,
        );

        loading.close();
        if (response.success) {
            showSuccessNotificationFunction(
                t('menu.closingRevenue.message.update.success'),
            );
            closingRevenueModule.setIsShowClosingRevenueFormPopUp(false);
            closingRevenueModule.setClosingRevenueQueryString({
                page: DEFAULT_FIRST_PAGE,
            });
            const loading = ElLoading.service({
                target: '.content',
            });
            await closingRevenueModule.getClosingRevenueList();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message as string);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                closingRevenueModule.setIsShowClosingRevenueFormPopUp(false);
                const loading = ElLoading.service({
                    target: '.content',
                });
                await closingRevenueModule.getClosingRevenueList();
                loading.close();
            }
        }
    });
    const { value: shift } = useField('shift');
    const { value: shiftLeaderId } = useField('shiftLeaderId');
    const { value: cashAtBeginningOfShift } = useField('cashAtBeginningOfShift');
    const { value: cashAtEndingOfShift } = useField('cashAtEndingOfShift');
    const { value: bankingRevenue } = useField('bankingRevenue');
    const { value: differenceRevenue } = useField('differenceRevenue');
    const { value: note } = useField('note');
    const { value: billingRevenue } = useField('billingRevenue');

    const openPopup = async () => {
        const loading = ElLoading.service({ target: '.closing-revenue-form-popup' });
        const closingRevenueDetail = (await closingRevenueService.getDetail(
            closingRevenueModule.selectedClosingRevenue?.id || 0,
        )) as IBodyResponse<IClosingRevenue>;
        loading.close();
        resetForm({
            values: {
                shift: closingRevenueDetail.data?.shift,
                cashAtBeginningOfShift: closingRevenueDetail.data?.cashAtBeginningOfShift,
                cashAtEndingOfShift: closingRevenueDetail.data?.cashAtEndingOfShift,
                bankingRevenue: closingRevenueDetail.data?.bankingRevenue,
                differenceRevenue: closingRevenueDetail.data?.differenceRevenue,
                note: closingRevenueDetail.data?.note,
                billingRevenue: closingRevenueDetail.data?.billingRevenue | 0,
            },
        });
    };
    return {
        errors,
        shift,
        shiftLeaderId,
        cashAtBeginningOfShift,
        billingRevenue,
        cashAtEndingOfShift,
        bankingRevenue,
        differenceRevenue,
        note,
        validate,
        openPopup,
        onSubmit,
        resetForm,
    };
}

export const setupDelete = () => {
    const deleteClosingRevenue = async (id: number) => {
        const isConfirm = await showConfirmPopUpFunction(
            i18n.global.t('menu.closingRevenue.message.delete.confirmAsk') as string,
            i18n.global.t('menu.closingRevenue.message.delete.title') as string,
            {},
        );
        if (isConfirm) {
            const loading = ElLoading.service({
                target: '.content',
            });
            const response = await closingRevenueService.delete(id);
            loading.close();
            if (response.success) {
                showSuccessNotificationFunction(
                    i18n.global.t('menu.closingRevenue.message.delete.success') as string,
                );
                closingRevenueModule.setClosingRevenueQueryString({
                    page: DEFAULT_FIRST_PAGE,
                });
                const loading = ElLoading.service({
                    target: '.content',
                });
                await closingRevenueModule.getClosingRevenueList();
                loading.close();
            } else {
                showErrorNotificationFunction(response.message);
                if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                    const loading = ElLoading.service({
                        target: '.content',
                    });
                    await closingRevenueModule.getClosingRevenueList();
                    loading.close();
                }
            }
        }
    };

    return { deleteClosingRevenue };
};

import { BillingStatus } from './types';
import yup from '@/plugins/yup/index';
import { INPUT_TEXT_MAX_LENGTH, INPUT_NUMBER_MAX_VALUE, REGEX } from '@/common/constants';

export const BillingSortOptions = [
    {
        label: 'billing.list.filterForm.createdAt',
        value: 'createdAt',
    },
    {
        label: 'billing.list.filterForm.name',
        value: 'name',
    },
];

export const BillingStatusOptions = [
    {
        label: 'billing.list.statusBillingOptions.eating',
        value: BillingStatus.EATING,
    },
    {
        label: 'billing.list.statusBillingOptions.canceled',
        value: BillingStatus.CANCELED,
    },
    {
        label: 'billing.list.statusBillingOptions.wait_for_pay',
        value: BillingStatus.WAIT_FOR_PAY,
    },
    {
        label: 'billing.list.statusBillingOptions.paid',
        value: BillingStatus.PAID,
    },
];

export const validateBillingSchema = yup.object({
    nameCustomer: yup
        .string()
        .trim()
        .required()
        .max(INPUT_TEXT_MAX_LENGTH)
        .label('billingName'),
    phone: yup.string().trim().matches(REGEX.PHONE_NUMBER).optional().required(),
    totalBillingPrice: yup
        .number()
        .positive()
        .max(INPUT_NUMBER_MAX_VALUE)
        .required()
        .label('totalBillingPrice'),

    payDate: yup
        .string()
        .matches(REGEX.YYYY_MM_DD_HYPHEN)
        .nullable()
        .required()
        .label('payDate'),
    statusBilling: yup
        .string()
        .max(INPUT_TEXT_MAX_LENGTH)
        .oneOf(Object.values(BillingStatus))
        .nullable()
        .optional(),
});

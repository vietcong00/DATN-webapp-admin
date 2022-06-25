import { BillingStatus, PaymentMethod } from './types';
import yup from '@/plugins/yup/index';
import { INPUT_TEXT_MAX_LENGTH, REGEX } from '@/common/constants';

export const BillingSortOptions = [
    {
        label: 'billing.billing.filterForm.createdAt',
        value: 'createdAt',
    },
    {
        label: 'billing.billing.filterForm.name',
        value: 'name',
    },
];

export const validateChefSchema = yup.object({
    customerName: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).label('billingName'),
    customerPhone: yup.string().trim().matches(REGEX.PHONE_NUMBER).optional(),
    paymentMethod: yup
        .string()
        .max(INPUT_TEXT_MAX_LENGTH)
        .oneOf(Object.values(PaymentMethod))
        .nullable()
        .optional()
        .required(),
    billingStatus: yup
        .string()
        .max(INPUT_TEXT_MAX_LENGTH)
        .oneOf(Object.values(BillingStatus))
        .nullable()
        .optional()
        .required(),
    paymentTime: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN_HH_MM_COLON).required(),
    cashier: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).label('cashier'),
    note: yup.string().trim().required().max(INPUT_TEXT_MAX_LENGTH).label('note'),
});

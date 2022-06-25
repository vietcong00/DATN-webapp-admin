import { IQueryString } from '@/common/types';
import { IFood } from '../menu/types';

export enum BillingStatus {
    EATING = 'eating',
    WAIT_FOR_PAY = 'wait_for_pay',
    CANCELED = 'canceled',
    PAID = 'paid',
}

export enum ReasonCanceled {
    OUT_OF_FOOD = 'out_of_food',
    ANOTHER_REASON = 'another_reason',
}

export enum PaymentMethod {
    READY_CASH = 'ready_cash',
    BANKING = 'banking',
}
export interface ICashier {
    id: number;
    name: string;
}
export interface IFoodBilling {
    id: number;
    food: IFood;
    quantity: number;
    total: number;
}
export interface IBilling {
    id: number;
    nameCustomer: string;
    phone: string;
    totalBillingPrice: number;
    payDate?: string;
    statusBilling: BillingStatus;
    paymentMethod?: PaymentMethod;
    cashier?: ICashier;
}

export interface IBillingCreate {
    nameCustomer: string | undefined;
    phone: string | undefined;
    totalBillingPrice: number | undefined;
    payDate: string | undefined;
    statusBilling: BillingStatus | undefined;
}

export interface IBillingUpdate extends IBillingCreate {
    id: number | undefined;
}

export interface IQueryStringBilling extends IQueryString {
    keyword?: string;
    payerIds?: number[];
    paymentDateRange?: string[] | null;
}

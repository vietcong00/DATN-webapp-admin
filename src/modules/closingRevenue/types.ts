import { IUser } from '@/modules/user/types';
import { IQueryString } from '@/common/types';

export enum SHIFT {
    MORNING_SHIFT = 'morningShift',
    AFTERNOON_SHIFT = 'afternoonShift',
}

export interface IClosingRevenue {
    id: number;
    shift: SHIFT;
    shiftLeaderId: number;
    shiftLeader: IUser;
    cashAtBeginningOfShift: number;
    billingRevenue: number;
    cashAtEndingOfShift: number;
    bankingRevenue: number;
    differenceRevenue: number;
    note: string;
}

export interface IClosingRevenueUpdateBody {
    id: number | undefined;
    shift: SHIFT | undefined;
    shiftLeaderId: number | undefined;
    shiftLeader: IUser | undefined;
    cashAtBeginningOfShift: number | undefined;
    cashAtEndingOfShift: number | undefined;
    bankingRevenue: number | undefined;
    differenceRevenue: number | undefined;
    note: string | undefined;
}

export interface IQueryStringClosingRevenue extends IQueryString {
    keyword?: string;
    payerIds?: number[];
    paymentDateRange?: string[] | null;
}

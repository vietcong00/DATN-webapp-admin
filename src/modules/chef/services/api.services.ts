import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';

class ChefService extends BaseService {}
export const chefService = new ChefService({ baseUrl: '/chef' }, service);

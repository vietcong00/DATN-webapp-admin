import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import store from './index';
import { appService } from '@/utils/app';
import { SupportLanguage } from '@/common/constants';

@Module({ dynamic: true, namespaced: true, store, name: 'app' })
class AppModule extends VuexModule {
    openSidebar = true;
    isShowNetworkError = false;
    selectedLanguage = appService.getLang();

    @Action
    setOpenSidebar(value: boolean) {
        this.MUTATE_SET_OPEN_SIDEBAR(value);
    }

    @Action
    setLanguage(lang: SupportLanguage): void {
        this.SET_LANGUAGE(lang);
    }
    // GETTERS

    @Mutation
    MUTATE_SET_OPEN_SIDEBAR(value: boolean) {
        this.openSidebar = value;
    }

    @Mutation
    SET_SHOW_NETWORK_ERROR(value: boolean): void {
        this.isShowNetworkError = value;
    }

    @Mutation
    SET_LANGUAGE(lang: SupportLanguage): void {
        this.selectedLanguage = lang;
    }
}

export const appModule = getModule(AppModule);

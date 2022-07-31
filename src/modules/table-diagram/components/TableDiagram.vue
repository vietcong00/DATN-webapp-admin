<template>
    <div class="list-note-diagram">
        <div class="note-item">
            <div class="note-color booked"></div>
            <div class="note-text">Đã được đặt bàn</div>
        </div>
        <div class="note-item">
            <div class="note-color used"></div>
            <div class="note-text">Đang được sử dụng</div>
        </div>
        <div class="note-item">
            <div class="note-color not-enough booked"></div>
            <div class="note-color not-enough used"></div>

            <div class="note-text">Không đủ chỗ</div>
        </div>
        <div class="note-item">
            <div class="note-color selected"></div>
            <div class="note-text">Đang chọn</div>
        </div>
    </div>
    <el-scrollbar>
        <div class="d-flex justify-content-around">
            <div style="width: 1100px">
                <div class="mt-4 d-flex justify-content-around align-items-center">
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/window-icon.svg"
                    />
                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/glass-door-icon.svg"
                    />
                    <img
                        class="decorations"
                        src="../../../assets/icons/table-diagram/window-icon.svg"
                    />
                </div>
                <div class="d-flex flex-row justify-content-around">
                    <div class="p-1 d-flex flex-column justify-content-around">
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />

                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-2.svg"
                        />

                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />
                    </div>
                    <div class="p-10 list-table">
                        <tables-restaurants
                            v-for="(table, index) in tableList"
                            :key="index"
                            :table="table"
                        />
                    </div>
                    <div class="p-1 d-flex flex-column justify-content-around">
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-1.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/window-icon.svg"
                        />
                        <img
                            class="decorations"
                            src="../../../assets/icons/table-diagram/plant-4.svg"
                        />
                    </div>
                </div>

                <div class="d-flex justify-content-around">
                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/cash-machine.svg"
                    />
                    <img
                        class="img-item"
                        src="../../../assets/icons/table-diagram/kitchen-room.svg"
                    />
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>

<script lang="ts">
import { bookingModule } from '@/modules/booking/store';
import { ElLoading } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import TablesRestaurants from '../components/TablesRestaurants.vue';
import { tableDiagramModule } from '../store';
import { ITable } from '../types';

@Options({
    name: 'table-diagram-component',
    components: {
        TablesRestaurants,
    },
})
export default class TableDiagramPage extends Vue {
    get tableList(): ITable[] {
        return tableDiagramModule.tableList || [];
    }

    created(): void {
        tableDiagramModule.clearQueryString();
        tableDiagramModule.setTableSelected(null);
        bookingModule.setSelectedBooking(null);
        this.getTableList();
    }

    async getTableList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await tableDiagramModule.getTables();
        loading.close();
    }
}
</script>

<style lang="scss" scoped>
.img-item {
    width: 75px;
    height: 75px;
    margin: 20px auto;
}

.decorations {
    width: 50px;
    height: 50px;
    margin: 20px auto;
}

.list-note-diagram {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    .note-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
        .note-color {
            width: 30px;
            height: 30px;
            margin-right: 20px;
            border-radius: 5px;
        }

        .booked {
            background: #ebff78;
        }

        .used {
            background: #9eb3fa;
        }

        .not-enough {
            opacity: 0.2;
        }

        .selected {
            border: 1px solid #ff0000;
        }
    }
}

.list-table {
    width: 100%;
    margin: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #e9e9e9;
    border: 1px solid #b3b3b3;
    border-radius: 10px;
}
</style>

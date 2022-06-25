<template>
    <div class="form-group position-relative">
        <label class="mb-2" v-if="label" :class="textLabel">{{ label }}</label>
        <el-input-number
            v-model="inputData"
            type="number"
            :error="true"
            :min="0"
            :max="max"
            size="small"
            @keydown="preventInput"
            @change="onChange"
            @blur="onBlur"
        />
    </div>
</template>

<script lang="ts">
import { Model, Prop, Vue } from 'vue-property-decorator';
export default class InputCountFood extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: 10 }) readonly max!: number;
    @Prop({ default: '' }) readonly textLabel!: string;

    @Model('value', { type: Number })
    readonly inputData!: number;

    isFocus = false;

    onChange(): void {
        this.isFocus = false;
        this.$emit('change');
    }

    onBlur(): void {
        this.$emit('blur');
    }
}
</script>

<style scoped>
.form-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.form-group label {
    text-align: initial;
    width: fit-content;
    font-weight: bold;
    margin-bottom: 8px;
}

.info {
    color: green;
}

.success {
    color: blue;
}

.danger {
    color: red;
}
</style>

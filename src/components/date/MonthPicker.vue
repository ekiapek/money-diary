<template>
  <v-menu v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y
    full-width min-width="300px" max-width="3000px">
    <template v-slot:activator="{ props }">
      <v-text-field label="Select Month" readonly hide-details
        v-model="dateString" v-bind="props" variant="outlined" @focus="focusDate">

      </v-text-field>
    </template>
    <VueDatePicker v-model="dateValue" @update:modelValue="selectDate" inline auto-apply month-picker :enable-time-picker="false"/>
  </v-menu>
</template>
<script>
import dayjs from 'dayjs';
import { TrafficLightsIcon } from 'vue-tabler-icons';
export default {
    data() {
    return {
      dateMenu: false,
      dateValue: this.modelValue !== undefined ? {year:this.modelValue.getFullYear(),month:this.modelValue.getMonth()} : {year:new Date().getFullYear(),month:new Date().getMonth()},
      dateString: this.modelValue !== undefined ? dayjs(this.modelValue).format("MMMM YYYY") : dayjs().format("MMMM YYYY"),
    };
  },
  props: {
    modelValue: Date,
    min: Date,
    max: Date,
  },
  methods: {
    focusDate() {
      setTimeout(() => {
        if (!this.dateMenu) {
          this.dateMenu = true;
        }
      }, 200);
    },
    selectDate(value) {
      let newDate = new Date()
      newDate.setTime(0);
      newDate.setDate(1);
      newDate.setMonth(value.month);
      newDate.setFullYear(value.year);
      this.dateValue = value;
      this.dateString = dayjs(newDate).format("MMMM YYYY");
      this.dateMenu = false;
      this.$emit('update:modelValue', newDate);
    }
  },
};
</script>
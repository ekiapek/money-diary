<template>
  <v-menu v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y
    full-width min-width="300px" max-width="3000px">
    <template v-slot:activator="{ props }">
      <v-text-field class="mb-8" label="Select Date" prepend-inner-icon="mdi-calendar" readonly hide-details
        v-model="dateString" v-bind="props" variant="outlined" @focus="focusDate">

      </v-text-field>
    </template>
    <!-- <v-date-picker label="lol" format="DD-MM-YYYY" show-adjacent-months locale="en-in" v-model="dateValue" hide-actions @update:modelValue="selectDate">
      <template v-slot:header></template>

    </v-date-picker> -->
    <!-- <Calendar /> -->
    <Picker v-model="dateValue" :min-date="min" :max-date="max" @update:modelValue="selectDate" />
  </v-menu>
</template>
<script>
import { Calendar, DatePicker } from 'v-calendar';
import dayjs from 'dayjs';
import 'v-calendar/style.css';
export default {
  components: {
    Calendar,
    "Picker": DatePicker,
  },
  data() {
    return {
      dateMenu: false,
      dateValue: this.modelValue !== undefined ? this.date : new Date(),
      dateString: this.modelValue !== undefined ? dayjs(this.date).format("DD/MM/YYYY") : dayjs().format("DD/MM/YYYY"),
    };
  },
  computed: {
    get() {
      this.modelValue = this.modelValue !== undefined ? this.modelValue : this.dateValue;
      return this.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    }
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
      this.dateValue = value;
      this.dateString = dayjs(this.dateValue).format("DD/MM/YYYY");
      this.dateMenu = false;
      this.$emit('update:modelValue', this.dateValue);
    }
  },
};
</script>
<script setup lang="ts">
import { useCurrencyInput,CurrencyDisplay } from 'vue-currency-input';
import { watch } from 'vue';

const props = defineProps({ modelValue: Number, currencyLogo: String });

const { inputRef, formattedValue, setValue } = useCurrencyInput({
  locale: "id-ID", currency: "USD", currencyDisplay: CurrencyDisplay.hidden, hideCurrencySymbolOnFocus: true, hideGroupingSeparatorOnFocus: false, hideNegligibleDecimalDigitsOnFocus: false, autoDecimalDigits: false, useGrouping: true, accountingSign: false,
});

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      setValue(value as number);
    } else {
      setValue(0);
    }

  }
);
</script>

<template>
  <v-text-field v-model="formattedValue" variant="outlined" ref="inputRef" :prefix="props.currencyLogo">
  </v-text-field>
</template>

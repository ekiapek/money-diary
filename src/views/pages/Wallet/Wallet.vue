<template>
  <v-row>
    <v-col cols="12" md="12">
      <h2 class="text-h2 mb-6 pl-7 pt-7 font-weight-bold" style="color: black; font-weight: bold;">
        Wallets</h2>
      <v-row class="mx-7 mb-7 align-top justify-space-between">
        <p class="">Where's your money stored?</p>
        <div class="">
          <v-btn prepend-icon="mdi-plus" variant="outlined" rounded="xl" style="color: rgb(var(--v-theme-primary));"
            @click="addItem()">Add new</v-btn>
        </div>
      </v-row>

      <v-container fluid>
        <h3 class="mb-3">Regular Wallets</h3>
        <v-row>
          <v-col v-if="regularWallets.length == 0" class="align-top"><i>No data</i></v-col>
          <v-col v-else v-for="item in regularWallets" :key="item.id" cols="4">
            <WalletItem :wallet="item" @click="editItem(item)" />
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <h3 class="mb-3">Savings Wallets</h3>
        <v-row>
          <v-col v-if="savingsWallets.length == 0" class="align-top"><i>No data</i></v-col>
          <v-col v-else v-for="item in savingsWallets" :key="item.id" cols="4">
            <WalletItem :wallet="item" @click="editItem(item)" />
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <h3 class="mb-3">Investment Wallets</h3>
        <v-row>
          <v-col v-if="investmentWallets.length == 0" class="align-top"><i>No data</i></v-col>
          <v-col v-else v-for="item in investmentWallets" :key="item.id" cols="4">
            <WalletItem :wallet="item" @click="editItem(item)" />
          </v-col>
        </v-row>
      </v-container>
    </v-col>

    <v-dialog v-model="walletDialog" width="600" style="z-index: 2000;">
      <v-card class="pa-2">
        <v-card-title class="headline black pt-4" primary-title>
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text class="">
          <v-form ref="walletForm" lazy-validation>
            <v-text-field v-model="wallet.name" class="mb-4" label="Wallet name" variant="outlined"
              :rules="[rules.required]"></v-text-field>
            <v-select v-model="wallet.type" class="mb-4" label="Type" variant="outlined" :items="walletTypes"
              :rules="[rules.required]"></v-select>
            <v-autocomplete v-model="wallet.currency" class="mb-4" item-value="code" item-title="name" label="Currency"
              variant="outlined" :menu-props="{ maxHeight: '200px' }" :items="currencies"
              :rules="[rules.required]"><template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item?.raw?.name"
                  :subtitle="item?.raw?.symbolNative"></v-list-item></template></v-autocomplete>
            <CurrencyInput class="mb-4" v-model="wallet.balance" label="Balance" variant="outlined"></CurrencyInput>
            <v-textarea v-model="wallet.description" label="Description" variant="outlined"></v-textarea>
          </v-form>
          <v-container>
            <v-row class="mb-3">
              <EmojiPicker :emoji="wallet?.icon" :color=pickerColor @emojiChanged="onChangeEmoji" />
              <ColorPicker class="mx-6" :colorProps="pickerColor" @colorChanged="onChangeColor" />
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pa-5 justify-end">
          <v-btn class="px-5" @click="walletDialog = false" variant="tonal" color="muted">Cancel</v-btn>
          <v-btn v-if="wallet?.createdAt" class="px-5" @click="deleteObj()" variant="tonal" color="error">Delete</v-btn>
          <v-btn class="px-8" type="submit" @click.stop="saveWallet()" variant="tonal" color="primary">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2000" :color="snackbarColor">
      {{ snackbarMsg }}
    </v-snackbar>
  </v-row>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Wallet, WALLET_TYPE_REGULAR, WALLET_TYPE_SAVINGS, WALLET_TYPE_INVESTMENT } from "@/types/models/Wallet";
import EmojiPicker from "@/components/emoji/EmojiPicker.vue";
import ColorPicker from "@/components/color/ColorPicker.vue";
import CurrencyInput from "@/components/input/CurrencyInput.vue";
import WalletItem from "@/components/cards/WalletItem.vue";
import UUID from "pure-uuid";

// State
const currencies = ref<any[]>([]);
const regularWallets = ref<Wallet[]>([]);
const savingsWallets = ref<Wallet[]>([]);
const investmentWallets = ref<Wallet[]>([]);
const walletTypes = ref<string[]>([]);
const walletDialog = ref(false);
const wallet = ref(new Wallet({ description: "", createdAt: new Date() }, "", 0, ""));
const snackbar = ref(false);
const dialogTitle = ref("");
const emojiColor = ref("");
const pickerColor = ref("");
const snackbarColor = ref("primary");
const snackbarMsg = ref("");
const rules = reactive({
  required: (value: any) => !!value || "This field is required",
});
const walletForm =  ref<null | any>(null);

// Methods
const loadData = async () => {
  try {
    const response: Wallet[] = await window.api.listWallets();
    if (response) {
      regularWallets.value = response.filter((obj: Wallet) => obj.type.toLowerCase() === WALLET_TYPE_REGULAR);
      savingsWallets.value = response.filter((obj: Wallet) => obj.type.toLowerCase() === WALLET_TYPE_SAVINGS);
      investmentWallets.value = response.filter((obj: Wallet) => obj.type.toLowerCase() === WALLET_TYPE_INVESTMENT);
    }
    const walletTypesResponse = await window.api.listWalletTypes();
    walletTypes.value = walletTypesResponse;
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

const loadCurrencies = async () => {
  try {
    const response = await window.api.listCurrencies();
    currencies.value = response;
  } catch (error) {
    console.error("Error loading currencies:", error);
  }
};

const addItem = () => {
  walletDialog.value = true;
  wallet.value = new Wallet({ description: "", createdAt: new Date() }, "", 0, "");
  dialogTitle.value = "Add new wallet";
  pickerColor.value = generateHex();
};

const editItem = (item: Wallet) => {
  wallet.value = item;
  walletDialog.value = true;
  dialogTitle.value = `Edit wallet: ${item.name}`;
  emojiColor.value = item.color ?? "";
  pickerColor.value = item.color ?? "";
};

const saveWallet = async () => {
  const formRef = walletForm.value;
  if (formRef) {
    formRef.validate().then(async (result: any) => {
      if (result.valid) {
        wallet.value.balance = Number(wallet.value.balance);
        try {
          if (!wallet.value.id) {
            wallet.value.id = new UUID(4).toString();
            wallet.value.color = pickerColor.value;
            const response = await window.api.insertWallet(JSON.stringify(wallet.value));
            handleSnackbar(response, "Wallet added", "Failed to add wallet");
          } else {
            wallet.value.color = pickerColor.value || wallet.value.color;
            const response = await window.api.updateWallet(JSON.stringify(wallet.value));
            handleSnackbar(response, "Successfully edited wallet", "Failed to edit wallet");
          }
          walletDialog.value = false;
          await loadData();
        } catch {
          handleSnackbar(false, "", "Failed to save wallet");
        }
      }
    });
  }
};

const deleteObj = async () => {
  if (confirm(`Delete ${wallet.value.name} wallet?\nDeleting wallet will also delete transactions made to this wallet. This action cannot be undone.`)) {
    try {
      const success = await window.api.deleteWallet(wallet.value.id);
      handleSnackbar(success, "Deleted Wallet", "Failed to delete wallet");
      walletDialog.value = false;
      await loadData();
    } catch {
      handleSnackbar(false, "", "Failed to delete wallet");
    }
  }
};

const handleSnackbar = (success: boolean, successMsg: string, errorMsg: string) => {
  snackbarMsg.value = success ? successMsg : errorMsg;
  snackbarColor.value = success ? "success" : "error";
  snackbar.value = true;
};

const onChangeColor = (newColor: string) => {
  pickerColor.value = newColor;
};

const onChangeEmoji = (newEmoji: string) => {
  wallet.value.icon = newEmoji;
};

const generateHex = () => {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

// Lifecycle hook
onMounted(() => {
  loadData();
  loadCurrencies();
});
</script>
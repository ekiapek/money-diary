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

      <v-container class="">
        <v-row justify="start">
          <v-col v-if="wallets.length == 0" class="align-top text-center justify-center"><i>No data</i></v-col>
          <v-col v-else v-for="item in wallets" :key="item.id" cols="4">
            <v-card elevation="10" @click="editItem(item)">
              <v-container class="py-3 px-4">
                <v-row class="align-center" justify="start">
                  <v-col cols="1" class="ml-2 item-icon align-center text-center"
                    :style="{ 'background-color': item.color, 'border-radius': '50%', 'min-width': '64px', 'min-height': '64px' }">
                    <h2>{{ item.icon }}</h2>
                  </v-col>
                  <v-col class="mx-2">
                    
                      <h3>{{ item.name }} </h3>
                      <h4>{{ formatCurrency(item.balance,item.currency) }}</h4>
                      <p>{{ item.type + " Wallet" }}</p>
                    
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- <v-card elevation="10" class="">
        <v-card-item class="pa-0">
          
        </v-card-item>
      </v-card> -->
    </v-col>

    <v-dialog v-model="walletDialog" width="600" style="z-index: 2000;">
      <v-card class="pa-2">
        <v-card-title class="headline black pt-4" primary-title>
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text class="">
          <v-container>
            <v-row class="mb-3">
              <EmojiPicker :emoji="wallet.icon" :color=pickerColor @emojiChanged="onChangeEmoji" />
              <ColorPicker class="mx-6" :colorProps="pickerColor" @colorChanged="onChangeColor" />
            </v-row>
          </v-container>
          <v-form ref="walletForm" lazy-validation>
            <v-text-field v-model="wallet.name" class="mb-4" label="Wallet name" variant="outlined"
              :rules="[rules.required]"></v-text-field>
              <v-select v-model="wallet.type" class="mb-4" label="Type" variant="outlined" :items="walletTypes" :rules="[rules.required]"></v-select>
            <v-autocomplete v-model="wallet.currency" class="mb-4" item-value="code" item-title="name" label="Currency" variant="outlined"
              :menu-props="{ maxHeight: '200px' }" :items="currencies" :rules="[rules.required]"
              ><template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item?.raw?.name"
                  :subtitle="item?.raw?.symbolNative"
                ></v-list-item></template></v-autocomplete>
            <v-text-field class="mb-4" v-model="wallet.balance" label="Balance" variant="outlined" @focus="removeInitialZero" @input="removeLeadingZero" @keypress="onlyNumberInput"></v-text-field>
            <v-textarea v-model="wallet.description" label="Description" variant="outlined"></v-textarea>

          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5 justify-end">
          <v-btn class="px-5" @click="walletDialog = false" variant="tonal" color="muted">Cancel</v-btn>
          <v-btn v-if="wallet.createdAt" class="px-5" @click="deleteObj()" variant="tonal" color="error">Delete</v-btn>
          <v-btn class="px-8" type="submit" @click.stop="saveWallet()" variant="tonal" color="primary">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2000" :color="snackbarColor">
      {{ snackbarMsg }}
    </v-snackbar>
  </v-row>
</template>
<script lang="ts">
import { Wallet } from '../../../../electron/core/models/Wallet';
import EmojiPicker from '@/components/emoji/EmojiPicker.vue';
import ColorPicker from '@/components/color/ColorPicker.vue';
import { formatCurrency } from '@/util/currency';

export default {
  components: {
    "EmojiPicker": EmojiPicker,
    "ColorPicker": ColorPicker
  },
  data() {
    return {
      currencies: [],
      wallets: [],
      walletTypes: [],
      walletDialog: false,
      wallet: null,
      snackbar: false,
      dialogTitle: "",
      emojisOutput: "",
      emojiColor: "",
      pickerColor: "",
      snackbarColor: "primary",
      snackbarMsg: "",
      rules: {
        required: value => !!value || "This field is required",
        email: v => /.+@.+\..+/.test(v) || "Must be a valid email"
      }
    };
  },
  created() {
    this.loadData();
    this.loadCurrencies();
  },
  methods: {
    formatCurrency,
    loadData() {
      window.api.listWallets().then((response) => {
        if (response) {
          this.wallets = response;
        }
      });
      window.api.listWalletTypes().then((response) => {
        this.walletTypes =response;
      })
    },
    loadCurrencies() {
      window.api.listCurrencies().then((response) => {
        this.currencies = response;
      })
    },
    populateSelectCurrencies(item: any) {
      return {
        title: item.name + " (" + item.code + ")",
        subtitle: item.symbol,
        value: item.code
      }
    },
    customFilter(queryText, item) {
      const textOne = item.raw.name.toLowerCase()
      const textTwo = item.raw.code.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    },
    addItem() {
      this.walletDialog = true;
      this.wallet = new Wallet({}, undefined, "", "");
      this.dialogTitle = "Add new wallet"
      this.pickerColor = this.generateHex();
    },
    editItem(item: any) {
      this.wallet = item;
      this.editedId = item.id;
      this.walletDialog = true;
      this.dialogTitle = "Edit wallet: " + item.name;
      this.emojiColor = item.color;
      this.pickerColor = item.color;
    },
    saveWallet() {
      this.$refs.walletForm.validate().then((result) => {
        if (result.valid) {
          this.wallet.balance = Number(this.wallet.balance)
          if (!this.wallet.createdAt) {
            this.wallet.color = this.pickerColor;
            window.api.insertWallet(JSON.stringify(this.wallet)).then((response) => {
              if (response) {
                this.snackbarMsg = "Wallet added";
                this.snackbarColor = "success";
                this.snackbar = true;
                this.loadData()
              } else {
                this.snackbarMsg = "Failed to add wallet";
                this.snackbarColor = "error";
                this.snackbar = true;
              }
            }).catch(() => {
              this.snackbarMsg = "Failed to add wallet";
              this.snackbarColor = "error"
              this.snackbar = true;
            });

          } else {
            this.wallet.color = this.pickerColor ? this.pickerColor : this.wallet.color;
            window.api.updateWallet(JSON.stringify(this.wallet)).then((response) => {
              if (response) {
                this.snackbarMsg = "Successfully edited wallet";
                this.snackbarColor = "success";
                this.snackbar = true;
                this.loadData()
              } else {
                this.snackbarMsg = "Failed to edit wallet";
                this.snackbarColor = "error";
                this.snackbar = true;
              }
            }).catch(() => {
              this.snackbarMsg = "Failed to edit wallet";
              this.snackbarColor = "error"
              this.snackbar = true;
            });
          }
          this.walletDialog = false
        }
      });

    },
    deleteObj() {
      if (confirm("Delete " + this.wallet.name + " wallet?")) {
        window.api.deleteWallet(this.wallet.id).then((success) => {
          if (success) {
            this.snackbarMsg = "Deleted Wallet";
            this.snackbarColor = "success";
            this.snackbar = true;
            this.walletDialog = false;
            this.loadData()
          } else {
            this.snackbarMsg = "Failed to delete wallet";
            this.snackbarColor = "error";
            this.snackbar = true;
          }
        }).catch((error) => {
          this.snackbarMsg = "Failed to delete wallet";
          this.snackbarColor = "error";
          this.snackbar = true;
        })
      }
    },
    onChangeColor(newColor) {
      this.pickerColor = newColor;
    },
    onChangeEmoji(newEmoji) {
      this.wallet.icon = newEmoji;
    },
    generateHex() {
      let letters = "0123456789ABCDEF";
      let color = '#';
      for (let i = 0; i < 6; i++)
        color += letters[(Math.floor(Math.random() * 16))];

      return color;
    },
    onlyNumberInput(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    removeLeadingZero() {
                    this.wallet.balance = Number(this.wallet.balance).toString();
                },
                removeInitialZero(){
                  if (this.wallet.balance == "0"){
                    this.wallet.balance = "";
                  }
                }
  },
};
</script>
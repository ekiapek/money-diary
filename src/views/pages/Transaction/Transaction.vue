<template>
  <v-row>
    <v-col cols="12" md="12">
      <h2 class="text-h2 mb-6 pl-7 pt-7 font-weight-bold" style="color: black; font-weight: bold;">
        Transactions</h2>
      <v-row class="mx-7 mb-7 align-top justify-space-between">
        <p class="">See all transactions you've made</p>
        <div class="">
          <v-btn prepend-icon="mdi-plus" variant="outlined" rounded="xl" style="color: rgb(var(--v-theme-primary));"
            @click="addItem()">Add new</v-btn>
        </div>
      </v-row>

      <v-row class="mb-5 px-9 align-top justify-space-between">
        <v-col cols="11">
          
        </v-col>
        <v-col cols="1"><FilterChip @setFilter="setFilter" /></v-col>
      </v-row>

      <v-card v-if="transactions === undefined" elevation="10" class="mb-5 align-top text-center justify-center pa-3">
        <p><i>No data</i></p>
      </v-card>
      <v-card v-else v-for="data in transactions" elevation="10" class="withbg mb-7">
        <!-- {{transactions[key]}} -->
        <v-card-item>
          <v-card-title class="text-h5">{{ new Date(data.date).toLocaleDateString(userLocale, dateOption) }}</v-card-title>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-subtitle-1 font-weight-bold">Category</th>
                <th class="text-subtitle-1 font-weight-bold">Amount</th>
                <th class="text-subtitle-1 font-weight-bold">Type</th>
                <th class="text-subtitle-1 font-weight-bold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data.transactions" :key="item.id" class="trx-row" @click.stop="editItem(item)">
                <td>
                  <div class="">
                    <v-avatar class="text-white" variant="flat" :color="item.category.color">
                      <span class="text-h4">{{ item.category.icon }}</span>
                    </v-avatar>
                    <span class="text-subtitle-1 font-weight-bold ml-3">{{ item.category.name }}</span>
                    <!-- <div class="text-13 mt-1 text-muted">{{ item.post }}</div> -->
                  </div>
                </td>
                <td>
                  <h6 class="text-body-1 text-muted">{{ formatCurrency(item.amount, item.wallet.currency) }}</h6>
                </td>
                <td>
                  <v-chip v-if="item.type == 1" :class="'text-body-1 bg-success'" color="white"
                    size="small">Income</v-chip>
                  <v-chip v-else-if="item.type == 2" :class="'text-body-1 bg-warning'" color="white" size="small">Transfer</v-chip>
                  <v-chip v-else :class="'text-body-1 bg-error'" color="white" size="small">Spending</v-chip>
                </td>
                <td style="max-width: 300px;">
                  <p class="d-inline-block text-truncate" style="max-width: inherit;">{{ item.description }}</p>
                </td>
                <td><v-avatar class="tbl-action-col" color="error" @click.stop="deleteObj(item)"
                    style="opacity: 75%;"><v-icon icon="mdi-delete-outline"></v-icon></v-avatar></td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <p>{{ data.transactions.length > 1 ? data.transactions.length + " transactions" : data.transactions.length + "transaction" }}</p>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-dialog v-model="transactionDialog" width="600" style="z-index: 2000;">
      <loading v-model:active="isLoading"/>
      <v-card class="pa-2">
        <v-card-title class="headline black pt-4" primary-title>
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text class="">
          <v-form ref="transactionForm" lazy-validation>
            <v-select class="mb-4" v-model="transaction.type" variant="outlined" label="Transaction type"
              item-value="type" item-title="name" :items="trxType" :rules="[rules.required]"></v-select>

            <DatePicker v-model="transaction.transactionDate" />

            <div v-if="transaction.type === undefined">
              <v-select class="mb-4" v-model="transaction.walletId" variant="outlined" label="Select Wallet" item-value="id"
              item-title="name" disabled :items="wallets" :menu-props="{ maxHeight: '200px' }">
              </v-select>
          </div>
            <div v-else-if="transaction.type == 2">
              <v-select class="mb-4" v-model="transaction.walletId" variant="outlined" label="Select Source Wallet" item-value="id"
              item-title="name" :items="wallets" :rules="[rules.required]" :menu-props="{ maxHeight: '200px' }"
              @update:modelValue="handleTransferSourceWallet">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item?.raw?.name" :subtitle="item?.raw?.currency">
                  <template v-slot:prepend>
                    <v-avatar class="text-white" variant="flat" :color="item?.raw?.color">
                      <span class="text-h4">{{ item?.raw?.icon }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
              </v-select>

              <v-select class="mb-4" v-model="transaction.destinationWalletId" variant="outlined" label="Select Destination Wallet" item-value="id"
              item-title="name" :items="destWallets" :rules="[rules.required]" :menu-props="{ maxHeight: '200px' }">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item?.raw?.name" :subtitle="item?.raw?.currency">
                  <template v-slot:prepend>
                    <v-avatar class="text-white" variant="flat" :color="item?.raw?.color">
                      <span class="text-h4">{{ item?.raw?.icon }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
              </v-select>
            </div>
            <div v-else>
              <v-select class="mb-4" v-model="transaction.walletId" variant="outlined" label="Select Wallet" item-value="id"
              item-title="name" :items="wallets" :rules="[rules.required]" :menu-props="{ maxHeight: '200px' }"
              @update:modelValue="renderAmountCurrency">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item?.raw?.name" :subtitle="item?.raw?.currency">
                  <template v-slot:prepend>
                    <v-avatar class="text-white" variant="flat" :color="item?.raw?.color">
                      <span class="text-h4">{{ item?.raw?.icon }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>
            </div>

            <v-select v-if="transaction.type == 1" v-model="transaction.categoryId" class="mb-4" label="Select Category"
              variant="outlined" item-value="id" item-title="name" :items="incomeCategories" :rules="[rules.required]"
              :menu-props="{ maxHeight: '200px' }">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item?.raw?.name">
                  <template v-slot:prepend>
                    <v-avatar class="text-white" variant="flat" :color="item?.raw?.color">
                      <span class="text-h4">{{ item?.raw?.icon }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>
            <v-select v-else-if="transaction.type == -1" v-model="transaction.categoryId" class="mb-4"
              label="Select Category" variant="outlined" item-value="id" item-title="name" :items="spendingCategories"
              :rules="[rules.required]" :menu-props="{ maxHeight: '200px' }">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item?.raw?.name">
                  <template v-slot:prepend>
                    <v-avatar class="text-white" variant="flat" :color="item?.raw?.color">
                      <span class="text-h4">{{ item?.raw?.icon }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>
            <v-select v-else-if="transaction.type == 2" class="mb-4" label="Select Category" variant="outlined" item-disabled="disabled"
              item-title="name" :items='[]' :menu-props="{ maxHeight: '200px' }" disabled>
              <template v-slot:no-data>
                <span class="px-4"><i>Please select transaction type</i></span>
              </template>
            </v-select>
            <v-select v-else class="mb-4" label="Select Category" variant="outlined" item-disabled="disabled"
              item-title="name" :items='[]' :menu-props="{ maxHeight: '200px' }" :rules="[rules.required]">
              <template v-slot:no-data>
                <span class="px-4"><i>Please select transaction type</i></span>
              </template>
            </v-select>

            <v-text-field class="mb-4" v-model="transaction.amount" label="Amount" variant="outlined"
              :prefix="currencyPrefix" :rules="[rules.required]" @focus="removeInitialZero" @input="removeLeadingZero"
              @keypress="onlyNumberInput"></v-text-field>

            <v-textarea v-model="transaction.description" label="Description" variant="outlined"></v-textarea>

          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5 justify-end">
          <v-btn class="px-5" @click="transactionDialog = false" variant="tonal" color="muted">Cancel</v-btn>
          <v-btn v-if="transaction.createdAt" class="px-5" @click="deleteObj(transaction)" variant="tonal"
            color="error">Delete</v-btn>
          <v-btn class="px-8" type="submit" @click.stop="saveTransaction()" variant="tonal" color="primary">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2000" :color="snackbarColor">
      {{ snackbarMsg }}
    </v-snackbar>
  </v-row>
</template>
<script lang="ts">
import { Transaction } from '../../../../electron/core/models/Transaction';
import { formatCurrency } from '@/util/currency';
import DatePicker from '@/components/date/DatePicker.vue';
import MonthPicker from '@/components/date/MonthPicker.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import FilterChip from '@/components/shared/FilterChip.vue';

export default {
  components: {
    "DatePicker": DatePicker,
    "MonthPicker": MonthPicker,
    Loading,
    FilterChip,
  },
  data() {
    return {
      currencies: [],
      incomeCategories: [],
      spendingCategories: [],
      wallets: [],
      destWallets: [],
      transactions: undefined,
      transactionDialog: false,
      transaction: null,
      snackbar: false,
      dialogTitle: "",
      snackbarColor: "primary",
      snackbarMsg: "",
      categoryLoading: false,
      currencyPrefix: "",
      userLocale: navigator.language,
      isLoading:false,
      dateOption: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      trxType: [{ name: "Income", type: 1 }, { name: "Spending", type: -1 }, { name: "Transfer Money", type: 2 }],
      rules: {
        required: value => !!value || "This field is required"
      }
    };
  },
  created() {
    this.loadData();
    this.loadWallets();
    this.loadCategories();
  },
  methods: {
    formatCurrency,
    loadCategories() {
      window.api.listCategories().then((response) => {
        if (response){
          this.spendingCategories = response.filter((obj: any) => {
            return obj.type == -1;
          });
          this.incomeCategories = response.filter((obj: any) => {
            return obj.type == 1;
          });
        }
      });
    },
    loadWallets() {
      window.api.listWallets().then((response) => {
        if (response) {
          this.wallets = response;
        }
      });
    },
    loadData() {
      window.api.listTransactions().then((response) => {
        if (response != null) {
          this.transactions = response.data;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    addItem() {
      this.transactionDialog = true;
      this.transaction = new Transaction({}, undefined, undefined, undefined, undefined);
      this.dialogTitle = "Add new transaction";
    },
    editItem(item: any) {
      this.isLoading = true;
      window.api.getTransaction(item.id).then((result) => {
        this.isLoading = false;
        this.transactionDialog = true;
        this.transaction = result;
        this.dialogTitle = "Edit transaction";
        this.renderAmountCurrency(result.walletId);
      })
      .catch(() => {
        this.snackbarColor = "error";
        this.snackbarMsg = "Failed to get transaction.";
      })
    },
    saveTransaction() {
      this.$refs.transactionForm.validate().then((result) => {
        if (result.valid) {
          this.transaction.balance = Number(this.transaction.balance)
          if (!this.transaction.createdAt) {
            this.transaction.createdAt = new Date();
            window.api.insertTransaction(JSON.stringify(this.transaction)).then((response) => {
              if (response) {
                this.snackbarMsg = "Transaction added";
                this.snackbarColor = "success";
                this.snackbar = true;
                this.loadData();
              } else {
                this.snackbarMsg = "Failed to add transaction";
                this.snackbarColor = "error";
                this.snackbar = true;
              }
            }).catch(() => {
              this.snackbarMsg = "Failed to add transaction";
              this.snackbarColor = "error"
              this.snackbar = true;
            });

          } else {
            window.api.updateTransaction(JSON.stringify(this.transaction)).then((response) => {
              if (response) {
                this.snackbarMsg = "Successfully edited transaction";
                this.snackbarColor = "success";
                this.snackbar = true;
                this.loadData()
              } else {
                this.snackbarMsg = "Failed to edit transaction";
                this.snackbarColor = "error";
                this.snackbar = true;
              }
            }).catch(() => {
              this.snackbarMsg = "Failed to edit transaction";
              this.snackbarColor = "error"
              this.snackbar = true;
            });
          }
          this.transactionDialog = false
        }
      });

    },
    deleteObj(obj: any) {
      let id = obj.id;
      this.transaction = obj;
      if (id === undefined) {
        id = this.transaction.id;
      }
      if (confirm("Delete transaction?")) {
        window.api.deleteTransaction(id).then((success) => {
          
          if (success) {
            this.snackbarMsg = "Deleted transaction";
            this.snackbarColor = "success";
            this.snackbar = true;
            this.transactionDialog = false;
            this.loadData();
          } else {
            this.snackbarMsg = "Failed to delete transaction";
            this.snackbarColor = "error";
            this.snackbar = true;
          }
        }).catch((error) => {
          this.snackbarMsg = "Failed to delete transaction";
          this.snackbarColor = "error";
          this.snackbar = true;
        })
      }
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
      this.transaction.amount = Number(this.transaction.amount).toString();
    },
    removeInitialZero() {
      if (this.transaction.amount == "0") {
        this.transaction.amount = "";
      }
    },
    renderAmountCurrency(walletId: string) {
      window.api.getWallet(walletId).then((wallet) => {
        window.api.getCurrency(wallet.currency).then((response) => {
          this.currencyPrefix = response.symbolNative;
        })
      })

    },
    setFilter(value) {
      let args = JSON.stringify(value)
      window.api.listTransactions(args).then((response) => {
        if (response != null) {
          this.transactions = response.data;
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    populateDestWallet() {
      if (this.transaction != null && this.transaction.type == 2 && this.transaction.walletId !== undefined) {
        this.transaction.destinationWalletId = undefined;
        window.api.getWallet(this.transaction.walletId).then((value) => {
          this.destWallets = this.wallets.filter((obj: any) => {
            return obj.id != this.transaction.walletId && obj.currency == value.currency;
          });
        })
        
      }
    },
    handleTransferSourceWallet(value) {
      this.renderAmountCurrency(value);
      this.populateDestWallet();
    }
  },
};
</script>
<style scoped>
.trx-row>td {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

.trx-row:hover {
  background: rgb(238, 238, 238) !important;
  cursor: pointer;
}

.tbl-action-col {
  visibility: hidden;
}

.trx-row:hover .tbl-action-col {
  visibility: visible;
  z-index: 1000;
}</style>
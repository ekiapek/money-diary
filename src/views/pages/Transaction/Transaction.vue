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
        <v-col cols="1">
          <FilterChip :wallets="wallets" :categories="categories" :date="activePeriod" @setFilter="setFilter" />
        </v-col>
      </v-row>

      <v-row class="mb-3 mt-3 px-3 gx-5 flex-nowrap overflow-auto scrolling-month">
        <div v-for="month in generateMonths(minDate, maxDate)" :key="month.date">
          <v-chip class="mx-1" color="primary" variant="flat"
            v-if="month.date.getFullYear() == activePeriod.getFullYear() && month.date.getMonth() == activePeriod.getMonth()"
            @click.stop="filterMonth(month.date)">{{ month.str }}</v-chip>
          <v-chip class="mx-1" v-else @click.stop="filterMonth(month.date)">{{ month.str }}</v-chip>
        </div>
      </v-row>

      <v-card v-if="transactions === undefined || transactions.length == 0" elevation="3" class="mb-5 align-top text-center justify-center pa-3">
        <p><i>No transaction found in this month. Start by adding a new transaction.</i></p>
      </v-card>
      <v-card v-else v-for="data in transactions" elevation="3" :key="data.id" class="withbg mb-7">
        <!-- {{transactions[key]}} -->
        <v-card-item>
          <v-card-title class="text-h5">{{ new Date(data.date).toLocaleDateString(userLocale, dateOption)
            }}</v-card-title>
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
                  </div>
                </td>
                <td>
                  <h6 class="text-body-1 text-muted">{{ formatCurrency(item.amount, item.wallet.currency) }}</h6>
                </td>
                <td>
                  <v-chip v-if="item.type == 1" :class="'text-body-1 bg-success'" color="white"
                    size="small">Income</v-chip>
                  <v-chip v-else-if="item.type == 2" :class="'text-body-1 bg-warning'" color="white"
                    size="small">Transfer</v-chip>
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
          <p class="ml-2">
            {{ data.transactions.length > 1 ? data.transactions.length + " transactions" : data.transactions.length + " transaction" }}
          </p>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-dialog v-model="transactionDialog" width="600" style="z-index: 2000;">
      <loading v-model:active="isLoading" />
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
              <v-select class="mb-4" v-model="transaction.walletId" variant="outlined" label="Select Wallet"
                item-value="id" item-title="name" disabled :items="wallets" :menu-props="{ maxHeight: '200px' }">
              </v-select>
            </div>
            <div v-else-if="transaction.type == 2">
              <v-select class="mb-4" v-model="transaction.walletId" variant="outlined" label="Select Source Wallet"
                item-value="id" item-title="name" :items="wallets" :rules="[rules.required]"
                :menu-props="{ maxHeight: '200px' }" @update:modelValue="handleTransferSourceWallet">
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

              <v-select class="mb-4" v-model="transaction.destinationWalletId" variant="outlined"
                label="Select Destination Wallet" item-value="id" item-title="name" :items="destWallets"
                :rules="[rules.required]" :menu-props="{ maxHeight: '200px' }">
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
              <v-select class="mb-4" v-model="transaction.walletId" variant="outlined" label="Select Wallet"
                item-value="id" item-title="name" :items="wallets" :rules="[rules.required]"
                :menu-props="{ maxHeight: '200px' }" @update:modelValue="renderAmountCurrency">
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

            <v-select v-if="transaction.type === 1" v-model="transaction.categoryId" class="mb-4" label="Select Category"
              variant="outlined" item-value="id" item-title="name" :items="validIncomeCategories" :rules="[rules.required]"
              :menu-props="{ maxHeight: '200px' }">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item?.raw?.name || 'Unknown Category'">
                  <template v-slot:prepend>
                    <v-avatar class="text-white" variant="flat" :color="item?.raw?.color || 'grey'">
                      <span class="text-h4">{{ item?.raw?.icon || '' }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>
            <v-select v-else-if="transaction.type === -1" v-model="transaction.categoryId" class="mb-4"
              label="Select Category" variant="outlined" item-value="id" item-title="name" :items="validSpendingCategories"
              :rules="[rules.required]" :menu-props="{ maxHeight: '200px' }">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item?.raw?.name || 'Unknown Category'">
                  <template v-slot:prepend>
                    <v-avatar class="text-white" variant="flat" :color="item?.raw?.color || 'grey'">
                      <span class="text-h4">{{ item?.raw?.icon || '' }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>
            <v-select v-else-if="transaction.type === 2" class="mb-4" label="Select Category" variant="outlined"
              item-disabled="disabled" item-title="name" :items='[]' :menu-props="{ maxHeight: '200px' }" disabled>
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

            <CurrencyInput class="mb-4" v-model="transaction.amount" label="Amount" variant="outlined"
              :currencyLogo="currencyPrefix"></CurrencyInput>

            <v-textarea v-model="transaction.description" label="Description" variant="outlined"></v-textarea>

          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5 justify-end">
          <v-btn class="px-5" @click="transactionDialog = false" variant="tonal" color="muted">Cancel</v-btn>
          <v-btn v-if="transaction?.createdAt" class="px-5" @click="deleteObj(transaction)" variant="tonal"
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
import { Transaction } from "@/types/models/Transaction";
import { Category } from "@/types/models/Category";
import { Wallet } from "@/types/models/Wallet";
import { TransactionFilter } from "@/types/Filter.ts";
import { Base } from "@/types/models/Base";
import { formatCurrency } from "@/util/currency";
import DatePicker from "@/components/date/DatePicker.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import FilterChip from "@/components/shared/FilterChip.vue";
import CurrencyInput from "@/components/input/CurrencyInput.vue";
import dayjs from "dayjs";
import { generateMonths } from "@/util/monthGenerator";
import UUID from "pure-uuid";

export default {
  components: {
    "DatePicker": DatePicker,
    CurrencyInput,
    Loading,
    FilterChip,
  },
  data() {
    return {
      minDate: new Date(),
      maxDate: new Date(),
      activePeriod: new Date(),
      filter: undefined as TransactionFilter | undefined,
      currencies: [] as any[],
      categories: [] as Category[],
      incomeCategories: [] as Category[],
      spendingCategories: [] as Category[],
      wallets: [] as Wallet[],
      destWallets: [] as Wallet[],
      transactions: undefined as any | undefined,
      transactionDialog: false,
      transaction:new Transaction({} as Base, undefined, undefined, undefined, undefined),
      snackbar: false,
      dialogTitle: "",
      snackbarColor: "primary",
      snackbarMsg: "",
      categoryLoading: false,
      currencyPrefix: "",
      currency: { code: "USD" },
      userLocale: navigator.language,
      isLoading: false,
      dateOption: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
      trxType: [{ name: "Income", type: 1 }, { name: "Spending", type: -1 }, { name: "Transfer Money", type: 2 }],
      rules: {
        required: (value:any) => !!value || "This field is required"
      }
    };
  },
  created() {
    this.loadData();
    this.loadWallets();
    this.loadCategories();
  },
  methods: {
    generateMonths,
    formatCurrency,
    loadCategories() {
      window.api.listCategories().then((response) => {
        if (response) {
          this.categories = response;
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
      let date = new Date();
      let startDate:Date = new Date(date.getFullYear(),date.getMonth(),1);
      let endDate:Date = new Date(date.getFullYear(),date.getMonth()+1,0);
      let args:TransactionFilter = {startDate:startDate,endDate:endDate};
      let req = JSON.stringify(args); 
      window.api.listTransactions(req).then((response) => {
        if (response != null) {
          this.transactions = response.data;
          this.minDate = response.minDate;
          this.maxDate = response.maxDate;
          this.activePeriod = response.activePeriod;
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    addItem() {
      this.transactionDialog = true;
      this.transaction = new Transaction({} as Base, undefined, undefined, undefined, undefined);
      this.dialogTitle = "Add new transaction";
    },
    editItem(item: any) {
      this.isLoading = true;
      window.api.getTransaction(item.id).then((result) => {
        if (!result) {
          return;
        }
        this.isLoading = false;
        this.transactionDialog = true;
        this.transaction = result;
        if (this.transaction == null) {
          return;
        }
        this.transaction.transactionDate = dayjs(this.transaction?.transactionDate).toDate();
        this.dialogTitle = "Edit transaction";
        this.renderAmountCurrency(result.walletId);
        if (this.transaction != null && this.transaction.type == 2 && this.transaction.walletId !== undefined) {
          this.destWallets = this.wallets.filter((obj: any) => {
            return obj.id != this.transaction?.walletId;
          });
        }
      })
        .catch(() => {
          this.snackbarColor = "error";
          this.snackbarMsg = "Failed to get transaction.";
        });
    },
    saveTransaction() {
      this.$refs.transactionForm.validate().then((result: any) => {
        if (result.valid) {
          if (this.transaction == null) {
            return;
          }
          this.transaction.amount = Number(this.transaction.amount);
          if (this.transaction.id == "") {
            this.transaction.id = new UUID(4).toString();
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
              this.snackbarColor = "error";
              this.snackbar = true;
            });
          } else {
            window.api.updateTransaction(JSON.stringify(this.transaction)).then((response) => {
              if (response) {
                this.snackbarMsg = "Successfully edited transaction";
                this.snackbarColor = "success";
                this.snackbar = true;
                this.loadData();
              } else {
                this.snackbarMsg = "Failed to edit transaction";
                this.snackbarColor = "error";
                this.snackbar = true;
              }
            }).catch(() => {
              this.snackbarMsg = "Failed to edit transaction";
              this.snackbarColor = "error";
              this.snackbar = true;
            });
          }
          this.transactionDialog = false;
        }
      });

    },
    deleteObj(obj: any) {
      let id = obj.id;
      this.transaction = obj;
      if (id === undefined) {
        id = this.transaction?.id;
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
        }).catch(() => {
          this.snackbarMsg = "Failed to delete transaction";
          this.snackbarColor = "error";
          this.snackbar = true;
        });
      }
    },
    renderAmountCurrency(walletId: string) {
      window.api.getWallet(walletId).then((wallet) => {
        window.api.getCurrency(wallet.currency).then((response) => {
          this.currencyPrefix = response.symbolNative;
          this.currency = response;
        });
      });
    },
    filterMonth(date: Date) {
      let startDate: Date = new Date(date.getFullYear(), date.getMonth(), 1);
      let endDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let filter: TransactionFilter = { startDate: startDate, endDate: endDate };
      this.setFilter(filter);
    },
    setFilter(value: TransactionFilter) {
      let args = JSON.stringify(value);
      window.api.listTransactions(args).then((response) => {
        if (response) {
          this.transactions = response.data;
          this.activePeriod = response.activePeriod;
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    populateDestWallet() {
      if (this.transaction != null && this.transaction.type == 2 && this.transaction.walletId !== undefined) {
        this.transaction.destinationWalletId = undefined;

        this.destWallets = this.wallets.filter((obj: any) => {
          return obj.id != this.transaction?.walletId;
        });
      }
    },
    handleTransferSourceWallet(value: any) {
      this.renderAmountCurrency(value);
      this.populateDestWallet();
    }
  },
  computed: {
    // Computed property to manage the filtered list of income categories
    validIncomeCategories() {
      // Check if the current categoryId exists in incomeCategories
      const categoryExists = this.incomeCategories.some(
        (category:any) => category.id === this.transaction.categoryId
      );

      // If the categoryId is not valid, reset it to null
      if (!categoryExists) {
        this.transaction.categoryId = undefined;
      }

      return this.incomeCategories; // Return the categories as usual
    },
    // Computed property to manage the filtered list of spendings categories
    validSpendingCategories() {
      // Check if the current categoryId exists in incomeCategories
      const categoryExists = this.spendingCategories.some(
        (category:any) => category.id === this.transaction.categoryId
      );

      // If the categoryId is not valid, reset it to null
      if (!categoryExists) {
        this.transaction.categoryId = undefined;
      }

      return this.spendingCategories; // Return the categories as usual
    },
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
}
</style>
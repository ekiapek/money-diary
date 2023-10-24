<template>
  <v-row>
    <v-col cols="12" md="12">
      <h2 class="text-h2 mb-6 pl-7 pt-7 font-weight-bold" style="color: black; font-weight: bold;">
        Category</h2>
      <p class="mb-6 pl-7">Categorizing your cashflow can impact to better financial management!</p>
      <v-card elevation="10" class="withbg" style='background: hsla(210, 44%, 96%, 1);

background: linear-gradient(315deg, hsla(210, 44%, 96%, 1) 0%, hsla(0, 100%, 93%, 1) 100%);

background: -moz-linear-gradient(315deg, hsla(210, 44%, 96%, 1) 0%, hsla(0, 100%, 93%, 1) 100%);

background: -webkit-linear-gradient(315deg, hsla(210, 44%, 96%, 1) 0%, hsla(0, 100%, 93%, 1) 100%);

filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#F2F6FA", endColorstr="#FFDBDB", GradientType=1 );
      margin-bottom: 2%;'>
        <v-card-item class="pa-0">
          <div class="d-sm-flex align-center justify-space-between">
            <h5 class="text-h5 mb-6 pl-7 pt-7">Spendings Category</h5>
            <div class="ma-7">
              <v-btn prepend-icon="mdi-plus" variant="outlined" rounded="xl" style="color: rgb(var(--v-theme-primary));"
                @click="addItem(-1)">Add new</v-btn>
            </div>
          </div>
          <v-container class="">
            <v-row justify="start">
              <v-col v-if="spendings.length == 0" class="align-top text-center justify-center"><i>No data</i></v-col>
              <v-col v-else v-for="cat in spendings" :key="cat.id" cols="3">
                <v-card elevation="10" @click="editItem(cat)">
                  <div class="py-5 px-4">
                    <v-row justify="start">
                      <v-col cols="2" class="mx-2 item-icon align-center text-center"
                        :style="{ 'background-color': cat.color, 'border-radius': '50%', 'min-width': '48px', 'min-height': '48px' }">
                        <h4>{{ cat.icon }}</h4>
                      </v-col>
                      <v-col class="pl-2">
                        <h5>{{ cat.name }} </h5>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-item>
      </v-card>


      <v-card elevation="10" class="withbg"
        style='background: hsla(210, 44%, 96%, 1);

background: linear-gradient(315deg, hsla(210, 44%, 96%, 1) 0%, hsla(207, 100%, 93%, 1) 100%);

background: -moz-linear-gradient(315deg, hsla(210, 44%, 96%, 1) 0%, hsla(207, 100%, 93%, 1) 100%);

background: -webkit-linear-gradient(315deg, hsla(210, 44%, 96%, 1) 0%, hsla(207, 100%, 93%, 1) 100%);

filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#F2F6FA", endColorstr="#DBEFFF", GradientType=1 );'>
        <v-card-item class="pa-0">
          <div class="d-sm-flex align-center justify-space-between">
            <h5 class="text-h5 mb-6 pl-7 pt-7">Income Category</h5>
            <div class="ma-7">
              <v-btn prepend-icon="mdi-plus" variant="outlined" rounded="xl" style="color: rgb(var(--v-theme-primary));"
                @click="addItem(1)">Add new</v-btn>
            </div>
          </div>
          <v-container class="">
            <v-row justify="start">
              <v-col v-if="income.length == 0" class="align-top text-center justify-center"><i>No data</i></v-col>
              <v-col v-else v-for="cat in income" :key="cat.id" cols="3">
                <v-card elevation="10" @click="editItem(cat)">
                  <div class="py-5 px-4">
                    <v-row justify="start">
                      <v-col cols="2" class="mx-2 item-icon align-center text-center"
                        :style="{ 'background-color': cat.color, 'border-radius': '50%', 'min-width': '48px', 'min-height': '48px' }">
                        <h4>{{ cat.icon }}</h4>
                      </v-col>
                      <v-col class="pl-2">
                        <h5>{{ cat.name }} </h5>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-item>
      </v-card>
    </v-col>

    <v-dialog v-model="categoryDialog" width="600" style="z-index: 2000;">
      <v-card class="pa-2">
        <v-card-title class="headline black pt-4" primary-title>
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text class="">
          <v-container>
            <v-row class="mb-3">
              <EmojiPicker :emoji="category.icon" :color=pickerColor @emojiChanged="onChangeEmoji" />
              <ColorPicker class="mx-6" :colorProps="pickerColor" @colorChanged="onChangeColor" />
            </v-row>
          </v-container>
          <v-form ref="sendForm" v-model="valid" lazy-validation>
            <v-text-field v-model="category.name" class="mb-4" label="Category name" variant="outlined"
              :rules="[rules.required]"></v-text-field>
            <v-textarea v-model="category.description" label="Description" variant="outlined"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5 justify-end">
          <v-btn class="px-5" @click="categoryDialog = false" variant="tonal" color="muted">Cancel</v-btn>
          <v-btn v-if="category.createdAt" class="px-5" @click="deleteObj()" variant="tonal" color="error">Delete</v-btn>
          <v-btn class="px-8" @click="save()" variant="tonal" color="primary">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2000" :color="snackbarColor">
      {{ snackbarMsg }}
    </v-snackbar>
  </v-row>
</template>
<script lang="ts">
import { Category } from '../../../../electron/core/models/Category';
import EmojiPicker from '@/components/emoji/EmojiPicker.vue';
import ColorPicker from '@/components/color/ColorPicker.vue';

export default {
  components: {
    "EmojiPicker": EmojiPicker,
    "ColorPicker": ColorPicker
  },
  data() {
    return {
      spendings: [],
      income: [],
      categoryDialog: false,
      category: null,
      valid: true,
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
  },
  methods: {
    loadData() {
      window.api.listCategories().then((response) => {
        if (response) {
          this.spendings = response.filter((obj) => {
            return obj.type == -1;
          });
          this.income = response.filter((obj) => {
            return obj.type == 1;
          });
        }
      });
    },
    addItem(type) {
      this.dialog = true;
      this.categoryDialog = true;
      this.category = new Category({}, type);
      if (type == 1) {
        this.dialogTitle = "Add new Income Category";
      } else {
        this.dialogTitle = "Add new Spending Category";
      }
      this.pickerColor = this.generateHex();
    },
    editItem(item: any) {
      this.category = item;
      this.editedId = item.id;
      this.dialog = true;
      this.categoryDialog = true;
      this.dialogTitle = "Edit category: " + item.name;
      this.emojiColor = item.color;
      this.pickerColor = item.color;
    },
    save() {
      this.$refs.sendForm.validate().then((result) => {
        if (result.valid) {
          if (!this.category.createdAt) {
            this.category.color = this.pickerColor;
            window.api.insertCategory(JSON.stringify(this.category)).then((response) => {
              if (response) {
                this.snackbarMsg = "Category added";
                this.snackbarColor = "success";
                this.snackbar = true;
                this.loadData()
              } else {
                this.snackbarMsg = "Failed to add category";
                this.snackbarColor = "error";
                this.snackbar = true;
              }
            }).catch(() => {
              this.snackbarMsg = "Failed to add category";
              this.snackbarColor = "error"
              this.snackbar = true;
            });

          } else {
            this.category.color = this.pickerColor ? this.pickerColor : this.category.color;
            window.api.updateCategory(JSON.stringify(this.category)).then((response) => {
              if (response) {
                this.snackbarMsg = "Successfully edited category";
                this.snackbarColor = "success";
                this.snackbar = true;
                this.loadData()
              } else {
                this.snackbarMsg = "Failed to edit category";
                this.snackbarColor = "error";
                this.snackbar = true;
              }
            }).catch(() => {
              this.snackbarMsg = "Failed to edit category";
              this.snackbarColor = "error"
              this.snackbar = true;
            });
          }
          this.categoryDialog = false
        }
      });
    },
    deleteObj() {
      if (confirm("Delete this category?")) {
        window.api.deleteCategory(this.category.id).then((success) => {
          if (success) {
            this.snackbarMsg = "Deleted category";
            this.snackbarColor = "success";
            this.snackbar = true;
            this.categoryDialog = false;
            this.loadData()
          } else {
            this.snackbarMsg = "Failed to delete category";
            this.snackbarColor = "error";
            this.snackbar = true;
          }
        }).catch((error) => {
          this.snackbarMsg = "Failed to delete category";
          this.snackbarColor = "error";
          this.snackbar = true;
        })
      }
    },
    onChangeColor(newColor) {
      this.pickerColor = newColor;
    },
    onChangeEmoji(newEmoji) {
      this.category.icon = newEmoji;
    },
    generateHex() {
      let letters = "0123456789ABCDEF";
      let color = '#';
      for (let i = 0; i < 6; i++)
        color += letters[(Math.floor(Math.random() * 16))];

      return color;
    }
  },
};
</script>
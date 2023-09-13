<script setup lang="ts">
import { ref } from 'vue';

let cats = ref(await window.api.listCategories());

</script>
<template>
    <v-card elevation="10" class="withbg"
        style='background: hsla(0, 0%, 100%, 1);background: linear-gradient(315deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 100%, 93%, 1) 100%);background: -moz-linear-gradient(315deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 100%, 93%, 1) 100%);background: -webkit-linear-gradient(315deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 100%, 93%, 1) 100%);filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#FFFFFF", endColorstr="#FFDBDB", GradientType=1 ); margin-bottom: 2%;'>
        <v-card-item class="pa-0">
            <div class="d-sm-flex align-center justify-space-between">
                <h5 class="text-h5 mb-6 pl-7 pt-7">Spendings Category</h5>
                <div class="ma-7">
                    <v-btn prepend-icon="mdi-plus" variant="outlined" rounded="xl"
                        style="color: rgb(var(--v-theme-primary));" @click.stop="addItem">Add new</v-btn>
                </div>
            </div>
            <v-container class="">
                <v-row justify="start">
                    <v-col v-for="cat in cats" :key="cat.id" cols="3">
                        <v-card elevation="10" @click.stop="editItem(cat)">
                            <div class="py-5 px-4">
                                <v-row justify="start">
                                    <v-col cols="2" class="mx-2"
                                        style="background-color: aqua;border-radius: 50%; min-width: fit-content;">
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
</template>
<script lang="ts">
import CategoryDialog from './CategoryDialog.vue';

export default {
    components: {
        "edit-modal": CategoryDialog,
    },
    data() {
        return {
            items: [

            ],
            headers: [

            ],
            editedId: null,
            dialog: false,
        };
    },
    methods: {
        addItem() {
            this.dialog = true;
        },
        editItem(item: any) {
            this.editedId = item.id;
            this.dialog = true;
        },
    },
};
</script>
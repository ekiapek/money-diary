<script setup lang="ts">
import { Category } from "@/types/models/Category";
import { PropType } from "vue";
const props = defineProps({
    category: Category as PropType<Category>
});
</script>
<template>
    <v-card class="py-3 px-3 d-flex align-center" elevation="3" height="100%">
        <v-row no-gutters class="align-center ">
            <v-col class="mr-sm-2 d-flex justify-center">
                <v-avatar size="x-large" height="100%" class="text-white" variant="flat" :color="category?.color">
                    <span class="text-h2">{{ category?.icon }}</span>
                </v-avatar>
            </v-col>
            <v-col xl="8" lg="8" md="7" sm="6">
                <h5 style="overflow-wrap: break-all; word-break: break-word;">{{ category?.name }} </h5>
            </v-col>
        </v-row>
    </v-card>
</template>
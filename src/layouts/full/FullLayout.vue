<script setup lang="ts">
import { RouterView } from 'vue-router';
// import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
// import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import MainView from './Main.vue';
</script>
<template>
    <v-locale-provider>
        <v-app>
            <!-- <VerticalSidebarVue />
            <VerticalHeaderVue  /> -->
            <MainView />
            <v-main class="bg-grey">
                <v-container fluid class="page-wrapper">
                    <div class="maxWidth">
                        <RouterView v-slot="{ Component, route }">
                            <transition name="slide-x-transition" mode="out-in">
                                <component :is="Component" :key="route.path" />
                            </transition>
                        </RouterView>
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
<style>
.bg-grey{
    background: rgb(var(--v-theme-grey100));
}
</style>

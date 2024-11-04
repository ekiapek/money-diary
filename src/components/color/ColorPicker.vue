<template>
    <v-row class="justify-start align-center">
        <v-menu v-model="menu" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
                <div :style="swatchStyle" v-bind="props" />
            </template>
            <v-card>
                <v-card-text class="pa-0">
                    <v-color-picker v-model="color" flat hide-inputs />
                </v-card-text>
            </v-card>
        </v-menu>
    </v-row>
</template>
<script lang="ts">
export default {
    name: "ColorPicker",
    props:{
        colorProps:String,
    },
    data() {
        return {
            color: this.colorProps ? this.colorProps : "#1976D2FF",
            mask: "!#XXXXXXXX",
            menu: false,
        };
    },
    computed: {
        swatchStyle() {
            const { color, menu } = this;
            return {
                backgroundColor: color,
                cursor: "pointer",
                height: "30px",
                width: "30px",
                borderRadius: menu ? "50%" : "4px",
                transition: "border-radius 200ms ease-in-out"
            };
        }
    },
    watch: {
        "color"(){
            this.$emit("colorChanged",this.color);
        }
    }
};
</script>
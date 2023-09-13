<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn id="btn-emoji" v-if="emoji" v-bind="props" :style="style" >
                <h1>{{ emojiData }}</h1>
            </v-btn>
            <v-btn rounded icon="mdi-emoticon-happy-outline" v-else v-bind="props" variant="tonal" style="color: #b5b5b5;">
                
            </v-btn>
        </template>
        <Picker :native="true" @select="onEmojiSelect"/>
    </v-menu>
</template>
<script lang="ts">
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css'

export default {
    name:"EmojiPicker",
    components:{
        "Picker":EmojiPicker
    },
    data() {
        return {
            emojiData:this.emoji,
        }
    },
    props:{
        emoji: String,
        color: String
    },
    computed: {
        style(){
            return {
                '--color': this.color ? this.color : '#b5b5b5',
            }
        }
    },
    methods: {
        onEmojiSelect(newEmoji){
            this.emojiData = newEmoji.i;
            this.$emit('emojiChanged',newEmoji.i);
        }
    }
}
</script>
<style scoped>
#btn-emoji{
    background-color: var(--color);
    min-width: fit-content;
    border-radius: 50%;
    height: 64px;
}
</style>
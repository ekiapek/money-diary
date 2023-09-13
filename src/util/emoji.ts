// import emojiRegex from 'emoji-regex'

// import data from "emoji-mart-vue-fast/data/all.json";
// import "emoji-mart-vue-fast/css/emoji-mart.css";
// import { Picker, EmojiIndex } from "emoji-mart-vue-fast";
// import { endsWith } from 'lodash'

// const unicodeEmojiRegex = emojiRegex()

// export function wrapEmoji(text: string): string {
//   return text.replace(unicodeEmojiRegex, function(match, offset) {
//     const before = text.substring(0, offset)
//     if (endsWith(before, 'alt="') || endsWith(before, 'data-text="')) {
//       // Emoji inside the replaced <img>
//       return match
//     }
//     // Find emoji object by native emoji.
//     let emoji = emojiIndex.nativeEmoji(match)
//     if (!emoji) {
//       // Can't find unicode emoji in our index
//       return match
//     }
//     // See `emojiToHtml` function above.
//     return emojiToHtml(emoji)
//   })
// }

// /**
//  * Convert Emoji to HTML to represent it as an image.
//  */
// export function emojiToHtml(emoji: Emoji): string {
//     let style = `background-position: ${emoji.getPosition()}`
//     // The src="data:image..." is needed to prevent border around img tags.
//     return `<img data-text="${emoji.native}" alt="${
//       emoji.colons
//     }" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class='emoji-text' style="${style}">`
//   }
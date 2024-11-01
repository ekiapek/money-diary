import { API } from "./core/handlers/api";
import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api",API);

function domReady(condition: DocumentReadyState[] = ["complete", "interactive"]) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = "loaders-css__square-spin";
  const styleContent = `
.${className} > div {
  max-height: 120px;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="400" height="112" viewBox="0 0 2000 560"><g transform="matrix(1,0,0,1,-1.2121212121212466,0.9787838168253415)"><svg viewBox="0 0 396 111" data-background-color="#ffffff" preserveAspectRatio="xMidYMid meet" height="560" width="2000" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="tight-bounds" transform="matrix(1,0,0,1,0.2400000000000091,-0.1940089351207348)"><svg viewBox="0 0 395.52 111.38801787024146" height="111.38801787024146" width="395.52"><g><svg viewBox="0 0 651.9566349808048 183.60678930993217" height="111.38801787024146" width="395.52"><g><rect width="5.064998417424747" height="183.60678930993217" x="238.1124784025823" y="0" fill="#0074d9" opacity="1" stroke-width="0" stroke="transparent" fill-opacity="1" class="rect-o-0" data-fill-palette-color="primary" rx="1%" id="o-0" data-palette-color="#0074d9"></rect></g><g transform="matrix(1,0,0,1,256.4366349808048,0.4567333067411141)"><svg viewBox="0 0 395.52 182.69332269644994" height="182.69332269644994" width="395.52"><g id="textblocktransform"><svg viewBox="0 0 395.52 182.69332269644994" height="182.69332269644994" width="395.52" id="textblock"><g><svg viewBox="0 0 395.52 182.69332269644994" height="182.69332269644994" width="395.52"><g transform="matrix(1,0,0,1,0,0)"><svg width="395.52" viewBox="0.2500009536743164 -35 250.70001220703125 112.80000305175781" height="182.69332269644994" data-palette-color="#0074d9"><svg></svg><svg></svg><svg></svg><g class="wordmark-text-0" data-fill-palette-color="primary" id="text-0"><path xmlns="http://www.w3.org/2000/svg" d="M41.7 0h-12.15l-4.45-20.95h-0.2l-4.45 20.95h-12.15l-8.05-34.4h11.5l3.95 19.5h0.2l3.9-19.5h10.9l4.15 19.5h0.2l3.7-19.5h11zM87.95 0h-11.05v-13.05h-12.15v13.05h-11.05v-34.4h11.05v12.55h12.15v-12.55h11.05zM95.35 0v-34.4h29.75v8.25h-18.7v4.75h16v7.9h-16v5.25h19.05v8.25zM164.1-23.85c0 2.1-0.567 4-1.7 5.7-1.133 1.7-2.783 2.95-4.95 3.75v0l7.65 14.4h-12.4l-6.1-12.55h-4.1v12.55h-11.05v-34.4h21.05c2.467 0 4.573 0.473 6.32 1.42 1.753 0.953 3.073 2.237 3.96 3.85 0.88 1.62 1.32 3.38 1.32 5.28zM152.85-23.4c0-0.9-0.3-1.65-0.9-2.25-0.6-0.6-1.333-0.9-2.2-0.9v0h-7.25v6.35h7.25c0.867 0 1.6-0.31 2.2-0.93 0.6-0.613 0.9-1.37 0.9-2.27zM170.35 0v-34.4h29.75v8.25h-18.7v4.75h16v7.9h-16v5.25h19.05v8.25zM213.75-27.05l-2.4 7.15h-3.4l-2.35-7.15v-7.35h8.15zM234.8-35c4.4 0 8.017 0.89 10.85 2.67 2.833 1.787 4.283 4.43 4.35 7.93v0 0.6h-10.35v-0.2c0-1-0.367-1.833-1.1-2.5-0.733-0.667-1.85-1-3.35-1v0c-1.467 0-2.59 0.217-3.37 0.65-0.787 0.433-1.18 0.967-1.18 1.6v0c0 0.9 0.533 1.567 1.6 2 1.067 0.433 2.783 0.883 5.15 1.35v0c2.767 0.567 5.043 1.157 6.83 1.77 1.78 0.62 3.337 1.63 4.67 3.03 1.333 1.4 2.017 3.3 2.05 5.7v0c0 4.067-1.373 7.083-4.12 9.05-2.753 1.967-6.43 2.95-11.03 2.95v0c-5.367 0-9.54-0.9-12.52-2.7-2.987-1.8-4.48-4.983-4.48-9.55v0h10.45c0 1.733 0.45 2.89 1.35 3.47 0.9 0.587 2.3 0.88 4.2 0.88v0c1.4 0 2.56-0.15 3.48-0.45 0.913-0.3 1.37-0.917 1.37-1.85v0c0-0.833-0.507-1.46-1.52-1.88-1.02-0.413-2.68-0.853-4.98-1.32v0c-2.8-0.6-5.117-1.227-6.95-1.88-1.833-0.647-3.433-1.72-4.8-3.22-1.367-1.5-2.05-3.533-2.05-6.1v0c0-3.767 1.457-6.543 4.37-8.33 2.92-1.78 6.613-2.67 11.08-2.67z" fill="#0074d9" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal" data-fill-palette-color="primary" opacity="1"></path><path xmlns="http://www.w3.org/2000/svg" d="M44.2 38.6h-10.95v-12.4c0-1.533 0.06-3.11 0.18-4.73 0.113-1.613 0.237-2.97 0.37-4.07 0.133-1.1 0.217-1.8 0.25-2.1v0h-0.2l-6.35 23.3h-8.65l-6.4-23.25h-0.2c0.033 0.3 0.127 0.99 0.28 2.07 0.147 1.087 0.287 2.437 0.42 4.05 0.133 1.62 0.2 3.197 0.2 4.73v0 12.4h-10.15v-34.4h15.6l5.2 19.85h0.2l5.15-19.85h15.05zM72.25 25.25v13.35h-11.05v-13.35l-13.65-21.05h12.7l6.6 11.45h0.2l6.6-11.45h12.05z" fill="#010c80" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal" data-fill-palette-color="secondary" opacity="1"></path><path xmlns="http://www.w3.org/2000/svg" d="M44.2 77.2h-10.95v-12.4c0-1.533 0.06-3.11 0.18-4.73 0.113-1.613 0.237-2.97 0.37-4.07 0.133-1.1 0.217-1.8 0.25-2.1v0h-0.2l-6.35 23.3h-8.65l-6.4-23.25h-0.2c0.033 0.3 0.127 0.99 0.28 2.07 0.147 1.087 0.287 2.437 0.42 4.05 0.133 1.62 0.2 3.197 0.2 4.73v0 12.4h-10.15v-34.4h15.6l5.2 19.85h0.2l5.15-19.85h15.05zM68 42.2c5.933 0 10.517 1.517 13.75 4.55 3.233 3.033 4.85 7.45 4.85 13.25v0c0 5.8-1.617 10.217-4.85 13.25-3.233 3.033-7.817 4.55-13.75 4.55v0c-5.933 0-10.507-1.51-13.72-4.53-3.22-3.013-4.83-7.437-4.83-13.27v0c0-5.833 1.61-10.26 4.83-13.28 3.213-3.013 7.787-4.52 13.72-4.52zM68 50.45c-2.367 0-4.167 0.717-5.4 2.15-1.233 1.433-1.85 3.367-1.85 5.8v0 3.2c0 2.433 0.617 4.367 1.85 5.8 1.233 1.433 3.033 2.15 5.4 2.15v0c2.367 0 4.177-0.717 5.43-2.15 1.247-1.433 1.87-3.367 1.87-5.8v0-3.2c0-2.433-0.623-4.367-1.87-5.8-1.253-1.433-3.063-2.15-5.43-2.15zM126.8 77.2h-9.65l-14.45-16.7v16.7h-10.15v-34.4h9.65l14.45 16.95v-16.95h10.15zM134.2 77.2v-34.4h29.75v8.25h-18.7v4.75h16v7.9h-16v5.25h19.05v8.25zM191.65 63.85v13.35h-11.05v-13.35l-13.65-21.05h12.7l6.6 11.45h0.2l6.6-11.45h12.05zM221 42.2c2.533 0 4.767 0.417 6.7 1.25 1.933 0.833 3.433 2.023 4.5 3.57 1.067 1.553 1.6 3.347 1.6 5.38v0c0 1.3-0.283 2.457-0.85 3.47-0.567 1.02-1.233 1.88-2 2.58-0.767 0.7-1.733 1.467-2.9 2.3v0c-0.967 0.733-1.673 1.317-2.12 1.75-0.453 0.433-0.68 0.883-0.68 1.35v0 1.05h-8.55v-2.5c0-0.8 0.25-1.527 0.75-2.18 0.5-0.647 1.283-1.47 2.35-2.47v0c1.1-0.967 1.94-1.833 2.52-2.6 0.587-0.767 0.88-1.617 0.88-2.55v0c0-0.967-0.3-1.793-0.9-2.48-0.6-0.68-1.4-1.02-2.4-1.02v0c-2.167 0-3.25 1.4-3.25 4.2v0c0 0.6 0.017 1.05 0.05 1.35v0h-9.2c-0.033-0.233-0.067-0.5-0.1-0.8-0.033-0.3-0.05-0.667-0.05-1.1v0c0-2.133 0.583-3.993 1.75-5.58 1.167-1.58 2.79-2.803 4.87-3.67 2.087-0.867 4.43-1.3 7.03-1.3zM226 77.2h-9.9v-9.25h9.9z" fill="#3d9970" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal" data-fill-palette-color="accent" opacity="1"></path></g></svg></g></svg></g></svg></g></svg></g><g transform="matrix(1,0,0,1,0,0.4567333067411141)"><svg viewBox="0 0 224.85332024178453 182.69332269644994" height="182.69332269644994" width="224.85332024178453"><g><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0" y="0" viewBox="0 48 512 416" enable-background="new 0 0 512 512" xml:space="preserve" height="182.69332269644994" width="224.85332024178453" class="icon-icon-0" data-fill-palette-color="accent" id="icon-0"><path d="M16 400h192c8.844 0 16-5.375 16-12v-24c0-6.625-7.156-12-16-12H16c-8.844 0-16 5.375-16 12v24C0 394.625 7.156 400 16 400zM16 464h192c8.844 0 16-5.375 16-12v-24c0-6.625-7.156-12-16-12H16c-8.844 0-16 5.375-16 12v24C0 458.625 7.156 464 16 464zM16 336h192c8.844 0 16-5.375 16-12v-24c0-6.625-7.156-12-16-12H16c-8.844 0-16 5.375-16 12v24C0 330.625 7.156 336 16 336zM255.297 329.625c0.25-1.875 0.703-3.688 0.703-5.625v-24c0-24.688-21.078-44-48-44h-64c0-44.188 35.813-80 80-80s80 35.813 80 80C304 289.063 283.922 317.438 255.297 329.625zM0 112h448v288H254.094c1.141-3.813 1.906-7.813 1.906-12v-20h96c0-35.344 28.656-64 64-64v-96c-35.344 0-64-28.656-64-64H96c0 35.344-28.656 64-64 64v48H16c-5.672 0-10.984 1.031-16 2.594V112zM512 48v320h-32V80H32V48H512z" fill="#3d9970" data-fill-palette-color="accent"></path></svg></g></svg></g></svg></g><defs></defs></svg><rect width="395.52" height="111.38801787024146" fill="none" stroke="none" visibility="hidden"></rect></g></svg></g></svg></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = ev => {
  ev.data.payload === "removeLoading" && removeLoading();
};

setTimeout(removeLoading, 3000);

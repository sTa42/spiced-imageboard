import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
        };
    },
    mounted() {
        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                this.images = data;
            });
    },
}).mount("#main");

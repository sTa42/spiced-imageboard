import * as Vue from "./vue.js";
import modalFocusImage from "./modalFocusImage.js";

Vue.createApp({
    data() {
        return {
            images: [],
            username: "",
            title: "",
            description: "",
            file: null,
            selectedImage: null,
        };
    },
    components: {
        "modal-focus-image": modalFocusImage,
    },
    mounted() {
        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                console.log({ data });
                console.log(data);
                this.images = data;
            });
    },
    methods: {
        clickHandler: function (e) {
            // e.preventDefault();
            console.log(this);
            const fd = new FormData();
            fd.append("username", this.username);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("file", this.file);

            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then((res) => res.json())
                .then((response) => {
                    console.log(response);
                    if (response.success) {
                        this.images.unshift(response.image);
                        this.clearInputFields();
                    }
                })
                .catch((err) => console.log("error", err));
        },
        fileSelectHandler(e) {
            console.log(e);
            this.file = e.target.files[0];
        },
        clearInputFields() {
            this.username = "";
            this.title = "";
            this.description = "";
            this.file = null;
            this.$refs.fileInput.value = null;
        },
        selectImage(imageIdClicked) {
            console.log(imageIdClicked);
            this.selectedImage = imageIdClicked;
        },
        unfocusImage() {
            this.selectedImage = null;
        },
    },
}).mount("#main");

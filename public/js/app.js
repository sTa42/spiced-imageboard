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
            lastIdImage: "",
            showMoreButton: true,
        };
    },
    components: {
        "modal-focus-image": modalFocusImage,
    },
    mounted() {
        window.addEventListener("popstate", () => {
            console.log("back/forward button clckkd");
            console.log("updated to ", location.pathname);
            if (location.pathname.slice(1).length === 0) {
                this.selectedImage = null;
            } else {
                this.selectedImage = location.pathname.slice(1);
            }
        });
        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                console.log({ data });
                console.log(data);
                this.images = data;
                this.lastIdImage = data[data.length - 1].id;
                console.log(this.lastIdImage);
                console.log(location.pathname);

                this.selectedImage = location.pathname.slice(1);
            })
            .catch((err) => {
                console.log(err);
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
            history.pushState({}, "", `${imageIdClicked}`);
            this.selectedImage = imageIdClicked;
        },
        unfocusImage() {
            this.selectedImage = null;
            history.pushState({}, "", "/");
        },
        changeToImage(imageIdToGo) {
            console.log("FROM PARENT", imageIdToGo);
            history.pushState({}, "", `/${imageIdToGo}`);
            this.selectedImage = imageIdToGo;
        },
        getMoreImages(lowestId) {
            fetch(`/images/more/${lowestId}`)
                .then((res) => res.json())
                .then((response) => {
                    // console.log(response);

                    if (response.success) {
                        response.images.forEach((item) => {
                            if (item.lowestId === item.id) {
                                this.showMoreButton = false;
                            }
                        });
                        this.images = [...this.images, response.images].flat();
                        // console.log(this.images);
                        this.lastIdImage =
                            response.images[response.images.length - 1].id;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
}).mount("#main");

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
            newContentFound: false,
            intervallCheck: "",
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
        this.selectedImage = location.pathname.slice(1);

        this.getImages();
        this.startCheckingForNewContent();
        // fetch("/images")
        //     .then((resp) => resp.json())
        //     .then((data) => {
        //         console.log({ data });
        //         console.log(data);
        //         this.images = data;
        //         this.lastIdImage = data[data.length - 1].id;
        //         console.log(this.lastIdImage);
        //         console.log(location.pathname);

        //         // this.selectedImage = location.pathname.slice(1);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
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
        getImages() {
            fetch("/images")
                .then((resp) => resp.json())
                .then((data) => {
                    console.log({ data });
                    console.log(data);
                    this.images = data;
                    this.lastIdImage = data[data.length - 1].id;
                    console.log(this.lastIdImage);
                    console.log(location.pathname);

                    // this.selectedImage = location.pathname.slice(1);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        startCheckingForNewContent() {
            this.intervallCheck = setInterval(() => {
                this.checkIfContentGotAdded();
            }, 5000);
        },
        stopCheckingForNewContent() {
            clearInterval(this.intervallCheck);
        },
        checkIfContentGotAdded() {
            fetch("/images")
                .then((resp) => resp.json())
                .then((data) => {
                    console.log(
                        "comparing: from Fetch",
                        data[0].id,
                        " AND from images: ",
                        this.images[0].id
                    );
                    console.log(data);
                    console.log(this.images);
                    if (data[0].id !== this.images[0].id) {
                        this.newContentFound = true;
                        this.stopCheckingForNewContent();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        loadNewImages() {
            fetch("/images")
                .then((resp) => resp.json())
                .then((data) => {
                    // let anchorPoint = data.findIndex((item) => {
                    //     return item.id === this.images[0].id;
                    // });
                    // console.log("anchorpoint", anchorPoint);

                    // for (let i = anchorPoint; i > 0; i--) {
                    //     console.log("INSIDE MY LOOP", data[i]);
                    //     this.images.unshift(data[i]);
                    // }

                    // data.reverse().forEach((item) => {
                    //     let indexInImages = this.images.findIndex((image) => {
                    //         console.log(item.id, "comparing with", image.id);
                    //         return item.id === image.id;
                    //     });
                    //     console.log(indexInImages);
                    //     if (item.id === this.images[indexInImages].id) {
                    //         return;
                    //     }
                    //     this.images.unshift(item);
                    // });
                    let indexInImages;
                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < this.images.length; j++) {
                            if (data[i].id === this.images[j].id) {
                                indexInImages = j;
                            }
                        }
                    }
                    console.log("initial position index: ", indexInImages);
                    for (let i = data.length - 1; i >= 0; i--) {
                        if (this.images[indexInImages].id != data[i].id) {
                            this.images.unshift(data[i]);
                            indexInImages++;
                        }
                    }

                    this.startCheckingForNewContent();
                    this.newContentFound = false;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
}).mount("#main");

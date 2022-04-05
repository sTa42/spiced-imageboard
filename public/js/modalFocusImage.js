import commentsComponent from "./commentsComponent.js";

const modalFocusImage = {
    data() {
        return {
            title: "",
            username: "",
            url: "",
            description: "",
            createdAt: "",
            showNoResult: false,
            nextId: "",
            prevId: "",
        };
    },
    components: {
        "comments-component": commentsComponent,
    },
    props: ["imageId"],
    watch: {
        imageId(newId, oldId) {
            console.log(newId, oldId, "HEY I SHOULD CHANGE FROM COMMENTS");
            if (!isNaN(newId)) {
                this.getImageData(this.imageId);
            }
        },
    },
    mounted() {
        console.log("Compontent moutned in browser");
        console.log("from component", this.imageId);

        this.getImageData(this.imageId);
    },
    methods: {
        getImageData(imageId) {
            fetch(`/image/${imageId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.success) {
                        console.log(data.image);
                        this.title = data.image.title;
                        this.username = data.image.username;
                        this.url = data.image.url;
                        this.description = data.image.description;
                        this.createdAt = data.image.created_at;
                        this.nextId = data.image.nextid;
                        this.prevId = data.image.previd;
                    } else {
                        this.showNoResult = true;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        triggerUnfocus() {
            this.$emit("close");
        },
        triggerGoNext() {
            console.log("GO NEXT: ", this.nextId);
            this.$emit("update", this.nextId);
        },
        triggerGoPrev(e) {
            console.log(e);
            console.log("GO PREV: ", this.prevId);
            this.$emit("update", this.prevId);
        },
        formatDate(date) {
            let year = date.substring(0, 4);
            let month = date.substring(5, 7);
            let day = date.substring(8, 10);
            let hours = date.substring(11, 13);
            let minutes = date.substring(14, 16);
            let seconds = date.substring(17, 19);
            return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
        },
    },
    template: `
    <div class="overlay" @click=triggerUnfocus>
        <div class="exitContainer">
            <img @click=triggerUnfocus src="/x-square.svg" class="navButton exit" width="50" height="50" alt="unfocus image button">
        </div>
        <img v-if="nextId" @click.stop="triggerGoNext" src="/arrow-left-square.svg" class="navButton" width="50" height="50" alt="next image button">
        <div @click.stop>
        
        <div v-if="showNoResult" class="noResult"><p>🙁 Oh noe, that image does not exist. 🙁</p>
        </div>
        <div v-else class="focusImageContainer">
            <div class="imageContainerFocus">
            <img :src="url" :alt="title" class="focusedImage"></div>
                <div class="attributesContainer">
                    <div class="modalTitle">
                        <h4>{{title}}</h4>
                    </div>
                    <div class="modalAttribute">
                        <p><span class="attributesType">UPLOADED BY</span></p>
                        <p>{{username}}</p>
                    </div>
                    <div class="modalAttribute">
                        <p><span class="attributesType">UPLOAD DATE</span></p>
                        <p>{{formatDate(createdAt)}}</p>
                    </div>
                    <div class="modalDescription">
                        <p><span class="attributesType">DESCRIPTION</span></p>
                        <p>{{description}}</p>
                    </div>
                </div>
                <comments-component v-if="imageId" :image-id="imageId"></comments-component>
                </div>
        </div>
        <img v-if="prevId" @click.stop="triggerGoPrev" src="/arrow-right-square.svg" class="navButton" width="50" height="50" alt="prev image button">

    </div>`,
};
export default modalFocusImage;

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
            console.log(newId, oldId, "HEY I SHOULD CHANGE");
            this.getImageData(newId);
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
            this.$emit("change", this.nextId);
        },
        triggerGoPrev() {
            console.log("GO PREV: ", this.prevId);
            this.$emit("change", this.prevId);
        },
        formatDate(date) {
            console.log(date);
            let myDate = new Date(date);
            console.log(myDate);
            console.log(myDate.getUTCMonth());
            return `${myDate.getDate()}.${myDate.getMonth()}.${myDate.getFullYear()} ${myDate.getHours()}:${myDate.getMinutes()}`;
        },
    },
    template: `
    <div class="overlay" @click=triggerUnfocus>
        <div v-if=prevId @click.stop=triggerGoPrev class="nav">PREV</div>
        <div v-if=nextId @click.stop=triggerGoNext class="nav">NEXT</div> 
        <img @click=triggerUnfocus src="/close-button.png" class="closeButton" width="50" height="50" alt="unfocus image button">
        <div class="focusImageContainer" @click.stop>
        
        <div v-if=showNoResult class="noResult"><p>🙁 Oh noe, that image does not exist. 🙁</p></div>
        <div v-else>
            <img :src="url" :alt="title" class="focusedImage">
                <div class="attributesContainer">
                    <div class="modalTitle">
                        <h4>{{title}}</h4>
                    </div>
                    <div class="modalAttribute">
                        <p>UPLOADED BY</p>
                        <p>{{username}}</p>
                    </div>
                    <div class="modalAttribute">
                        <p>UPLOAD DATE</p>
                        <p>{{createdAt}}</p>
                    </div>
                    <div class="modalDescription">
                        <p>DESCRIPTION</p>
                        <p>{{description}}</p>
                    </div>
                </div>
                <comments-component v-if="imageId" :image-id="imageId"></comments-component>
                </div>
        </div>
    </div>`,
};
export default modalFocusImage;

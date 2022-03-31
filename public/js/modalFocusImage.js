const modalFocusImage = {
    data() {
        return {
            heading: "Hello from First COMP",
            title: "",
            username: "",
            url: "",
            description: "",
            createdAt: "",
        };
    },
    props: ["imageId"],
    mounted() {
        console.log("Compontent moutned in browser");
        console.log("from component", this.imageId);
        fetch(`/image/${this.imageId}`)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    this.title = data.image.title;
                    this.username = data.image.username;
                    this.url = data.image.url;
                    this.description = data.image.description;
                    this.createdAt = data.image.created_at;
                }
            })
            .catch();
    },
    methods: {
        triggerUnfocus() {
            this.$emit("close");
        },
    },
    template: `
    <div class="overlay" @click=triggerUnfocus> 
        <img @click=triggerUnfocus src="/close-button.png" class="closeButton" width="50" height="50" alt="unfocus image button">
        <div class="focusImageContainer" @click.stop>
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
        </div>
    </div>`,
};
export default modalFocusImage;

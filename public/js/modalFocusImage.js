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
    template: ` <div>
                    <img :src="url" :alt="title">
                    <p>{{title}}</p>
                    <p>{{username}}</p>
                    <p>{{description}}</p>    
                    <p>{{createdAt}}</p>
                    <p @click=triggerUnfocus>X</p>                
                </div>`,
};
export default modalFocusImage;

const commentsComponent = {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["imageId"],
    mounted() {
        console.log("FROM COMMENTS", this.imageId);
        console.log("comments have mounted");
        fetch(`/comments/${this.imageId}`)
            .then((resp) => resp.json())
            .then((data) => {
                this.comments = data;
            })
            .catch((err) => {
                console.log(err);
            });
    },
    methods: {
        commentPostClickHandler() {
            fetch("/comments/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageId: this.imageId,
                    username: this.username,
                    comment: this.comment,
                }),
            })
                .then((resp) => resp.json())
                .then((response) => {
                    console.log(response);
                    if (response.success) {
                        this.comments.unshift(response.comment);
                    }
                    this.clearInputs();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        clearInputs() {
            this.username = "";
            this.comment = "";
        },
    },
    template: ` <div class="comments-container">
                    <div class="commentsPosting">
                        <form>
                            <input v-model="username" type="text" name="username" placeholder="username" required>
                            <input v-model="comment" type="text" name="comment" placeholder="comment" required>
                            <button @click.prevent="commentPostClickHandler">Post Comment</button>
                        </form>
                    </div>
                        <div v-for="comment in comments" :key="comment.id" class="comment">
                        {{comment.username}} {{comment.comment}} {{comment.created_at}}
                    </div>   

                </div>`,
};

export default commentsComponent;

const commentsComponent = {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["imageId"],
    watch: {
        imageId(newId, oldId) {
            console.log(newId, oldId, "HEY I SHOULD CHANGE FROM COMMENTS");
            if (!isNaN(newId)) {
                this.getComments(this.imageId);
            }
        },
    },
    mounted() {
        console.log("FROM COMMENTS", this.imageId);
        console.log("comments have mounted");
        this.getComments(`${this.imageId}`);
    },
    methods: {
        getComments(imageId) {
            fetch(`/comments/${imageId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    this.comments = data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
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
    template: ` <div class="comments-container">
                    <div class="comments-attributes">
                        <form>
                            <input v-model="username" type="text" name="username" placeholder="username" required>
                            <input v-model="comment" type="text" name="comment" placeholder="comment" required>
                            <button @click.prevent="commentPostClickHandler">Post Comment</button>
                        </form>
                    </div>
                        <div v-if="comments.length" class="userComments">
                            <div v-for="comment in comments" :key="comment.id" class="userCommentContainer">
                                <div class="userComment">
                                    <p class="commentAttribute left"><span class="comment-username">{{comment.username}}</span></p>
                                    <p class="commentAttribute right"><span class="date">{{formatDate(comment.created_at)}}</span></p>
                                    <p class="commentText">{{comment.comment}}</p> 
                                </div>
                            </div>
                        </div>   
                        <div v-else class="emptyComments"><p>Oh noes. Nobody commented yet. Will <strong>you</strong> be the first?</p></div>    
                </div>`,
};

export default commentsComponent;

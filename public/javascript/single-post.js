// create a comment
async function commentFormHandler(event) {
    event.preventDefault();

    const comment_text = document.querySelector('#comment-input').value.trim();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    console.log(comment_text);

    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_text // this needs to match the left hand side of what is in the route in comment-routes.js --> comment_text: req.body.comment_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('#comment-btn').addEventListener('click', commentFormHandler);

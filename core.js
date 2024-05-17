var usersData;
let currentUser = null;
let selectedDate="";


$(document).ready(function () {
    $.getJSON('users.json', function (datadetails) {
        usersData = datadetails;
        makeUserList(usersData)
    })
});



function makeUserList(data) {
    $('#users').empty();
    data.forEach((item, index) => {
        $('#users').append(`
        <div class="post">
        <div class="post-header d-flex align-items-center">
            <img src="./assets/`+ item.image + `.jpg" alt="Profile Photo" class="rounded-circle me-3" style="width: 50px; height: 50px;">
            <div>
                <span>`+ item.name + `</span>
                <div class="d-flex align-items-center">
                    <div class="green-dot me-2"></div>
                    <span>1h</span>
                </div>
            </div>
        </div>
        <p>`+ item.post + `</p>
        <img  src="./assets/`+ item.image + `.jpg" id="PostImage">
        <div class="actions">
            <button  class="btn btn-primary"  onclick="handleLikeClick(`+ index + `)"><i class="fas fa-thumbs-up" id="hide-mob"></i> Like</button>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#commentModal" onclick="handleShowComments('`+ item.name + `')"><i class="fas fa-comment" id="hide-mob"></i> Comment</button>
            <button class="btn btn-primary share-btn" onclick="Sharevia('`+ item.post + `')"><i class="fas fa-share" id="hide-mob"></i> Share</button>
        </div>
        <div>
        <div class="likes-section mt-2">
            <span id="like-counts"  data-bs-toggle="modal" data-bs-target="#likeModal" onclick="handleShowLikes('`+ item.likedby + `')">Likes: <span class="like-count" >` + item.likes + `</span></span>
            <span id="caption">Caption:"Awesome"</span>
        </div>
        
        
    </div>`)

    });

}

function handleLikeClick(index) {
    if (usersData && usersData[index]) {
        usersData[index].likes++;

        const username = "UserX";
        if (!usersData[index].likedby.includes(username)) {
            usersData[index].likedby.push(username);
        }

        const likeCountElement = $(`#users .post:nth-child(${index + 1}) .like-count`);
        if (likeCountElement.length) {
            likeCountElement.text(usersData[index].likes);
        }

    }
}


function handleShowLikes(data) {
    const usernames = data.split(',');

    $('#likesbody').empty();
    if (usernames && usernames.length > 0) {
        usernames.forEach((username, index) => {
            $('#likesbody').append(`
                <div class="d-flex align-items-center mb-3">
                    <img src="./assets/user${index + 1}.jpg" alt="${username}" class="rounded-circle me-3" style="width: 50px; height: 50px;">
                    <div>
                        <h4>${username}</h4>
                    </div>
                    <button class="btn btn-primary">Follow</button>
                </div>
            `);
        });
    } else {
        $('#likesbody').append(`<p>No likes yet.</p>`);
    }
}


function handleShowComments(name) {
    let userComments = [];

    usersData.forEach(user => {
        if (user.name === name) {
            currentUser = user;
            userComments = user.comments;
        }
    });

    $('#commentsData').empty();
    $('#addcommentsData').empty();
    if (userComments && userComments.length > 0) {
        userComments.forEach((item, index) => {
            $('#commentsData').append(`
            <label for="recipient-name" class="col-form-label" style="font-weight:bold">`+ item.commentedby + `</label>
            <textarea class="form-control" id="message-text" disabled >`+ item.comment + `</textarea>
            `);
        });
    } else {
        $('#likesbody').append(`<p>No Comments yet.</p>`);
    }

    $('#addcommentsData').append(`
    <div class="add-comment-section">
        <textarea class="form-control" id="new-comment" placeholder="Type your comment here..."></textarea>
        <button type="button" style="float:right" class="btn btn-primary add-comment-btn mt-2" onclick="addComment('${name}')">Add Comment</button>
    </div>

    
`);


}

function addComment(username) {
    const newComment = $('#new-comment').val().trim();
    if (newComment !== '') {
        currentUser.comments.push({ "comment": newComment, "commentedby": "UserX" });
        $('#new-comment').val('');
        handleShowComments(username);
    }
}


function Sharevia(post) {

    navigator.share({
        text: post,
        url: "url",
    }).then(() => {
        console.log('Thanks for sharing!');
    })

}

function handleDateSelection() {
    const inputElement = document.getElementById('searchInput');
    selectedDate = inputElement.value;
    filterUsersByDate(selectedDate)
  }

  function filterUsersByDate(selectedDate) {
    const filteredUsers = usersData.filter(user => user.dob === selectedDate);
    makeUserList(filteredUsers)
}







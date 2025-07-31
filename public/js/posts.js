// Load and display posts
async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        const postsContainer = document.getElementById('postsContainer');
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-muted">No posts yet. Be the first to create one!</p>';
        } else {
            postsContainer.innerHTML = posts.map(post => `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Posted by ${post.author.username}</h6>
                        <p class="card-text">${post.content}</p>
                        
                        ${post.images && post.images.length > 0 ? `
                            <div class="row mt-3">
                                ${post.images.map(image => `
                                    <div class="col-md-4 mb-3">
                                        <img src="${image.url}" class="img-fluid rounded" alt="${image.originalName}">
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="toggleLike('${post._id}')">
                                    <i class="fas fa-heart"></i> ${post.likes ? post.likes.length : 0} Likes
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" onclick="showComments('${post._id}')">
                                    <i class="fas fa-comments"></i> ${post.comments ? post.comments.length : 0} Comments
                                </button>
                            </div>
                            <small class="text-muted">${new Date(post.createdAt).toLocaleDateString()}</small>
                        </div>
                        
                        <div id="comments-${post._id}" class="mt-3"></div>
                        
                        ${post.isAuthor ? `
                            <div class="mt-3">
                                <button class="btn btn-sm btn-primary me-2" onclick="editPost('${post._id}')">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deletePost('${post._id}')">Delete</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Toggle like on post
async function toggleLike(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST'
        });
        if (response.ok) {
            loadPosts();
        }
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

// Show comments for a post
async function showComments(postId) {
    const post = await fetch(`/api/posts/${postId}`).then(res => res.json());
    const commentsContainer = document.getElementById(`comments-${postId}`);
    
    if (commentsContainer) {
        commentsContainer.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2">Comments</h6>
                    ${post.comments.map(comment => `
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <strong>${comment.user.username}</strong>
                                <p class="mb-0">${comment.content}</p>
                                <small class="text-muted">${new Date(comment.createdAt).toLocaleDateString()}</small>
                            </div>
                            ${comment.user._id === currentUserId ? `
                                <button class="btn btn-sm btn-danger" onclick="deleteComment('${postId}', '${comment._id}')">
                                    Delete
                                </button>
                            ` : ''}
                        </div>
                    `).join('')}
                    <form onsubmit="addComment(event, '${postId}')" class="mt-3">
                        <div class="mb-3">
                            <textarea class="form-control" rows="2" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-sm">Add Comment</button>
                    </form>
                </div>
            </div>
        `;
    }
}

// Add comment to post
async function addComment(event, postId) {
    event.preventDefault();
    const content = event.target.querySelector('textarea').value;
    
    try {
        const response = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        
        if (response.ok) {
            showComments(postId);
            event.target.reset();
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

// Delete comment
async function deleteComment(postId, commentId) {
    if (confirm('Are you sure you want to delete this comment?')) {
        try {
            const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                showComments(postId);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }
}

// Load posts when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
}); 
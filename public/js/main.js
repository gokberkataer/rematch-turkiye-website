// Authentication functions
async function register(username, email, password) {
    try {
        console.log('Starting registration process...');
        console.log('Registration data:', { username, email });
        
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        console.log('Registration response status:', response.status);
        const data = await response.json();
        console.log('Registration response data:', data);
        
        if (response.ok) {
            showMessage('Registration successful!', 'success');
            // Update UI to show logged in state
            updateAuthUI(data.user);
            return true;
        } else {
            showMessage(data.error, 'error');
            return false;
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('An error occurred during registration', 'error');
        return false;
    }
}

async function login(email, password) {
    try {
        console.log('Logging in user:', { email });
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            showMessage('Login successful!', 'success');
            // Update UI to show logged in state
            updateAuthUI(data.user);
            return true;
        } else {
            showMessage(data.error, 'error');
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('An error occurred during login', 'error');
        return false;
    }
}

async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        if (response.ok) {
            showMessage('Logged out successfully', 'success');
            // Update UI to show logged out state
            updateAuthUI(null);
        }
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('An error occurred during logout', 'error');
    }
}

// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
            const user = await response.json();
            updateAuthUI(user);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

// Update UI based on authentication state
function updateAuthUI(user) {
    const authForms = document.querySelector('.row.mt-5');
    const postForm = document.getElementById('postForm');
    
    if (user) {
        // User is logged in
        if (authForms) authForms.style.display = 'none';
        if (postForm) postForm.style.display = 'block';
        
        // Add user info to the page
        const userInfo = document.createElement('div');
        userInfo.className = 'alert alert-info';
        userInfo.innerHTML = `Logged in as: ${user.username} <button class="btn btn-sm btn-danger float-end" id="logoutBtn">Logout</button>`;
        document.body.insertBefore(userInfo, document.body.firstChild);
        
        // Add logout button handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    } else {
        // User is logged out
        if (authForms) authForms.style.display = 'flex';
        if (postForm) postForm.style.display = 'none';
        
        // Remove user info if it exists
        const userInfo = document.querySelector('.alert-info');
        if (userInfo) userInfo.remove();
    }
}

// Post functions
async function getPosts() {
    try {
        console.log('Fetching posts...');
        const response = await fetch('/api/posts');
        const posts = await response.json();
        console.log('Posts received:', posts);
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        showMessage('Error fetching posts', 'error');
        return [];
    }
}

async function createPost(title, content, category) {
    try {
        console.log('Creating post:', { title, content, category });
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content, category })
        });
        const data = await response.json();
        if (response.ok) {
            showMessage('Post created successfully!', 'success');
            // Clear the form
            document.getElementById('postTitle').value = '';
            document.getElementById('postContent').value = '';
            document.getElementById('postCategory').value = 'news';
            // Refresh the posts list
            await loadPosts();
            return data;
        } else {
            showMessage(data.error, 'error');
            return null;
        }
    } catch (error) {
        console.error('Error creating post:', error);
        showMessage('Error creating post', 'error');
        return null;
    }
}

async function addComment(postId, content) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        const data = await response.json();
        if (response.ok) {
            showMessage('Comment added successfully!', 'success');
            return data;
        } else {
            showMessage(data.error, 'error');
            return null;
        }
    } catch (error) {
        showMessage('Error adding comment', 'error');
        return null;
    }
}

// UI Helper functions
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.insertBefore(alertDiv, document.body.firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, checking authentication...');
    
    // Check authentication status on page load
    await checkAuth();
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, adding event listener');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            await login(email, password);
        });
    }

    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Register form found, adding event listener');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Register form submitted');
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            await register(username, email, password);
        });
    }

    // Load posts if on home page
    const postsContainer = document.getElementById('postsContainer');
    if (postsContainer) {
        console.log('Posts container found, loading posts');
        loadPosts();
    }
});

// Load and display posts
async function loadPosts() {
    console.log('Loading posts...');
    const posts = await getPosts();
    console.log('Posts to display:', posts);
    const postsContainer = document.getElementById('postsContainer');
    console.log('Posts container:', postsContainer);
    
    if (postsContainer) {
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-muted">No posts yet. Be the first to create one!</p>';
        } else {
            postsContainer.innerHTML = posts.map(post => `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Posted by ${post.author ? post.author.username : 'Anonymous'}</h6>
                        <p class="card-text">${post.content}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${new Date(post.createdAt).toLocaleDateString()}</small>
                            <button class="btn btn-sm btn-outline-primary" onclick="showComments('${post._id}')">
                                Comments (${post.comments ? post.comments.length : 0})
                            </button>
                        </div>
                        <div id="comments-${post._id}" class="mt-3"></div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Show comments for a post
async function showComments(postId) {
    const post = await fetch(`/api/posts/${postId}`).then(res => res.json());
    const commentsContainer = document.getElementById(`comments-${postId}`);
    if (commentsContainer) {
        commentsContainer.innerHTML = post.comments.map(comment => `
            <div class="card mb-2">
                <div class="card-body">
                    <p class="card-text">${comment.content}</p>
                    <small class="text-muted">By ${comment.user.username} on ${new Date(comment.createdAt).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('');
    }
} 
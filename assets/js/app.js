import { RedditService } from './reddit.service.js';

const redditService = new RedditService();
const postContainer = document.querySelector('.posts');

function getPosts() {
  redditService
    .search()
    .then((posts) => {
      localStorage.setItem('posts', JSON.stringify(posts));
      showPosts(posts);
    });
}
  
function showPosts(posts = []) {
  posts.forEach((post) => {
    const postEl = document.createElement('post-card');
    postContainer.appendChild(postEl)
    postEl.src = post.data.thumbnail;
    postEl.title = post.data.title;
    postEl.href = `https://www.reddit.com/${post.data.permalink}`;
  });
}

if (localStorage.getItem('posts')) {
  const posts = JSON.parse(localStorage.getItem('posts'));
  console.log(posts);
  showPosts(posts);
} else {
  getPosts();
}

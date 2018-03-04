import { RedditService } from './reddit.service.js';

const searchForm = document.querySelector('search-form');
const postGrid = document.querySelector('post-grid');
const redditService = new RedditService();
let redditPosts = [];

function showPosts() {
  document.querySelector('post-grid').posts = JSON.stringify(redditPosts);
}

async function getPosts(sr, q, t) {
  redditPosts = await redditService.search(sr, q, t)
  showPosts();
  postGrid.loading = false;
}

postGrid.addEventListener('autoload', async () => {
  postGrid.loading = true;
  const popularSubreddits = await redditService.popularSubreddits();
  getPosts(popularSubreddits);
});

searchForm.addEventListener('search', (ev) => {
  postGrid.loading = true;
  postGrid.posts = [];
  getPosts(ev.detail.subreddit, ev.detail.searchTerm, ev.detail.timeRange);
});

window.addEventListener('scroll', async (ev) => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    postGrid.loading = true;
    const posts = await redditService.loadMore();
    if (posts) {
      redditPosts = [...redditPosts, ...posts];
      showPosts();
    }
    postGrid.loading = false;
  }
});

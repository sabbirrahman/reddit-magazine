import { RedditService } from './reddit.service.js';

const searchForm = document.querySelector('search-form');
const postGrid = document.querySelector('post-grid');
const redditService = new RedditService();
let redditPosts = [];

function showPosts() {
  document.querySelector('post-grid').posts = JSON.stringify(redditPosts);
}

function getPosts(sr = 'streetwear', q, t) {
  redditService
    .search(sr, q, t)
    .then((posts) => {
      redditPosts = posts;
      showPosts();
    });
}

postGrid.addEventListener('autoload', () => {
  getPosts();
});

searchForm.addEventListener('search', (ev) => {
  getPosts(ev.detail.subreddit, ev.detail.searchTerm, ev.detail.timeRange);
});

window.addEventListener('scroll', (ev) => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    const prom = redditService.loadMore();
    if (prom) {
      prom.then((posts) => {
        redditPosts = [...redditPosts, ...posts];
        showPosts();
      });
    }
  }
});

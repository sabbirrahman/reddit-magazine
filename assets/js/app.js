import { RedditService } from './reddit.service.js';

const searchForm = document.querySelector('search-form');
const postGrid = document.querySelector('post-grid');
const redditService = new RedditService();
let redditPosts = [];

function showPosts() {
  document.querySelector('post-grid').posts = JSON.stringify(redditPosts);
}

async function getPosts(sr = ['marvelmemes', 'dcmemes'], q, t) {
  redditPosts = await redditService.search(sr, q, t)
  showPosts();
}

postGrid.addEventListener('autoload', () => { getPosts(); });

searchForm.addEventListener('search', (ev) => {
  getPosts(ev.detail.subreddit, ev.detail.searchTerm, ev.detail.timeRange);
});

window.addEventListener('scroll', async (ev) => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    const posts = await redditService.loadMore();
    if (posts) {
      redditPosts = [...redditPosts, ...posts];
      showPosts();
    }
  }
});

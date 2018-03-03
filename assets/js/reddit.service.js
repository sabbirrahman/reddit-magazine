export class RedditService {
  search(q = 'wdywt', sr = 'streetwear') {
    const url = `https://www.reddit.com/r/${sr}/search.json?q=${q}&sort=top&restrict_sr=on&t=week&type=image`;
    
    return fetch(url)
      .then(res => res.json())
      .then(res => res.data.children);
  }
}

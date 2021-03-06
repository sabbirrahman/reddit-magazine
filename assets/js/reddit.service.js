export class RedditService {
  search(subreddits, q, t = 'all', loadMore = false) {
    this.subreddits = [];
    this.t = t;
    this.q = q;
    
    const urls = [];
    subreddits.forEach((sr, i) => {
      if (loadMore && this.next[i] === '') { return; }
      
      urls.push(`https://www.reddit.com/r/${sr.toLowerCase()}/`);
      if (q) {
        urls[i] += `search.json?sort=top&restrict_sr=on&type=image&limit=15&q=${q.toLowerCase()}&t=${t}`;
      } else {
        urls[i] += `top.json?show=all&limit=15&t=${t}`
      }

      if (loadMore) { urls[i] += `&after=${this.next[i]}`; }

      this.subreddits.push(sr);
    });

    const promises = urls.map(url => fetch(url).then(res => res.json()))
    
    this.next = [];
    return Promise.all(promises)
      .then(resArr => {
        return resArr.map((res, i) => {
          this.next.push(res && res.data && res.data.after || '');
          return res && res.data && res.data.children || [];
        });
      })
      .then(res => [].concat.apply([], res))
      .then(posts => {
        return posts.reduce((arr, post) => {
          if (/^http/.test(post.data.thumbnail)) {
            arr.push({
              src: post.data.thumbnail,
              href: post.data.permalink,
              title: post.data.title
            });
          }
          return arr;
        }, [])
      });
  }

  loadMore() {
    if (this.next && this.next.length && this.subreddits) {
      return this.search(this.subreddits, this.q, this.t, true);
    }
  }

  popularSubreddits(limit = 3) {
    const url = `https://www.reddit.com/subreddits/popular.json?limit=${limit}`
    return fetch(url)
      .then(res => res.json())
      .then(res => res && res.data && res.data.children || [])
      .then(res => res && res.map(r => r.data.display_name) || [])
  }
}

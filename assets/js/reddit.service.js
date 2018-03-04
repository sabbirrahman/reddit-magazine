export class RedditService {
  search(sr, q, loadMore = false) {
    this.sr = sr;
    
    this.url = `https://www.reddit.com/r/${sr.toLowerCase()}/`;
    if (q) {
      this.url += `search.json?sort=top&restrict_sr=on&type=image&q=${q.toLowerCase()}&t=week`;
    } else {
      this.url += `new.json?show=all`
    }

    if (loadMore) { this.url += `&after=${this.next}`; }
    
    return fetch(this.url)
      .then(res => res.json())
      .then(res => {
        this.next = res && res.data && res.data.after || null;
        return res && res.data && res.data.children || [];
      })
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
    if (this.next && this.sr) {
      return this.search(this.sr, null, true);
    }
  }
}

export class RedditService {
  search(q, sr) {
    if (q && sr) {
      this.url = `https://www.reddit.com/r/${sr.toLowerCase()}/search.json?q=${q.toLowerCase()}&sort=top&restrict_sr=on&t=week&type=image`;
    }
    
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
    if (this.next) {
      this.url += `&after=${this.next}`;
      return this.search();
    }
  }
}

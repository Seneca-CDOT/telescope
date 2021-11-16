export const fetchFeeds = () => fetch(`https://${process.env.API_HOST}/v1/posts/feeds`);

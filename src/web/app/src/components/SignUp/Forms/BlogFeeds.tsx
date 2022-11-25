import RSSFeeds from './RSSFeeds';
import formModels from '../Schema/FormModel';

const { blogs, allBlogs, blogUrl, blogOwnership } = formModels;

const BlogFeeds = () => {
  return (
    <RSSFeeds
      title="Blog and RSS"
      prompt="Enter your blog root URL (HTML) and select the blog's RSS feed URL (XML) you want to use in Telescope, such as:"
      promptExamples={[
        'Blog root URL: https://dev.to/user',
        'RSS feed URL: https://dev.to/feed/user',
      ]}
      buttonText="Validate"
      helperText="Validate your Blog URL"
      noFeedsSelected="Please validate your blog URL"
      feeds={{
        selected: blogs.name as any,
        discovered: allBlogs.name as any,
      }}
      agreement={{
        name: blogOwnership.name,
        label: blogOwnership.label,
      }}
      input={{
        name: blogUrl.name,
        label: blogUrl.label,
      }}
    />
  );
};

export default BlogFeeds;

import PostList from '../components/posts/PostList';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Home Feed</h1>
      <PostList />
    </div>
  );
}
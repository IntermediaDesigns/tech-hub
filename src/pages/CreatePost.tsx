import PostForm from '../components/posts/PostForm';

export default function CreatePost() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create a New Post</h1>
      <PostForm />
    </div>
  );
}
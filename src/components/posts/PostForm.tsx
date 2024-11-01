import { useState } from 'react';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { useCreatePost } from '../../hooks/useCreatePost';
import { PostFormData } from '../../lib/types';
import { useUserContext } from '../../context/UserContext'; // Import the hook

const categories = [
  'JavaScript', 'React', 'HTML', 'CSS', 'Python',
  'Node.js', 'TypeScript', 'GraphQL', 'Vue.js', 'Angular'
];

export default function PostForm() {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    imageUrl: '',
    secretKey: '',
    category: categories[0] // Default to the first category
  });

  const [validationErrors, setValidationErrors] = useState<Partial<PostFormData>>({});
  const { createPost, loading, error } = useCreatePost();
  const { userId } = useUserContext(); // Access user ID from context

  const validateForm = (): boolean => {
    const errors: Partial<PostFormData> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      errors.imageUrl = 'Please enter a valid URL';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (userId) {
      await createPost(formData, userId); // Pass user ID to createPost
    } else {
      setValidationErrors({ title: 'User ID is required to create a post.' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof PostFormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error creating post
              </h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={validationErrors.title}
        required
        disabled={loading}
      />

      <TextArea
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        error={validationErrors.content}
        rows={4}
        required
        disabled={loading}
      />

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          disabled={loading}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Image URL (optional)"
        name="imageUrl"
        type="url"
        value={formData.imageUrl}
        onChange={handleChange}
        error={validationErrors.imageUrl}
        placeholder="https://example.com/image.jpg"
        disabled={loading}
      />

      <Input
        label="Secret Key (optional)"
        name="secretKey"
        type="password"
        value={formData.secretKey}
        onChange={handleChange}
        error={validationErrors.secretKey}
        placeholder="For editing/deleting later"
        disabled={loading}
      />

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}

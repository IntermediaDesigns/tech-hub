import EditPostForm from '../components/posts/EditPostForm'
import { Navigate, useParams } from 'react-router-dom'

export default function EditPost () {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <Navigate to='/' />
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Edit Post</h1>
      <EditPostForm postId={id} />
    </div>
  )
}

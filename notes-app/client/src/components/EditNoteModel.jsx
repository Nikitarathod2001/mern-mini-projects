import React, {useState} from 'react';
import toast from "react-hot-toast";

import { updateNote } from '../services/noteService';

const categories = [
  "Personal",
  "Work",
  "Study",
  "Ideas",
  "Projects",
  "Todo",
  "Important",
  "Other",
];

const EditNoteModel = ({note, onClose, onNoteUpdated}) => {

  const [formData, setFormData] = useState({
    title: note.title,
    content: note.content,
    category: note.category,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.title.trim()) {
      return toast.error("Title is required");
    }

    if(!formData.content.trim()) {
      return toast.error("Content is required");
    }

    try {

      setLoading(true);

      const data = await updateNote(note._id, formData);

      toast.success("Note updated");

      onNoteUpdated(data.note);

      onClose();
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update note"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>

      <div className='w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl'>

        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>

          <h2 className='text-xl font-bold'>
            Edit Note
          </h2>

          <button onClick={onClose}
            className='rounded-lg p-2 hover:bg-gray-100'
          >
            X
          </button>

        </div>

        <form onSubmit={handleSubmit}
          className='space-y-5'
        >

          {/* Title */}
          <input type="text" 
            name='title'
            value={formData.title}
            onChange={handleChange}
            placeholder='Title'
            className='w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-gray-400'
          />

          {/* Content */}
          <textarea name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            className='w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-gray-400'
          />

          {/* Category */}
          <select name="category"
            value={formData.category}
            onChange={handleChange}
            className='w-full rounded-lg border border-gray-200 px-4 py-3'
          >
            {
              categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            }
          </select>

          <div className='flex justify-end gap-3'>

            <button type='button'
              onClick={onClose}
              className='rounded-lg border px-4 py-2'
            >
              Cancel
            </button>

            <button type="submit"
              disabled={loading}
              className='rounded-lg bg-gray-900 px-4 py-2 text-white'
            >
              {
                loading ? "Updating..." : "Save Changes"
              }
            </button>

          </div>

        </form>

      </div>
      
    </div>
  )
}

export default EditNoteModel

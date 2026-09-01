import React from 'react';
import { useState } from 'react';
import toast from "react-hot-toast";
import api from "../services/api";
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const NoteForm = ({onClose, onNoteCreated}) => {

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Other",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if(!formData.content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    try {

      setLoading(true);

      const {data} = await api.post("/notes", formData);

      toast.success("Note created successfully!");

      onNoteCreated(data.note);
      onClose();
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create note"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>

      <div className='w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl'>

        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>

          <div>

            <h2 className='text-xl font-bold text-gray-900 cursor-pointer'>
              Create Note
            </h2>

            <p className='mt-1 text-sm text-gray-500'>
              Capture your thoughts and ideas.
            </p>

          </div>

          <button type="button"
            onClick={onClose}
            className='rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 cursor-pointer'
          >
            <FontAwesomeIcon icon={faXmarkCircle}/>
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}
          className='space-y-5'
        >

          {/* Title */}
          <div>

            <label htmlFor='title'
              className='mb-2 block text-sm font-medium text-gray-700'
            >
              Title
            </label>

            <input type="text" 
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='Enter note title'
              maxLength={100}
              className='w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-gray-100'
            />

          </div>

          {/* Content */}
          <div>

            <label htmlFor='content'
              className='mb-2 block text-sm font-medium text-gray-700'
            >
              Content
            </label>

            <textarea id='content'
              name='content'
              value={formData.content}
              onChange={handleChange}
              placeholder='Write your note...'
              rows={7}
              className='w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100'
            />

          </div>

          {/* Category */}
          <div>

            <label htmlFor='category'
              className='mb-2 block text-sm font-medium text-gray-700'
            >
              Category
            </label>

            <select id='category'
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100'
            >
              {
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              }
            </select>
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-3 pt-2'>

            <button type='button'
              onClick={onClose}
              disabled={loading}
              className='rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer'
            >
              Cancel
            </button>

            <button type="submit"
              disabled={loading}
              className='rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
            >
              {loading ? "Creating..." : "Create Note"}
            </button>

          </div>

        </form>

      </div>
      
    </div>
  )
}

export default NoteForm

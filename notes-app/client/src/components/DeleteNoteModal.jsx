import React, {useState} from 'react';
import toast from 'react-hot-toast';

import { deleteNote } from '../services/noteService';

const DeleteNoteModal = ({
  note, onClose, onDeleted
}) => {

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {

      setLoading(true);
      await deleteNote(note._id);
      toast.success("Note deleted successfully");
      onDeleted();
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete note"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>

      <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>

        {/* Content */}
        <h2 className='mt-5 text-xl font-bold text-gray-900'>
          Delete this note?
        </h2>

        <p className='mt-2 text-sm leading-6 text-gray-500'>

          Are you sure you want to delete{" "}
          <span className='font-medium text-gray-700'>
            "{note.title}"
          </span>
          ? This action cannot be undone.

        </p>

        {/* Actions */}
        <div className='mt-6 flex justify-end gap-3'>

          <button type='button'
            onClick={onClose}
            disabled={loading}
            className='rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer'
          >
            Cancel
          </button>

          <button type='button'
            onClick={handleDelete}
            disabled={loading}
            className='rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
          >
            {
              loading ? "Deleting..." : "Delete Note"
            }
          </button>

        </div>

      </div>
      
    </div>
  )
}

export default DeleteNoteModal

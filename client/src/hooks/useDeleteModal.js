import { useCallback } from 'react';
import Swal from 'sweetalert2';

export function useDeleteModal() {
  const fire = useCallback(async (action) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      const deleted = await action();
      if (deleted) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    }
  }, []);

  return fire;
}

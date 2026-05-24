import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../store/userSlice';
import { clampPage } from '../utils/helpers';


const usePagination = () => {
  const dispatch = useDispatch();
  const { currentPage, totalPages } = useSelector((state) => state.users);

  const goToPage = useCallback(
    (page) => {
      dispatch(setCurrentPage(clampPage(page, totalPages)));
    },
    [dispatch, totalPages]
  );

  const goToNext = useCallback(() => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  }, [dispatch, currentPage, totalPages]);

  const goToPrevious = useCallback(() => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  }, [dispatch, currentPage]);

  return {
    currentPage,
    totalPages,
    goToPage,
    goToNext,
    goToPrevious,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };
};

export default usePagination;

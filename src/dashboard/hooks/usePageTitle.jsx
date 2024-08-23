import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTitle = (titleMap) => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const pageTitle = titleMap[currentPath] || 'React App';
    document.title = pageTitle;
  }, [location, titleMap]);
};
export default usePageTitle;

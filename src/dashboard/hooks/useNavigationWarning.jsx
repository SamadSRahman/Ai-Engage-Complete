import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function useNavigationWarning() {
  const navigate = useNavigate();
  const isReloading = useRef(false);

  const clearLocalStorage = useCallback(() => {
    const accessToken = localStorage.getItem("accessToken");
    const adminDetails = localStorage.getItem("adminDetails");

    localStorage.clear();
    console.log("Clear event triggered");

    if (accessToken !== null) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (adminDetails !== null) {
      localStorage.setItem("adminDetails", adminDetails);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const vidData = JSON.parse(localStorage.getItem("videoArray")) || [];
      if (vidData.length > 0 && !isReloading.current) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return event.returnValue;
      }
    };

    const handlePopState = (event) => {
      const vidData = JSON.parse(localStorage.getItem("videoArray")) || [];

      if (vidData.length > 0) {
        const confirmNavigation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        
        if (confirmNavigation) {
          clearLocalStorage();
          // Allow the navigation to proceed
          return;
        } else {
          // If the user clicks "Cancel", prevent navigation
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    };

    // Push a state when the component mounts
    window.history.pushState(null, '', window.location.pathname);

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Handle page reload
    const handlePageLoad = () => {
      const vidData = JSON.parse(localStorage.getItem("videoArray")) || [];
      if (vidData.length > 0) {
        const confirmReload = window.confirm('You have unsaved changes. Are you sure you want to reload?');
        if (confirmReload) {
          isReloading.current = true;
          clearLocalStorage();
          window.location.reload();
        }
      }
    };

    // Call handlePageLoad on initial load
    handlePageLoad();

    return () => {
      // Remove event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [clearLocalStorage, navigate]);

  const confirmNavigation = useCallback((to) => {
    const vidData = JSON.parse(localStorage.getItem("videoArray")) || [];
    if (vidData.length > 0) {
      const confirmNavigation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (confirmNavigation) {
        clearLocalStorage();
        navigate(to);
      }
    } else {
      navigate(to);
    }
  }, [clearLocalStorage, navigate]);

  return { confirmNavigation, clearLocalStorage };
}

export default useNavigationWarning;
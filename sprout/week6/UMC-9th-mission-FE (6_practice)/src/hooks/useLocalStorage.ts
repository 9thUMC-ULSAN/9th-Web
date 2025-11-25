export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      // JSON.stringify 기능을 그대로 유지

      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const getItem = () => {
    try {
      const item: string | null = window.localStorage.getItem(key); // JSON.parse 기능을 그대로 유지

      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return { setItem, getItem, removeItem };
};

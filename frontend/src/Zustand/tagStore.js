import { create } from "zustand";

const useTagStore = create((set) => {
  const persistedTags = localStorage.getItem("tags");
  const initialTags = persistedTags ? JSON.parse(persistedTags) : [];

  return {
    tags: initialTags,

    // setting tags when we fetch
    setTags: (newTags) =>
      set(() => {
        localStorage.setItem("tags", JSON.stringify(newTags));
        return { tags: newTags };
      }),

    // check tag is already there or not
    checkTagExists: (tag) => {
      const state = useTagStore.getState();
      return state.tags.includes(tag);
    },

    // Add new tag
    addTag: (tag) =>
      set((state) => {
        const updatedTags = [...state.tags, tag];
        localStorage.setItem("tags", JSON.stringify(updatedTags));
        return { tags: updatedTags };
      }),

    // Delete tag from store and local storage
    deleteTag: (tag) =>
      set((state) => {
        const updatedTags = state.tags.filter((t) => t !== tag);
        localStorage.setItem("tags", JSON.stringify(updatedTags));
        return { tags: updatedTags };
      }),
  };
});

export default useTagStore;

import { create } from "zustand";

const useTagStore = create((set) => {
  // check if tags exists in local store otherwise empty array
  const persistedTags = localStorage.getItem("tags");
  const initialTags = persistedTags ? JSON.parse(persistedTags) : [];

  return {
    tags: initialTags,
    //   @Remember
    setTags: (newTags) =>
      set(() => {
        // @Remember
        // store data in local storage after stringify
        localStorage.setItem("tags", JSON.stringify(newTags));
        return { tags: newTags };
      }),

    checkTagExists: (tag) => {
      const state = useTagStore.getState();
      return state.tags.includes(tag);
    },

    addTag: (tag) =>
      set((state) => {
        //    Remember
        // updating in store
        const updatedTags = [...state.tags, tag];
        //   updating in local storage
        localStorage.setItem("tags", JSON.stringify(updatedTags));
        return { tags: updatedTags };
      }),

    // @Todo:
    deleteTag: (tag) =>
      set((state) => {
        //    Remember
        // updating in store
        const updatedTags = state.tags.filter((t) => t !== tag);
        //   updating in local storage
        localStorage.setItem("tags", JSON.stringify(updatedTags));
        return { tags: updatedTags };
      }),
  };
});

export default useTagStore;

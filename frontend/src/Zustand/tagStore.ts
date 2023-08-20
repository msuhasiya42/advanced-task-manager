import { create } from "zustand";

type TagStoreState = {
  tags: string[];
  setTags: (newTags: string[]) => void;
  checkTagExists: (tag: string) => boolean;
  addTag: (tag: string) => void;
  deleteTag: (tag: string) => void;
};


const useTagStore = create<TagStoreState>((set) => {
  const persistedTags = localStorage.getItem("tags");
  const initialTags: string[] = persistedTags ? JSON.parse(persistedTags) : [];

  return {
    tags: initialTags,

    // setting tags when we fetch
    setTags: (newTags: string[]) =>
      set(() => {
        localStorage.setItem("tags", JSON.stringify(newTags));
        return { tags: newTags };
      }),

    // check tag is already there or not
    checkTagExists: (tag: string) => {
      const state: TagStoreState = useTagStore.getState();
      return state.tags.includes(tag);
    },

    // Add new tag
    addTag: (tag: string) =>
      set((state: TagStoreState) => {
        const updatedTags = [...state.tags, tag];
        localStorage.setItem("tags", JSON.stringify(updatedTags));
        return { tags: updatedTags };
      }),

    // Delete tag from store and local storage
    deleteTag: (tag: string) =>
      set((state: TagStoreState) => {
        const updatedTags = state.tags.filter((t: string) => t !== tag);
        localStorage.setItem("tags", JSON.stringify(updatedTags));
        return { tags: updatedTags };
      }),
  };
});

export default useTagStore;

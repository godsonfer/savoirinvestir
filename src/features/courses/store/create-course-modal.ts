import { atom, useAtom } from "jotai";

const modalState = atom(false);
export const useCreateCourseModal = () => {
  return useAtom(modalState);
};

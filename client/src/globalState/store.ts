import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import createContactsSlice, {
  ContactsSlice,
} from "src/globalState/contactsSlice";

type AllStateSlices = ContactsSlice; // & AnotherSlice & ...

const useStore = create<AllStateSlices>()(
  immer((...args) => ({
    ...createContactsSlice(...args),
    // ...createAnotherSlice(...args), etc.
  }))
);

export default useStore;

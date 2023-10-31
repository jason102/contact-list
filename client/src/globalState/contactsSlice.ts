import { StateCreator } from "zustand";
import "zustand/middleware/immer"; // For [["zustand/immer", never]] below
import { ContactInfo } from "src/types";
import { HttpResponseCodes, trimObjectStringValues } from "src/utils";

export interface ContactsSlice {
  contacts: ContactInfo[];
  addContact: (newContact: ContactInfo) => void;
}

const createContactsSlice: StateCreator<
  ContactsSlice,
  [["zustand/immer", never]], // Immer middleware for easily updating nested object states
  [],
  ContactsSlice
> = (set) => ({
  contacts: [],
  addContact: async (contact) => {
    const newContact = trimObjectStringValues<ContactInfo>(contact);

    const response = await fetch(
      `${import.meta.env.VITE_LOCALHOST_URL}/addContact`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      }
    );

    switch (response.status) {
      case HttpResponseCodes.Success: {
        set((state) => {
          state.contacts.push(newContact);
        });
        break;
      }
      case HttpResponseCodes.AlreadyExists: {
        alert("Contact already exists");
        break;
      }
      default: {
        console.error(
          `Error: server responded with status ${response.status} for request ${response.url}`
        );
        alert(
          "Sorry, there was a problem. Please contact Jason to fix this bug."
        );
      }
    }
  },
});

export default createContactsSlice;

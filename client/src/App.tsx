import React from "react";
import AddContactForm from "src/pages/AddContactForm";
import FetchResultSnackbar from "src/components/FetchResultSnackbar";

const App: React.FC = () => {
  return (
    <>
      <AddContactForm />
      <FetchResultSnackbar />
    </>
  );
};

export default App;

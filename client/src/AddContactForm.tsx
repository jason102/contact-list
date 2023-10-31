import React from "react";
import { useForm } from "react-hook-form";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import RHFTextField from "src/components/RHFTextField";
import { ContactInfo } from "src/types";
import { validateEmail } from "src/utils";
import useStore from "src/globalState/store";

const defaultFormValues: ContactInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
};

const AddContactForm: React.FC = () => {
  const dispatchAddContact = useStore((state) => state.addContact);
  // const contacts = useStore((state) => state.contacts);

  const { control, handleSubmit } = useForm<ContactInfo>({
    defaultValues: defaultFormValues,
  });

  const onSubmit = async (submittedData: ContactInfo) => {
    dispatchAddContact(submittedData);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="elevation"
        elevation={16}
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography component="h6" variant="h4" align="center">
            Add Contact
          </Typography>
          <Grid container spacing={3} sx={{ pt: 5 }}>
            <Grid item xs={12} sm={6}>
              <RHFTextField
                required
                id="firstName"
                name="firstName"
                label="First name"
                fullWidth
                autoComplete="given-name"
                variant="standard"
                control={control}
                maxLength={{
                  value: 255,
                  message: "Name cannot exceed 255 characters",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField
                required
                id="lastName"
                name="lastName"
                label="Last name"
                fullWidth
                autoComplete="family-name"
                variant="standard"
                control={control}
                maxLength={{
                  value: 255,
                  message: "Name cannot exceed 255 characters",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                required
                id="email"
                name="email"
                label="Email"
                fullWidth
                autoComplete="email"
                variant="standard"
                control={control}
                validate={(value) =>
                  validateEmail(value) || "Please enter a valid email address"
                }
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                required
                id="phone"
                name="phone"
                label="Phone"
                fullWidth
                autoComplete="phone"
                variant="standard"
                control={control}
                maxLength={{
                  value: 20, // Max phone number length is 15 numbers according to international standards, so give them more space to include chars like +()-
                  message: "Please enter a valid phone number",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                id="notes"
                name="notes"
                label="Notes"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                control={control}
                maxLength={{
                  value: 1000, // Just to limit people submitting something unreasonably long
                  message: "The note cannot exceed 1000 characters",
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddContactForm;

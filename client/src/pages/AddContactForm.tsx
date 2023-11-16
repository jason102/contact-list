import React from "react";
import { useForm } from "react-hook-form";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import RHFTextField from "src/components/RHFTextField";
import { ContactInfo } from "src/types";
import {
  HttpResponseCodes,
  trimObjectStringValues,
  validateEmail,
} from "src/utils";
import { useAddContactMutation } from "src/app/api/apiSlice";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import {
  FetchResultType,
  setFetchResult,
  setIsSnackbarOpen,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { useAppDispatch } from "src/app/store";

const defaultFormValues: ContactInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
};

const AddContactForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const [dispatchAddNewContact, { isLoading }] =
    useSnackbarFetchResponse<ContactInfo>(useAddContactMutation(), {
      [HttpResponseCodes.Created]: {
        message: "New contact successfully added",
        type: FetchResultType.success,
      },
      [HttpResponseCodes.AlreadyExists]: {
        message:
          "This contact already exists. Please use the edit contact function to update an existing contact's information.",
        type: FetchResultType.warning,
      },
    });

  const { control, handleSubmit } = useForm<ContactInfo>({
    defaultValues: defaultFormValues,
  });

  const onSubmit = async (submittedData: ContactInfo) => {
    const newContact = trimObjectStringValues<ContactInfo>(submittedData);
    const fetchResult = await dispatchAddNewContact(newContact);

    dispatch(setFetchResult(fetchResult));
    dispatch(setIsSnackbarOpen(true));
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
            <Button variant="contained" type="submit" disabled={isLoading}>
              Submit
              {isLoading && (
                <CircularProgress size={18} color="inherit" sx={{ ml: 1 }} />
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddContactForm;

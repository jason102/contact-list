import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";

type RHFTextFieldProps<T extends FieldValues> = TextFieldProps &
  UseControllerProps<T>;

const RHFTextField = <T extends FieldValues>({
  name,
  control,
  ...restProps
}: RHFTextFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <TextField
        name={name}
        error={!!error}
        value={value}
        onChange={onChange}
        {...restProps}
      />
    )}
  />
);

export default RHFTextField;

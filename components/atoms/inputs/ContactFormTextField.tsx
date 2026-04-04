'use client'
import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

interface CustomTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
    name: FieldPath<T>;
    control: Control<T>;
    rules?: RegisterOptions<T>;
}

const ContactFormTextField = <T extends FieldValues>({
    name,
    control,
    rules,
    variant = 'standard',
    fullWidth = true,
    autoComplete = 'off',
    ...textFieldProps
}: CustomTextFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    {...textFieldProps}
                    variant={variant}
                    fullWidth={fullWidth}
                    autoComplete={autoComplete}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{ mb: 2, ...textFieldProps.sx }}
                />
            )}
        />
    );
};

export default ContactFormTextField;
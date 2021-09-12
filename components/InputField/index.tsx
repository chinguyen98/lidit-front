import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { NextPage } from 'next';
import React, { HTMLInputTypeAttribute } from 'react';

interface inputFieldProps {
  fieldName: string;
  displayName: string | undefined;
  placeholder?: string | undefined;
  fieldType: HTMLInputTypeAttribute;
  errors: any;
  register: any;
}

const InputField: NextPage<inputFieldProps> = ({
  fieldName,
  displayName,
  placeholder,
  fieldType,
  errors,
  register,
}) => {
  return (
    <FormControl width="50%" id={fieldName} isInvalid={errors[fieldName]} isRequired>
      <FormLabel htmlFor={fieldName}>{displayName}</FormLabel>
      <Input
        {...register(fieldName)}
        placeholder={placeholder}
        name={fieldName}
        type={fieldType}
      />
      <FormErrorMessage>
        {errors[fieldName]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default InputField;
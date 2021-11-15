import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Textarea } from '@chakra-ui/textarea';
import { NextPage } from 'next';
import React, { HTMLInputTypeAttribute } from 'react';

interface inputFieldProps {
  fieldName: string;
  displayName: string | undefined;
  placeholder?: string | undefined;
  fieldType: HTMLInputTypeAttribute;
  isMultiLine?: boolean;
  errors: any;
  register: any;
  responseError?: string | undefined;
}

const InputField: NextPage<inputFieldProps> = ({
  fieldName,
  displayName,
  placeholder,
  fieldType,
  errors,
  register,
  responseError,
  isMultiLine = false,
}) => {
  return (
    <FormControl
      width="50%"
      id={fieldName}
      isInvalid={errors[fieldName] || responseError}
      isRequired
    >
      <FormLabel htmlFor={fieldName}>{displayName}</FormLabel>
      {isMultiLine ? (
        <Textarea
          {...register(fieldName)}
          placeholder={placeholder}
          name={fieldName}
          type={fieldType}
        />
      ) : (
        <Input
          {...register(fieldName)}
          placeholder={placeholder}
          name={fieldName}
          type={fieldType}
        />
      )}
      <FormErrorMessage>
        {errors[fieldName]?.message || responseError}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputField;

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button, FormGroup, InputGroup } from '@blueprintjs/core';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;

  > *:first-child {
    margin-right: 24px;
  }
`;

const ErrorText = styled.span`
  color: red;
`;

const HelperText = ({ errorText, helperText, isError }) =>
  isError ? <ErrorText>{errorText}</ErrorText> : helperText;

export const UserForm = ({
  onData,
  onCancelClick: handleCancelClick = () => {},
  cancelButtonProps = {},
  submitButtonProps = {},
  disabledFields = {},
  defaultValues,
}) => {
  const { register, handleSubmit, errors } = useForm({ defaultValues });
  const onSubmit = (data) => onData(data);

  return (
    <Root>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          helperText={
            <HelperText
              isError={errors.id}
              helperText="gimme yo identity"
              errorText="only alphanumerical plz"
            />
          }
          label="ID"
          labelFor="text-input"
          labelInfo="(required)"
        >
          <InputGroup
            large
            name="id"
            readOnly={disabledFields?.id}
            inputRef={register({
              required: true,
              maxLength: 255,
              pattern: /^[a-z0-9]+$/i,
            })}
          />
        </FormGroup>
        <FormGroup
          helperText={
            <HelperText
              isError={errors.login}
              helperText="gimme yo identity"
              errorText="Dis, cannot conflict with other pple ah"
            />
          }
          label="Login"
          labelFor="text-input"
          labelInfo="(required)"
        >
          <InputGroup
            large
            name="login"
            inputRef={register({
              required: true,
              maxLength: 255,
              pattern: /^[a-z0-9]+$/i,
            })}
            readOnly={disabledFields?.login}
          />
        </FormGroup>
        <FormGroup
          helperText={
            <HelperText
              isError={errors.name}
              helperText="You want same name oso okay"
              errorText="pls type something"
            />
          }
          label="Name"
          labelFor="text-input"
          labelInfo="(required)"
        >
          <InputGroup
            large
            name="name"
            inputRef={register({ required: true, maxLength: 255 })}
            readOnly={disabledFields?.name}
          />
        </FormGroup>
        <FormGroup
          helperText={
            <HelperText
              isError={errors.salary}
              helperText="Annual salary?"
              errorText="you can earn negative ah"
            />
          }
          label="Salary (SGD)"
          labelFor="text-input"
          labelInfo="(required)"
        >
          <InputGroup
            large
            type="number"
            name="salary"
            step="any"
            inputRef={register({ required: true, min: 0 })}
            readOnly={disabledFields?.salary}
          />
        </FormGroup>
        <ButtonContainer>
          <Button
            type="submit"
            icon="add"
            text="Create"
            fill
            large
            intent="primary"
            {...submitButtonProps}
          />
          <Button
            text="Cancel"
            fill
            large
            onClick={handleCancelClick}
            {...cancelButtonProps}
          />
        </ButtonContainer>
      </form>
    </Root>
  );
};

export default UserForm;

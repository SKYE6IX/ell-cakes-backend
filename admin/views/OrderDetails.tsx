/** @jsxRuntime classic */
/** @jsx jsx */
import {
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from "@keystone-6/core/types";
import { jsx } from "@keystone-ui/core";
import { FieldContainer, FieldLabel } from "@keystone-ui/fields";

export const controller = (
  config: FieldControllerConfig
): FieldController<string, string> => {
  return {
    path: config.path,
    label: config.label,
    graphqlSelection: config.path,
    defaultValue: "",
    deserialize: (data) => data[config.path],
    serialize: (value) => ({ [config.path]: value }),
    description: null,
  };
};

export const Field = ({ field, value }: FieldProps<typeof controller>) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>

      {/* value is the string returned by your resolver */}
      <div dangerouslySetInnerHTML={{ __html: value || "" }} />
    </FieldContainer>
  );
};

export const Cell = ({ value }: any) => {
  return <div dangerouslySetInnerHTML={{ __html: value || "" }} />;
};

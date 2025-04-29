
import React from "react";
import { FormSection as FormSectionType, FormField as FormFieldType, FormValues } from "@/types/form";
import FormField from "./FormField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  section: FormSectionType;
  values: FormValues;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  errors: Record<string, string>;
}

const FormSection: React.FC<FormSectionProps> = ({ section, values, onChange, errors }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">{section.title}</CardTitle>
        {section.description && (
          <CardDescription>{section.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={values[field.fieldId] !== undefined ? values[field.fieldId] : field.type === "checkbox" ? false : ""}
            onChange={onChange}
            error={errors[field.fieldId]}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default FormSection;

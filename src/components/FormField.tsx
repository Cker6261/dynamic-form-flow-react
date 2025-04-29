
import React from "react";
import { FormField as FormFieldType } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  field: FormFieldType;
  value: string | string[] | boolean;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const handleChange = (val: string | string[] | boolean) => {
    onChange(field.fieldId, val);
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "tel":
      case "email":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder || ""}
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            maxLength={field.maxLength}
            data-testid={field.dataTestId}
            className={error ? "border-red-500" : ""}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder || ""}
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            maxLength={field.maxLength}
            data-testid={field.dataTestId}
            className={error ? "border-red-500" : ""}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            data-testid={field.dataTestId}
            className={error ? "border-red-500" : ""}
          />
        );
      case "dropdown":
        return (
          <Select
            value={value as string}
            onValueChange={(val) => handleChange(val)}
          >
            <SelectTrigger
              data-testid={field.dataTestId}
              className={error ? "border-red-500" : ""}
            >
              <SelectValue placeholder={field.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  data-testid={option.dataTestId || `${field.dataTestId}-${option.value}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "radio":
        return (
          <RadioGroup
            value={value as string}
            onValueChange={(val) => handleChange(val)}
            className="flex flex-col space-y-2"
          >
            {field.options?.map((option) => (
              <div className="flex items-center space-x-2" key={option.value}>
                <RadioGroupItem 
                  value={option.value} 
                  id={`${field.fieldId}-${option.value}`} 
                  data-testid={option.dataTestId || `${field.dataTestId}-${option.value}`}
                />
                <Label htmlFor={`${field.fieldId}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value as boolean}
              onCheckedChange={(checked) => handleChange(!!checked)}
              id={field.fieldId}
              data-testid={field.dataTestId}
            />
            <label
              htmlFor={field.fieldId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        );
      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.fieldId} className="font-medium">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {renderField()}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;

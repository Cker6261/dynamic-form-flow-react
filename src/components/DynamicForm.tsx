
import React, { useState, useEffect } from "react";
import { FormResponse, FormSection as FormSectionType, FormValues } from "@/types/form";
import { getFormStructure } from "@/services/api";
import FormSection from "./FormSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DynamicFormProps {
  rollNumber: string;
  userName: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ rollNumber, userName }) => {
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const data = await getFormStructure(rollNumber);
        setFormData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [rollNumber, toast]);

  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear errors for this field when it changes
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateSection = (section: FormSectionType) => {
    const sectionErrors: Record<string, string> = {};
    
    section.fields.forEach((field) => {
      const value = formValues[field.fieldId];
      
      // Check required fields
      if (field.required && 
          (value === undefined || 
           value === "" || 
           (Array.isArray(value) && value.length === 0))) {
        sectionErrors[field.fieldId] = field.validation?.message || "This field is required";
        return;
      }
      
      // Check minLength
      if (field.minLength !== undefined && 
          typeof value === "string" && 
          value.length < field.minLength) {
        sectionErrors[field.fieldId] = 
          field.validation?.message || 
          `Minimum ${field.minLength} characters required`;
        return;
      }
      
      // Check maxLength
      if (field.maxLength !== undefined && 
          typeof value === "string" && 
          value.length > field.maxLength) {
        sectionErrors[field.fieldId] = 
          field.validation?.message || 
          `Maximum ${field.maxLength} characters allowed`;
        return;
      }
    });
    
    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!formData) return;
    
    const currentSection = formData.form.sections[currentSectionIndex];
    const isValid = validateSection(currentSection);
    
    if (isValid && currentSectionIndex < formData.form.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (!formData) return;
    
    const currentSection = formData.form.sections[currentSectionIndex];
    const isValid = validateSection(currentSection);
    
    if (isValid) {
      // All sections are validated, submit the form
      console.log("Form submitted with values:", formValues);
      
      toast({
        title: "Success",
        description: "Form submitted successfully!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading form...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No form data available.</p>
      </div>
    );
  }

  const currentSection = formData.form.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === formData.form.sections.length - 1;

  return (
    <div className="container max-w-3xl py-10 px-4">
      <Card className="mb-6">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-2xl text-center">
            {formData.form.formTitle}
          </CardTitle>
          <div className="text-center text-sm text-muted-foreground">
            Welcome, {userName} | Roll Number: {rollNumber}
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              {formData.form.sections.map((section, index) => (
                <React.Fragment key={section.sectionId}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      index === currentSectionIndex
                        ? "bg-primary text-primary-foreground"
                        : index < currentSectionIndex
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < formData.form.sections.length - 1 && (
                    <div
                      className={`w-8 h-1 ${
                        index < currentSectionIndex 
                          ? "bg-green-500" 
                          : "bg-muted"
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FormSection
            section={currentSection}
            values={formValues}
            onChange={handleFieldChange}
            errors={errors}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          {isLastSection ? (
            <Button onClick={handleSubmit} data-testid="submit-form-button">
              Submit Form
            </Button>
          ) : (
            <Button onClick={handleNext} data-testid="next-section-button">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DynamicForm;

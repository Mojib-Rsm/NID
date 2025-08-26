"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdentityForm, type FormSchemaType, formSchema } from "@/components/IdentityForm";
import { IdCardPreview } from "@/components/IdCardPreview";
import { generatePdf } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import * as z from "zod";


const defaultValues: FormSchemaType = {
  name: "",
  fatherName: "",
  motherName: "",
  address: "",
  nidNumber: "",
  dob: undefined,
  photo: undefined,
  signature: undefined,
};


export default function Home() {
  const [data, setData] = useState<FormSchemaType>(defaultValues);
  const { toast } = useToast();
  const [theme, setTheme] = useState('light');

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
    mode: "onChange",
  });

  const handleSaveToLocal = () => {
    try {
      const currentData = form.getValues();
      localStorage.setItem("identityForgeData", JSON.stringify(currentData));
      toast({
        title: "Success",
        description: "Your data has been saved locally.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save data. Local storage might be full.",
      });
    }
  };

  const handleLoadFromLocal = () => {
    try {
      const savedData = localStorage.getItem("identityForgeData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Zod parse to ensure data integrity and convert date string back to Date object
        const validatedData = formSchema.extend({
          dob: z.string().optional().transform(val => val ? new Date(val) : undefined)
        }).parse(parsedData);

        form.reset(validatedData);
        setData(validatedData);
        toast({
          title: "Success",
          description: "Your data has been loaded.",
        });
      } else {
        toast({
          title: "Not Found",
          description: "No saved data found in local storage.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load data. It might be corrupted.",
      });
    }
  };
  
  const handleGeneratePdf = () => {
    const currentData = form.getValues();
    const result = formSchema.safeParse(currentData);
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Invalid Data",
        description: "Please fill all required fields correctly before generating the PDF.",
      });
      // Trigger validation display
      form.trigger();
      return;
    }
    generatePdf(result.data);
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);


  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">IdentityForge</h1>
            <Button onClick={toggleTheme} variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="w-full">
            <IdentityForm
              onDataChange={setData}
              onGeneratePdf={handleGeneratePdf}
              onSave={handleSaveToLocal}
              onLoad={handleLoadFromLocal}
              form={form}
            />
          </div>
          <div className="w-full lg:sticky lg:top-8">
            <IdCardPreview data={data} />
          </div>
        </div>
      </div>
    </main>
  );
}

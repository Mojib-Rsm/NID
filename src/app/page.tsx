"use client"

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdentityForm, type FormSchemaType, formSchema } from "@/components/IdentityForm";
import { IdCardPreview } from "@/components/IdCardPreview";
import { generatePdf } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Sparkles, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { extractIdData } from "@/ai/flows/extract-id-data-flow";


const defaultValues: FormSchemaType = {
  name: "John Doe",
  nameBangla: "জন ডো",
  fatherName: "Richard Doe",
  motherName: "Jane Doe",
  address: "123 Main St, Anytown, USA",
  nidNumber: "1234567890",
  dob: new Date("1990-01-01"),
  issueDate: new Date(),
  photo: undefined,
  signature: undefined,
  pin: "1234567890123",
  voterArea: "Anytown",
  birthPlace: "Anytown",
  spouseName: "Jane Doe",
  gender: "Male",
  bloodGroup: "O+",
  presentAddress: "123 Main St, Anytown, USA",
  permanentAddress: "123 Main St, Anytown, USA",
  mobileNumber: "",
};

type CardType = "nid" | "server" | "signature";


export default function Home() {
  const [data, setData] = useState<FormSchemaType>(defaultValues);
  const { toast } = useToast();
  const [theme, setTheme] = useState('light');
  const [cardType, setCardType] = useState<CardType>("nid");
  const [isExtracting, startExtracting] = useTransition();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
    mode: "onChange",
  });

  const handleSaveToLocal = () => {
    try {
      const currentData = form.getValues();
      // Convert Date object to ISO string for consistent storage
      const dataToSave = {
        ...currentData,
        dob: currentData.dob ? currentData.dob.toISOString() : undefined,
        issueDate: currentData.issueDate ? currentData.issueDate.toISOString() : undefined,
      };
      localStorage.setItem("identityForgeData", JSON.stringify(dataToSave));
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
        
        // Ensure dob is a Date object if it exists
        const dataToLoad = {
            ...defaultValues, // ensure all fields are present
            ...parsedData,
            dob: parsedData.dob ? new Date(parsedData.dob) : new Date(),
            issueDate: parsedData.issueDate ? new Date(parsedData.issueDate) : new Date(),
        };

        const validatedData = formSchema.safeParse(dataToLoad);

        if (validatedData.success) {
            form.reset(validatedData.data);
            setData(validatedData.data);
            toast({
              title: "Success",
              description: "Your data has been loaded.",
            });
        } else {
             toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Loaded data is invalid. Please check the console for details.",
             });
             console.error(validatedData.error);
        }
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
    generatePdf(result.data, cardType);
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  const handleFileExtract = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        startExtracting(async () => {
          try {
            const extractedData = await extractIdData({ photoDataUri: dataUri });
            const newDob = new Date(extractedData.dob);
            const newIssueDate = new Date(extractedData.issueDate);
            const updatedData = {
              ...form.getValues(),
              ...extractedData,
              dob: newDob,
              issueDate: newIssueDate,
            };
            form.reset(updatedData);
            setData(updatedData);
            toast({
              title: "Data Extracted",
              description: "The information from the ID card has been filled into the form.",
            });
          } catch(err) {
            console.error(err)
            toast({
              variant: "destructive",
              title: "Extraction Failed",
              description: "Could not extract data from the document. Please try a clearer one.",
            });
          }
        });
      };
      reader.readAsDataURL(file);
    }
     // Reset file input to allow re-selection of the same file
     e.target.value = "";
  }


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
          <div className="w-full space-y-6">
            <Card>
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                 <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">Card Style</label>
                    <Select value={cardType} onValueChange={(v) => setCardType(v as CardType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nid">NID Card</SelectItem>
                        <SelectItem value="server">Server Copy</SelectItem>
                        <SelectItem value="signature">Signature Card</SelectItem>
                      </SelectContent>
                    </Select>
                 </div>
                 <div className="flex-1 space-y-2">
                   <label htmlFor="image-extract-input" className="text-sm font-medium block">
                      Extract from Document (AI)
                    </label>
                    <Button asChild className="w-full" variant="outline">
                      <label htmlFor="image-extract-input" className="cursor-pointer">
                         {isExtracting ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                           <Sparkles className="mr-2 h-4 w-4" />
                         )}
                         Upload and Extract
                      </label>
                    </Button>
                    <input id="image-extract-input" type="file" accept="image/*,application/pdf" className="sr-only" onChange={handleFileExtract} disabled={isExtracting} />
                 </div>
              </CardContent>
            </Card>

            <IdentityForm
              onDataChange={setData}
              onGeneratePdf={handleGeneratePdf}
              onSave={handleSaveToLocal}
              onLoad={handleLoadFromLocal}
              form={form}
            />
          </div>
          <div className="w-full lg:sticky lg:top-8">
            <IdCardPreview data={data} cardType={cardType} />
          </div>
        </div>
      </div>
    </main>
  );
}

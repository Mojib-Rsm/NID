"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "./ui/date-picker"
import { User, Calendar, MapPin, Fingerprint, Image as ImageIcon, PenSquare, Save, FolderOpen, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Dispatch, SetStateAction } from "react"
import React from "react"

export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  fatherName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  motherName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  dob: z.date().optional(),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  nidNumber: z.string().regex(/^\d{10}$|^\d{13}$|^\d{17}$/, { message: "Enter a valid 10, 13, or 17 digit NID number." }),
  photo: z.string().optional(), // Base64 string
  signature: z.string().optional(), // Base64 string
})

export type FormSchemaType = z.infer<typeof formSchema>

interface IdentityFormProps {
  onDataChange: Dispatch<SetStateAction<FormSchemaType>>;
  onGeneratePdf: () => void;
  onSave: () => void;
  onLoad: () => void;
  form: UseFormReturn<FormSchemaType>;
}

export function IdentityForm({ onDataChange, onGeneratePdf, onSave, onLoad, form }: IdentityFormProps) {

  const watchedValues = form.watch();

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange(value as FormSchemaType);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "photo" | "signature") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue(fieldName, reader.result as string, { shouldValidate: true, shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4" />Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4" />Father's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Richard Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4" />Mother's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center"><Calendar className="mr-2 h-4 w-4" />Date of Birth</FormLabel>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4" />Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Main St, Anytown..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nidNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Fingerprint className="mr-2 h-4 w-4" />NID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="photo"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4" />Photo</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "photo")} className="pt-1.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signature"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center"><PenSquare className="mr-2 h-4 w-4" />Signature</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "signature")} className="pt-1.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button type="button" onClick={onGeneratePdf}><Download className="mr-2 h-4 w-4" />Generate PDF</Button>
              <Button type="button" variant="secondary" onClick={onSave}><Save className="mr-2 h-4 w-4" />Save Data</Button>
              <Button type="button" variant="outline" onClick={onLoad}><FolderOpen className="mr-2 h-4 w-4" />Load Data</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

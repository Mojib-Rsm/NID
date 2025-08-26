"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { FormSchemaType } from "./IdentityForm"
import Image from "next/image"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

type CardType = "nid" | "server" | "signature";

const Barcode = () => {
    const [bars, setBars] = useState<{ width: number; height: number }[]>([]);

    useEffect(() => {
        const newBars = [...Array(120)].map(() => ({
            width: Math.random() * 1.5 + 0.5,
            height: Math.random() * 60 + 40,
        }));
        setBars(newBars);
    }, []);

    if (bars.length === 0) {
        // Render a placeholder or nothing on the server and initial client render
        return <div className="h-12 w-full bg-gray-200" />;
    }
    
    return (
        <div className="flex items-end gap-px h-12 w-full overflow-hidden px-2">
            {bars.map((bar, i) => (
                <div key={i} className="bg-black" style={{width: `${bar.width}px`, height: `${bar.height}%`}}></div>
            ))}
        </div>
    )
}

const QrCode = ({ data }: { data: FormSchemaType }) => {
    const qrData = `Name: ${data.name}\nNID: ${data.nidNumber}\nDOB: ${data.dob ? new Date(data.dob).toLocaleDateString('en-CA') : ''}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    
    return (
        <div className="w-24 h-24 p-1 border bg-white">
            <Image src={qrUrl} alt="QR Code" width={96} height={96} className="w-full h-full" data-ai-hint="qr code" />
        </div>
    )
}

const NIDCardFront = ({ data }: { data: FormSchemaType }) => (
    <Card className="font-sans shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="bg-white aspect-[85.6/54] w-full border relative overflow-hidden" style={{ backgroundImage: "url('/nid_bg.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
           {/* Header */}
           <div className="h-[22%] bg-green-700/95 flex items-center justify-start p-2.5 gap-2">
              <Image src="/bd_govt.png" alt="Bangladesh Govt Logo" width={40} height={40} className="w-10 h-10 object-contain" data-ai-hint="emblem logo" />
              <div className="text-center text-white">
                  <p className="text-[8px] font-bold">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                  <p className="text-[7px] -mt-0.5">Government of the People's Republic of Bangladesh</p>
              </div>
           </div>
  
           <main className="mt-1 grid grid-cols-12 gap-x-2 px-2.5">
            <div className="col-span-4">
                {data.photo ? (
                  <Image src={data.photo} alt="User photo" width={100} height={125} className="w-full h-auto aspect-[4/5] object-cover bg-gray-200 mt-1 border-2 border-white shadow-md" data-ai-hint="person portrait" />
                ) : (
                  <div className="w-full aspect-[4/5] bg-gray-300 flex items-center justify-center mt-1 border-2 border-white shadow-md">
                      <p className="text-xs text-gray-500">Photo</p>
                  </div>
                )}
                 <div className="mt-2 h-8 flex items-center justify-center">
                   {data.signature ? (
                       <Image src={data.signature} alt="User signature" width={100} height={30} className="w-full h-full object-contain mix-blend-darken" data-ai-hint="signature" />
                   ) : (
                       <div className="w-24 h-6 bg-gray-300/50 rounded-md" />
                   )}
                </div>
            </div>
            <div className="col-span-8 space-y-0.5 text-black pt-1">
               <h2 className="text-lg font-bold text-red-600 leading-tight">জাতীয় পরিচয়পত্র</h2>
               <h3 className="text-[10px] font-bold -mt-1 leading-tight">NATIONAL IDENTITY CARD</h3>
  
               <p className="text-[10px] font-bold pt-2">{data.nameBangla}</p>
               <p className="text-[9px] font-semibold">{data.name}</p>
               <p className="text-[9px]"><span className="font-semibold">Father:</span> {data.fatherName}</p>
               <p className="text-[9px]"><span className="font-semibold">Mother:</span> {data.motherName}</p>
               <div className="flex items-center gap-4">
                  <p className="text-[9px]"><span className="font-semibold">Date of Birth:</span> {data.dob ? new Date(data.dob).toLocaleDateString('en-GB') : ''}</p>
               </div>
               <p className="text-[10px] font-bold text-red-600 pt-1">ID NO: {data.nidNumber}</p>
            </div>
           </main>
           
           <div className="absolute bottom-0 left-0 w-full h-4 bg-red-600" style={{ backgroundImage: "url('/wave.svg')", backgroundSize: 'cover' }}></div>
        </div>
      </CardContent>
    </Card>
)
  
const NIDCardBack = ({ data }: { data: FormSchemaType }) => (
    <Card className="font-sans shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white">
      <CardContent className="aspect-[85.6/54] p-2.5 text-black flex flex-col justify-between relative overflow-hidden" style={{ backgroundImage: "url('/nid_bg.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <p className="text-[8px] text-center">
          এই কার্ডটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সম্পত্তি। কার্ডটি ব্যবহারকারী ব্যতীত অন্য কোথাও পাওয়া গেলে নিকটস্থ পোস্ট অফিসে জমা দেবার জন্য অনুরোধ করা হলো।
        </p>
        
        <div className="border-t border-b border-black py-1 my-1">
           <p className="text-[9px]"><span className="font-bold">Address:</span> {data.address}</p>
        </div>
  
        <div className="flex justify-between items-start border-b border-black pb-1">
          <p className="text-[9px]"><span className="font-bold">Blood Group:</span> <span className="text-red-600 font-bold">{data.bloodGroup}</span></p>
          <p className="text-[9px]"><span className="font-bold">Place of Birth:</span> {data.birthPlace}</p>
        </div>
        
        <div className="flex justify-between items-end mt-1">
          <div className="w-24 h-24 p-1 border bg-white">
            <QrCode data={data}/>
          </div>
          <div className="text-center">
              <div className="w-24 h-6" />
              <p className="text-[8px] font-bold border-t border-black mt-0.5">Authorised Signature</p>
          </div>
          <div>
              <p className="text-[9px]"><span className="font-bold">Date of Issue:</span> {data.issueDate ? new Date(data.issueDate).toLocaleDateString('en-GB') : ''}</p>
          </div>
        </div>
  
        <div className="absolute bottom-0 left-0 w-full">
            <Barcode />
        </div>
        
      </CardContent>
    </Card>
)

const ServerCopy = ({ data }: { data: FormSchemaType }) => {
    const ServerField = ({ label, value }: { label: string; value: string | undefined | React.ReactNode}) => (
        <tr className="border-b border-gray-200">
            <td className="w-1/3 py-1.5 px-2 text-sm text-gray-600">{label}</td>
            <td className="w-2/3 py-1.5 px-2 text-sm font-medium text-black">{value || " "}</td>
        </tr>
    );
    const SectionHeader = ({ title }: { title: string }) => (
      <div className="bg-cyan-100 border border-cyan-200 px-3 py-1 my-2">
          <h3 className="text-md font-bold text-cyan-800">{title}</h3>
      </div>
    )
    
    return (
        <Card className="font-sans shadow-lg overflow-hidden bg-white text-black text-[12px]">
            <CardContent className="p-4">
                <header className="flex items-center justify-between gap-4 mb-4 border-b-2 border-gray-400 pb-2">
                    <div className="flex items-center gap-4">
                        <Image src="/bd_govt.png" alt="Bangladesh Govt Logo" width={40} height={40} data-ai-hint="emblem logo" />
                        <div>
                            <h2 className="text-lg font-bold text-green-800">Bangladesh Election Commission</h2>
                            <p className="text-sm text-yellow-600 font-semibold">National Identity Registration Wing (NIDW)</p>
                        </div>
                    </div>
                    <Button size="sm">Home</Button>
                </header>

                <main className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 flex flex-col items-center">
                        {data.photo ? (
                            <Image src={data.photo} alt="User photo" width={120} height={150} className="w-full max-w-[120px] aspect-[4/5] object-cover bg-gray-200 rounded-sm border" data-ai-hint="person portrait" />
                        ) : <div className="w-full max-w-[120px] aspect-[4/5] bg-gray-200" />}
                        <p className="mt-2 text-sm font-semibold">{data.name}</p>
                        <div className="mt-4">
                           <QrCode data={data} />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <SectionHeader title="জাতীয় পরিচিতি তথ্য" />
                        <table className="w-full"><tbody>
                          <ServerField label="জাতীয় পরিচয় পত্র নম্বর" value={data.nidNumber} />
                          <ServerField label="পিন" value={data.pin} />
                          <ServerField label="ভোটার এলাকা" value={data.voterArea} />
                          <ServerField label="জন্মস্থান" value={data.birthPlace} />
                          <ServerField label="স্বামী/স্ত্রীর নাম" value={data.spouseName} />
                        </tbody></table>

                        <SectionHeader title="ব্যক্তিগত তথ্য" />
                        <table className="w-full"><tbody>
                          <ServerField label="নাম (বাংলা)" value={data.nameBangla} />
                          <ServerField label="নাম (ইংরেজি)" value={data.name} />
                          <ServerField label="জন্ম তারিখ" value={data.dob ? new Date(data.dob).toLocaleDateString('en-GB') : ''} />
                          <ServerField label="পিতার নাম" value={data.fatherName} />
                          <ServerField label="মাতার নাম" value={data.motherName} />
                        </tbody></table>

                        <SectionHeader title="অন্যান্য তথ্য" />
                        <table className="w-full"><tbody>
                           <ServerField label="লিঙ্গ" value={data.gender} />
                           <ServerField label="রক্তের গ্রুপ" value={data.bloodGroup} />
                           <ServerField label="মোবাইল" value={data.mobileNumber} />
                        </tbody></table>
                    </div>
                </main>

                <div className="mt-4">
                  <SectionHeader title="বর্তমান ঠিকানা" />
                  <p className="p-2 text-sm">{data.presentAddress}</p>
                  
                  <SectionHeader title="স্থায়ী ঠিকানা" />
                  <p className="p-2 text-sm">{data.permanentAddress}</p>
                </div>

                <footer className="text-center mt-6">
                    <p className="text-xs text-gray-500">উপরে প্রদর্শিত তথ্য সমূহ জাতীয় পরিচয়পত্র সংশ্লিষ্ট, ভোটার তালিকার সাথে সরাসরি সম্পর্কযুক্ত নয়।</p>
                    <p className="text-xs text-red-600">This is a Software Generated Report From Bangladesh Election Commission, Signature & Seal Aren't Required.</p>
                </footer>
            </CardContent>
        </Card>
    )
}

const SignatureCard = ({ data }: { data: FormSchemaType }) => (
  <Card className="font-sans shadow-lg overflow-hidden bg-white">
     <CardContent className="aspect-[85.6/54] p-4 flex flex-col justify-center items-center border-4 border-primary/50">
        <h2 className="text-sm font-semibold mb-2">{data.name}</h2>
        {data.signature ? (
            <Image src={data.signature} alt="User signature" width={200} height={80} className="w-48 h-20 object-contain mix-blend-darken" data-ai-hint="signature" />
        ) : (
            <div className="w-48 h-20 bg-gray-300/50 rounded-md flex items-center justify-center">
                <p className="text-xs text-gray-500">Signature</p>
            </div>
        )}
         <hr className="border-gray-600 w-48 mt-1" />
         <p className="text-[10px] text-gray-500 mt-1">Signature</p>
     </CardContent>
  </Card>
)

export function IdCardPreview({ data, cardType }: { data: FormSchemaType, cardType: CardType }) {

  const renderPreview = () => {
    switch(cardType) {
      case 'nid':
        return (
          <>
            <h3 className="text-xl font-semibold text-center text-primary">NID Card Preview</h3>
            <NIDCardFront data={data} />
            <NIDCardBack data={data} />
          </>
        )
      case 'server':
         return (
          <>
            <h3 className="text-xl font-semibold text-center text-primary">Server Copy Preview</h3>
            <ServerCopy data={data} />
          </>
        )
      case 'signature':
        return (
          <>
            <h3 className="text-xl font-semibold text-center text-primary">Signature Card Preview</h3>
            <SignatureCard data={data} />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full space-y-4">
      {renderPreview()}
    </div>
  )
}

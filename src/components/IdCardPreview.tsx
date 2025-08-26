"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { FormSchemaType } from "./IdentityForm"
import Image from "next/image"

type CardType = "nid" | "server" | "signature";

const Barcode = () => (
    <div className="flex items-end gap-px h-12 w-full overflow-hidden">
        {[...Array(60)].map((_, i) => (
            <div key={i} className="bg-black" style={{width: `${Math.random() * 2 + 0.5}px`, height: `${Math.random() * 80 + 20}%`}}></div>
        ))}
    </div>
)

const QrCode = () => (
    <div className="w-24 h-24 p-1 border bg-white">
        <Image src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://firebase.google.com/" alt="QR Code" width={96} height={96} className="w-full h-full" data-ai-hint="qr code" />
    </div>
)


const Field = ({ label, value }: { label: string; value: string | undefined }) => (
  <div>
    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-sm font-semibold text-black -mt-0.5">{value || " "}</p>
  </div>
);

const NIDCardFront = ({ data }: { data: FormSchemaType }) => (
  <Card className="font-sans shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
    <CardContent className="p-0">
      <div className="bg-accent/50 aspect-[85.6/54] border-4 border-white">
        <header className="bg-primary/80 text-primary-foreground text-center py-2 px-4">
          <h4 className="text-sm font-bold tracking-wider">GOVERNMENT OF PEOPLE'S REPUBLIC</h4>
          <p className="text-xs">National ID Card</p>
        </header>
        <main className="p-4 grid grid-cols-3 gap-4">
          <div className="col-span-1 space-y-2">
              {data.photo ? (
                <Image src={data.photo} alt="User photo" width={100} height={125} className="w-full h-auto aspect-[4/5] object-cover bg-gray-200 rounded-md border-2 border-white" data-ai-hint="person portrait" />
              ) : (
                <div className="w-full aspect-[4/5] bg-gray-300 rounded-md flex items-center justify-center border-2 border-white">
                    <p className="text-xs text-gray-500">Photo</p>
                </div>
              )}
          </div>
          <div className="col-span-2 space-y-2.5">
            <Field label="Name" value={data.name} />
            <Field label="Father's Name" value={data.fatherName} />
            <Field label="Mother's Name" value={data.motherName} />
            <Field label="Date of Birth" value={data.dob ? new Date(data.dob).toLocaleDateString('en-GB') : ''} />
            
            <div className="pt-4">
                {data.signature ? (
                    <Image src={data.signature} alt="User signature" width={100} height={40} className="w-32 h-10 object-contain mix-blend-darken" data-ai-hint="signature" />
                ) : (
                    <div className="w-32 h-10 bg-gray-300/50 rounded-md flex items-center justify-center">
                        <p className="text-[10px] text-gray-500">Signature</p>
                    </div>
                )}
                  <hr className="border-gray-600 w-32 mt-1" />
            </div>
          </div>
        </main>
      </div>
    </CardContent>
  </Card>
)

const NIDCardBack = ({ data }: { data: FormSchemaType }) => (
  <Card className="font-sans shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
    <CardContent className="p-0">
        <div className="bg-accent/50 aspect-[85.6/54] p-4 flex flex-col justify-between border-4 border-white">
            <div>
                <Field label="Address" value={data.address} />
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-red-600">ID NO:</p>
                    <p className="font-mono text-lg font-bold tracking-widest text-red-600">{data.nidNumber}</p>
                </div>
                <Barcode />
                <p className="text-[6px] text-center text-gray-600 pt-2">This card is the property of the government. If found, please return to the nearest police station.</p>
            </div>
        </div>
    </CardContent>
  </Card>
)

const ServerCopy = ({ data }: { data: FormSchemaType }) => {
    const ServerField = ({ label, value }: { label: string; value: string | undefined | React.ReactNode}) => (
        <div className="flex border-b border-gray-200 py-1.5">
            <p className="w-1/3 text-sm text-gray-600">{label}</p>
            <p className="w-2/3 text-sm font-medium text-black">{value || " "}</p>
        </div>
    );
    
    return (
        <Card className="font-sans shadow-lg overflow-hidden bg-white text-black">
            <CardContent className="p-6">
                <header className="flex items-center gap-4 mb-4">
                    <Image src="https://seeklogo.com/images/B/bangladesh-govt-logo-A2C76D6556-seeklogo.com.png" alt="Bangladesh Govt Logo" width={40} height={40} data-ai-hint="emblem logo" />
                    <div>
                        <h2 className="text-lg font-bold text-green-800">Bangladesh Election Commission</h2>
                        <p className="text-sm text-yellow-600 font-semibold">National Identity Registration Wing (NIDW)</p>
                    </div>
                </header>

                <main className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 flex flex-col items-center">
                        {data.photo ? (
                            <Image src={data.photo} alt="User photo" width={120} height={150} className="w-full max-w-[120px] aspect-[4/5] object-cover bg-gray-200 rounded-sm border" data-ai-hint="person portrait" />
                        ) : <div className="w-full max-w-[120px] aspect-[4/5] bg-gray-200" />}
                        <p className="mt-2 text-sm font-semibold">{data.name}</p>
                        <div className="mt-4">
                           <QrCode />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="bg-cyan-50 border border-cyan-200 px-3 py-1 mb-4">
                            <h3 className="text-md font-bold text-cyan-800">National Identity Information</h3>
                        </div>
                        <ServerField label="National ID No." value={<span className="font-bold text-red-600">{data.nidNumber}</span>} />
                        
                        <div className="bg-cyan-50 border border-cyan-200 px-3 py-1 mt-6 mb-4">
                            <h3 className="text-md font-bold text-cyan-800">Personal Information</h3>
                        </div>
                        <ServerField label="Name (English)" value={data.name} />
                        <ServerField label="Date of Birth" value={data.dob ? new Date(data.dob).toLocaleDateString('en-GB') : ''} />
                        <ServerField label="Father's Name" value={data.fatherName} />
                        <ServerField label="Mother's Name" value={data.motherName} />
                        
                        <div className="bg-cyan-50 border border-cyan-200 px-3 py-1 mt-6 mb-4">
                            <h3 className="text-md font-bold text-cyan-800">Address</h3>
                        </div>
                        <div className="border-b border-gray-200 py-1.5">
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="text-sm font-medium text-black">{data.address || " "}</p>
                        </div>

                    </div>
                </main>
                <footer className="text-center mt-6">
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

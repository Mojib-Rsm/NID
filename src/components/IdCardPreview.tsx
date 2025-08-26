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

const ServerCopy = ({ data }: { data: FormSchemaType }) => (
  <Card className="font-sans shadow-lg overflow-hidden bg-white">
     <CardContent className="aspect-[85.6/108] p-4 border-2 border-dashed border-gray-400">
        <h2 className="text-lg font-bold text-center mb-4">Server Copy</h2>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
           <div className="col-span-1 font-semibold">Name</div>
           <div className="col-span-2">: {data.name}</div>
           
           <div className="col-span-1 font-semibold">Father's Name</div>
           <div className="col-span-2">: {data.fatherName}</div>
           
           <div className="col-span-1 font-semibold">Mother's Name</div>
           <div className="col-span-2">: {data.motherName}</div>

           <div className="col-span-1 font-semibold">Date of Birth</div>
           <div className="col-span-2">: {data.dob ? new Date(data.dob).toLocaleDateString('en-GB') : ''}</div>

           <div className="col-span-1 font-semibold">Address</div>
           <div className="col-span-2 text-xs">: {data.address}</div>

           <div className="col-span-3 my-2 border-t border-dashed"></div>

           <div className="col-span-1 font-semibold">NID Number</div>
           <div className="col-span-2 font-mono font-bold text-base">: {data.nidNumber}</div>

           <div className="col-span-3 mt-4 flex justify-between items-end">
              <div>
                {data.photo ? (
                  <Image src={data.photo} alt="User photo" width={80} height={100} className="w-20 h-auto aspect-[4/5] object-cover bg-gray-200 rounded-sm border" data-ai-hint="person portrait" />
                ) : <div className="w-20 aspect-[4/5] bg-gray-200" />}
              </div>
              <div>
                 {data.signature ? (
                    <Image src={data.signature} alt="User signature" width={100} height={40} className="w-28 h-12 object-contain mix-blend-darken" data-ai-hint="signature" />
                ) : <div className="w-28 h-12 bg-gray-200/50" />}
                 <p className="text-xs text-center border-t border-black mt-1">Signature</p>
              </div>
           </div>
           <div className="col-span-3 mt-4">
              <Barcode />
           </div>
        </div>
     </CardContent>
  </Card>
)

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

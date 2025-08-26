import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { FormSchemaType } from '@/components/IdentityForm';
import { SolaimanLipi } from './SolaimanLipi';
import font from 'file-loader?name=static/fonts/[name].[ext]!./SolaimanLipi.ttf';

type CardType = "nid" | "server" | "signature";

// A placeholder for a national emblem, as an inline SVG.
// Note: jspdf's addSvg is experimental. A raster image (PNG) is more reliable.
const emblemSvg = `
<svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50,5 L61.8,38.2 L95.1,38.2 L68.6,61.8 L79.4,95 L50,73.6 L20.6,95 L31.4,61.8 L4.9,38.2 L38.2,38.2 Z" fill="#4A5568"/>
</svg>`;

const addBanglaFont = (doc: jsPDF) => {
    doc.addFileToVFS('SolaimanLipi.ttf', SolaimanLipi);
    doc.addFont('SolaimanLipi.ttf', 'SolaimanLipi', 'normal');
    doc.setFont('SolaimanLipi');
};

const addFrontPage = (doc: jsPDF, data: FormSchemaType) => {
  // Card dimensions (standard ID card size: 85.6mm x 53.98mm) converted to points (1mm = 2.83465 pt)
  const cardWidth = 242.6;
  const cardHeight = 153;
  
  // Background
  doc.setFillColor(232, 240, 254); // #E8F0FE
  doc.rect(0, 0, cardWidth, cardHeight, 'F');
  
  // Header
  doc.setFillColor(119, 141, 169); // #778DA9
  doc.rect(0, 0, cardWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF PEOPLE\'S REPUBLIC', cardWidth / 2, 12, { align: 'center' });
  doc.setFontSize(8);
  doc.text('National ID Card', cardWidth / 2, 20, { align: 'center' });

  // Add emblem placeholder
  try {
      doc.addSvg(emblemSvg, 10, 30, 30, 30);
  } catch(e) {
      console.error("Could not add SVG to PDF, drawing fallback.", e);
      doc.setFillColor(74, 85, 104);
      doc.circle(25, 45, 15, 'F');
  }

  // Photo
  if (data.photo) {
    try {
      doc.addImage(data.photo, 'JPEG', 15, 65, 60, 75);
      doc.setDrawColor(255, 255, 255);
      doc.rect(15, 65, 60, 75); // White border around photo
    } catch (e) {
      console.error("Error adding photo to PDF", e);
    }
  }

  // Personal Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);

  const fields = [
    { label: 'Name', value: data.name },
    { label: "Father's Name", value: data.fatherName },
    { label: "Mother's Name", value: data.motherName },
    { label: 'Date of Birth', value: data.dob ? new Date(data.dob).toLocaleDateString('en-GB') : '' },
  ];
  
  let yPos = 70;
  fields.forEach(field => {
    doc.setFont('helvetica', 'bold');
    doc.text(field.label + ':', 85, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(field.value || '', 140, yPos);
    yPos += 15;
  });

  // Signature
  if (data.signature) {
    try {
      doc.addImage(data.signature, 'PNG', 170, 115, 50, 25, undefined, 'FAST');
      doc.setDrawColor(0,0,0);
      doc.line(170, 220, 140, 140); // line under signature
      doc.text('Signature', 185, 145);
    } catch (e) {
      console.error("Error adding signature to PDF", e);
    }
  }
};

const addBackPage = (doc: jsPDF, data: FormSchemaType) => {
    doc.addPage();
    const cardWidth = 242.6;
    const cardHeight = 153;

    // Background
    doc.setFillColor(232, 240, 254);
    doc.rect(0, 0, cardWidth, cardHeight, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Address:', 15, 20);
    doc.setFont('SolaimanLipi');
    const addressLines = doc.splitTextToSize(data.address || "", cardWidth - 30);
    doc.text(addressLines, 15, 30);
    doc.setFont('helvetica', 'normal');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('NID No:', 15, 80);
    doc.setFont('courier', 'bold');
    doc.setTextColor(200, 0, 0); // Red color for NID
    doc.text(data.nidNumber, 60, 80);
    doc.setTextColor(0, 0, 0);
    
    // Barcode placeholder
    doc.setFillColor(0,0,0);
    let x = 15;
    for(let i=0; i<35; i++) {
        let width = Math.random() * 2 + 0.5;
        doc.rect(x, 100, width, 30, 'F');
        x += width + Math.random() * 1.5;
    }

    doc.setFontSize(7);
    doc.text('This card is the property of the government. If found, please return to the nearest police station.', cardWidth / 2, 148, { align: 'center' });
};

const addServerCopy = async (doc: jsPDF, data: FormSchemaType) => {
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    doc.addPage([pageWidth, pageHeight]);
    addBanglaFont(doc);
    
    // Helper to fetch and convert image to data URL
    const getImageDataUrl = async (path: string) => {
        const response = await fetch(path);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    
    try {
        const govtLogo = await getImageDataUrl('/bd_govt.png');
        doc.addImage(govtLogo, 'PNG', 40, 40, 50, 50);
    } catch (e) {
        console.error("Could not load logo images", e);
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Bangladesh Election Commission', pageWidth / 2, 60, { align: 'center' });
    doc.setFontSize(14);
    doc.text('National Identity Registration Wing (NIDW)', pageWidth / 2, 80, { align: 'center' });

    if (data.photo) {
        doc.addImage(data.photo, 'JPEG', 40, 120, 100, 125);
    }
     if (data.nidNumber) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Name: ${data.name}%0ANID: ${data.nidNumber}%0ADOB: ${data.dob ? new Date(data.dob).toLocaleDateString('en-CA') : ''}`;
        try {
            const qrCodeData = await getImageDataUrl(qrUrl);
            doc.addImage(qrCodeData, 'PNG', 50, 255, 80, 80);
        } catch(e) {
             console.error("Could not load QR code image", e);
        }
    }


    const tableStartY = 120;
    const tableStartX = 160;
    const colWidths = [180, 240];

    const addSection = (title: string, tableData: (string|string[])[][], startY: number): number => {
        doc.setFontSize(12);
        doc.setFont('SolaimanLipi', 'normal');
        doc.setFillColor(220, 240, 255);
        doc.rect(tableStartX, startY - 1, (pageWidth - tableStartX - 40), 20, 'F');
        doc.text(title, tableStartX + 10, startY + 14);

        (doc as any).autoTable({
            startY: startY + 22,
            head: [],
            body: tableData,
            theme: 'grid',
            tableWidth: 'wrap',
            margin: { left: tableStartX },
            styles: {
                font: 'SolaimanLipi',
                fontSize: 10,
                cellPadding: 4,
            },
            columnStyles: {
                0: { cellWidth: colWidths[0], fontStyle: 'normal' },
                1: { cellWidth: colWidths[1] },
            }
        });
        return (doc as any).lastAutoTable.finalY + 10;
    };
    
    let currentY = tableStartY;

    currentY = addSection('জাতীয় পরিচিতি তথ্য', [
        ['জাতীয় পরিচয় পত্র নম্বর', data.nidNumber || ''],
        ['পিন', data.pin || ''],
        ['ভোটার এলাকা', data.voterArea || ''],
        ['জন্মস্থান', data.birthPlace || ''],
        ['স্বামী/স্ত্রীর নাম', data.spouseName || ''],
    ], currentY);

    currentY = addSection('ব্যক্তিগত তথ্য', [
        ['নাম (বাংলা)', data.nameBangla || ''],
        ['নাম (ইংরেজি)', data.name || ''],
        ['জন্ম তারিখ', data.dob ? new Date(data.dob).toLocaleDateString('en-GB') : ''],
        ['পিতার নাম', data.fatherName || ''],
        ['মাতার নাম', data.motherName || ''],
    ], currentY);

    currentY = addSection('অন্যান্য তথ্য', [
        ['লিঙ্গ', data.gender || ''],
        ['রক্তের গ্রুপ', data.bloodGroup || ''],
        ['মোবাইল', data.mobileNumber || ''],
    ], currentY);
    
    // Addresses below tables
    doc.setFontSize(12);
    doc.setFont('SolaimanLipi', 'normal');
    doc.setFillColor(220, 240, 255);
    doc.rect(40, currentY -1, (pageWidth - 80), 20, 'F');
    doc.text("বর্তমান ঠিকানা", 50, currentY + 14);
    doc.setFontSize(10);
    doc.text(data.presentAddress || '', 45, currentY + 40, { maxWidth: pageWidth - 90 });
    currentY += 60;
    
    doc.setFontSize(12);
    doc.setFont('SolaimanLipi', 'normal');
    doc.setFillColor(220, 240, 255);
    doc.rect(40, currentY -1, (pageWidth - 80), 20, 'F');
    doc.text("স্থায়ী ঠিকানা", 50, currentY + 14);
    doc.setFontSize(10);
    doc.text(data.permanentAddress || '', 45, currentY + 40, { maxWidth: pageWidth - 90 });
    currentY += 60;
    

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('উপরে প্রদর্শিত তথ্য সমূহ জাতীয় পরিচয়পত্র সংশ্লিষ্ট, ভোটার তালিকার সাথে সরাসরি সম্পর্কযুক্ত নয়।', pageWidth / 2, pageHeight - 40, { align: 'center' });
    doc.setTextColor(200, 0, 0);
    doc.text("This is a Software Generated Report From Bangladesh Election Commission, Signature & Seal Aren't Required.", pageWidth / 2, pageHeight - 25, { align: 'center' });
}

const addSignatureCard = (doc: jsPDF, data: FormSchemaType) => {
  doc.addPage();
  const cardWidth = 242.6;
  const cardHeight = 153;

  doc.setFillColor(250, 250, 250);
  doc.rect(0, 0, cardWidth, cardHeight, 'F');
  doc.setDrawColor(119, 141, 169);
  doc.rect(2, 2, cardWidth-4, cardHeight-4);

  doc.setTextColor(0,0,0);
  doc.setFontSize(10);
  doc.setFont('SolaimanLipi');
  doc.text(data.name, cardWidth/2, 50, {align: 'center'});

  if (data.signature) {
    doc.addImage(data.signature, 'PNG', cardWidth/2 - 50, 60, 100, 40, undefined, 'FAST');
  }
  doc.setDrawColor(0,0,0);
  doc.line(cardWidth/2 - 50, 105, cardWidth/2 + 50, 105);
  doc.setFontSize(8);
  doc.text('Signature', cardWidth/2, 115, {align: 'center'});
}


export const generatePdf = async (data: FormSchemaType, cardType: CardType) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });
  doc.deletePage(1); // remove default page

  switch(cardType) {
    case 'nid':
       doc.addPage([242.6, 153]); // Go back to landscape card
       addBanglaFont(doc);
       addFrontPage(doc, data);
       addBackPage(doc, data);
       doc.deletePage(1); // remove the extra blank page
       break;
    case 'server':
      await addServerCopy(doc, data);
      break;
    case 'signature':
      doc.addPage([242.6, 153]);
      addBanglaFont(doc);
      addSignatureCard(doc, data);
      doc.deletePage(1);
      break;
  }
  
  doc.save(`IdentityForge-${cardType}.pdf`);
};

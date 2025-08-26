import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { FormSchemaType } from '@/components/IdentityForm';

// A placeholder for a national emblem, as an inline SVG.
// Note: jspdf's addSvg is experimental. A raster image (PNG) is more reliable.
const emblemSvg = `
<svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50,5 L61.8,38.2 L95.1,38.2 L68.6,61.8 L79.4,95 L50,73.6 L20.6,95 L31.4,61.8 L4.9,38.2 L38.2,38.2 Z" fill="#4A5568"/>
</svg>`;


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
    doc.text(field.value, 140, yPos);
    yPos += 15;
  });

  // Signature
  if (data.signature) {
    try {
      doc.addImage(data.signature, 'PNG', 170, 115, 50, 25, undefined, 'FAST');
      doc.setDrawColor(0,0,0);
      doc.line(170, 140, 220, 140); // line under signature
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
    doc.setFont('helvetica', 'normal');
    const addressLines = doc.splitTextToSize(data.address, cardWidth - 30);
    doc.text(addressLines, 15, 30);

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


export const generatePdf = async (data: FormSchemaType) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [242.6, 153],
  });

  addFrontPage(doc, data);
  addBackPage(doc, data);
  
  doc.save('IdentityForge-NID.pdf');
};

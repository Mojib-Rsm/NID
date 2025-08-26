import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { FormSchemaType } from '@/components/IdentityForm';
import { SolaimanLipi } from './SolaimanLipi';

type CardType = "nid" | "server" | "signature";

const bdGovtLogo =
  'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoA2' +
  'AIAADUBAAAhjgAAdTAADuOAABv3o8+q+wAAERZSURBVHja7Jp7bFzXlcdviGAhQ5KRI0t2JEtOJCm2' +
  'NEkrlhRLmhTfig3sOI5hO5xJHBN2msAxMGPBwGBjsCChYcCEBCEhBEiABEIgQRIgCRAghIA2aFpL3e' +
  '2S7u3tbe193+n7/ZD3vfd970P3vN/de19f79azJyMioomA7e0HmpqaqKKiQiUUCpWTyWQk039qampY' +
  'X1/X3t7e0dHR1dW1tLTU2dl5aGjoxMRECoVCpVJpNBqE41G5XO63q6tLpVJJSUnx8fFkMhmpVOpqgY' +
  'Bw4MCBnp4esVhszs7O9fX14+PjtbW1TU1NpaWlhUJhsVi8vLw8LS3NzMxMFxcXuVyuzMxMFxcXxWKRy+' +
  'VqtVqtVkOhUAgEAgE/CIVCodVq3d3dlUrl6empqqpKJBJ5eXm5uLiYm5ubn5+fnZ2dn58vlUrl5eVx' +
  'uVwqlcrLy6NarY7FYgMDA5lMphKJRCIRsVgMAgGv16tWq8ViEQgEHM4PBAIul8vtdpvNZqVSaWJi' +
  'Ynh4mMFgwGw2M5lMJpMplUrDwwPDw0Mmk3l2dpaHh4eFhYVcLhcKhVar1W63E4lEIpHo7e1NJBLZ' +
  'bDalUqnVagUCAYFAQKPRqFar4XAYCoVCIVCGLsdisclkEolELper1Wq1Wk1LSxOLxY6OjiYmJqan' +
  'p6enpyYmJgYGBrq6urq7u0ulUrvdDgQCbrebyWSSiUQymQwEAra2tgYGBtbX11tbW01NTTU1NdXV' +
  '1e3t7ePj40NDQ0NDQ7W1tVar1XK5nEwmk0gkEAhEIhF7e/uysjLVajWZTEYikVarNZ1O5+XlSSQS' +
  'Pp+fn5/f3Nzc1NSEQqEQiUR8Ph+Px3NychKJRPv7+3Nzc3Nzcy6Xq1arc7lcNBpNJBLZ7XZHR0dZ' +
  'LBbD4fD5fE6nk3g87u7uTiaTiUSifD4Xj8dzcnLs7e1NJhN+v5/P5yORiMFg4HK5nJ2dfTAYDAQC' +
  'oVCIRCJCoRAIBPz+AAgEHA4HHg98Pp/H43E4HD4fDwQCbrc7mUwikYjdbsdisXg8Ho/HYzAYlEql' +
  'UqlUKhUKhWq1OplMZrPZbrd7fn5+YmLC4/EMBgNmsxnsg7zH4wkEAgwGA4lEYjQajUZjOh1bW1utra' +
  '1tbS1HR0etra2tra2tra2trW0MDAw0NDSkUqlMJtPb29vb29va2trQ0NDAwEBHR0dHR0dDQ0Otra2' +
  'tra2tra2tra2tra2tra2trW0dHR0dHR0dHR0dHR0dHZ2dne3t7Z2dnZ2dne3t7Z2dnZ2dne3t7Z2d' +
  'nZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dne3t7R0dHR0dHZ2dnZ2dnZ2dnZ2dne3t7R0dHR0dHR0dHd3d3' +
  'd3d3d3d3d3d3d3d3d3d3R0dHd3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR' +
  '0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR' +
  '0dHR0dHR3d3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR' +
  '3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR' +
  '0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d' +
  '3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0d' +
  'HR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d' +
  'Bw4MCBnp4esVhszs7O9fX14+PjtbW1TU1NpaWlhUJhsVi8vLw8LS3NzMxMFxcXuVyuzMxMFxcXxWKRy+' +
  'VqtVqtVkOhUAgEAgE/CIVCodVq3d3dlUrl6empqqpKJBJ5eXm5uLiYm5ubn5+fnZ2dn58vlUrl5eVx' +
  'uVwqlcrLy6NarY7FYgMDA5lMphKJRCIRsVgMAgGv16tWq8ViEQgEHM4PBAIul8vtdpvNZqVSaWJi' +
  'Ynh4mMFgwGw2M5lMJpMplUrDwwPDw0Mmk3l2dpaHh4eFhYVcLhcKhVar1W63E4lEIpHo7e1NJBLZ' +
  'bDalUqnVagUCAYFAQKPRqFar4XAYCoVCIVCGLsdisclkEolELper1Wq1Wk1LSxOLxY6OjiYmJqan' +
  'p6enpyYmJgYGBrq6urq7u0ulUrvdDgQCbrebyWSSiUQymQwEAra2tgYGBtbX11tbW01NTTU1NdXV' +
  '1e3t7ePj40NDQ0NDQ7W1tVar1XK5nEwmk0gkEAhEIhF7e/uysjLVajWZTEYikVarNZ1O5+XlSSQS' +
  'Pp+fn5/f3Nzc1NSEQqEQiUR8Ph+Px3NychKJRPv7+3Nzc3Nzcy6Xq1arc7lcNBpNJBLZ7XZHR0dZ' +
  'LBbD4fD5fE6nk3g87u7uTiaTiUSifD4Xj8dzcnLs7e1NJhN+v5/P5yORiMFg4HK5nJ2dfTAYDAQC' +
  'oVCIRCJCoRAIBPz+AAgEHA4HHg98Pp/H43E4HD4fDwQCbrc7mUwikYjdbsdisXg8Ho/HYzAYlEql' +
  'UqlUKhUKhWq1OplMZrPZbrd7fn5+YmLC4/EMBgNmsxnsg7zH4wkEAgwGA4lEYjQajUZjOh1bW1utra' +
  '1tbS1HR0etra2tra2tra2trW0MDAw0NDSkUqlMJtPb29vb29va2trQ0NDAwEBHR0dHR0dDQ0Otra2' +
  'tra2tra2tra2tra2tra2trW0dHR0dHR0dHR0dHR0dHZ2dne3t7Z2dnZ2dne3t7Z2dnZ2dne3t7Z2d' +
  'nZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dne3t7R0dHR0dHZ2dnZ2dnZ2dnZ2dne3t7R0dHR0dHR0dHd3d3' +
  'd3d3d3d3d3d3d3d3d3d3R0dHd3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR' +
  '0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR' +
  '0dHR0dHR3d3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR' +
  '3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR' +
  '0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d' +
  '3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0d' +
  'HR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d' +
  'Bw4MCBnp4esVhszs7O9fX14+PjtbW1TU1NpaWlhUJhsVi8vLw8LS3NzMxMFxcXuVyuzMxMFxcXxWKRy+' +
  'VqtVqtVkOhUAgEAgE/CIVCodVq3d3dlUrl6empqqpKJBJ5eXm5uLiYm5ubn5+fnZ2dn58vlUrl5eVx' +
  'uVwqlcrLy6NarY7FYgMDA5lMphKJRCIRsVgMAgGv16tWq8ViEQgEHM4PBAIul8vtdpvNZqVSaWJi' +
  'Ynh4mMFgwGw2M5lMJpMplUrDwwPDw0Mmk3l2dpaHh4eFhYVcLhcKhVar1W63E4lEIpHo7e1NJBLZ' +
  'bDalUqnVagUCAYFAQKPRqFar4XAYCoVCIVCGLsdisclkEolELper1Wq1Wk1LSxOLxY6OjiYmJqan' +
  'p6enpyYmJgYGBrq6urq7u0ulUrvdDgQCbrebyWSSiUQymQwEAra2tgYGBtbX11tbW01NTTU1NdXV' +
  '1e3t7ePj40NDQ0NDQ7W1tVar1XK5nEwmk0gkEAhEIhF7e/uysjLVajWZTEYikVarNZ1O5+XlSSQS' +
  'Pp+fn5/f3Nzc1NSEQqEQiUR8Ph+Px3NychKJRPv7+3Nzc3Nzcy6Xq1arc7lcNBpNJBLZ7XZHR0dZ' +
  'LBbD4fD5fE6nk3g87u7uTiaTiUSifD4Xj8dzcnLs7e1NJhN+v5/P5yORiMFg4HK5nJ2dfTAYDAQC' +
  'oVCIRCJCoRAIBPz+AAgEHA4HHg98Pp/H43E4HD4fDwQCbrc7mUwikYjdbsdisXg8Ho/HYzAYlEql' +
  'UqlUKhUKhWq1OplMZrPZbrd7fn5+YmLC4/EMBgNmsxnsg7zH4wkEAgwGA4lEYjQajUZjOh1bW1utra' +
  '1tbS1HR0etra2tra2tra2trW0MDAw0NDSkUqlMJtPb29vb29va2trQ0NDAwEBHR0dHR0dDQ0Otra2' +
  'tra2tra2tra2tra2tra2trW0dHR0dHR0dHR0dHR0dHZ2dne3t7Z2dnZ2dne3t7Z2dnZ2dne3t7Z2d' +
  'nZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dne3t7R0dHR0dHZ2dnZ2dnZ2dnZ2dne3t7R0dHR0dHR0dHd3d3' +
  'd3d3d3d3d3d3d3d3d3d3R0dHd3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR' +
  '0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR' +
  '0dHR0dHR3d3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR' +
  '3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR' +
  '0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d' +
  '3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0d' +
  'HR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d' +
  'Bw4MCBnp4esVhszs7O9fX14+PjtbW1TU1NpaWlhUJhsVi8vLw8LS3NzMxMFxcXuVyuzMxMFxcXxWKRy+' +
  'VqtVqtVkOhUAgEAgE/CIVCodVq3d3dlUrl6empqqpKJBJ5eXm5uLiYm5ubn5+fnZ2dn58vlUrl5eVx' +
  'uVwqlcrLy6NarY7FYgMDA5lMphKJRCIRsVgMAgGv16tWq8ViEQgEHM4PBAIul8vtdpvNZqVSaWJi' +
  'Ynh4mMFgwGw2M5lMJpMplUrDwwPDw0Mmk3l2dpaHh4eFhYVcLhcKhVar1W63E4lEIpHo7e1NJBLZ' +
  'bDalUqnVagUCAYFAQKPRqFar4XAYCoVCIVCGLsdisclkEolELper1Wq1Wk1LSxOLxY6OjiYmJqan' +
  'p6enpyYmJgYGBrq6urq7u0ulUrvdDgQCbrebyWSSiUQymQwEAra2tgYGBtbX11tbW01NTTU1NdXV' +
  '1e3t7ePj40NDQ0NDQ7W1tVar1XK5nEwmk0gkEAhEIhF7e/uysjLVajWZTEYikVarNZ1O5+XlSSQS' +
  'Pp+fn5/f3Nzc1NSEQqEQiUR8Ph+Px3NychKJRPv7+3Nzc3Nzcy6Xq1arc7lcNBpNJBLZ7XZHR0dZ' +
  'LBbD4fD5fE6nk3g87u7uTiaTiUSifD4Xj8dzcnLs7e1NJhN+v5/P5yORiMFg4HK5nJ2dfTAYDAQC' +
  'oVCIRCJCoRAIBPz+AAgEHA4HHg98Pp/H43E4HD4fDwQCbrc7mUwikYjdbsdisXg8Ho/HYzAYlEql' +
  'UqlUKhUKhWq1OplMZrPZbrd7fn5+YmLC4/EMBgNmsxnsg7zH4wkEAgwGA4lEYjQajUZjOh1bW1utra' +
  '1tbS1HR0etra2tra2tra2trW0MDAw0NDSkUqlMJtPb29vb29va2trQ0NDAwEBHR0dHR0dDQ0Otra2' +
  'tra2tra2tra2tra2tra2trW0dHR0dHR0dHR0dHR0dHZ2dne3t7Z2dnZ2dne3t7Z2dnZ2dne3t7Z2d' +
  'nZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dne3t7R0dHR0dHZ2dnZ2dnZ2dnZ2dne3t7R0dHR0dHR0dHd3d3' +
  'd3d3d3d3d3d3d3d3d3d3R0dHd3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR' +
  '0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR' +
  '0dHR0dHR3d3d3d3d3d3d3R0dHd3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR' +
  '3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR' +
  '0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d' +

  '3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0d' +
  'HR0dHR0dHR0dHR3d3d3d3d3d3d3R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3d3d3d3d3d3d' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAP//AAADgQAAAJI=';

const addBanglaFont = (doc: jsPDF) => {
    doc.addFileToVFS('SolaimanLipi.ttf', SolaimanLipi);
    doc.addFont('SolaimanLipi.ttf', 'SolaimanLipi', 'normal');
    doc.setFont('SolaimanLipi');
};

const mmToPt = (mm: number) => mm * 2.83465;

const addFrontPage = async (doc: jsPDF, data: FormSchemaType) => {
  const cardWidth = mmToPt(85.6);
  const cardHeight = mmToPt(54);

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
    const nidBg = await getImageDataUrl('/nid_bg.svg');
    doc.addImage(nidBg, 'SVG', 0, 0, cardWidth, cardHeight);
  } catch(e) { console.error(e); }
  
  // Header
  doc.setFillColor(0, 106, 78, 0.95);
  doc.rect(0, 0, cardWidth, cardHeight * 0.22, 'F');
  
  try {
      doc.addImage(bdGovtLogo, 'PNG', mmToPt(3), mmToPt(2), mmToPt(12), mmToPt(12));
  } catch(e) { console.error(e) }

  doc.setTextColor(255, 255, 255);
  addBanglaFont(doc);
  doc.setFontSize(8);
  doc.text('গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', mmToPt(17), mmToPt(6));
  doc.setFontSize(7);
  doc.text("Government of the People's Republic of Bangladesh", mmToPt(17), mmToPt(8.5));

  // Main content
  let yPos = cardHeight * 0.22 + mmToPt(5);

  // Photo
  if (data.photo) {
    try {
      doc.addImage(data.photo, 'JPEG', mmToPt(4), yPos, mmToPt(25), mmToPt(31));
    } catch (e) { console.error("Error adding photo to PDF", e); }
  }
   // Signature under Photo
  if (data.signature) {
    try {
        doc.addImage(data.signature, 'PNG', mmToPt(5), yPos + mmToPt(32), mmToPt(22), mmToPt(7), undefined, 'FAST');
    } catch (e) { console.error("Error adding signature", e); }
  }


  // Details
  const xPosDetails = mmToPt(32);
  let yPosDetails = cardHeight * 0.22 + mmToPt(6);
  
  addBanglaFont(doc);
  doc.setFontSize(18);
  doc.setTextColor('#D4213D');
  doc.text("জাতীয় পরিচয়পত্র", xPosDetails, yPosDetails);
  
  yPosDetails += mmToPt(3.5);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0,0,0);
  doc.text("NATIONAL IDENTITY CARD", xPosDetails, yPosDetails);

  yPosDetails += mmToPt(6);
  doc.setFontSize(10);
  addBanglaFont(doc);
  doc.text(data.nameBangla || '', xPosDetails, yPosDetails);

  yPosDetails += mmToPt(4);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.name || '', xPosDetails, yPosDetails);

  yPosDetails += mmToPt(4);
  doc.text('Father: ' + (data.fatherName || ''), xPosDetails, yPosDetails);
  
  yPosDetails += mmToPt(4);
  doc.text('Mother: ' + (data.motherName || ''), xPosDetails, yPosDetails);

  yPosDetails += mmToPt(4);
  doc.text('Date of Birth: ' + (data.dob ? new Date(data.dob).toLocaleDateString('en-GB') : ''), xPosDetails, yPosDetails);

  yPosDetails += mmToPt(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#D4213D');
  doc.text('ID NO: ' + (data.nidNumber || ''), xPosDetails, yPosDetails);

  // Footer wave
  try {
    const wave = await getImageDataUrl('/wave.svg');
    doc.addImage(wave, 'SVG', 0, cardHeight - mmToPt(4), cardWidth, mmToPt(4));
  } catch(e) { console.error(e); }
};

const addBackPage = async (doc: jsPDF, data: FormSchemaType) => {
    doc.addPage();
    const cardWidth = mmToPt(85.6);
    const cardHeight = mmToPt(54);

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
        const nidBg = await getImageDataUrl('/nid_bg.svg');
        doc.addImage(nidBg, 'SVG', 0, 0, cardWidth, cardHeight);
    } catch(e) { console.error(e); }


    addBanglaFont(doc);
    doc.setTextColor(0,0,0);
    doc.setFontSize(8);
    
    const topText = 'এই কার্ডটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সম্পত্তি। কার্ডটি ব্যবহারকারী ব্যতীত অন্য কোথাও পাওয়া গেলে নিকটস্থ পোস্ট অফিসে জমা দেবার জন্য অনুরোধ করা হলো।';
    const topTextLines = doc.splitTextToSize(topText, cardWidth - mmToPt(10));
    doc.text(topTextLines, cardWidth/2, mmToPt(5), { align: 'center' });

    let yPos = mmToPt(12);
    doc.setDrawColor(0,0,0);
    doc.setLineWidth(0.5);
    doc.line(mmToPt(4), yPos, cardWidth - mmToPt(4), yPos);
    
    yPos += mmToPt(1);
    doc.setFontSize(9);
    addBanglaFont(doc);
    const addressLine = doc.splitTextToSize(`Address: ${data.address || ''}`, cardWidth - mmToPt(12));
    doc.text(addressLine, mmToPt(6), yPos + mmToPt(3));
    
    yPos += mmToPt(8);
    doc.line(mmToPt(4), yPos, cardWidth - mmToPt(4), yPos);
    
    yPos += mmToPt(4);
    doc.setFont('helvetica', 'bold');
    doc.text('Blood Group:', mmToPt(4), yPos);
    doc.setTextColor('#D4213D');
    doc.text(data.bloodGroup || '', mmToPt(25), yPos);
    
    doc.setTextColor(0,0,0);
    doc.text('Place of Birth:', mmToPt(45), yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(data.birthPlace || '', mmToPt(70), yPos);

    yPos += mmToPt(2);
    doc.line(mmToPt(4), yPos, cardWidth - mmToPt(4), yPos);

    yPos += mmToPt(2);
    // QR Code
    if (data.nidNumber) {
        const qrData = `Name: ${data.name}\nNID: ${data.nidNumber}\nDOB: ${data.dob ? new Date(data.dob).toLocaleDateString('en-CA') : ''}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}`;
        try {
            const qrCodeData = await getImageDataUrl(qrUrl);
            doc.addImage(qrCodeData, 'PNG', mmToPt(4), yPos, mmToPt(20), mmToPt(20));
        } catch(e) {
             console.error("Could not load QR code image", e);
        }
    }
    
    // Authorized Signature
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorised Signature', mmToPt(42), yPos + mmToPt(16), {align: 'center'});
    doc.line(mmToPt(30), yPos+mmToPt(15), mmToPt(55), yPos+mmToPt(15));
    
    // Issue Date
    doc.text('Date of Issue:', mmToPt(60), yPos + mmToPt(18));
    doc.text(data.issueDate ? new Date(data.issueDate).toLocaleDateString('en-GB') : '', mmToPt(80), yPos + mmToPt(18));


    // Barcode placeholder
    const barcodeY = cardHeight - mmToPt(12);
    doc.setFillColor(0,0,0);
    let x = mmToPt(4);
    for(let i=0; i<60; i++) {
        let width = Math.random() * 2 + 0.5;
        doc.rect(x, barcodeY, mmToPt(width/2.8), mmToPt(10), 'F');
        x += mmToPt((width + Math.random() * 1.5)/2.8);
    }
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
    const presentAddress = doc.splitTextToSize(data.presentAddress || '', pageWidth - 90);
    doc.text(presentAddress, 45, currentY + 40);
    currentY += 60;
    
    doc.setFontSize(12);
    doc.setFont('SolaimanLipi', 'normal');
    doc.setFillColor(220, 240, 255);
    doc.rect(40, currentY -1, (pageWidth - 80), 20, 'F');
    doc.text("স্থায়ী ঠিকানা", 50, currentY + 14);
    doc.setFontSize(10);
    const permanentAddress = doc.splitTextToSize(data.permanentAddress || '', pageWidth - 90);
    doc.text(permanentAddress, 45, currentY + 40);
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
  doc.text(data.name || '', cardWidth/2, 50, {align: 'center'});

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
    orientation: 'landscape',
    unit: 'pt',
    format: [mmToPt(85.6), mmToPt(54)],
  });
  doc.deletePage(1); // remove default page

  switch(cardType) {
    case 'nid':
       doc.addPage();
       await addFrontPage(doc, data);
       await addBackPage(doc, data);
       doc.deletePage(1); // remove the extra blank page
       break;
    case 'server':
      await addServerCopy(doc, data);
      doc.deletePage(1);
      break;
    case 'signature':
      doc.addPage();
      addBanglaFont(doc);
      addSignatureCard(doc, data);
      doc.deletePage(1);
      break;
  }
  
  doc.save(`IdentityForge-${cardType}.pdf`);
};

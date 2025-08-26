import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { FormSchemaType } from '@/components/IdentityForm';
import { SolaimanLipi } from './SolaimanLipi';
import { format } from 'date-fns';

type CardType = "nid" | "server" | "signature";

const bdGovtLogo = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoA2' +
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
    try {
        doc.addFileToVFS('SolaimanLipi.ttf', SolaimanLipi);
        doc.addFont('SolaimanLipi.ttf', 'SolaimanLipi', 'normal');
        doc.setFont('SolaimanLipi');
    } catch (e) {
        console.error("Error adding Bangla font:", e);
    }
};

const mmToPt = (mm: number) => mm * 2.83465;

const getImageDataUrl = async (path: string): Promise<string> => {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


const addFrontPage = async (doc: jsPDF, data: FormSchemaType) => {
    const cardWidth = mmToPt(85.6);
    const cardHeight = mmToPt(54);

    // Header
    doc.addImage(bdGovtLogo, 'PNG', mmToPt(4), mmToPt(2), mmToPt(10), mmToPt(10));
    
    addBanglaFont(doc);
    doc.setFontSize(10);
    doc.setFont('SolaimanLipi', 'normal');
    doc.setTextColor(0, 100, 0); // Dark Green
    doc.text('গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', mmToPt(16), mmToPt(5.5));
    doc.setFontSize(7);
    doc.text("Government of the People's Republic of Bangladesh", mmToPt(16), mmToPt(8));

    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.5);
    doc.line(mmToPt(4), mmToPt(9.5), cardWidth - mmToPt(4), mmToPt(9.5));

    doc.setFontSize(8);
    doc.setTextColor(255, 0, 0); // Red
    doc.text('National ID Card /', mmToPt(30), mmToPt(12));
    addBanglaFont(doc);
    doc.setFontSize(9);
    doc.text('জাতীয় পরিচয় পত্র', mmToPt(52), mmToPt(12));
    
    doc.setDrawColor(0, 100, 0);
    doc.line(mmToPt(4), mmToPt(13.5), cardWidth - mmToPt(4), mmToPt(13.5));


    // Watermark
    try {
      const watermark = await getImageDataUrl('/bd_govt.png');
      doc.addImage(watermark, 'PNG', mmToPt(42), mmToPt(22), mmToPt(35), mmToPt(35), undefined, 'FAST', 0.1);
    } catch(e) { console.error("Could not add watermark", e); }


    // Photo and Signature
    if (data.photo) {
        try {
            doc.addImage(data.photo, 'JPEG', mmToPt(5), mmToPt(16), mmToPt(25), mmToPt(31));
        } catch (e) { console.error("Error adding photo to PDF", e); }
    }
    
    if (data.signature) {
        try {
            doc.addImage(data.signature, 'PNG', mmToPt(8), mmToPt(42), mmToPt(20), mmToPt(5), undefined, 'FAST');
        } catch (e) { console.error("Error adding signature to PDF", e); }
    }

    // Details
    const xPosLabel = mmToPt(33);
    const xPosValue = mmToPt(43);
    let yPosDetails = mmToPt(22);
    const yIncrement = mmToPt(5);

    doc.setFontSize(9);
    addBanglaFont(doc);
    doc.setTextColor(0,0,0);
    doc.text('নাম:', xPosLabel, yPosDetails);
    doc.text(data.nameBangla || '', xPosValue, yPosDetails);
    yPosDetails += yIncrement;

    doc.setFont('helvetica', 'normal');
    doc.text('Name:', xPosLabel, yPosDetails);
    doc.text(data.name || '', xPosValue, yPosDetails);
    yPosDetails += yIncrement;

    addBanglaFont(doc);
    doc.text('পিতা:', xPosLabel, yPosDetails);
    doc.text(data.fatherName || '', xPosValue, yPosDetails);
    yPosDetails += yIncrement;
    
    doc.text('মাতা:', xPosLabel, yPosDetails);
    doc.text(data.motherName || '', xPosValue, yPosDetails);
    yPosDetails += yIncrement;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Date of Birth:', xPosLabel, yPosDetails);
    doc.setTextColor(255, 0, 0);
    const dob = data.dob ? format(new Date(data.dob), 'dd MMM yyyy') : '';
    doc.text(dob, xPosValue + mmToPt(7), yPosDetails);
    yPosDetails += yIncrement;

    doc.setTextColor(0, 0, 0);
    doc.text('ID NO:', xPosLabel, yPosDetails);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 0, 0);
    doc.text(data.nidNumber || '', xPosValue + mmToPt(7), yPosDetails);
};

const addBackPage = async (doc: jsPDF, data: FormSchemaType) => {
    doc.addPage();
    const cardWidth = mmToPt(85.6);
    const cardHeight = mmToPt(54);

    addBanglaFont(doc);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);

    const topText = 'এই কার্ডটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সম্পত্তি। কার্ডটি ব্যবহারকারী ব্যতীত অন্য কোথাও পাওয়া গেলে নিকটস্থ পোস্ট অফিসে জমা দেবার জন্য অনুরোধ করা হলো।';
    const topTextLines = doc.splitTextToSize(topText, cardWidth - mmToPt(8));
    doc.text(topTextLines, cardWidth / 2, mmToPt(4), { align: 'center', lineHeightFactor: 1.2 });

    let yPos = mmToPt(11);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(mmToPt(4), yPos, cardWidth - mmToPt(4), yPos);

    yPos += mmToPt(1);
    doc.setFontSize(8);
    addBanglaFont(doc);
    const addressText = `ঠিকানা: ${data.address || ''}`;
    const addressLines = doc.splitTextToSize(addressText, cardWidth - mmToPt(10));
    doc.text(addressLines, mmToPt(5), yPos + mmToPt(2.5), {lineHeightFactor: 1.2});

    yPos += mmToPt(9);
    doc.line(mmToPt(4), yPos, cardWidth - mmToPt(4), yPos);

    yPos += mmToPt(3);
    doc.setFont('helvetica', 'normal');
    doc.text('রক্তের গ্রুপ/Blood Group:', mmToPt(4), yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 0, 0);
    doc.text(data.bloodGroup || '', mmToPt(38), yPos);

    doc.setTextColor(0,0,0);
    addBanglaFont(doc);
    doc.text('জন্মস্থান:', mmToPt(55), yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(data.birthPlace || '', mmToPt(68), yPos);
    
    yPos += mmToPt(2);
    doc.line(mmToPt(4), yPos, cardWidth - mmToPt(4), yPos);
    
    // Authority Signature and Issue Date
    let bottomY = cardHeight - mmToPt(18);
    addBanglaFont(doc);
    doc.setFontSize(8);
    doc.text('প্রদানকারী কর্তৃপক্ষের স্বাক্ষর', mmToPt(46), bottomY + mmToPt(1.5), { align: 'center' });
    doc.line(mmToPt(30), bottomY, mmToPt(62), bottomY);
    
    doc.text('প্রদানের তারিখ:', mmToPt(65), bottomY + mmToPt(5));
    doc.setFont('helvetica', 'normal');
    const issueDate = data.issueDate ? format(new Date(data.issueDate), 'dd/MM/yyyy') : '';
    doc.text(issueDate, mmToPt(85), bottomY + mmToPt(5), { align: 'right'});

    // Barcode
    const barcodeY = cardHeight - mmToPt(7);
    doc.setFillColor(0, 0, 0);
    let x = mmToPt(4);
    for (let i = 0; i < 120; i++) {
        if(x > cardWidth - mmToPt(4)) break;
        let width = (Math.random() * 1.5 + 0.5) / 2.83465;
        let height = (Math.random() * 4 + 6);
        doc.rect(x, barcodeY, mmToPt(width), mmToPt(height), 'F');
        x += mmToPt(width + (Math.random() * 0.5 + 0.2) / 2.83465);
    }
};

const addServerCopy = async (doc: jsPDF, data: FormSchemaType) => {
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    doc.addPage([pageWidth, pageHeight]);
    addBanglaFont(doc);
    
    const getImageDataUrl = async (path: string): Promise<string> => {
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
        addBanglaFont(doc);
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
                0: { cellWidth: colWidths[0], font: 'SolaimanLipi' },
                1: { cellWidth: colWidths[1], font: 'SolaimanLipi' },
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
    addBanglaFont(doc);
    doc.setFillColor(220, 240, 255);
    doc.rect(40, currentY -1, (pageWidth - 80), 20, 'F');
    doc.text("বর্তমান ঠিকানা", 50, currentY + 14);
    doc.setFontSize(10);
    const presentAddress = doc.splitTextToSize(data.presentAddress || '', pageWidth - 90);
    doc.text(presentAddress, 45, currentY + 40);
    currentY += 60;
    
    doc.setFontSize(12);
    addBanglaFont(doc);
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
  addBanglaFont(doc);
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

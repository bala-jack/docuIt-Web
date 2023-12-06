// import React, { useEffect, useRef } from 'react';
// import pdfjs from 'pdfjs-dist';
// import html2canvas from 'html2canvas';
// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// function PdfToImage({ pdfUrl }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const renderFirstPageAsImage = async () => {
//      GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
//       const pdfDoc = await pdfjs.getDocument(pdfUrl).promise;
//       const firstPage = await pdfDoc.getPage(1);

//       // Set the scale based on your requirements
//       const scale = 1.5;
//       const viewport = firstPage.getViewport({ scale });

//       const canvas = canvasRef.current;
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       const renderContext = {
//         canvasContext: canvas.getContext('2d'),
//         viewport: viewport,
//       };

//       await firstPage.render(renderContext).promise;

//       // Convert the canvas to a PNG image using html2canvas
//       html2canvas(canvas).then((canvasImage) => {
//         // You can now use canvasImage as a PNG image
//         console.log('PNG Image:', canvasImage);
//       });
//     };

//     renderFirstPageAsImage();
//   }, [pdfUrl]);

//   return <canvas ref={canvasRef} />;
// }

// export default PdfToImage;

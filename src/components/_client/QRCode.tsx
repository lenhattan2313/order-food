"use client";
import { getTableLink } from "@/app/manage/tables/utils/tablesUtils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

type Props = {
  tableNumber: number;
  token: string;
  width?: number;
};

export function QRCodeCanvas({ tableNumber, token, width = 300 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    //add content to canvas
    //create virtual dom for qr code and add to real canvas
    const canvasContext = canvasRef.current.getContext("2d");
    if (!canvasContext) return;
    // Set the canvas dimensions
    canvas.width = width;
    canvas.height = width + 50;

    // Clear the canvas
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    canvasContext.font = "24px Arial";
    canvasContext.fillStyle = "#000";
    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "middle";

    // Add text to the canvas
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.height - 30
    );
    const virtualCanvas = document.createElement("canvas");
    const content = getTableLink({ token, tableNumber });
    QRCode.toCanvas(virtualCanvas, content, { width }, function (error) {
      if (error) console.error(error);
      canvasContext.drawImage(virtualCanvas, 0, 0);
    });
  }, [token, tableNumber]);
  return <canvas ref={canvasRef} />;
}

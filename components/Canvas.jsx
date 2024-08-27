import { useRef, useEffect, useState } from "react";

export default function Canvas(props) {
  const canvasRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Clear canvas
    context.clearRect(0, 0, props.width, props.height);

    // Draw black background
    context.fillStyle = "black";
    context.fillRect(0, 0, props.width, props.height);

    // Draw gray grid lines
    const gridSize = 20;
    context.strokeStyle = "rgba(128, 128, 128, 0.5)";
    for (let x = 0; x < props.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, props.height);
      context.stroke();
    }
    for (let y = 0; y < props.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(props.width, y);
      context.stroke();
    }

    // Draw robot body (circle) and arrow
    const bodyRadius = 6;
    const neonGreen = "#39FF14";
    const arrowSize = 7;
    const arrowOffset = 0;
    const arrowAngle = (props.robo?.facing * Math.PI) / 180; // Convert to radians
    const bodyX = props.robo?.x + props.width / 2;
    const bodyY = props.robo?.y + props.height / 2;

    // Draw robot body (circle)
    context.fillStyle = "#000000"; // Black body
    context.strokeStyle = "darkgray";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(bodyX, bodyY, bodyRadius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.stroke();

    // Draw arrow on the robot
    // context.fillStyle = neonGreen; // Neon green arrow
    // context.beginPath();
    // context.moveTo(bodyX + bodyRadius + arrowOffset, bodyY);
    // context.lineTo(
    //   bodyX + bodyRadius + arrowOffset + arrowSize,
    //   bodyY - arrowSize / 2
    // );
    // context.lineTo(
    //   bodyX + bodyRadius + arrowOffset + arrowSize,
    //   bodyY + arrowSize / 2
    // );
    // context.closePath();
    // context.fill();

    // Draw yellow circles at pillar coordinates
    const pillarRadius = 7;
    context.fillStyle = "yellow";
    props.pillars?.forEach(({ x, y }) => {
      context.beginPath();
      context.arc(
        x + props.width / 2,
        y + props.height / 2,
        pillarRadius,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    // Draw thin red crosses at specified coordinates
    const crossSize = 5;
    const crossLineWidth = 1;
    context.strokeStyle = "red";
    context.lineWidth = crossLineWidth;
    coordinates.forEach(({ x, y }) => {
      context.beginPath();
      context.moveTo(x - crossSize, y);
      context.lineTo(x + crossSize, y);
      context.moveTo(x, y - crossSize);
      context.lineTo(x, y + crossSize);
      context.stroke();
    });
  }, [coordinates, props.pillars, props.robo, props.width, props.height]);

  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCoordinates((prevCoordinates) => [...prevCoordinates, { x, y }]);
  };

  return (
    <canvas
      ref={canvasRef}
      width={props.width}
      height={props.height}
      onClick={handleClick}
    />
  );
}

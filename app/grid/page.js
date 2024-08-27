"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { createTheme, ThemeProvider } from "@mui/material";
import Canvas from "../../components/Canvas";
import Pointer from "../../components/Pointer";

const theme = createTheme({
  palette: {
    primary: {
      main: "#C8102E",
    },
    secondary: {
      main: "#F1BE48",
    },
  },
});

export default function Home() {
  const [imgNum, setImgNum] = useState(0);
  const [state, setState] = useState(0);
  const [pillarCords, setPillarCords] = useState();
  const [botCords, setBotCords] = useState();

  const handleClick = () => {
    setState(state === 0 ? 1 : 0);
  };

  function handleInc() {
    setImgNum((n) => n + 1);
  }

  function handleDec() {
    setImgNum((n) => n - 1);
  }
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getPillars");
      const data = await response.json();
      console.log("data in fetch", data);
      setPillarCords(data);
      const response2 = await fetch("/api/getLatest");
      const data2 = await response2.json();
      console.log("OVA HEAR", data2.data.orientation);
      setBotCords({
        x: data2.data.xCoordinate,
        y: data2.data.yCoordinate,
        facing: data2.data.orientation,
      });
    };
    fetchData();
  }, [state]);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#C8102E",
      },
      secondary: {
        main: "#F1BE48",
      },
    },
  });

  let imgURL = `http://localhost:8000/images/img${imgNum}.jpg`;
  return (
    <>
      <ThemeProvider theme={theme}>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            color: "red",
            margin: "50px",
          }}
        >
          <Pointer degrees={botCords?.facing} />

          <Button variant='contained' onClick={handleClick}>
            Toggle State: {state}
          </Button>

          <Canvas
            width={2000}
            height={2000}
            pillars={pillarCords}
            robo={botCords}
          />
        </span>
      </ThemeProvider>
    </>
  );
}

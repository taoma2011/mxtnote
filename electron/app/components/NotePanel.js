/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
// import CardActions from '@material-ui/core/CardActions';
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
// import Typography from '@material-ui/core/Typography';
import MathJax from "react-mathjax2";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import LoadImage from "../containers/LoadImage";
import DeleteNoteDialog from "../containers/DeleteNoteDialog";
import DependencyChips from "../containers/DependencyChips";

export default function NotePanel(props) {
  // eslint-disable-next-line react/prop-types
  const {
    noteId,
    text,
    image,
    scale,
    width,
    height,
    noteContext,
    startDeleteNote,
    gotoNote,
    openNoteEditor,
    closeNoteEditor,
  } = props;
  const scaledWidth = (width || 0) * (scale / 100);
  const scaledHeight = (height || 0) * (scale / 100);
  const canvasRef = React.createRef();

  useEffect(() => {
    if (canvasRef.current && image && scaledWidth && scaledHeight) {
      //console.log('notepanel repaint for ', text);
      canvasRef.current.width = scaledWidth;
      canvasRef.current.height = scaledHeight;
      const ctx = canvasRef.current.getContext("2d");
      const imageBuffer = image;
      const array = new Uint8ClampedArray(imageBuffer);
      try {
        const imageData = new ImageData(array, scaledWidth, scaledHeight);

        ctx.putImageData(imageData, 0, 0);
      } catch (err) {
        console.log(err);
      }
    }
  }, [image]);

  const style = {
    padding: 10,
  };

  const lines = text ? text.split(/\r?\n/) : [];
  // const mathJaxNodes = lines.forEach(l => <MathJax.Text text={l} />);

  return (
    <Box m={1}>
      <Card>
        <CardActionArea onClick={gotoNote}>
          <CardMedia>
            <LoadImage context={noteId} />
            <canvas ref={canvasRef} />
          </CardMedia>
        </CardActionArea>
        <Divider />
        <CardContent>
          <div style={{ width: "100%" }}>
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>
                <label>{noteContext}</label>
              </Box>
              <DependencyChips context={noteId} />
              <Box>
                <IconButton
                  onClick={() => openNoteEditor(noteId)}
                  edge="end"
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => startDeleteNote(noteId)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </div>
          <Divider />
          <Box>
            <MathJax.Context
              input="ascii"
              onLoad={() => console.log("Loaded MathJax script!")}
              onError={(mj, error) => {
                console.warn(error);
                console.log(
                  "Encountered a MathJax error, re-attempting a typeset!"
                );
              }}
              script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=AM_HTMLorMML"
              options={{
                asciimath2jax: {
                  useMathMLspacing: true,
                  delimiters: [["$", "$"]],
                  preview: "none",
                },
              }}
            >
              <div>
                {lines.map((l, index) => {
                  const key = `m-${index}`;
                  return l ? (
                    <MathJax.Text key={key} text={l} />
                  ) : (
                    <br key={key} />
                  );
                })}
              </div>
            </MathJax.Context>
          </Box>
        </CardContent>
      </Card>
      <DeleteNoteDialog context={noteId} />
    </Box>
  );
}

import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface editorProps {
  description: string;
  // eslint-disable-next-line no-unused-vars
  handleDescChange: (value: string) => void;
}

const Editor = ({ description, handleDescChange }: editorProps) => {
  return (
    <ReactQuill
      theme="snow"
      value={description}
      onChange={(changeDesc) => {
        handleDescChange(changeDesc);
      }}
      style={{ height: "300px", marginBottom: "60px" }}
    />
  );
};

export default Editor;

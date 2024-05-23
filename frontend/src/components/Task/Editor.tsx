import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  description: string;
  handleDescChange: (value: string) => void;
  canEdit: boolean;
}

const Editor = ({ description, canEdit, handleDescChange }: EditorProps) => {
  return (
    <ReactQuill
      theme="snow"
      value={description}
      onChange={(changeDesc) => {
        handleDescChange(changeDesc);
      }}
      style={{ height: "100px", marginBottom: "70px" }}
      readOnly={!canEdit}
    />
  );
};

export default Editor;

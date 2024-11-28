import React from "react";

const Document = ({ params }: { params: { id: string } }) => {
  return <div>{params.id}</div>;
};

export default Document;

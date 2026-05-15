import React from "react";
import { Navigate } from "react-router-dom";

const CreateGrade: React.FC = () => {
  return <Navigate to="/grades/list" replace />;
};

export default CreateGrade;
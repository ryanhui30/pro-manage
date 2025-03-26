import React from "react";
import ReusablePriorityPage from "../reuseablePriorityPage";
import { Priority } from "@/state/api";

const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.Urgent} />;
};

export default Urgent;

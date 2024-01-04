import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PauseOutlined,
} from "@ant-design/icons";
import React from "react";

export const convertToIndianTime = (date: string) => {
  const inputDate = new Date(date);

  const currentDate = new Date();

  const currentWeekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  );

  const currentWeekEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + (6 - currentDate.getDay())
  );

  const isCurrentWeek =
    inputDate >= currentWeekStart && inputDate <= currentWeekEnd;

  if (isCurrentWeek) {
    if (currentDate.getDay() === inputDate.getDay()) {
      return "Today";
    } else if (currentDate.getDay() + 1 === inputDate.getDay()) {
      return "Tommorrow";
    } else if (currentDate.getDay() - 1 === inputDate.getDay()) {
      return "Yesterday";
    }

    const weekDay = inputDate.toLocaleDateString("en-In", {
      weekday: "long",
    });
    return weekDay;
  } else {
    const formattedDate =
      inputDate.getFullYear() == currentDate.getFullYear()
        ? inputDate.toLocaleDateString("en-IN", {
            // year: "numeric",
            month: "long",
            day: "numeric",
          })
        : inputDate.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    return formattedDate;
  }
};

export const taskPriorities = ["Low", "Medium", "High", "Urgent"];

export const getPriorityIcon = (priority: string): React.JSX.Element => {
  let icon;

  switch (priority) {
    case "Urgent":
      icon = <ArrowUpOutlined className="text-red-700 text-xl" />;
      break;
    case "High":
      icon = <ArrowUpOutlined className="text-red-400 text-xl" />;
      break;
    case "Medium":
      icon = <PauseOutlined className="text-yellow-500 text-xl rotate-90" />;
      break;
    default:
      icon = <ArrowDownOutlined className="text-blue-400 text-xl" />;
      break;
  }
  return icon;
};

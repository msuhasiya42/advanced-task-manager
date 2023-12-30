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

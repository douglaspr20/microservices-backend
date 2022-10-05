export const isBefore = (date1: Date, date2: Date) => {
  console.log(date1);
  console.log(date2);
  return date1 < date2;
};

export const isAfter = (date1: Date, date2: Date) => {
  return date1 > date2;
};

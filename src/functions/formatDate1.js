export default function formatDate1(day) {
  var d = new Date(day),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month].join("/");
}

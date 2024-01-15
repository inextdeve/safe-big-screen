export const generatei18nT = (key) => {
  console.log(key);
  switch (key) {
    case "Masjid":
      return parent.lang.mosques;
    case "schools":
      return parent.lang.schools;
    case "Public toilets":
      return parent.lang.toilets;
    case "RC buildings":
      return parent.lang.buildings;
    case "Reports":
      return parent.lang.reports;
    case "Vehicle":
      return parent.lang.vehicles;
    case "Sweepers":
      return parent.lang.sweepers;
    case "Washing":
      return parent.lang.washing;
    case "Bins":
      return parent.lang.bins;
    case "Cartoons":
      return parent.lang.cartoons;
    default:
      return key;
  }
};

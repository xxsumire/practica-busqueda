
/**
 * Convert a string to send to the server API
 * 
 * @param name string to convert
 * @returns converted string without accented words or special characters
 * and spaces replaced by '_'
 */
export const convertStationName = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\//g, '')
      .replace(/[\s\-]+/g, '_');
  }
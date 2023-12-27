export function getFileNameFromLocation(location: string): string {
  const splitLocation = location.split("/");
  return splitLocation[splitLocation.length - 1];
}

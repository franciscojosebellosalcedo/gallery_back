export function getTokenFromHeader(headers) {
  const parts = headers.authorization.split(" ");
  if (parts[0]!== "bearer"){
    return null;
  };
  return parts[1];

}

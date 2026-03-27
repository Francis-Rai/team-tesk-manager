// type TeamStore = {
//   lastTeamId: string | null;
//   setLastTeamId: (id: string) => void;
// };

const KEY = "lastTeamId";

export function getLastTeamId(): string | null {
  return localStorage.getItem(KEY);
}

export function setLastTeamId(id: string) {
  localStorage.setItem(KEY, id);
}

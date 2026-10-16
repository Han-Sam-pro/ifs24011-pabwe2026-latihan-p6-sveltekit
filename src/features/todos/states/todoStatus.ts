export function getStatusLabel(isFinished?: number | boolean | null) {
  return isFinished ? "Selesai" : "Belum selesai";
}

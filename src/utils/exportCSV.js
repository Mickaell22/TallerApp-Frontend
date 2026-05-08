export function descargarCSV(filas, nombreArchivo) {
  if (!filas.length) return
  const cabeceras = Object.keys(filas[0])
  const contenido = [
    cabeceras.join(','),
    ...filas.map(f =>
      cabeceras.map(h => `"${String(f[h] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  const blob = new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  a.click()
  URL.revokeObjectURL(url)
}

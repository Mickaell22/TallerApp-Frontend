export const ESTADO_LABELS = {
  recibido:       'Recibido',
  en_diagnostico: 'En diagnostico',
  en_reparacion:  'En reparacion',
  listo:          'Listo',
  entregado:      'Entregado',
}

export function estadoCSS(estado) {
  const map = { en_diagnostico: 'diagnostico', en_reparacion: 'reparacion' }
  return map[estado] || estado
}

export const ESTADOS_ORDEN = ['recibido', 'en_diagnostico', 'en_reparacion', 'listo', 'entregado']

export const ESTADO_TITULOS = {
  recibido:       'Equipo recibido',
  en_diagnostico: 'En diagnostico',
  en_reparacion:  'En reparacion',
  listo:          'Listo para retirar',
  entregado:      'Entregado',
}

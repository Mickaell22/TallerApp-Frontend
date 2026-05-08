import { useState, useRef } from 'react'
import Icon from './Icon'

export default function SelectBusqueda({
  items = [],
  value,
  onChange,
  getLabel,
  getValue,
  renderItem,
  placeholder = 'Buscar...',
  noResultados = 'Sin resultados',
}) {
  const [query, setQuery]     = useState('')
  const [abierto, setAbierto] = useState(false)
  const inputRef = useRef(null)

  const seleccionado = items.find(i => getValue(i) === value)
  const displayText  = abierto ? query : (seleccionado ? getLabel(seleccionado) : '')

  const filtrados = items.filter(i =>
    !query || getLabel(i).toLowerCase().includes(query.toLowerCase())
  )

  function handleFocus() {
    setAbierto(true)
    setQuery('')
  }

  function handleSelect(item) {
    onChange(getValue(item))
    setQuery('')
    setAbierto(false)
    inputRef.current?.blur()
  }

  function handleBlur() {
    setTimeout(() => setAbierto(false), 100)
  }

  function handleLimpiar(e) {
    e.stopPropagation()
    onChange('')
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Icon
          name="search"
          size={14}
          style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)', pointerEvents: 'none' }}
        />
        <input
          ref={inputRef}
          className="input"
          style={{ paddingLeft: 32, paddingRight: seleccionado && !abierto ? 32 : undefined }}
          placeholder={placeholder}
          value={displayText}
          onChange={e => { setQuery(e.target.value); setAbierto(true) }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        {seleccionado && !abierto && (
          <button
            type="button"
            onClick={handleLimpiar}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-muted)', fontSize: 18, lineHeight: 1, padding: '0 2px' }}
          >
            ×
          </button>
        )}
      </div>

      {abierto && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
          background: 'var(--c-surface)', border: '1px solid var(--c-border)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,.22)',
          maxHeight: 260, overflowY: 'auto', marginTop: 4,
        }}>
          {filtrados.length === 0 ? (
            <div style={{ padding: '12px 14px', color: 'var(--c-text-muted)', fontSize: 13 }}>
              {noResultados}
            </div>
          ) : (
            filtrados.map(item => (
              <button
                key={getValue(item)}
                type="button"
                onMouseDown={e => { e.preventDefault(); handleSelect(item) }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 14px', background: 'none', border: 'none',
                  borderBottom: '1px solid var(--c-border)',
                  cursor: 'pointer', fontSize: 13, color: 'var(--c-text)',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--c-surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {renderItem ? renderItem(item) : getLabel(item)}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

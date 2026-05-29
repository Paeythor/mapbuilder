import React, { useEffect, useMemo, useState } from 'react'
import {
  Tldraw,
  createTLStore,
  defaultShapeUtils,
  DefaultToolbar,
  DefaultKeyboardShortcutsDialog,
  DefaultHelpMenu,
  DefaultActionsMenu,
  DefaultStylePanel,
  DefaultContextMenu,
  DefaultPageMenu,
  DefaultMainMenu,
  DefaultSidebar
} from 'tldraw'

const STORAGE_KEY = 'mapbuilder-local-snapshot'

const terrainBrushes = [
  { id: 'mountain', label: 'Mountain', color: '#8b8b8b', geo: 'ellipse' },
  { id: 'forest', label: 'Forest', color: '#2f7d32', geo: 'ellipse' },
  { id: 'water', label: 'Water', color: '#2b6cb0', geo: 'ellipse' },
  { id: 'desert', label: 'Desert', color: '#d9b46f', geo: 'ellipse' },
  { id: 'hill', label: 'Hill', color: '#a67c52', geo: 'ellipse' },
  { id: 'city', label: 'City', color: '#444444', geo: 'rectangle' },
  { id: 'river', label: 'River', color: '#2b6cb0', geo: 'rectangle' },
  { id: 'label', label: 'Label', color: '#111827', geo: 'text' }
]

function getSavedSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function downloadFile(content, name, type = 'application/json') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function TerrainToolbar({ editor }) {
  const addShape = (brush) => {
    const point = editor.getViewportPageBounds().center
    let shape = {
      type: 'geo',
      x: point.x,
      y: point.y,
      props: {
        geo: brush.geo === 'text' ? 'rectangle' : brush.geo,
        w: brush.geo === 'text' ? 260 : 140,
        h: brush.geo === 'text' ? 60 : 100,
        fill: 'solid',
        color: brush.color,
        dash: 'draw'
      }
    }

    if (brush.id === 'label') {
      shape = {
        type: 'text',
        x: point.x,
        y: point.y,
        props: {
          text: 'New label',
          size: 28,
          align: 'middle',
          color: brush.color,
          font: 'inter'
        }
      }
    }

    editor.createShapes([shape])
  }

  return (
    <div className="tool-grid">
      {terrainBrushes.map((brush) => (
        <button key={brush.id} type="button" className="tool-button" onClick={() => addShape(brush)}>
          {brush.label}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [editor, setEditor] = useState(null)
  const [gridActive, setGridActive] = useState(true)
  const store = useMemo(() => createTLStore({ shapeUtils: defaultShapeUtils }), [])
  const components = useMemo(
    () => ({
      Toolbar: () => <DefaultToolbar />,
      KeyboardShortcutsDialog: () => <DefaultKeyboardShortcutsDialog />,
      HelpMenu: () => <DefaultHelpMenu />,
      ActionsMenu: () => <DefaultActionsMenu />,
      StylePanel: () => <DefaultStylePanel />,
      ContextMenu: () => <DefaultContextMenu />,
      PageMenu: () => <DefaultPageMenu />,
      MainMenu: () => <DefaultMainMenu />,
      Sidebar: () => <DefaultSidebar />
    }),
    []
  )

  useEffect(() => {
    const saved = getSavedSnapshot()
    if (saved) store.loadSnapshot(saved)
  }, [store])

  const saveMap = () => {
    if (!editor) return
    const snapshot = editor.store.getSnapshot()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    window.alert('Map saved locally.')
  }

  const loadMap = () => {
    const saved = getSavedSnapshot()
    if (saved) {
      store.loadSnapshot(saved)
      window.alert('Saved map loaded.')
    } else {
      window.alert('No saved map found.')
    }
  }

  const clearMap = () => {
    if (!editor) return
    editor.selectAll()
    editor.deleteSelectedShapes()
  }

  const exportMap = () => {
    if (!editor) return
    const snapshot = editor.store.getSnapshot()
    downloadFile(JSON.stringify(snapshot, null, 2), 'mapbuilder-map.json')
  }

  const openJson = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      store.loadSnapshot(parsed)
    } catch (error) {
      window.alert('Invalid map JSON file.')
    } finally {
      event.target.value = ''
    }
  }

  const centerMap = () => {
    if (!editor) return
    editor.centerContent()
  }

  const zoomToFit = () => {
    if (!editor?.zoomToFit) return
    editor.zoomToFit()
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>MapBuilder</h1>
          <p className="subtitle">Create fantasy worlds with an infinite canvas and intuitive terrain tools.</p>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <section className="panel">
            <h2>Terrain stamps</h2>
            <p>Quickly drop mountains, forests, rivers, labels, and cities anywhere on the map.</p>
            {editor && <TerrainToolbar editor={editor} />}
          </section>

          <section className="panel">
            <h2>Map controls</h2>
            <button type="button" onClick={saveMap}>Save map</button>
            <button type="button" onClick={loadMap}>Load saved map</button>
            <button type="button" onClick={exportMap}>Export JSON</button>
            <label className="file-button">
              Import JSON
              <input type="file" accept="application/json" onChange={openJson} />
            </label>
            <button type="button" onClick={centerMap}>Center canvas</button>
            <button type="button" onClick={zoomToFit}>Zoom to fit</button>
            <button type="button" onClick={clearMap}>Clear canvas</button>
            <button type="button" className={gridActive ? 'active' : ''} onClick={() => setGridActive((value) => !value)}>
              {gridActive ? 'Hide grid' : 'Show grid'}
            </button>
          </section>

          <section className="panel">
            <h2>Design notes</h2>
            <ul>
              <li>Use the built-in toolbar to draw rivers, roads, and freehand details.</li>
              <li>Zoom with wheel gestures and pan anywhere on the infinite canvas.</li>
              <li>Save locally and export JSON to preserve your work.</li>
              <li>Drop labels, terrain regions, and landmarks with a single click.</li>
            </ul>
          </section>
        </aside>

        <main className="canvas-panel">
          <Tldraw
            store={store}
            onMount={(editorInstance) => setEditor(editorInstance)}
            components={components}
            grid={gridActive ? 'dot' : 'none'}
          />
        </main>
      </div>
    </div>
  )
}

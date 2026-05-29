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
  DefaultMainMenu
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

function createMountainShapes(point) {
  return [
    {
      type: 'geo',
      x: point.x,
      y: point.y + 16,
      props: {
        geo: 'ellipse',
        w: 190,
        h: 90,
        fill: 'solid',
        color: '#4f4f4f',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x - 8,
      y: point.y - 18,
      props: {
        geo: 'ellipse',
        w: 140,
        h: 80,
        fill: 'solid',
        color: '#7d7d7d',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 24,
      y: point.y - 28,
      props: {
        geo: 'ellipse',
        w: 96,
        h: 70,
        fill: 'solid',
        color: '#9d9d9d',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 2,
      y: point.y - 48,
      props: {
        geo: 'ellipse',
        w: 58,
        h: 32,
        fill: 'solid',
        color: '#e6e6e6',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x - 24,
      y: point.y - 4,
      rotation: -16,
      props: {
        geo: 'rectangle',
        w: 14,
        h: 80,
        fill: 'solid',
        color: '#666666',
        dash: 'draw'
      }
    }
  ]
}

function createForestShapes(point) {
  return [
    {
      type: 'geo',
      x: point.x,
      y: point.y,
      props: {
        geo: 'ellipse',
        w: 180,
        h: 90,
        fill: 'solid',
        color: '#2d6f36',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x - 22,
      y: point.y - 10,
      props: {
        geo: 'ellipse',
        w: 76,
        h: 56,
        fill: 'solid',
        color: '#1e4f24',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 24,
      y: point.y - 12,
      props: {
        geo: 'ellipse',
        w: 70,
        h: 52,
        fill: 'solid',
        color: '#3b8d43',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x,
      y: point.y + 22,
      props: {
        geo: 'ellipse',
        w: 56,
        h: 34,
        fill: 'solid',
        color: '#265f28',
        dash: 'draw'
      }
    }
  ]
}

function createWaterShapes(point) {
  return [
    {
      type: 'geo',
      x: point.x,
      y: point.y,
      props: {
        geo: 'ellipse',
        w: 190,
        h: 100,
        fill: 'solid',
        color: '#1e5294',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x - 8,
      y: point.y - 10,
      props: {
        geo: 'ellipse',
        w: 156,
        h: 76,
        fill: 'solid',
        color: '#3190df',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 32,
      y: point.y + 16,
      props: {
        geo: 'ellipse',
        w: 28,
        h: 18,
        fill: 'solid',
        color: '#9ec9f5',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x - 34,
      y: point.y + 24,
      props: {
        geo: 'ellipse',
        w: 20,
        h: 14,
        fill: 'solid',
        color: '#a8d9ff',
        dash: 'draw'
      }
    }
  ]
}

function createDesertShapes(point) {
  return [
    {
      type: 'geo',
      x: point.x,
      y: point.y,
      props: {
        geo: 'ellipse',
        w: 210,
        h: 110,
        fill: 'solid',
        color: '#d9b46f',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 4,
      y: point.y - 12,
      props: {
        geo: 'ellipse',
        w: 156,
        h: 70,
        fill: 'solid',
        color: '#c79b51',
        dash: 'draw'
      }
    },
    ...[[-48, 12], [-18, 22], [24, 30], [48, -8], [12, -18]].map(([dx, dy]) => ({
      type: 'geo',
      x: point.x + dx,
      y: point.y + dy,
      props: {
        geo: 'ellipse',
        w: 14,
        h: 14,
        fill: 'solid',
        color: '#b98a47',
        dash: 'draw'
      }
    }))
  ]
}

function createHillShapes(point) {
  return [
    {
      type: 'geo',
      x: point.x,
      y: point.y + 10,
      props: {
        geo: 'ellipse',
        w: 170,
        h: 84,
        fill: 'solid',
        color: '#987444',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 8,
      y: point.y - 8,
      props: {
        geo: 'ellipse',
        w: 120,
        h: 54,
        fill: 'solid',
        color: '#b89863',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x - 42,
      y: point.y + 30,
      props: {
        geo: 'ellipse',
        w: 20,
        h: 20,
        fill: 'solid',
        color: '#7d6037',
        dash: 'draw'
      }
    }
  ]
}

function createCityShapes(point) {
  return [
    {
      type: 'geo',
      x: point.x,
      y: point.y,
      props: {
        geo: 'rectangle',
        w: 140,
        h: 90,
        fill: 'solid',
        color: '#4b4b4b',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x - 40,
      y: point.y - 30,
      props: {
        geo: 'rectangle',
        w: 28,
        h: 36,
        fill: 'solid',
        color: '#6d6d6d',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 10,
      y: point.y - 38,
      props: {
        geo: 'rectangle',
        w: 30,
        h: 42,
        fill: 'solid',
        color: '#575757',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 42,
      y: point.y - 18,
      props: {
        geo: 'rectangle',
        w: 28,
        h: 32,
        fill: 'solid',
        color: '#4a4a4a',
        dash: 'draw'
      }
    }
  ]
}

function createRiverShapes(point) {
  return [
    {
      type: 'geo',
      x: point.x,
      y: point.y,
      rotation: -12,
      props: {
        geo: 'rectangle',
        w: 240,
        h: 50,
        fill: 'solid',
        color: '#1f5b9f',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 8,
      y: point.y - 4,
      rotation: -10,
      props: {
        geo: 'rectangle',
        w: 190,
        h: 24,
        fill: 'solid',
        color: '#3a80cc',
        dash: 'draw'
      }
    },
    {
      type: 'geo',
      x: point.x + 40,
      y: point.y + 12,
      props: {
        geo: 'ellipse',
        w: 28,
        h: 20,
        fill: 'solid',
        color: '#8bbbed',
        dash: 'draw'
      }
    }
  ]
}

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
    let shapes = []

    switch (brush.id) {
      case 'mountain':
        shapes = createMountainShapes(point)
        break
      case 'forest':
        shapes = createForestShapes(point)
        break
      case 'water':
        shapes = createWaterShapes(point)
        break
      case 'desert':
        shapes = createDesertShapes(point)
        break
      case 'hill':
        shapes = createHillShapes(point)
        break
      case 'city':
        shapes = createCityShapes(point)
        break
      case 'river':
        shapes = createRiverShapes(point)
        break
      case 'label':
        shapes = [
          {
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
        ]
        break
      default:
        shapes = [
          {
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
        ]
    }

    editor.createShapes(shapes)
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
      MainMenu: () => <DefaultMainMenu />
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
              <li>Use the terrain stamps to place layered mountains, dunes, forests, lakes, and cities.</li>
              <li>Draw rivers and roads with the built-in freehand tools for natural curves.</li>
              <li>Zoom with wheel gestures and pan anywhere on the infinite canvas.</li>
              <li>Save locally and export JSON to preserve your work.</li>
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

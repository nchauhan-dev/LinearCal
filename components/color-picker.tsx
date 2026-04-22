"use client"

import { COLOR_OPTIONS } from "@/lib/colors"

interface ColorPickerProps {
  onColorSelect: (color: string) => void
  currentColor?: string
}

export function ColorPicker({ onColorSelect, currentColor }: ColorPickerProps) {
  // Helper function to get color values for inline styles
  const getColorStyle = (colorValue: string) => {
    switch (colorValue) {
      case "red":
        return { background: "rgb(254 202 202)", borderColor: "rgb(252 165 165)" }
      case "orange":
        return { background: "rgb(254 215 170)", borderColor: "rgb(253 186 116)" }
      case "yellow":
        return { background: "rgb(254 240 138)", borderColor: "rgb(253 224 71)" }
      case "green":
        return { background: "rgb(187 247 208)", borderColor: "rgb(134 239 172)" }
      case "blue":
        return { background: "rgb(191 219 254)", borderColor: "rgb(147 197 253)" }
      case "purple":
        return { background: "rgb(233 213 255)", borderColor: "rgb(216 180 254)" }
      case "pink":
        return { background: "rgb(251 207 232)", borderColor: "rgb(249 168 212)" }
      default:
        return { background: "white", borderColor: "rgb(209 213 219)" }
    }
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1">
      {COLOR_OPTIONS.map((color) => {
        const isSelected = currentColor === color.value
        const isNone = color.value === "none"
        const colorStyle = getColorStyle(color.value)

        return (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
            className={`
              w-5 h-5 rounded-full transition-all duration-150 border-2
              ${isSelected ? "ring-2 ring-gray-400 ring-offset-1" : ""}
              hover:scale-110
            `}
            style={colorStyle}
            title={color.name}
          >
            {isNone && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-0.5 bg-gray-400 rotate-45"></div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

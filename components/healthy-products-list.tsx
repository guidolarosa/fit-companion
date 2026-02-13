"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X, Download } from "lucide-react"

const defaultProducts = [
  "Chicken Breast",
  "Salmon",
  "Greek Yogurt",
  "Eggs",
  "Spinach",
  "Broccoli",
  "Sweet Potatoes",
  "Quinoa",
  "Brown Rice",
  "Avocado",
  "Almonds",
  "Blueberries",
  "Oatmeal",
  "Green Tea",
  "Cottage Cheese",
]

export function HealthyProductsList() {
  const t = useTranslations("healthyProducts")
  const tc = useTranslations("common")
  const [products, setProducts] = useState(
    defaultProducts.map((name) => ({ name, checked: false }))
  )
  const [newProduct, setNewProduct] = useState("")

  function toggleProduct(index: number) {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, checked: !p.checked } : p))
    )
  }

  function addProduct() {
    if (newProduct.trim()) {
      setProducts((prev) => [...prev, { name: newProduct.trim(), checked: false }])
      setNewProduct("")
    }
  }

  function removeProduct(index: number) {
    setProducts((prev) => prev.filter((_, i) => i !== index))
  }

  function exportList() {
    const checkedProducts = products.filter((p) => p.checked)
    const uncheckedProducts = products.filter((p) => !p.checked)

    const list = [
      t("exportChecked"),
      ...checkedProducts.map((p) => `✓ ${p.name}`),
      "",
      t("exportToBuy"),
      ...uncheckedProducts.map((p) => `- ${p.name}`),
    ].join("\n")

    const blob = new Blob([list], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "shopping-list.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addProduct())}
          placeholder={t("addPlaceholder")}
          className="flex-1"
        />
        <Button onClick={addProduct} disabled={!newProduct.trim()}>
          {tc("add")}
        </Button>
      </div>

      <div className="w-full overflow-hidden">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg border p-3 border-b-0 last:border-b text-sm w-full overflow-hidden"
          >
            <button
              onClick={() => toggleProduct(index)}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                product.checked
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              }`}
            >
              {product.checked && <Check className="h-3 w-3 text-primary-foreground" />}
            </button>
            <span
              className={`flex-1 min-w-0 truncate ${product.checked ? "line-through text-muted-foreground" : ""}`}
            >
              {product.name}
            </span>
            <button
              onClick={() => removeProduct(index)}
              className="text-destructive hover:text-destructive/80 shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button onClick={exportList} className="w-full" variant="outline">
        <Download className="mr-2 h-4 w-4" />
        {t("exportButton")}
      </Button>
    </div>
  )
}

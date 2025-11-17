"use client"

import { HttpTypes } from "@medusajs/types"
import { Table, Text } from "@medusajs/ui"
import Markdown from "react-markdown"
import Accordion from "./accordion"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Description",
      component: <ProductSpecsTab product={product} />,
    },
    {
      label: "Specifications",
      component: <ProductSpecificationsTab product={product} />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion 
        type="multiple" 
        className="flex flex-col gap-y-2"
        defaultValue={["Description", "Specifications"]}
      >
        {tabs.map((tab, i) => (
          <Accordion.Item
            className="bg-neutral-100 small:px-24 px-6"
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductSpecsTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8 xl:w-2/3">
      <Markdown
        components={{
          p: ({ children }) => (
            <Text className="text-neutral-950 mb-2">{children}</Text>
          ),
          h2: ({ children }) => (
            <Text className="text-xl text-neutral-950 my-4 font-semibold">
              {children}
            </Text>
          ),
          h3: ({ children }) => (
            <Text className="text-lg text-neutral-950 mb-2">{children}</Text>
          ),
        }}
      >
        {product.description ? product.description : "-"}
      </Markdown>
    </div>
  )
}

const ProductSpecificationsTab = ({ product }: ProductTabsProps) => {
  // 提取星号中的数字用于排序，并去掉星号及其内容用于显示
  const parseMetadataKey = (key: string) => {
    const match = key.match(/\*(\d+)\*/)
    const order = match ? parseInt(match[1], 10) : Infinity
    const displayKey = key.replace(/\*\d+\*/g, "")
    return { order, displayKey, originalKey: key }
  }

  // 处理并排序 metadata
  const sortedMetadata = product.metadata
    ? Object.entries(product.metadata)
        .map(([key, value]) => ({
          ...parseMetadataKey(key),
          value,
        }))
        .sort((a, b) => a.order - b.order)
    : []

  return (
    <div className="text-small-regular py-8">
      <Table className="rounded-lg shadow-borders-base overflow-hidden border-none">
        <Table.Body>
          {product.weight && (
            <Table.Row>
              <Table.Cell className="border-r">
                <span className="font-semibold">Weight</span>
              </Table.Cell>
              <Table.Cell className="px-4">{product.weight} grams</Table.Cell>
            </Table.Row>
          )}
          {(product.height || product.width || product.length) && (
            <Table.Row>
              <Table.Cell className="border-r">
                <span className="font-semibold">Dimensions (HxWxL)</span>
              </Table.Cell>
              <Table.Cell className="px-4">
                {product.height}mm x {product.width}mm x {product.length}mm
              </Table.Cell>
            </Table.Row>
          )}

          {sortedMetadata.map(({ displayKey, value, originalKey }) => (
            <Table.Row key={originalKey}>
              <Table.Cell className="border-r">
                <span className="font-semibold">{displayKey}</span>
              </Table.Cell>
              <Table.Cell className="px-4">
                <p>{value as string}</p>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ProductTabs

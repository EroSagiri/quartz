import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "./types"
import { Root } from "mdast"

const CDN = "https://bedrock.sighjune.com/"
const RESOURCE_PREFIXES = ["attachments/", "bedrock/"]

function rewriteResourceUrl(value: unknown): unknown {
  if (typeof value !== "string") return value
  if (!RESOURCE_PREFIXES.some((prefix) => value.startsWith(prefix))) return value
  return CDN + value
}

export const BedrockRewrite: QuartzTransformerPlugin = () => {
  return {
    name: "BedrockRewrite",

    markdownPlugins() {
      return [
        () => {
          return (tree: Root, _file) => {
            visit(tree, ["image", "link"], (node: any) => {
              node.url = rewriteResourceUrl(node.url)
            })
          }
        },
      ]
    },

    htmlPlugins() {
      return [
        () => {
          return (tree: Root, _file) => {
            visit(tree, "element", (node: any) => {
              const props = node.properties
              if (!props) return

              props.src = rewriteResourceUrl(props.src)

              props.href = rewriteResourceUrl(props.href)
            })
          }
        },
      ]
    },
  }
}

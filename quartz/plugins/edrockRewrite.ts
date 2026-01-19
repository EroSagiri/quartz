import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "./types"
import { Root } from "mdast"

const CDN = "https://bedrock.sighjune.com/"

export const BedrockRewrite: QuartzTransformerPlugin = () => {
    return {
        name: "BedrockRewrite",

        markdownPlugins() {
            return [
                () => {
                    return (tree: Root, _file) => {
                        visit(tree, ["image", "link"], (node: any) => {
                            if (typeof node.url === "string" && node.url.startsWith("bedrock/")) {
                                node.url = CDN + node.url
                            }
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

                            if (
                                typeof props.src === "string" &&
                                props.src.startsWith("bedrock/")
                            ) {
                                props.src = CDN + props.src
                            }

                            if (
                                typeof props.href === "string" &&
                                props.href.startsWith("bedrock/")
                            ) {
                                props.href = CDN + props.href
                            }
                        })
                    }
                },
            ]
        }
    }
}
import { execInShell } from './ShUtils'

export function msBuild() {
    execInShell("msbuild")
}
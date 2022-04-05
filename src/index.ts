import { getInput } from "@actions/core"
import { context, getOctokit } from "@actions/github"
import { getDiffieHellman } from "crypto"
import dedent from "dedent"
import { getAllOpenPullRequestWithOctokit } from "./JSLGhe"

type GithubContext = typeof context

const inputName: string = getInput("name")
const ghToken: string = getInput("ghToken")

greet(inputName, getRepoUrl(context))

getDiff().then(files => {
    console.log(dedent(`
    Your PR added
    ${JSON.stringify(files, undefined, 2)}
    `))
})

function greet(name: string, repoUrl: string) {
    console.log(`'Hello ${name}! ${repoUrl}'`)


    getAllOpenPullRequestWithOctokit(ghToken)




}

function getRepoUrl({ repo, serverUrl }: GithubContext): string {
    return `${serverUrl}/${repo.owner}/${repo.repo}`
}

async function getDiff() {
    return []
}

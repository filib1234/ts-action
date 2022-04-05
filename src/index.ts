import { getInput } from "@actions/core"
import { context, getOctokit } from "@actions/github"
import { getDiffieHellman } from "crypto"
import dedent from "dedent"
import { getAllOpenPullRequestWithOctokit, writeCommentToPr } from "./JSLGhe"

type GithubContext = typeof context

const inputName: string = getInput("name")
const ghToken: string = getInput("ghToken")

greet(inputName, getRepoUrl(context))


function greet(name: string, repoUrl: string) {
    console.log(`'Hello ${name}! ${repoUrl}'`)


    getAllOpenPullRequestWithOctokit(ghToken)

    writeCommentToPr(ghToken, 1, "test message from octokit")


}

function getRepoUrl({ repo, serverUrl }: GithubContext): string {
    return `${serverUrl}/${repo.owner}/${repo.repo}`
}


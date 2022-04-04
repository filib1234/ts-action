import { getInput } from "@actions/core"
import { context } from "@actions/github"

type GithubContext = typeof context

const inputName: string = getInput("name")

greet(inputName, getRepoUrl(context))

function greet(name: string, repoUrl: string) {
    console.log(`'Hello ${name}! ${repoUrl}'`)
}

function getRepoUrl({ repo, serverUrl }: GithubContext): string {
    return `${serverUrl}/${repo.owner}/${repo.repo}`
}

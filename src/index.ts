import { getInput } from "@actions/core"
import { cleanUpBranchesMatchingPattern, cleanUpSynchPullRequests, createFile, createPullRequest, deleteBranch, getAllBranchesNames, getAllOpenPullRequests, initFlow, setLabels, updateCommitStatusError, validateCommitMessages, writeCommentToPr } from "./Ghe"

const inputName: string = getInput("name")
const ghToken: string = getInput("ghToken")

greet(inputName)

async function greet(name: string) {
    console.log(`'Hello ${name}!'`)

    // getAllOpenPullRequests(ghToken)

    // writeCommentToPr(ghToken, 1, "test message from octokit")

    // setLabels(ghToken, 1, ["test", "octokit", "actions"])

    // validateCommitMessages(ghToken, "asd", 1)

    // createPullRequest(ghToken, "generated by action", "feature/test", "master", "body test")

    // updateCommitStatusError(ghToken, "d93a68fb112e1eeb193aa5be4c81c754b39b6e36", "test-errors")

    // cleanUpSynchPullRequests(ghToken)

    // initFlow(ghToken)

    // console.log(await getAllBranchesNames(ghToken))

    // deleteBranch(ghToken, "develop")
    // deleteBranch(ghToken, "main")
    cleanUpBranchesMatchingPattern(ghToken, "asd")
}



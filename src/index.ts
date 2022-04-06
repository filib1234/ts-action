import { getInput } from "@actions/core"
import { getAllOpenPullRequestWithOctokit, setLabels, validateCommitMessages, writeCommentToPr } from "./JSLGhe"

const inputName: string = getInput("name")
const ghToken: string = getInput("ghToken")

greet(inputName)


function greet(name: string) {
    console.log(`'Hello ${name}!'`)


    getAllOpenPullRequestWithOctokit(ghToken)

    writeCommentToPr(ghToken, 1, "test message from octokit")

    setLabels(ghToken, 1, ["test", "octokit", "actions"])

    validateCommitMessages(ghToken, "asd", 1)

}



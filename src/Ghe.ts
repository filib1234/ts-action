import { context, getOctokit } from '@actions/github'

// ghe file
export async function getAllOpenPullRequests(ghToken: string): Promise<any> {
    console.log('get all open pull requests')
    return await getOctokit(ghToken).rest.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'open'
    })
}

export function writeCommentToPr(ghToken: string, prNumber: number, message: string) {
    console.log(`write comment to pr number: ${prNumber}`)
    getOctokit(ghToken).rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        body: message,
    })
}

export function setLabels(ghToken: string, prNumber: number, labels: string[]) {
    console.log(`set labels: ${labels} to pr number: ${prNumber}`)
    getOctokit(ghToken).rest.issues.setLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        labels: labels
    })
}

export async function validateCommitMessages(ghToken: string, pattern: string, prNumber: number) {
    console.log(`validate commit message with pattern: ${pattern}`)
    let messages: string[] = await getOctokit(ghToken).rest.pulls.listCommits({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: prNumber,
    }).then(r => r.data.map(e => e.commit.message))

    let validCommitMessage = true
    let reg = new RegExp(pattern)
    messages.forEach((message: string) => {
        if (!reg.test(message)) {
            validCommitMessage = false
            console.log(`Message: ${message} does no match pattern: ${pattern}`)
        }
    });
    if (validCommitMessage) {
        console.log('all commits are valid')
    }
    console.log(messages)
}

export function createPullRequest(ghToken: string, title: string, head: string,
    base: string, body: string, maintainer?: boolean, draft?: boolean) {
    console.log(`create pull request with title: ${title} from branch: ${head} to: ${base}`)
    getOctokit(ghToken).rest.pulls.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        head: head,
        base: base,
        title: title,
        maintainer_can_modify: maintainer,
        draft: draft
    })
}

export function updateCommitStatusError(ghToken: string, commitSha: string, description: string) {
    updateCommitStatus(ghToken, commitSha, description, 'error')
}

export function updateCommitStatusPending(ghToken: string, commitSha: string, description: string) {
    updateCommitStatus(ghToken, commitSha, description, 'pending')
}

export function updateCommitStatusFailure(ghToken: string, commitSha: string, description: string) {
    updateCommitStatus(ghToken, commitSha, description, 'failure')
}

export function updateCommitStatusSuccess(ghToken: string, commitSha: string, description: string) {
    updateCommitStatus(ghToken, commitSha, description, 'success')
}

function updateCommitStatus(ghToken: string, commitSha: string, description: string, state: "error" | "failure" | "pending" | "success") {
    console.log(`update status to: ${state} for commit with sha: ${commitSha}`)
    getOctokit(ghToken).rest.repos.createCommitStatus({
        owner: context.repo.owner,
        repo: context.repo.repo,
        sha: commitSha,
        state: state,
        description: description
    });
}

export function cleanUpSynchPullRequests(ghToken: string) {
    getOctokit(ghToken).rest.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'open'
    }).then(r => r.data.forEach(openPullRequest => {
        let title = openPullRequest.title
        let prNumber = openPullRequest.number
        if (title.includes("update from SAVI in")) {
            let updatedAt = new Date(openPullRequest.updated_at)
            let dateNow = new Date()

            let diff = dateNow.getTime() - updatedAt.getTime()
            let diffInDays = Math.ceil(diff / (1000 * 3600 * 24))

            if (diffInDays > 10) {
                console.log(`PR with title ${title} will be closed`)

                getOctokit(ghToken).rest.pulls.update({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    pull_number: prNumber,
                    state: 'closed'
                });
            }
        }
    }))
}

// git file
export async function initFlow(ghToken: string) {
    let content = "\nHello Repo, you are now a git flow project"
    let path = "README.md"
    let message = "init gitflow"
    let branches = await getAllBranchesNames(ghToken)
    createFile(ghToken, branches, "develop", content, path, message)
    createFile(ghToken, branches, "main", content, path, message)
}

export async function createFile(ghToken: string, branches: string[], branch: string, content: string, path: string, message: string) {
    if (!branches.includes(branch)) {
        await createBranch(ghToken, branch)
    }

    await getOctokit(ghToken).rest.repos.createOrUpdateFileContents({
        owner: context.repo.owner,
        repo: context.repo.repo,
        branch: branch,
        path: path,
        message: message,
        content: Buffer.from(content, 'binary').toString('base64'),
        committer: {
            name: "Octokit bot",
            email: "example@example.com"
        },
        author: {
            name: "Octokit bot",
            email: "example@example.com"
        }

    })
}

export async function createBranch(ghToken: string, branch: string) {
    console.log(`create branch: ${branch}`)
    await getOctokit(ghToken).rest.git.createRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        sha: context.sha,
        ref: `refs/heads/${branch}`
    })
}

export async function getAllBranchesNames(ghToken: string): Promise<string[]> {
    return await getOctokit(ghToken).rest.repos.listBranches({
        owner: context.repo.owner,
        repo: context.repo.repo,
    }).then(resp => resp.data.map(el => el.name));
}

export async function deleteBranch(ghToken: string, branchName: string) {
    console.log(`delete branch with name: ${branchName}`)
    let branchExists = await getAllBranchesNames(ghToken).then(r => r.includes(branchName))
    if (branchExists) {
        getOctokit(ghToken).rest.git.deleteRef({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: `heads/${branchName}`
        })
    } else {
        console.log(`branch: ${branchName} does not exists`)
    }
}

export async function cleanUpBranchesMatchingPattern(ghToken: string, pattern: string) {
    let branches = await getAllBranchesNames(ghToken)
    let reg = new RegExp(pattern)
    branches.forEach(async branch => {
        let lastUpdate = await getOctokit(ghToken).request(`GET /repos/${context.repo.owner}/${context.repo.repo}/commits/${branch}`)
            .then(r => r.data.commit.committer.date)
        console.log(lastUpdate)
        let updatedAt = new Date(lastUpdate)
        let dateNow = new Date()

        let diff = dateNow.getTime() - updatedAt.getTime()
        let diffInDays = Math.ceil(diff / (1000 * 3600 * 24))

        if (diffInDays > 10 && reg.test(branch)) {
            console.log(`Branch with name ${branch} will be closed`)
            deleteBranch(ghToken, branch)
        }
    })
}


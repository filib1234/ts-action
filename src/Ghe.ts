import { context, getOctokit } from '@actions/github'

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